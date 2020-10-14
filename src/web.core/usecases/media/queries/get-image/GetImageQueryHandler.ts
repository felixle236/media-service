import { Inject, Service } from 'typedi';
import { GetImageQuery } from './GetImageQuery';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { MEDIA_CACHING_EXPIRE_IN } from '../../../../../configs/Configuration';
import { MediaType } from '../../../../domain/enums/media/MediaType';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetImageQueryHandler implements IQueryHandler<GetImageQuery, string> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    async handle(param: GetImageQuery): Promise<string> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.ext)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'ext');

        const media = await this._mediaRepository.getByIdWithCache(param.id, MEDIA_CACHING_EXPIRE_IN);
        if (!media || media.type !== MediaType.IMAGE || media.extension !== param.ext.toLocaleLowerCase())
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return media.url.storage;
    }
}
