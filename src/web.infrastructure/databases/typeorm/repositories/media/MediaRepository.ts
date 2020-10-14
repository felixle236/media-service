import { BaseRepository } from '../base/BaseRepository';
import { FindMediaQuery } from '../../../../../web.core/usecases/media/queries/find-media/FindMediaQuery';
import { IMediaRepository } from '../../../../../web.core/gateways/repositories/media/IMediaRepository';
import { MEDIA_SCHEMA } from '../../schemas/media/MediaSchema';
import { Media } from '../../../../../web.core/domain/entities/media/Media';
import { MediaDb } from '../../entities/media/MediaDb';
import { Service } from 'typedi';
import { SortType } from '../../../../../web.core/domain/common/database/SortType';

@Service('media.repository')
export class MediaRepository extends BaseRepository<Media, MediaDb, string> implements IMediaRepository {
    constructor() {
        super(MediaDb, MEDIA_SCHEMA);
    }

    async findAndCount(param: FindMediaQuery): Promise<[Media[], number]> {
        let query = this.repository.createQueryBuilder(MEDIA_SCHEMA.TABLE_NAME);

        if (param.appId)
            query = query.andWhere(`${MEDIA_SCHEMA.TABLE_NAME}.${MEDIA_SCHEMA.COLUMNS.APP_ID} = :appId`, { appId: param.appId });

        if (param.createdById)
            query = query.andWhere(`${MEDIA_SCHEMA.TABLE_NAME}.${MEDIA_SCHEMA.COLUMNS.CREATED_BY_ID} = :createdById`, { createdById: param.createdById });

        if (param.type)
            query = query.andWhere(`${MEDIA_SCHEMA.TABLE_NAME}.${MEDIA_SCHEMA.COLUMNS.TYPE} = :type`, { type: param.type });

        query = query
            .orderBy(`${MEDIA_SCHEMA.TABLE_NAME}.${MEDIA_SCHEMA.COLUMNS.CREATED_AT}`, SortType.DESC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByIdWithCache(id: string, expireTimeCaching: number): Promise<Media | undefined> {
        const result = await this.repository.createQueryBuilder(MEDIA_SCHEMA.TABLE_NAME)
            .whereInIds(id)
            .cache(id, expireTimeCaching)
            .getOne();
        return result?.toEntity();
    }

    async removeCaching(key: string): Promise<void> {
        await this.dbContext.getConnection().clearCaching(key);
    }
}
