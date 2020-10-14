import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class CreateVideoResult {
    id: string;
    type: MediaType;
    name: string;
    extension: string;
    size: number;
    url: string;

    constructor(data: Media) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.extension = data.extension;
        this.size = data.size;
        this.url = data.url.media;
    }
}
