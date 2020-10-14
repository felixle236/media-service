import { IEntity } from '../base/IEntity';
import { IMedia } from '../media/IMedia';

export interface IApplication extends IEntity {
    id: string;
    name: string;
    apiKey: string;

    medias?: IMedia[];
}
