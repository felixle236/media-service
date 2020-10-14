import { Application } from '../../../domain/entities/application/Application';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';

export interface IApplicationRepository extends IBaseRepository<Application, string> {
    /**
     * Get all applications with caching mode.
     */
    getAll(): Promise<Application[]>;

    /**
     * Get all applications with caching mode, we can set the time for caching expiration.
     * @param expireTimeCaching config expire time.
     */
    getAll(expireTimeCaching: number): Promise<Application[]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;

    clearCaching(): Promise<void>;
}
