import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetImageCustomQuery implements IQuery {
    id: string;
    ext: string;
    width: number;
    height: number;
}
