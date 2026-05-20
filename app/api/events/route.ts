import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

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

        const createdEvent = await Event.create(event);

        return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, {status: 201})

        }
    catch(e){
        console.log(e);
        return NextResponse.json({message: 'Event cration failed', error: e instanceof Error? e.message : 'unknown'}, {status: 500})

    }
}