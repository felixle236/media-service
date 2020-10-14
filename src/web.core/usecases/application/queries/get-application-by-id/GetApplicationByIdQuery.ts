import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetApplicationByIdQuery implements IQuery {
    id: string;
}
