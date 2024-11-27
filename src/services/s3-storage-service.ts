import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface PreSignedUrlPayload {
  fileName: string;
  fileType: string;
}
export class S3StorageService {
  private static instance: S3StorageService;
  private s3Client: S3Client;

  private constructor() {
    const accessKeyId: string = process.env.ACCESS_KEY_ID ?? "NA";
    const secretAccessKey: string = process.env.SECRET_ACCESS_KEY ?? "NA";
    const region: string = process.env.REGION ?? "NA";
    if (accessKeyId == "NA" || secretAccessKey == "NA") {
      throw new Error("AWS credentials are not provided");
    }
    // Initialize S3 client with your AWS credentials
    this.s3Client = new S3Client({
      region: region,

      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  public static getInstance(): S3StorageService {
    if (!S3StorageService.instance) {
      S3StorageService.instance = new S3StorageService();
    }
    return S3StorageService.instance;
  }

  public async generatePUTPresignedUrl(
    key: PreSignedUrlPayload
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: "test-ygsd-vikash",
      Key: key.fileName,
      ContentType: key.fileType,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    return url;
  }

  public async generateMultiplePUTPresignedUrls(
    keys: PreSignedUrlPayload[]
  ): Promise<string[]> {
    console.log(keys)
    const promises = keys.map((key) => this.generatePUTPresignedUrl(key));
    const signedUrls = await Promise.all(promises);
    return signedUrls;
  }

  public async getDownloadUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: "test-ygsd-vikash",
      Key: fileName, // Add the Key property
    });

        const signedUrl = await getSignedUrl(this.s3Client, command,);
        return signedUrl;
    }

    public async generateDownloadUrl(fileName: string): Promise<string> {
        const command = new GetObjectCommand({
          Bucket: 'test-ygsd-vikash',
          Key: fileName,
        });
    
        return await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
      }

    // delete image from storage
    public async deleteImage(fileName: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: 'test-ygsd-vikash',
            Key: fileName,
        });
        await this.s3Client.send(command);

        console.log("Image deleted successfully");
    }
}

export const s3StorageService = S3StorageService.getInstance();
