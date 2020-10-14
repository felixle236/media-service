import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetDocumentQuery } from '../../web.core/usecases/media/queries/get-document/GetDocumentQuery';
import { GetDocumentQueryHandler } from '../../web.core/usecases/media/queries/get-document/GetDocumentQueryHandler';
import { Service } from 'typedi';

@Service()
export class DocumentController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getDocumentQueryHandler: GetDocumentQueryHandler
    ) {
        this._router.get('/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getDocument.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getDocument(req: express.Request, res: express.Response) {
        const param = new GetDocumentQuery();
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getDocumentQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
