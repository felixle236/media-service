import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetStorageVideoQuery implements IQuery {
    appId: string;
    id: string;
    ext: string;
}
