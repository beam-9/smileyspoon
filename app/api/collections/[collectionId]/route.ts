//square brackets means it is parameters

import { connectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Products";


//to fetch details of collection on page
export const GET = async (req: NextRequest, { params }: { params: { collectionId: string}}) => {
    try {
        await connectDB()
        
        
        const collection = await Collection.findById(params.collectionId)

        //return message of collection not found
        if (!collection) {
            return new NextResponse(JSON.stringify({ message: "Collection not found!" }), { status:404 })
        }

        return NextResponse.json(collection, { status: 200 })



    } catch (err) {
        console.log("[collectionId_GET]", err)
        return new NextResponse("Internal server error", { status: 500})

    }
}

//To update EXISTING collection
export const POST = async (req: NextRequest, { params }: { params: { collectionId: string}}) => {
    try {
        //since this act is admin act, it requires the appropriate access so check id

        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401})
        }
        
        await connectDB()

        //use 'let' instead of const as we want to update values
        let collection = await Collection.findById(params.collectionId)

        if(!collection) {
            return new NextResponse("Collection not found", { status: 404})
        }

        const {title, description, image } = await req.json()

        if(!title || !image) {
            return new NextResponse("Title and image are required", { status: 500})
        }
        // only update new data, updating the collection
        collection = await Collection.findByIdAndUpdate(params.collectionId, { title, description, image}, {new: true})

        await collection.save()

        return NextResponse.json(collection,  { status: 200 })


    } catch (err) {
        console.log("[collectionID_UPDATE]", err)
        return new NextResponse("Internal server error", {status: 500})
    }
}

//making the delete function on the collection page, deleting a collection. Using async function again
export const DELETE = async (req: NextRequest, { params }: { params : { collectionId: string } }) => {
    try {
        //authenticate userid
        //only admin can do this action
        const { userId } = auth()//from clerk

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401})
        }

        await connectDB()
        //function to delete the collection
        await Collection.findByIdAndDelete(params.collectionId)

        //if a collection is deleted, remove this from the products associated with it
        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId}}//pull all products with the same colletion
        );
        return new NextResponse("Collection is deleted", { status:200})

    } catch (err) {
        //return error message with associated action and route to identify
        console.log("[collectionsId_DELETE]", err)
        return new NextResponse("Internal server error", { status: 500})
    }
}

export const dynamic = "force-dynamic";