import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UpdateApplicationCommand implements ICommand {
    id: string;
    name: string;
}
