import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { JwtAuthUserQuery } from './JwtAuthUserQuery';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

@Service()
export class JwtAuthUserQueryHandler implements IQueryHandler<JwtAuthUserQuery, UserAuthenticated> {
    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: IJwtAuthService;

    async handle(param: JwtAuthUserQuery): Promise<UserAuthenticated> {
        if (!param.token || !param.secretKey)
            throw new UnauthorizedError(MessageError.DATA_INVALID);

        if (!validator.isJWT(param.token))
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        let payload;
        try {
            payload = this._jwtAuthService.verify(param.token, param.secretKey);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.SOMETHING_WRONG);
        }

        if (!payload || !payload.sub)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        const userAuth = new UserAuthenticated();
        userAuth.appId = payload.sub;
        userAuth.userId = payload.userId;
        return userAuth;
    }
}
