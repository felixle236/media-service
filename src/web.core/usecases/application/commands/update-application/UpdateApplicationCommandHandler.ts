import { Inject, Service } from 'typedi';
import { Application } from '../../../../domain/entities/Application/Application';
import { IApplicationRepository } from '../../../../gateways/repositories/application/IApplicationRepository';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateApplicationCommand } from './UpdateApplicationCommand';

@Service()
export class UpdateApplicationCommandHandler implements ICommandHandler<UpdateApplicationCommand, boolean> {
    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    async handle(param: UpdateApplicationCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const data = new Application();
        data.name = param.name;

        const isExist = await this._applicationRepository.checkNameExist(data.name, param.id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._applicationRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._applicationRepository.clearCaching();
        return hasSucceed;
    }
}
