import * as jwt from 'jsonwebtoken';
import { DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../../configs/Configuration';
import { IJwtAuthService, IJwtPayloadExtend } from '../../../web.core/gateways/services/IJwtAuthService';
import { Service } from 'typedi';

@Service('jwt.auth.service')
export class JwtAuthService implements IJwtAuthService {
    verify(token: string, secretKey: string): IJwtPayloadExtend {
        return jwt.verify(token, secretKey, {
            issuer: PROJECT_NAME,
            audience: `${PROTOTYPE}://${DOMAIN}`,
            algorithm: 'HS256'
        } as jwt.VerifyOptions) as IJwtPayloadExtend;
    }
}
