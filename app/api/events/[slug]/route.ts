import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


type RouteParams = {
    params: Promise<{
        slug: string,
    }>;
};

export async function GET(req: NextRequest, {params}: RouteParams): Promise<NextResponse>{

    try{

        //Connecting to the database and extracting the value of the slug
        await connectDB();
        const {slug} = await params;

        //Validating slug parameter
        if(!slug || typeof slug !== "string" || slug.trim() === ''){
            return NextResponse.json(
                {message: 'Invalid or missing slug parameter'},
                {status: 400}
            );
        }

        //Sanitize slug(remove any potential malicious input)
        const sanitizedSlug = slug.trim().toLowerCase();

        //Query event by slug
        const event = await Event.findOne({slug: sanitizedSlug}).lean();

        //Handle event not found
        if(!event){
            return NextResponse.json(
                {message: `Event with slug ${sanitizedSlug} not found`},
                {status : 404}
            );
        }
        //Return Successful response with the data
        return NextResponse.json(
            {message: 'Event fetched Successfully', event: event},
            {status: 200}
        );


    }
    catch(error){
        //Log error for debugging(Only in development)
        if(process.env.NODE_ENV === 'development'){
            console.log('Error fetching event by slug:', error);
        }

        //Handle specific error types
        if(error instanceof Error){

            //Handle database connection error
            if(error.message.includes("MONGODB_URI")){
                return NextResponse.json(
                    {message: 'Database configuration error'},
                    {status: 500}
                );
            }
        

        //Return generic error with error message
        return NextResponse.json(
            {message: 'failed to fetch event', error: error.message},
            {status: 500}
        );

    }


    return NextResponse.json(
        {message: 'An unexpected error occurred'},
        {status: 500}
    );

    }

}