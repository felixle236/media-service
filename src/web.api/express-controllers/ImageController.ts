import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { Inject, Service } from 'typedi';
import { GetOptimizedImageQuery } from '../../web.core/usecases/media/queries/get-optimized-image/GetOptimizedImageQuery';
import { GetOptimizedImageQueryHandler } from '../../web.core/usecases/media/queries/get-optimized-image/GetOptimizedImageQueryHandler';
import { ILogService } from '../../web.core/gateways/services/ILogService';

@Service()
export class ImageController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    @Inject('log.service')
    private readonly _logService: ILogService;

    constructor(
        private readonly _getOptimizedImageQueryHandler: GetOptimizedImageQueryHandler
    ) {
        this._router.get('/:appId([a-f0-9-]{36})/:id([a-f0-9-]{36})_:width(\\d{1,4})x:height(\\d{1,4}).:ext([a-z0-9]{3,4})$', this._getOptimizedImage.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getOptimizedImage(req: express.Request, res: express.Response) {
        const param = new GetOptimizedImageQuery();
        param.appId = req.params.appId;
        param.id = req.params.id;
        param.ext = req.params.ext;
        param.width = Number(req.params.width);
        param.height = Number(req.params.height);

        this._getOptimizedImageQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(err => {
                this._logService.writeErrorLog({
                    type: 'Handler',
                    method: req.method,
                    url: req.originalUrl,
                    query: req.query,
                    body: req.body,
                    message: err.message,
                    stack: err.stack
                });
                res.status(404).end();
            });
    }
}
