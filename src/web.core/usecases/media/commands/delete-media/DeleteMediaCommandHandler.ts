import { Inject, Service } from 'typedi';
import { DeleteMediaCommand } from './DeleteMediaCommand';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IStorageService } from '../../../../gateways/services/IStorageService';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class DeleteMediaCommandHandler implements ICommandHandler<DeleteMediaCommand, boolean> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: DeleteMediaCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.appId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'app id');

        const media = await this._mediaRepository.getById(param.id);
        if (!media || media.appId !== param.appId)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'file');

        let hasSucceed = await this._mediaRepository.delete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        hasSucceed = await this._storageService.delete(media.appId, media.storageOriginalUrlPath);
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'file');

        await this._mediaRepository.removeCaching(param.id);
        return hasSucceed;
    }
}
