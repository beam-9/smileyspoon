import mongoose from "mongoose";
//connecting to mongo db

let isConnected: boolean = false;

// asynchronous function, causing it to return a Promise.
export const connectDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("Connected to Database")
        return;
    }

    try {
        await mongoose.connect(process.env.MNGODB_URL || "", {
            dbName: "SmileySpoon_Admin"

        })

        isConnected = true;
        console.log("Database is connected")
    } catch (err) {
        console.log(err)
    }

}

// import { MongoClient, ServerApiVersion } from 'mongodb';
// const uri = "mongodb+srv://cane7548:cane7548@smileyspoon.avfwg.mongodb.net/?retryWrites=true&w=majority&appName=smileySpoon";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close whenhh you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
