import { Application } from '../../../../domain/entities/Application/Application';

export class GetApplicationByIdResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    apiKey: string

    constructor(data: Application) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.name = data.name;
        this.apiKey = data.apiKey;
    }
}
