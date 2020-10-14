import { BASE_SCHEMA } from '../base/BaseSchema';

export const MEDIA_SCHEMA = {
    TABLE_NAME: 'media',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        APP_ID: 'app_id',
        CREATED_BY_ID: 'created_by_id',
        TYPE: 'type',
        NAME: 'name',
        EXTENSION: 'extension',
        SIZE: 'size',
        INFO: 'info',
        OPTIMIZATIONS: 'optimizations'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        APP: 'app'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
