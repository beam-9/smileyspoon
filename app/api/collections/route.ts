import { connectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
//TALKING PONT FOR C - USE OF ASYNC AND AWAIT FUNCTIONS, writing status codes

//api route to create new collection
export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth()

        //confirm that if they aren't signed in as admin, they can't manipulate data
        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 403})
        }

        await connectDB()
        const { title, description, image } = await req.json()

        // finding existing collection, with unique identifier to see if it exists
        const existingCollection = await Collection.findOne({ title })

        //if already exists, alert admin
        if (existingCollection) {
            return new NextResponse("Collection Already exists", {status: 400})
        }

        //check for missing image and title
        if (!title || !image) {
            return new NextResponse("Title and Image is required", {status: 400})

        }

        const newCollection = await Collection.create({
            title,
            description,
            image,
        })

        //save new collection
        await newCollection.save()

        return NextResponse.json(newCollection, {status: 200})


    } catch (err) {
        console.log("[collections_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}

export const GET = async (req: NextRequest) => {
    try {
        await connectDB()
        
        //sort existing collections be in order of created first to last.
        const collections = await Collection.find().sort({ createdAt: "desc"})

        return NextResponse.json(collections, { status: 200})



    } catch (err) {
        console.log("[collections_GET", err)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}

export const dynamic = "force-dynamic";