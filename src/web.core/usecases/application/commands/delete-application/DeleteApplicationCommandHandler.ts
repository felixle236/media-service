import { Inject, Service } from 'typedi';
import { DeleteApplicationCommand } from './DeleteApplicationCommand';
import { IApplicationRepository } from '../../../../gateways/repositories/application/IApplicationRepository';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class DeleteApplicationCommandHandler implements ICommandHandler<DeleteApplicationCommand, boolean> {
    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    async handle(param: DeleteApplicationCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const application = await this._applicationRepository.getById(param.id);
        if (!application)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'application');

        const hasSucceed = await this._applicationRepository.softDelete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._applicationRepository.clearCaching();
        return hasSucceed;
    }
}
