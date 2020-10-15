import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetStorageImageQuery implements IQuery {
    appId: string;
    id: string;
    ext: string;
}
