import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export class S3StorageService {
    private static instance: S3StorageService;
    private s3Client: S3Client;

    private constructor() {
        this.s3Client = new S3Client({
            region: "TODO: Replace with your region",

            credentials: {
                accessKeyId: "TODO: Replace with your access key",
                secretAccessKey:"TODO: Replace with your secret access key",

            }
        });
    }

    public static getInstance(): S3StorageService {
        if (!S3StorageService.instance) {
            S3StorageService.instance = new S3StorageService();
        }
        return S3StorageService.instance;
    }

   
}

export const storageManager = S3StorageService.getInstance();
