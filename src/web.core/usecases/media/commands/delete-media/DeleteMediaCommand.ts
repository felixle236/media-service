import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class DeleteMediaCommand implements ICommand {
    id: string;
    appId: string;
}
