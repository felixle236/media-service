import { APPLICATION_SCHEMA } from '../../schemas/application/ApplicationSchema';
import { Application } from '../../../../../web.core/domain/entities/application/Application';
import { ApplicationDb } from '../../entities/application/ApplicationDb';
import { BaseRepository } from '../base/BaseRepository';
import { IApplicationRepository } from '../../../../../web.core/gateways/repositories/application/IApplicationRepository';
import { Service } from 'typedi';
import { SortType } from '../../../../../web.core/domain/common/database/SortType';

@Service('application.repository')
export class ApplicationRepository extends BaseRepository<Application, ApplicationDb, string> implements IApplicationRepository {
    private readonly _appListCacheKey = 'apps';

    constructor() {
        super(ApplicationDb, APPLICATION_SCHEMA);
    }

    async getAll(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Application[]> {
        const list = await this.repository.createQueryBuilder(APPLICATION_SCHEMA.TABLE_NAME)
            .orderBy(`${APPLICATION_SCHEMA.TABLE_NAME}.${APPLICATION_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .cache(this._appListCacheKey, expireTimeCaching)
            .getMany();
        return list.map(item => item.toEntity());
    }

    async checkNameExist(name: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(APPLICATION_SCHEMA.TABLE_NAME)
            .where(`lower(${APPLICATION_SCHEMA.TABLE_NAME}.${APPLICATION_SCHEMA.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${APPLICATION_SCHEMA.TABLE_NAME}.${APPLICATION_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }

    async clearCaching(): Promise<void> {
        await this.dbContext.getConnection().clearCaching(this._appListCacheKey);
    }
}
