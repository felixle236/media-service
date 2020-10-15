import * as mime from 'mime-types';
import * as uuid from 'uuid';
import { Inject, Service } from 'typedi';
import { CreateVideoCommand } from './CreateVideoCommand';
import { CreateVideoResult } from './CreateVideoResult';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IStorageService } from '../../../../gateways/services/IStorageService';
import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class CreateVideoCommandHandler implements ICommandHandler<CreateVideoCommand, CreateVideoResult> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: CreateVideoCommand): Promise<CreateVideoResult> {
        if (!param.file)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'file');

        const ext = mime.extension(param.file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'file');

        const data = new Media();
        data.id = uuid.v4();
        data.appId = param.appId;
        data.createdById = param.createdById;
        data.type = MediaType.VIDEO;
        data.name = param.file.originalname;
        data.extension = ext;
        data.size = param.file.size;

        const hasSucceed = await this._storageService.upload(data.appId, data.storageOriginalUrlPath, param.file.buffer);
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'file');

        const id = await this._mediaRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return new CreateVideoResult(data);
    }
}
