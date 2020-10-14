import { Filter } from '../../../../domain/common/usecase/Filter';

export class FindApplicationQuery extends Filter {
    keyword?: string;
}
