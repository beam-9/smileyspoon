//square brackets means it is parameters

import { connectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Products";
import Collection from "@/lib/models/Collection";


//to fetch details of collection on page
export const GET = async (req: NextRequest, { params }: { params: { productId: string}}) => {
    try {
        await connectDB()
        
        
        const productDetails = await Product.findById(params.productId).populate({ path: "collections", model: Collection })

        //return message of collection not found
        if (!productDetails) {
            return new NextResponse(JSON.stringify({ message: "Product not found!" }), { status:404 })
        }

        return NextResponse.json(productDetails, { status: 200 })



    } catch (err) {
        console.log("[productId_GET]", err)
        return new NextResponse("Internal server error", { status: 500})

    }
}

// updating products in collection, add or remove product from collection. Admin action
export const POST = async (req: NextRequest, { params }: {params: { productId: string } }) => {
    try {
        const  { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 })
        }
        await connectDB()

        const product = await Product.findById(params.productId)

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found"}), { status: 404 })
        }

        const { title, description, image, category, collections, price, cost} = await req.json()


        if (!title || !description || !image || !category || !price || !cost) {
            return new NextResponse("Not enough data is create a new product", { status: 400 })
        }

        //filters the collections array to return only the collections that are not already present in the product.collections array.
        const addedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))

        //filters product.collections to return only the collection IDs that are not present in the collections array.
        const removedCollections = product.collections.filter((collectionId: string) => !collections.includes(collectionId))

        await Promise.all([
            //update added collections with this product
            ...addedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $push: { products: product._id},

                })
            ),
            //update collections removing the product
            ...removedCollections.map((collectionId: string) =>
                Collection.findByIdAndDelete(collectionId, {
                    $pull: { products: product._id },
                })
            )
        ]);

        //update product
        const updatedProduct = await Product.findByIdAndUpdate(params.productId, {
            title,
            description,
            image,
            category,
            collections,
            price,
            cost,
        }, { new: true }).populate({ path: "collections", model: Collection });

        await updatedProduct.save()
        
        return NextResponse.json(updatedProduct, { status: 200});


    } catch (err) {
        console.log("[productId_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
} 



//making the delete function on the products page, deleting a collection. Using async function again
export const DELETE = async (req: NextRequest, { params }: { params : { productId: string } }) => {
    try {
        //authenticate userid, however in the other route, we dont do this as
        //if we were to try fetch the products for the e-commerce and authenticate user, it wont work. Also why we use GET instead of POST.
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401})
        }

        await connectDB()
        //function to delete the collection

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found"}), { status: 404 });
        }

        //delete product by id
        await Product.findByIdAndDelete(product._id);

        //Updating the collection, if there was a product within a collection, reduce the count.
        await Promise.all( //whenever updating more than one thing, use promise
            product.collections.map((collectionID: string) =>//go through each collection by that id for the product, then remove it.
                Collection.findByIdAndUpdate(collectionID, {
                    $pull: { products: product._id},
                })
            )
        );

        await Product.findByIdAndDelete(params.productId)
        return new NextResponse("Product is deleted", { status:200})

    } catch (err) {
        console.log("[productId_DELETE", err)
        return new NextResponse("Internal server error", { status: 500})
    }
}

export const dynamic = "force-dynamic";