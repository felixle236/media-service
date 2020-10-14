import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetImageCustomQuery } from '../../web.core/usecases/media/queries/get-image-custom/GetImageCustomQuery';
import { GetImageCustomQueryHandler } from '../../web.core/usecases/media/queries/get-image-custom/GetImageCustomQueryHandler';
import { GetImageQuery } from '../../web.core/usecases/media/queries/get-image/GetImageQuery';
import { GetImageQueryHandler } from '../../web.core/usecases/media/queries/get-image/GetImageQueryHandler';
import { Service } from 'typedi';

@Service()
export class ImageController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getImageQueryHandler: GetImageQueryHandler,
        private readonly _getImageCustomQueryHandler: GetImageCustomQueryHandler
    ) {
        this._router.get('/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getImage.bind(this));
        this._router.get('/:id([a-f0-9-]{36})_:width(\\d{1,4})x:height(\\d{1,4}).:ext([a-z]{3,4})$', this._getImageCustom.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getImage(req: express.Request, res: express.Response) {
        const param = new GetImageQuery();
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getImageQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }

    private _getImageCustom(req: express.Request, res: express.Response) {
        const param = new GetImageCustomQuery();
        param.id = req.params.id;
        param.ext = req.params.ext;
        param.width = Number(req.params.width);
        param.height = Number(req.params.height);

        this._getImageCustomQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
