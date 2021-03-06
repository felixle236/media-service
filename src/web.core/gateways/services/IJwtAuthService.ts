export interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: string;
}

export interface IJwtAuthService {
    verify(token: string, secretKey: string): IJwtPayloadExtend;
}
