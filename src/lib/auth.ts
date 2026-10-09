
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.BETTER_AUTH_MONGODB_URI;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_MONGODB_URI is not defined");
}

const client = new MongoClient(mongoUri);

const db = client.db("dailymart");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    client,
  }),
});