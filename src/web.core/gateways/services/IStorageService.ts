export interface IStorageService {
    createBucket(bucketName: string, policy: string): Promise<void>;

    upload(bucketName: string, urlPath: string, buffer: Buffer): Promise<boolean>;

    download(bucketName: string, urlPath: string): Promise<Buffer>;

    delete(bucketName: string, urlPath: string): Promise<boolean>;
}
