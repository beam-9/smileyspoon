import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB()

        //pulling data from order library which is from database
        const orders = await Order.find().sort( {createdAt: "desc"} )

        //mapping each order

        const orderDetails = Promise.all(orders.map(async (order) => {
            // find customer of order
            const customer = await Customer.findOne({ clerkId: order.customerClerkId })

            //return the order details
            return {
                _id: order._id,
                customer: customer.name,
                products: order.products.length,
                totalAmount: order.totalAmount,
                createdAt: format(order.createdAt, "do MMM, yyyy")
            }
        }))

        return NextResponse.json(orderDetails, { status: 200})
    } catch (err) {
        console.log("[orders_GET]", err)
        return new NextResponse("Internal server error", { status: 500 })
    }
}