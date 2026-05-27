import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest){
    try{
        await connectDB();
        
        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData.entries());
            }
        catch(e){
            return NextResponse.json({
                message: 'Invalid json data format'
            },
            {status: 400})
        }


        const imageEntry = formData.get("image");
        if (!(imageEntry instanceof File) || imageEntry.size === 0) {
            return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        }
        const image = imageEntry;

        let tags: unknown;
        let agenda: unknown;
        try {
            tags = JSON.parse((formData.get("tags") as string) ?? "[]");
            agenda = JSON.parse((formData.get("agenda") as string) ?? "[]");
        } catch {
            return NextResponse.json(
                { message: "Invalid tags/agenda format" },
                { status: 400 }
            );
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);


        const uploadImage = await new Promise((reslove, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, result) => {
                if(error) return reject(error);


                reslove(result);
            }).end(buffer)
        })


        event.image = (uploadImage as {secure_url: string}).secure_url;
        console.log(event.image);

        const createdEvent = await Event.create({...event, tags: tags, agenda: agenda});

        return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, {status: 201})

        }
    catch(e){
        console.log(e);
        return NextResponse.json({message: 'Event cration failed', error: e instanceof Error? e.message : 'unknown'}, {status: 500})

    }

}


export async function GET(){
    try{
        await connectDB();

        const events = await Event.find().sort({createdAt : -1});
        return NextResponse.json({message: 'Event fetched Successfully', events}, {status: 200});
    }
    catch(e){
        return NextResponse.json({message: 'Event fatching failed'}, {status: 500});
    }

}