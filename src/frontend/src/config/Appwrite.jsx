import { Client, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject("67cf89ff00003c9bbf4e"); // Your project ID

export const storage = new Storage(client);