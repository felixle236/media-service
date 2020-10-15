import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetStorageDocumentQuery } from '../../web.core/usecases/media/queries/get-storage-document/GetStorageDocumentQuery';
import { GetStorageDocumentQueryHandler } from '../../web.core/usecases/media/queries/get-storage-document/GetStorageDocumentQueryHandler';
import { Service } from 'typedi';

@Service()
export class StorageDocumentController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getStorageDocumentQueryHandler: GetStorageDocumentQueryHandler
    ) {
        this._router.get('/:appId/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getDocument.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getDocument(req: express.Request, res: express.Response) {
        const param = new GetStorageDocumentQuery();
        param.appId = req.params.appId;
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getStorageDocumentQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
