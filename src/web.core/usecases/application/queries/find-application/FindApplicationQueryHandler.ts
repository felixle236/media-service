import { Inject, Service } from 'typedi';
import { FindApplicationQuery } from './FindApplicationQuery';
import { FindApplicationResult } from './FindApplicationResult';
import { IApplicationRepository } from '../../../../gateways/repositories/application/IApplicationRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';

@Service()
export class FindApplicationQueryHandler implements IQueryHandler<FindApplicationQuery, PaginationResult<FindApplicationResult>> {
    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    async handle(param: FindApplicationQuery): Promise<PaginationResult<FindApplicationResult>> {
        const [applications, count] = await this._applicationRepository.findAndCount(param);
        const list = applications.map(application => new FindApplicationResult(application));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
