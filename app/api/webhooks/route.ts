import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();

    //verify webhook's authenticity
    const signature = req.headers.get("Stripe-Signature") as string;

    // Verifying the Stripe event by constructing the event object using the raw request body,
    // signature, and the secret stored in the environment variable
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    //when checkout is successful
    if (event.type === "checkout.session.completed") {
      // Extracting the session object from the event data
      const session = event.data.object;
      console.log("[webhooks_POST]", session);

      // Extracting customer information from the session object
      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };
      //pulling the shipping address details from the webhook (session object)
      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        postalCode: session?.shipping_details?.address?.postal_code,
      };
      //retrieve all info from session
      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        //expand to get the metadata
        { expand: ["line_items.data.price.product"] }
      );
      //retrieves the list of line items from a Stripe session object, returning undefined if any part of the chain is missing.
      const lineItems = await retrieveSession?.line_items?.data;

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          quantity: item.quantity,
        };
      });

      //connect to database
      await connectDB();

      // Mapping over each line item to create an array of order items with product IDs and quantities
      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress: shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0, //divide by one hundred to get the decimal, otherwise total is 0
      });

      await newOrder.save();
      //use let to reassign value
      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      // if customer is found and logged in, push the new order into the orders array, otherwise create new customer using the info above.
      if (customer) {
        customer.orders.push(newOrder._id);
        await customer.save();
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }
    }

    return new NextResponse("Order Created", { status: 200 });
  } catch (err) {
    //log error
    console.log("[webhook_POST]", err);
    //return error response
    return new NextResponse("Failed to create order", { status: 500 });
  }
};

export const dynamic = "force-dynamic";