import { BASE_SCHEMA } from '../base/BaseSchema';

export const APPLICATION_SCHEMA = {
    TABLE_NAME: 'application',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name',
        API_KEY: 'api_key'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.

    },
    RELATED_MANY: {
        // The field name that we're defined into entity.
        MEDIA: 'medias'
    }
};
