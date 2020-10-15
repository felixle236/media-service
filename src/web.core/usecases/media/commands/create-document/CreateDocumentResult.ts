import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class CreateDocumentResult {
    id: string;
    type: MediaType;
    name: string;
    extension: string;
    size: number;
    urlPath: string;

    constructor(data: Media) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.extension = data.extension;
        this.size = data.size;
        this.urlPath = data.getDocumentMediaUrlPath();
    }
}
