import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class FindMediaResult {
    id: string;
    createdAt: Date;
    appId: string;
    createdById?: string;
    type: MediaType;
    name: string;
    extension: string;
    size: number;
    urlPath: string;
    storageUrl: string;

    constructor(data: Media) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.appId = data.appId;
        this.createdById = data.createdById;
        this.type = data.type;
        this.name = data.name;
        this.extension = data.extension;
        this.size = data.size;

        if (data.type === MediaType.DOCUMENT) {
            this.urlPath = data.getDocumentMediaUrlPath();
            this.storageUrl = data.getDocumentStorageUrl();
        }
        else if (data.type === MediaType.IMAGE) {
            this.urlPath = data.getImageMediaUrlPath();
            this.storageUrl = data.getImageStorageUrl();
        }
        else if (data.type === MediaType.VIDEO) {
            this.urlPath = data.getVideoMediaUrlPath();
            this.storageUrl = data.getVideoStorageUrl();
        }
    }
}
