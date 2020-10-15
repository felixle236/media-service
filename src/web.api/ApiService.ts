import * as compression from 'compression';
import * as path from 'path';
import { API_PORT, IS_DEVELOPMENT } from '../configs/Configuration';
import { ApiAuthenticator } from './ApiAuthenticator';
import { Container } from 'typedi';
import { HttpServer } from '../web.infrastructure/servers/http/HttpServer';
import { RoutingControllersOptions } from 'routing-controllers';
import { Server } from 'http';
import { StorageDocumentController } from './express-controllers/StorageDocumentController';
import { StorageImageController } from './express-controllers/StorageImageController';
import { StorageVideoController } from './express-controllers/StorageVideoController';

export class ApiService {
    setup(callback?: any): Server {
        const authenticator = Container.get(ApiAuthenticator);
        const storageDocumentController = Container.get(StorageDocumentController);
        const storageImageController = Container.get(StorageImageController);
        const storageVideoController = Container.get(StorageVideoController);

        const options: RoutingControllersOptions = {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
                maxAge: 3600,
                preflightContinue: true,
                optionsSuccessStatus: 204
            },
            routePrefix: '/api',
            controllers: [
                path.join(__dirname, './controllers/**/*{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*{.js,.ts}')
            ],
            validation: false,
            defaultErrorHandler: false,
            development: IS_DEVELOPMENT,
            authorizationChecker: authenticator.authorizationHttpChecker,
            currentUserChecker: authenticator.userAuthChecker
        };
        const httpServer = new HttpServer(options);

        httpServer.app.get('/healthz', (_req, res) => {
            res.status(200).end('ok');
        });

        httpServer.app.use('/documents', storageDocumentController.getRouter());
        httpServer.app.use('/images', storageImageController.getRouter());
        httpServer.app.use('/videos', storageVideoController.getRouter());

        httpServer.app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return httpServer.start(API_PORT, callback);
    }
}
