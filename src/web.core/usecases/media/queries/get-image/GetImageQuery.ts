import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetImageQuery implements IQuery {
    id: string;
    ext: string;
}
