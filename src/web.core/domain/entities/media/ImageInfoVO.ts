import * as validator from 'class-validator';
import { ALLOW_IMAGE_HEIGHT, ALLOW_IMAGE_WIDTH } from '../../../../configs/Configuration';
import { BaseVO } from '../base/BaseVO';
import { IImageInfoVO } from '../../types/media/IImageInfoVO';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';

export class ImageInfoVO extends BaseVO<IImageInfoVO> implements IImageInfoVO {
    constructor(data?: IImageInfoVO) {
        super(data);
    }

    get width(): number {
        return this.data.width;
    }

    set width(val: number) {
        if (!validator.isPositive(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'width');

        if (val > ALLOW_IMAGE_WIDTH)
            throw new SystemError(MessageError.PARAM_MAX_NUMBER, 'width', ALLOW_IMAGE_WIDTH);

        this.data.width = val;
    }

    get height(): number {
        return this.data.height;
    }

    set height(val: number) {
        if (!validator.isPositive(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'height');

        if (val > ALLOW_IMAGE_HEIGHT)
            throw new SystemError(MessageError.PARAM_MAX_NUMBER, 'height', ALLOW_IMAGE_HEIGHT);

        this.data.height = val;
    }
}
