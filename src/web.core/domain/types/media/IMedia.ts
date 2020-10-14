import { IApplication } from '../application/IApplication';
import { IEntity } from '../base/IEntity';
import { IImageInfoVO } from './IImageInfoVO';
import { IImageOptimizationVO } from './IImageOptimizationVO';
import { MediaType } from '../../enums/media/MediaType';

export interface IMedia extends IEntity {
    id: string;
    appId: string;
    createdById?: string;
    type: MediaType;
    name: string;
    extension: string;
    size: number;
    info?: IImageInfoVO;
    optimizations?: IImageOptimizationVO[];

    app?: IApplication;
}
