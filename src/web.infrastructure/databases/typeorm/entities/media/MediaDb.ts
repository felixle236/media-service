import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationDb } from '../application/ApplicationDb';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { IImageInfoVO } from '../../../../../web.core/domain/types/media/IImageInfoVO';
import { IImageOptimizationVO } from '../../../../../web.core/domain/types/media/IImageOptimizationVO';
import { IMedia } from '../../../../../web.core/domain/types/media/IMedia';
import { MEDIA_SCHEMA } from '../../schemas/media/MediaSchema';
import { Media } from '../../../../../web.core/domain/entities/media/Media';
import { MediaType } from '../../../../../web.core/domain/enums/media/MediaType';

@Entity(MEDIA_SCHEMA.TABLE_NAME)
@Index((media: MediaDb) => [media.appId, media.createdById, media.type])
export class MediaDb extends BaseDbEntity<Media> implements IMedia {
    @PrimaryGeneratedColumn('uuid', { name: MEDIA_SCHEMA.COLUMNS.ID })
    id: string;

    @Column('uuid', { name: MEDIA_SCHEMA.COLUMNS.APP_ID })
    appId: string;

    @Column('uuid', { name: MEDIA_SCHEMA.COLUMNS.CREATED_BY_ID, nullable: true })
    createdById?: string;

    @Column('enum', { name: MEDIA_SCHEMA.COLUMNS.TYPE, enum: MediaType })
    type: MediaType;

    @Column({ name: MEDIA_SCHEMA.COLUMNS.NAME, length: 200 })
    name: string;

    @Column({ name: MEDIA_SCHEMA.COLUMNS.EXTENSION, length: 4 })
    extension: string;

    @Column({ name: MEDIA_SCHEMA.COLUMNS.SIZE })
    size: number;

    @Column('json', { name: MEDIA_SCHEMA.COLUMNS.INFO, nullable: true })
    info?: IImageInfoVO;

    @Column('json', { name: MEDIA_SCHEMA.COLUMNS.OPTIMIZATIONS, nullable: true })
    optimizations?: IImageOptimizationVO[];

    /* Relationship */

    @ManyToOne(() => ApplicationDb, app => app.medias)
    @JoinColumn({ name: MEDIA_SCHEMA.COLUMNS.APP_ID })
    app: ApplicationDb;

    /* handlers */

    toEntity(): Media {
        return new Media(this);
    }

    fromEntity(entity: Media): this {
        const data = entity.toData();

        if (data.id !== undefined)
            this.id = data.id;

        if (data.appId !== undefined)
            this.appId = data.appId;

        if (data.createdById !== undefined)
            this.createdById = data.createdById;

        if (data.type !== undefined)
            this.type = data.type;

        if (data.name !== undefined)
            this.name = data.name;

        if (data.extension !== undefined)
            this.extension = data.extension;

        if (data.size !== undefined)
            this.size = data.size;

        if (data.info !== undefined)
            this.info = data.info;

        if (data.optimizations !== undefined)
            this.optimizations = data.optimizations;

        return this;
    }
}
