import { Inject, Service } from 'typedi';
import { GetApplicationByIdQuery } from './GetApplicationByIdQuery';
import { GetApplicationByIdResult } from './GetApplicationByIdResult';
import { IApplicationRepository } from '../../../../gateways/repositories/application/IApplicationRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetApplicationByIdQueryHandler implements IQueryHandler<GetApplicationByIdQuery, GetApplicationByIdResult> {
    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    async handle(param: GetApplicationByIdQuery): Promise<GetApplicationByIdResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const application = await this._applicationRepository.getById(param.id);
        if (!application)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetApplicationByIdResult(application);
    }
}
