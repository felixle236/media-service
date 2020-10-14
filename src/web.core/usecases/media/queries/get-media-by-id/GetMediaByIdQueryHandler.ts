import { Inject, Service } from 'typedi';
import { GetMediaByIdQuery } from './GetMediaByIdQuery';
import { GetMediaByIdResult } from './GetMediaByIdResult';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetMediaByIdQueryHandler implements IQueryHandler<GetMediaByIdQuery, GetMediaByIdResult> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    async handle(param: GetMediaByIdQuery): Promise<GetMediaByIdResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const media = await this._mediaRepository.getById(param.id);
        if (!media)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetMediaByIdResult(media);
    }
}
