import Collection from "../models/Collection";
import Product from "../models/Products";
import { connectDB } from "../mongoDB"

//api route to get total collections
export async function getTotalCollections(): Promise<number> {
    await connectDB();
    const collections = await Collection.find()
    const totalCollections = collections.length; //getting length (num) of total collections created
    return totalCollections //Promise type number ensures a number or nothing is returned
}

//api route to get total products created
export async function getTotalProducts(): Promise<number> {
    await connectDB();
    const products = await Product.find()
    const totalProducts = products.length;
    return totalProducts 
}
