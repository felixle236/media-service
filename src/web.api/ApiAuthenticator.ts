import { Inject, Service } from 'typedi';
import { ADMIN_SECRET_KEY } from '../configs/Configuration';
import { Action } from 'routing-controllers';
import { IApplicationRepository } from '../web.core/gateways/repositories/application/IApplicationRepository';
import { JwtAuthUserQuery } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { RoleId } from '../web.core/domain/enums/role/RoleId';
import { UserAuthenticated } from '../web.core/domain/common/UserAuthenticated';

@Service()
export class ApiAuthenticator {
    @Inject('application.repository')
    private readonly _applicationRepository: IApplicationRepository;

    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        if (roleIds.find(roleId => RoleId.SUPER_ADMIN === roleId) && ADMIN_SECRET_KEY === action.request.headers['x-admin-secret-key'])
            return true;

        const appId = action.request.headers['x-app-id'];
        if (!appId)
            return false;

        const apps = await this._applicationRepository.getAll();
        const app = apps.find(app => app.id === appId);
        if (!app)
            return false;

        const apiKey = action.request.headers['x-api-key'];
        // Receive a request from Client's backend.
        if (apiKey) {
            if (app.apiKey !== apiKey)
                return false;

            const userAuth = new UserAuthenticated();
            userAuth.appId = appId;
            userAuth.userId = action.request.headers['x-user-id'];
            action.request.userAuth = userAuth;
        }
        else { // Receive a request from Client's frontend.
            const parts = (action.request.headers.authorization || '').split(' ');
            const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

            if (!token)
                return false;

            const param = new JwtAuthUserQuery();
            param.token = token;
            param.secretKey = app.apiKey;

            action.request.userAuth = await this._jwtAuthUserQueryHandler.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
