import { Inject, Service } from 'typedi';
import { FindMediaQuery } from './FindMediaQuery';
import { FindMediaResult } from './FindMediaResult';
import { IMediaRepository } from '../../../../gateways/repositories/media/IMediaRepository';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';

@Service()
export class FindMediaQueryHandler implements IQueryHandler<FindMediaQuery, PaginationResult<FindMediaResult>> {
    @Inject('media.repository')
    private readonly _mediaRepository: IMediaRepository;

    async handle(param: FindMediaQuery): Promise<PaginationResult<FindMediaResult>> {
        const [medias, count] = await this._mediaRepository.findAndCount(param);
        const list = medias.map(media => new FindMediaResult(media));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
