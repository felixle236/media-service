import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { IApplication } from '../../types/application/IApplication';
import { Media } from '../media/Media';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';

export class Application extends BaseEntity<IApplication> implements IApplication {
    constructor(data?: IApplication) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    set id(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'id');

        this.data.id = val;
    }

    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'name');

        val = val.trim();
        if (val.length > 50)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50);

        this.data.name = val;
    }

    get apiKey(): string {
        return this.data.apiKey;
    }

    set apiKey(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'api key');

        val = val.trim();
        if (val.length > 64)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'api key', 64);

        this.data.apiKey = val;
    }

    /* Relationship */

    get medias(): Media[] | undefined {
        return this.data.medias && this.data.medias.map(media => new Media(media));
    }
}
