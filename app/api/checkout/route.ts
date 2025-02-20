//routes for stripe

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

//CORS (Cross-Origin Resource Sharing) - needed as frontend and backend hosted on different domains
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        //take all details
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", { status: 400 })
        }
        //create checkout session and form
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], //credit card
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["TH"], //only allowed to ship to thailand cause its icecream
            },
            shipping_options: [
                {shipping_rate: "shr_1Q7B3THsQ7p3NiJRCY4a96Ou"},//created ground shipping rate in stripe
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: "thb",
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productId: cartItem.item._id,
                        },
                    },
                    unit_amount: cartItem.item.price * 100,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId, //pull user from clerkid as they already have email and password and phonenumber, instead of from mongodb
            success_url: `${process.env.SMILEYSPOON_STORE_URL}/success`, 
            cancel_url:  `${process.env.SMILEYSPOON_STORE_URL}/cart`,
        })

        return NextResponse.json(session, { headers: corsHeaders});

    } catch (err) {
        console.log("[checkout_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}

export const dynamic = "force-dynamic";