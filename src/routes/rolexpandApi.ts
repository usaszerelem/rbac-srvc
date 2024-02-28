import express, { Request, Response } from 'express';
import AppLogger from '../startup/utils/Logger';
import { Role } from '../models/roles';
import isValidApiKey from '../middleware/apiKeyValidate';
import { RouteErrorFormatter } from '../startup/utils/RouteHandlingError';

const router = express.Router();
const logger = new AppLogger(module);

/**
 * @swagger
 * components:
 *   schemas:
 *     RolesArray:
 *       required:
 *         - roleIds
 *       properties:
 *         roleIds:
 *           type: array
 *           description: List of role IDs to expand into service operation IDs
 *           items:
 *             type: string
 *           example: ["65bd7c5403a909833fc9a97d", "65bd7d0203a909833fc9a986"]
 */

/**
 * @swagger
 * /api/v1/rolexpand:
 *   post:
 *     tags:
 *       - Role Expand
 *     summary: Expands a role into the various service operation IDs that are assigned to it.
 *     description: This endpoint is needed by the userauth-srvc when authenticating users and convert a list of role ids that are assigned to a user to service operation ids that are granted to the user.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Array of role IDs to expand.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolesArray'
 *     responses:
 *       '200':
 *         description: A list of all service operation IDs.
 *       content:
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["str1", "str2", "str3"]
 */
router.post('/', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const roleIds = req.body.roleIds as string[];
        logger.info('Translating roleIds to service operation Ids: ' + roleIds);

        let srvcOpIds: string[] = [];

        for (let i = 0; i < roleIds.length; i++) {
            const role = await Role.findById(roleIds[i]);
            srvcOpIds = srvcOpIds.concat(role.serviceOpIds);
        }

        return res.status(201).json(srvcOpIds);
    } catch (ex) {
        const error = RouteErrorFormatter(ex, __filename, 'Fatal error Role Expand POST');
        logger.error(error.message);
        return res.status(error.httpStatus).send(error.message);
    }
});

export default router;
