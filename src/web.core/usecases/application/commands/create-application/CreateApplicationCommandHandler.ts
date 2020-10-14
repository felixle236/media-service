import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { Inject, Service } from 'typedi';
import { Application } from '../../../../domain/entities/application/Application';
import { CreateApplicationCommand } from './CreateApplicationCommand';
import { IApplicationRepository } from '../../../../gateways/repositories/application/IApplicationRepository';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IDbContext } from '../../../../domain/common/database/interfaces/IDbContext';
import { IStorageService } from '../../../../gateways/services/IStorageService';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class CreateApplicationCommandHandler implements ICommandHandler<CreateApplicationCommand, string> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: CreateApplicationCommand): Promise<string> {
        const data = new Application();
        data.id = uuid.v4();
        data.name = param.name;
        data.apiKey = crypto.randomBytes(32).toString('hex');

        const isExist = await this._applicationRepository.checkNameExist(data.name);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._applicationRepository.create(data, queryRunner);
            if (!id)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE);

            const policies = this._getPolicies(data.id);
            await this._storageService.createBucket(data.id, JSON.stringify(policies));
            await this._applicationRepository.clearCaching();
        });
        return data.id;
    }

    private _getPolicies(bucketName: string) {
        /* eslint-disable */
        return {
            Version: '2012-10-17',
            Statement: [{
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetBucketLocation'],
                Resource: [`arn:aws:s3:::${bucketName}`]
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:ListBucket'],
                Resource: [`arn:aws:s3:::${bucketName}`],
                Condition: {
                    StringEquals: {
                        's3:prefix': ['documents/']
                    }
                }
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucketName}/documents/*`]
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:ListBucket'],
                Resource: [`arn:aws:s3:::${bucketName}`],
                Condition: {
                    StringEquals: {
                        's3:prefix': ['images/']
                    }
                }
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucketName}/images/*`]
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:ListBucket'],
                Resource: [`arn:aws:s3:::${bucketName}`],
                Condition: {
                    StringEquals: {
                        's3:prefix': ['videos/']
                    }
                }
            }, {
                Sid: '',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucketName}/videos/*`]
            }]
        };
        /* eslint-enable */
    }
}
