import * as sharp from 'sharp';
import { Inject, Service } from 'typedi';
import { GetOptimizedImageQuery } from './GetOptimizedImageQuery';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IStorageService } from '../../../../gateways/services/IStorageService';
import { ImageOptimizationVO } from '../../../../domain/entities/media/ImageOptimizationVO';
import { MEDIA_CACHING_EXPIRE_IN } from '../../../../../configs/Configuration';
import { Media } from '../../../../domain/entities/media/Media';
import { MediaType } from '../../../../domain/enums/media/MediaType';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetOptimizedImageQueryHandler implements IQueryHandler<GetOptimizedImageQuery, string> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: GetOptimizedImageQuery): Promise<string> {
        if (!param.appId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'app id');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.ext)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'ext');

        const media = await this._mediaRepository.getByIdWithCache(param.id, MEDIA_CACHING_EXPIRE_IN);
        if (!media || media.appId !== param.appId || media.type !== MediaType.IMAGE || media.extension !== param.ext.toLocaleLowerCase())
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const width = param.width;
        const height = param.height;

        // if (media.info && width > media.info.width && height > media.info.height) {
        //     if (width > media.info.width)
        //         throw new SystemError(MessageError.PARAM_MAX_NUMBER, 'width', media.info.width);
        //     if (height > media.info.height)
        //         throw new SystemError(MessageError.PARAM_MAX_NUMBER, 'height', media.info.height);
        // }

        let opt = media.optimizations && media.optimizations.find(opt => opt.width === width && opt.height === height);
        if (!opt) {
            const bufferMedia = await this._storageService.download(media.appId, media.getImageStorageUrlPath());
            const buffer = await sharp(bufferMedia)
                .resize(width, height)
                .toBuffer();

            let hasSucceed = await this._storageService.upload(media.appId, media.getImageStorageUrlPath(width, height), buffer);
            if (!hasSucceed)
                throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'file');

            opt = new ImageOptimizationVO();
            opt.width = width;
            opt.height = height;
            opt.size = buffer.length;

            const data = new Media();
            media.optimizations?.forEach(opt => {
                data.addOptimization(opt);
            });
            data.addOptimization(opt);

            hasSucceed = await this._mediaRepository.update(media.id, data);
            if (!hasSucceed)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE);

            await this._mediaRepository.removeCaching(media.id);
            return media.getImageStorageUrl(width, height);
        }
        return media.getImageStorageUrl(opt.width, opt.height);
    }
}
