import express, { Request, Response } from 'express';
import AppLogger from '../startup/utils/Logger';
import IRoleDto from '../dtos/IRoleDto';
import { Role, validateRole } from '../models/roles';
import { ErrorFormatter } from '../startup/utils/ErrorFormatter';
import { buildResponse, validateServiceOps } from './serviceApi';
import { IPagedDataReturn } from '../dtos/IPagedDataReturn';
import isValidApiKey from '../middleware/apiKeyValidate';

const router = express.Router();
const logger = new AppLogger(module);

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Create a new role and associate a list of service operation IDs with it.
 *     description: Creates a new role such as 'Accountants' and at the same time you can specify an list of service operations that this role can perform. A service operation is an operation that a service allows to be performed. A an example a user manager service can have a service operation of 'List all users'.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Role creation information
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IRoleDto'
 *     responses:
 *       '201':
 *         description: Created audit document if returnNew query parameter was set to True
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IRoleDto'
 *       '400':
 *         description: The provided information for the role to create is invalid. Ensure that service operation IDs are valid and message body is correctly formatted.
 *       '500':
 *         description: Internal error.
 */
router.post('/', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const newRole: IRoleDto = { ...req.body };
        logger.info('New role create: ' + JSON.stringify(newRole));

        const { error } = validateRole(newRole);

        if (error) {
            const msg = error.details[0].message;
            logger.error(msg);
            return res.status(400).send(msg);
        }

        if ((await validateServiceOps(newRole.serviceOpIds)) === true) {
            let role = new Role(newRole);
            role = await role.save();

            logger.info(`Role ${role._id} created.`);

            return res.status(201).json(role);
        }

        const msg = 'Service Operation ID validation failed';
        logger.error(msg);
        return res.status(400).send(msg);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Role POST', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/roles/{roleId}:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Updates and existing role with optionally a new name and a new set of service operations.
 *     description: It is preferrable to update rather than delete and recreate a role because by updating the role ID remains the same and existing associations are not affected.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique role identification number.
 *     requestBody:
 *       description: Role creation information
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IRoleDto'
 *     responses:
 *       '200':
 *         description: Created audit document if returnNew query parameter was set to True
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IRoleDto'
 *       '400':
 *         description: The requested role ID could not be found.
 *       '500':
 *         description: Internal error.
 */
router.put('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const roleId = req.params.id;
        const newRole: IRoleDto = { ...req.body };

        logger.info('Updating role with ID: ' + roleId);

        if ((await validateServiceOps(newRole.serviceOpIds)) === true) {
            const filter = { _id: roleId };
            const role = await Role.findOneAndUpdate(filter, newRole, {
                new: true,
            });

            return res.status(200).json(role);
        }

        const msg = 'Service Operation ID validation failed';
        logger.error(msg);
        return res.status(400).send(msg);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Role PUT', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/roles/{roleId}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Retreives information about an existing role.
 *     description: An existing role's name and associated service operation identifiers is retrieved.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique role identification number to inquire about.
 *     responses:
 *       '200':
 *         description: Found the requested role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IRoleDto'
 *       '400':
 *         description: The requested role ID could not be found.
 *       '500':
 *         description: Internal error.
 */
router.get('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const roleId = req.params.id;
        logger.info('Getting role with ID: ' + roleId);

        const role = await Role.findById(roleId);

        if (role === null) {
            const msg = `Role with ID ${roleId} could not be found.`;
            logger.error(msg);
            return res.status(400).send(msg);
        }

        return res.status(200).json(role);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Role GET', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Retreives information about existing roles.
 *     description: An existing role's name and associated service operation identifiers is retrieved.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Found the requested role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IPagedRoleDto'
 *       '413':
 *         description: Payload too large. Max page size allowed is 99.
 *       '500':
 *         description: Internal error.
 */
router.get('/', isValidApiKey, async (req: Request, res: Response) => {
    try {
        logger.debug(`Roles GET request`);

        const result = await getRoles(req);

        if (typeof result[1] === 'string') {
            return res.status(result[0]).send(result[1]);
        } else {
            return res.status(result[0]).json(result[1]);
        }
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Role GET', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/roles/{roleId}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Deletes an existing role.
 *     description: Deletes an existing role. Pending work is to remove the deleted role from all user's that are associated with it.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique role identification number.
 *     responses:
 *       '200':
 *         description: Success. Found the requested role and it was deleted.
 *       '500':
 *         description: Internal error.
 */
router.delete('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const roleId = req.params.id;
        logger.info('Deleting service with ID: ' + roleId);

        await Role.deleteOne({ _id: roleId });

        return res.status(201).send('Success');
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Role DELETE', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 *
 * @param {req } - Request object so that we can access query parameters
 * @param field - Product object field that we would like to search on. As an example 'upc'
 * @returns touple with HTTP Status code as key and either an error or product
 * object as value.
 */
async function getRoles(req: Request): Promise<[number, IPagedDataReturn<IRoleDto> | string]> {
    const maxPageSize: number = 100;
    logger.debug('Inside getServicesByField');

    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;

    if (pageSize > maxPageSize) {
        const msg = `Payload too large. Max page size allowed is ${maxPageSize}`;
        logger.error(msg);
        return [413, msg];
    }

    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;

    logger.debug(`pageNumber: ${pageNumber}`);
    logger.debug(`pageSize: ${pageSize}`);

    const products = await Role.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort('{name: 1}');

    const fullUrl: string = req.protocol + '://' + req.get('host') + req.originalUrl;
    const response = buildResponse<IRoleDto>(fullUrl, pageNumber, pageSize, products);

    logger.debug('Returning: ' + JSON.stringify(response));
    logger.info('Success');
    return [200, response];
}

export default router;
