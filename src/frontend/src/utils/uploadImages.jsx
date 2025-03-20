import { storage } from '../config/Appwrite';

const uploadFile = async (file) => {
    try {
        // Replace 'bucketID' with the ID of you r storage bucket in Appwrite
        const bucketID = import.meta.env.VITE_SECOND_BUCKET_CLOUD_KEY;

        // Upload the file to Appwrite storage
        const response = await storage.createFile(bucketID, 'unique()', file);

        // Get the public URL of the uploaded file
        const fileID = response.$id;
        const downloadURL = storage.getFileView(bucketID, fileID);

        console.log(downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFile;
