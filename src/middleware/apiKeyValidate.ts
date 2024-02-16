import AppLogger from '../startup/utils/Logger';
import { Request, Response, NextFunction } from 'express';
import _ from 'underscore';
import { AppEnv, Env } from '../startup/utils/AppEnv';

const logger = new AppLogger(module);

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

export default function isValidApiKey(req: Request, res: Response, next: NextFunction): any {
    if (_.isUndefined(req) === false && _.isUndefined(req.header) === false) {
        logger.info('Validation RBAC API Key...');

        const token = req.header('x-api-key');

        if (!token || token !== AppEnv.Get(Env.RBAC_API_KEY)) {
            const msg = 'Access denied. RBAC API key is invalid.';
            logger.error(msg);
            return res.status(401).send(msg);
        }
    }

    next();
}
