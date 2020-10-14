import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { Media } from '../../../domain/entities/media/Media';

export interface IMediaRepository extends IBaseRepository<Media, string> {
    getByIdWithCache(id: string, expireTimeCaching: number): Promise<Media | undefined>;

    removeCaching(key: string): Promise<void>;
}
