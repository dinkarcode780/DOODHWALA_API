import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.LINODE_OBJECT_STORAGE_REGION,
    endpoint: new URL(process.env.LINODE_OBJECT_STORAGE_ENDPOINT).toString(), 
    forcePathStyle: false,
    credentials: {
        accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY,
    },
});

export const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            let folderPath = "";
            if (file.mimetype.startsWith("image")) {
                folderPath = "DOODH_WALA/IMAGE/";
            } else if (file.mimetype.startsWith("video")) {
                folderPath = "DOODH_WALA/VIDEO/";
            } else if (file.mimetype.startsWith("application/pdf")) {
                folderPath = "DOODH_WALA/PDF/";
            } else {
                folderPath = "DOODH_WALA/OTHERS/";
            }
            const key = `${folderPath}${Date.now().toString()}_${file.originalname}`;
            cb(null, key);
        },
    }),
});


export const deleteFileFromObjectStorage = async (key) => {
    try {
        const params = {
            Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET,
            Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`File deleted successfully: ${key}`);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
};
