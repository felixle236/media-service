import { Authorized, Body, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { CreateApplicationCommand } from '../../../web.core/usecases/application/commands/create-application/CreateApplicationCommand';
import { CreateApplicationCommandHandler } from '../../../web.core/usecases/application/commands/create-application/CreateApplicationCommandHandler';
import { DeleteApplicationCommand } from '../../../web.core/usecases/application/commands/delete-application/DeleteApplicationCommand';
import { DeleteApplicationCommandHandler } from '../../../web.core/usecases/application/commands/delete-application/DeleteApplicationCommandHandler';
import { FindApplicationQuery } from '../../../web.core/usecases/application/queries/find-application/FindApplicationQuery';
import { FindApplicationQueryHandler } from '../../../web.core/usecases/application/queries/find-application/FindApplicationQueryHandler';
import { FindApplicationResult } from '../../../web.core/usecases/application/queries/find-application/FindApplicationResult';
import { GetApplicationByIdQuery } from '../../../web.core/usecases/application/queries/get-application-by-id/GetApplicationByIdQuery';
import { GetApplicationByIdQueryHandler } from '../../../web.core/usecases/application/queries/get-application-by-id/GetApplicationByIdQueryHandler';
import { GetApplicationByIdResult } from '../../../web.core/usecases/application/queries/get-application-by-id/GetApplicationByIdResult';
import { PaginationResult } from '../../../web.core/domain/common/usecase/PaginationResult';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { UpdateApplicationCommand } from '../../../web.core/usecases/application/commands/update-application/UpdateApplicationCommand';
import { UpdateApplicationCommandHandler } from '../../../web.core/usecases/application/commands/update-application/UpdateApplicationCommandHandler';

@Service()
@JsonController('/v1/apps')
export class ApplicationController {
    constructor(
        private readonly _findApplicationQueryHandler: FindApplicationQueryHandler,
        private readonly _getApplicationByIdQueryHandler: GetApplicationByIdQueryHandler,
        private readonly _createApplicationCommandHandler: CreateApplicationCommandHandler,
        private readonly _updateApplicationCommandHandler: UpdateApplicationCommandHandler,
        private readonly _deleteApplicationCommandHandler: DeleteApplicationCommandHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@QueryParams() param: FindApplicationQuery): Promise<PaginationResult<FindApplicationResult>> {
        return await this._findApplicationQueryHandler.handle(param);
    }

    @Get('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Params() param: GetApplicationByIdQuery): Promise<GetApplicationByIdResult> {
        return await this._getApplicationByIdQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateApplicationCommand): Promise<string> {
        return await this._createApplicationCommandHandler.handle(param);
    }

    @Put('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateApplicationCommand): Promise<boolean> {
        param.id = id;
        return await this._updateApplicationCommandHandler.handle(param);
    }

    @Delete('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Params() param: DeleteApplicationCommand): Promise<boolean> {
        return await this._deleteApplicationCommandHandler.handle(param);
    }
}
