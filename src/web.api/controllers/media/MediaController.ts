import * as multer from 'multer';
import { Authorized, CurrentUser, Delete, Get, JsonController, Params, Post, QueryParams, UploadedFile } from 'routing-controllers';
import { CreateDocumentCommand } from '../../../web.core/usecases/media/commands/create-document/CreateDocumentCommand';
import { CreateDocumentCommandHandler } from '../../../web.core/usecases/media/commands/create-document/CreateDocumentCommandHandler';
import { CreateDocumentResult } from '../../../web.core/usecases/media/commands/create-document/CreateDocumentResult';
import { CreateImageCommand } from '../../../web.core/usecases/media/commands/create-image/CreateImageCommand';
import { CreateImageCommandHandler } from '../../../web.core/usecases/media/commands/create-image/CreateImageCommandHandler';
import { CreateImageResult } from '../../../web.core/usecases/media/commands/create-image/CreateImageResult';
import { CreateVideoCommand } from '../../../web.core/usecases/media/commands/create-video/CreateVideoCommand';
import { CreateVideoCommandHandler } from '../../../web.core/usecases/media/commands/create-video/CreateVideoCommandHandler';
import { CreateVideoResult } from '../../../web.core/usecases/media/commands/create-video/CreateVideoResult';
import { DeleteMediaCommand } from '../../../web.core/usecases/media/commands/delete-media/DeleteMediaCommand';
import { DeleteMediaCommandHandler } from '../../../web.core/usecases/media/commands/delete-media/DeleteMediaCommandHandler';
import { FindMediaQuery } from '../../../web.core/usecases/media/queries/find-media/FindMediaQuery';
import { FindMediaQueryHandler } from '../../../web.core/usecases/media/queries/find-media/FindMediaQueryHandler';
import { FindMediaResult } from '../../../web.core/usecases/media/queries/find-media/FindMediaResult';
import { GetMediaByIdQuery } from '../../../web.core/usecases/media/queries/get-media-by-id/GetMediaByIdQuery';
import { GetMediaByIdQueryHandler } from '../../../web.core/usecases/media/queries/get-media-by-id/GetMediaByIdQueryHandler';
import { GetMediaByIdResult } from '../../../web.core/usecases/media/queries/get-media-by-id/GetMediaByIdResult';
import { PaginationResult } from '../../../web.core/domain/common/usecase/PaginationResult';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/v1/medias')
export class MediaController {
    constructor(
        private readonly _findMediaQueryHandler: FindMediaQueryHandler,
        private readonly _getMediaByIdQueryHandler: GetMediaByIdQueryHandler,
        private readonly _createDocumentCommandHandler: CreateDocumentCommandHandler,
        private readonly _createImageCommandHandler: CreateImageCommandHandler,
        private readonly _createVideoCommandHandler: CreateVideoCommandHandler,
        private readonly _deleteMediaCommandHandler: DeleteMediaCommandHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.CLIENT])
    async find(@QueryParams() param: FindMediaQuery): Promise<PaginationResult<FindMediaResult>> {
        return await this._findMediaQueryHandler.handle(param);
    }

    @Get('/:id')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.CLIENT])
    async getById(@Params() param: GetMediaByIdQuery): Promise<GetMediaByIdResult> {
        return await this._getMediaByIdQueryHandler.handle(param);
    }

    @Post('/documents')
    @Authorized(RoleId.CLIENT)
    async createDocument(@UploadedFile('file', { required: true, options: { storage: multer.memoryStorage() } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateDocumentResult> {
        const param = new CreateDocumentCommand();
        param.appId = userAuth.appId;
        param.createdById = userAuth.userId;
        param.file = file;
        return await this._createDocumentCommandHandler.handle(param);
    }

    @Post('/images')
    @Authorized(RoleId.CLIENT)
    async createImage(@UploadedFile('file', { required: true, options: { storage: multer.memoryStorage() } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateImageResult> {
        const param = new CreateImageCommand();
        param.appId = userAuth.appId;
        param.createdById = userAuth.userId;
        param.file = file;
        return await this._createImageCommandHandler.handle(param);
    }

    @Post('/videos')
    @Authorized(RoleId.CLIENT)
    async createVideo(@UploadedFile('file', { required: true, options: { storage: multer.memoryStorage() } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateVideoResult> {
        const param = new CreateVideoCommand();
        param.appId = userAuth.appId;
        param.createdById = userAuth.userId;
        param.file = file;
        return await this._createVideoCommandHandler.handle(param);
    }

    @Delete('/:id')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.CLIENT])
    async delete(@Params() param: DeleteMediaCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.appId = userAuth.appId;
        return await this._deleteMediaCommandHandler.handle(param);
    }
}
