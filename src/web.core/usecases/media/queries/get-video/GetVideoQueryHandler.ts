import { Inject, Service } from 'typedi';
import { API_CACHING_EXPIRE_IN } from '../../../../../configs/Configuration';
import { GetVideoQuery } from './GetVideoQuery';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { MediaType } from '../../../../domain/enums/media/MediaType';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetVideoQueryHandler implements IQueryHandler<GetVideoQuery, string> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    async handle(param: GetVideoQuery): Promise<string> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.ext)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'ext');

        const media = await this._mediaRepository.getByIdWithCache(param.id, API_CACHING_EXPIRE_IN);
        if (!media || media.type !== MediaType.VIDEO || media.extension !== param.ext.toLocaleLowerCase())
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return media.url.storage;
    }
}
