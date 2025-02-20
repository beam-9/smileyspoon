import mongoose from "mongoose";

//schema for products, provides detailed description of how data should be stored
const ProductSchema = new mongoose.Schema ({
    title: String,
    description: String,
    image: String,
    category: String,
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection"}],

    //converting data back into acceptable format for the front end.
    price: {type: mongoose.Schema.Types.Decimal128, default:0.1, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
    cost: {type: mongoose.Schema.Types.Decimal128, default:0.1, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now},

}, { toJSON: { getters: true}});//The getter functions convert the stored Decimal128 values to standard JavaScript floats

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;//export default for route