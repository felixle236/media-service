import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetMediaByIdQuery implements IQuery {
    id: string;
}
