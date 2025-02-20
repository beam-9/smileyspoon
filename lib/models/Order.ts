import mongoose from "mongoose";

//schema for order
const orderSchema = new mongoose.Schema({
    customerClerkId: String,
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
        },
    ],
    shippingAddresss: {
        street: String,
        city: String,
        postalCode: String,
    },
    shippingRate: String, //store id of the shipping rate
    totalAmount: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;