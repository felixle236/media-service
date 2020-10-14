import { IStorageService } from '../../../web.core/gateways/services/IStorageService';
import { Service } from 'typedi';
import { StorageUploader } from './uploader/StorageUploader';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _uploader: StorageUploader;

    constructor() {
        this._uploader = new StorageUploader();
    }

    async createBucket(bucketName: string, policy: string): Promise<void> {
        const isExist = await this._uploader.checkBucketExist(bucketName);
        if (!isExist) {
            await this._uploader.createBucket(bucketName);
            await this._uploader.setBucketPolicy(bucketName, policy);
        }
    }

    async upload(bucketName: string, urlPath: string, buffer: Buffer): Promise<boolean> {
        return await this._uploader.upload(bucketName, urlPath, buffer);
    }

    async download(bucketName: string, urlPath: string): Promise<Buffer> {
        return await this._uploader.download(bucketName, urlPath);
    }

    async delete(bucketName: string, urlPath: string): Promise<boolean> {
        return await this._uploader.delete(bucketName, urlPath);
    }
}
