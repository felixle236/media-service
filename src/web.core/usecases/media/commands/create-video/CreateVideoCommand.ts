import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class CreateVideoCommand implements ICommand {
    appId: string;
    createdById?: string;
    file: Express.Multer.File;
}
