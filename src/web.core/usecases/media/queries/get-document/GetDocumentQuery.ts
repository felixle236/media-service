import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetDocumentQuery implements IQuery {
    id: string;
    ext: string;
}
