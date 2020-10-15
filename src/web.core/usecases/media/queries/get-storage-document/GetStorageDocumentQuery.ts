import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetStorageDocumentQuery implements IQuery {
    appId: string;
    id: string;
    ext: string;
}
