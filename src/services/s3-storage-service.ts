import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export class S3StorageService {
    private static instance: S3StorageService;
    private s3Client: S3Client;

    private constructor() {
        const accessKeyId: string = process.env.ACCESS_KEY_ID ?? "NA";
        const secretAccessKey: string = process.env.SECRET_ACCESS_KEY ?? "NA";
        const region: string = process.env.REGION ?? "NA";
        if(accessKeyId == "NA" || secretAccessKey == "NA"){
            throw new Error("AWS credentials are not provided");
        }
        // Initialize S3 client with your AWS credentials
        this.s3Client = new S3Client({
            region: region,

            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,

            }
        });
    }

    public static getInstance(): S3StorageService {
        if (!S3StorageService.instance) {
            S3StorageService.instance = new S3StorageService();
        }
        return S3StorageService.instance;
    }

    public async generatePUTPresignedUrl(key:string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: 'test-ygsd-vikash',
            Key: key, // Key will be filename
        })

        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 60 * 5, // expires in 5 minutes
        });
        return signedUrl;
     }

     public async generateMultiplePUTPresignedUrls(keys: string[]): Promise<string[]> {
        const promises = keys.map(key => this.generatePUTPresignedUrl(key));
        const signedUrls = await Promise.all(promises);
        return signedUrls;
    }

    public async generateGETPresignedUrl(key:string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: 'test-ygsd-vikash',
            Key: key, // Add the Key property
        })

        const signedUrl = await getSignedUrl(this.s3Client, command,);
        return signedUrl;
    }

   
}


export const s3StorageService = S3StorageService.getInstance();