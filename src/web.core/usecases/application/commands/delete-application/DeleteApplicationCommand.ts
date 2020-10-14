import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class DeleteApplicationCommand implements ICommand {
    id: string;
}
