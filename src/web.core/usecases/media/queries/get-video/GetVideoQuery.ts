import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetVideoQuery implements IQuery {
    id: string;
    ext: string;
}
