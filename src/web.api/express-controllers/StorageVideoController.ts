import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetStorageVideoQuery } from '../../web.core/usecases/media/queries/get-storage-video/GetStorageVideoQuery';
import { GetStorageVideoQueryHandler } from '../../web.core/usecases/media/queries/get-storage-video/GetStorageVideoQueryHandler';
import { Service } from 'typedi';

@Service()
export class StorageVideoController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getStorageVideoQueryHandler: GetStorageVideoQueryHandler
    ) {
        this._router.get('/:appId/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getVideo.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getVideo(req: express.Request, res: express.Response) {
        const param = new GetStorageVideoQuery();
        param.appId = req.params.appId;
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getStorageVideoQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
