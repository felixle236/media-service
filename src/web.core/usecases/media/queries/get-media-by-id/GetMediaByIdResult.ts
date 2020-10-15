import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class MediaUrl {
    constructor(public urlPath: string, public storageUrl: string) {}
}

export class GetMediaByIdResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    appId: string;
    createdById?: string;
    type: MediaType;
    name: string;
    extension: string;
    size: number;
    urlPath: string;
    storageUrl: string;
    optUrls?: MediaUrl[] | undefined;

    constructor(data: Media) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
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

            this.optUrls = data.optimizations && data.optimizations.map(opt => {
                return new MediaUrl(
                    data.getImageMediaUrlPath(opt.width, opt.height),
                    data.getImageStorageUrl(opt.width, opt.height)
                );
            });
        }
        else if (data.type === MediaType.VIDEO) {
            this.urlPath = data.getVideoMediaUrlPath();
            this.storageUrl = data.getVideoStorageUrl();
        }
    }
}
