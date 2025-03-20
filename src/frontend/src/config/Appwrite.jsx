import { Client, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID
// client
// .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
// .setProject("67cf89ff00003c9bbf4e"); // Your project ID

export const storage = new Storage(client);
