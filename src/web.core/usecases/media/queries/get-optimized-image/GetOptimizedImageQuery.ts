import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetOptimizedImageQuery implements IQuery {
    appId: string;
    id: string;
    ext: string;
    width: number;
    height: number;
}
