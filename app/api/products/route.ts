import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Products";
import { connectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 })
        }

        await connectDB()

        const {title, description, image, category, collections, price, cost} =  await req.json();

        if (!title || !description || !image || !category|| !price || !cost) {
            return new NextResponse("Missing inputs", {status: 400});
        }

        const newProduct = await Product.create({
            title,
            description,
            image,
            category,
            collections,
            price,
            cost,
        });

        await newProduct.save();
        //check if colletions is added since its optional, if yes we increment the number of products in the collection
        if (collections) {
            for(const collectionId of collections) {
                const collection = await Collection.findById(collectionId);
                if (collection) {
                    collection.products.push(newProduct._id);
                    await collection.save();
                }
            }
        }

        //return fetched data in json
        return NextResponse.json(newProduct, { status: 200 });
    } catch (err) {
        console.log("[products_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

//get function to retrieve all the products and display in a data table
export const GET = async(req: NextRequest) => {
    try{
        await connectDB()
        //populate the path collections with the collection model
        const products = await Product.find().sort({ createdAt: "desc"}). populate({ path: "collections", model: Collection})

        return NextResponse.json(products, { status: 200})
    } catch (err) {
        console.log("[products_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500});
    }
}

export const dynamic = "force-dynamic";