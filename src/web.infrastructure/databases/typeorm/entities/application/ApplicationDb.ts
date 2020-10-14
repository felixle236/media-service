import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { APPLICATION_SCHEMA } from '../../schemas/application/ApplicationSchema';
import { Application } from '../../../../../web.core/domain/entities/application/Application';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { IApplication } from '../../../../../web.core/domain/types/application/IApplication';
import { MediaDb } from '../media/MediaDb';

@Entity(APPLICATION_SCHEMA.TABLE_NAME)
export class ApplicationDb extends BaseDbEntity<Application> implements IApplication {
    @PrimaryGeneratedColumn('uuid', { name: APPLICATION_SCHEMA.COLUMNS.ID })
    id: string;

    @Column({ name: APPLICATION_SCHEMA.COLUMNS.NAME, length: 50 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    name: string;

    @Column({ name: APPLICATION_SCHEMA.COLUMNS.API_KEY, length: 64 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    apiKey: string;

    /* Relationship */

    @OneToMany(() => MediaDb, media => media.app)
    medias: MediaDb[];

    /* handlers */

    toEntity(): Application {
        return new Application(this);
    }

    fromEntity(entity: Application): this {
        const data = entity.toData();

        if (data.id !== undefined)
            this.id = data.id;

        if (data.name !== undefined)
            this.name = data.name;

        if (data.apiKey !== undefined)
            this.apiKey = data.apiKey;

        return this;
    }
}
