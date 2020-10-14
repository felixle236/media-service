import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class CreateApplicationCommand implements ICommand {
    name: string;
}
