import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetStorageImageCustomQuery } from '../../web.core/usecases/media/queries/get-storage-image-custom/GetStorageImageCustomQuery';
import { GetStorageImageCustomQueryHandler } from '../../web.core/usecases/media/queries/get-storage-image-custom/GetStorageImageCustomQueryHandler';
import { GetStorageImageQuery } from '../../web.core/usecases/media/queries/get-storage-image/GetStorageImageQuery';
import { GetStorageImageQueryHandler } from '../../web.core/usecases/media/queries/get-storage-image/GetStorageImageQueryHandler';
import { Service } from 'typedi';

@Service()
export class StorageImageController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getStorageImageQueryHandler: GetStorageImageQueryHandler,
        private readonly _getStorageImageCustomQueryHandler: GetStorageImageCustomQueryHandler
    ) {
        this._router.get('/:appId/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getImage.bind(this));
        this._router.get('/:appId/:id([a-f0-9-]{36})_:width(\\d{1,4})x:height(\\d{1,4}).:ext([a-z]{3,4})$', this._getImageCustom.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getImage(req: express.Request, res: express.Response) {
        const param = new GetStorageImageQuery();
        param.appId = req.params.appId;
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getStorageImageQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }

    private _getImageCustom(req: express.Request, res: express.Response) {
        const param = new GetStorageImageCustomQuery();
        param.appId = req.params.appId;
        param.id = req.params.id;
        param.ext = req.params.ext;
        param.width = Number(req.params.width);
        param.height = Number(req.params.height);

        this._getStorageImageCustomQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
