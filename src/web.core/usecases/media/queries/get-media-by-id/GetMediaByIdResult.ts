import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class MediaUrl {
    constructor(public media: string, public storage: string) {}
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
    url: MediaUrl;
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
        this.url = new MediaUrl(data.url.media, data.url.storage);

        if (data.type === MediaType.IMAGE)
            this.optUrls = data.optimizations && data.optimizations.map(opt => data.getImageUrl(opt.width, opt.height));
    }
}
