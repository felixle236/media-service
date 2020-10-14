import { Application } from '../../../../domain/entities/Application/Application';

export class FindApplicationResult {
    id: string;
    createdAt: Date;
    name: string;
    apiKey: string;

    constructor(data: Application) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.apiKey = data.apiKey;
    }
}
