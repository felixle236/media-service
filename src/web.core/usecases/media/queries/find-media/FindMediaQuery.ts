import { Filter } from '../../../../domain/common/usecase/Filter';
import { MediaType } from '../../../../domain/enums/media/MediaType';

export class FindMediaQuery extends Filter {
    appId?: string;
    createdById?: string;
    type?: MediaType;
}
