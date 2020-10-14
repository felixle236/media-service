import { IValueObject } from '../../types/base/IValueObject';

export abstract class BaseVO<TVO extends IValueObject> implements IValueObject {
    constructor(protected readonly data = {} as TVO) { }

    toData(): TVO {
        return this.data;
    }
}
