import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';
import { AccessDeniedError } from '../../web.core/domain/common/exceptions/AccessDeniedError';
import { ILogService } from '../../web.core/gateways/services/ILogService';
import { Inject } from 'typedi';
import { SystemError } from '../../web.core/domain/common/exceptions/SystemError';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    @Inject('log.service')
    private readonly _logService: ILogService;

    error(err: SystemError, req: Request, res: Response) {
        const stack = err.stack;

        if (err.httpCode === 403)
            err = new AccessDeniedError();

        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            this._logService.writeErrorLog({
                type: 'Request',
                method: req.method,
                url: req.originalUrl,
                query: req.query,
                body: req.body,
                message: err.message,
                stack: err.stack
            });
            err = new SystemError();
            err.stack = stack;
        }

        if (!res.writableEnded) {
            res.status(err.httpCode);
            res.send({
                code: err.code,
                message: err.message
            });
        }
    }
}
