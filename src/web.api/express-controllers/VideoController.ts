import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { GetVideoQuery } from '../../web.core/usecases/media/queries/get-video/GetVideoQuery';
import { GetVideoQueryHandler } from '../../web.core/usecases/media/queries/get-video/GetVideoQueryHandler';
import { Service } from 'typedi';

@Service()
export class VideoController {
    private _router = express.Router();
    private _proxy = httpProxy.createProxyServer({});

    constructor(
        private readonly _getVideoQueryHandler: GetVideoQueryHandler
    ) {
        this._router.get('/:id([a-f0-9-]{36}).:ext([a-z]{3,4})$', this._getVideo.bind(this));
    }

    getRouter() {
        return this._router;
    }

    private _getVideo(req: express.Request, res: express.Response) {
        const param = new GetVideoQuery();
        param.id = req.params.id;
        param.ext = req.params.ext;

        this._getVideoQueryHandler.handle(param)
            .then(url => this._proxy.web(req, res, { target: url, ignorePath: true }))
            .catch(error => {
                console.error(error);
                res.status(404).end();
            });
    }
}
