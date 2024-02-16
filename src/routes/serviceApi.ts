import express, { Request, Response } from 'express';
import AppLogger from '../startup/utils/Logger';
import IServiceDto from '../dtos/IServiceDto';
import { ServiceModel, validateService } from '../models/service';
import { ErrorFormatter } from '../startup/utils/ErrorFormatter';
import { IPagedDataReturn } from '../dtos/IPagedDataReturn';
import isValidApiKey from '../middleware/apiKeyValidate';

const router = express.Router();
const logger = new AppLogger(module);

/**
 * @swagger
 * /api/v1/services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Registers a new service and list of operations that it can perform.
 *     description: Each service should register itself and list of operations that can be associated with roles.
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
 *             $ref: '#/components/schemas/IServiceDto'
 *     responses:
 *       '201':
 *         description: Created service document.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IServiceResponseDto'
 *       '500':
 *         description: Internal error.
 */
router.post('/', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const newService: IServiceDto = { ...req.body };
        logger.info('New service create: ' + JSON.stringify(newService));

        const { error } = validateService(newService);

        if (error) {
            const msg = error.details[0].message;
            logger.error(msg);
            return res.status(400).send(msg);
        }

        let newServiceObj = new ServiceModel(newService);
        newServiceObj = await newServiceObj.save();

        logger.info(`Service ${newServiceObj._id} created.`);

        return res.status(201).json(newServiceObj);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service POST', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/services/operation:
 *   post:
 *     tags:
 *       - Services
 *     summary: Registers additional service operations with a registered service.
 *     description: Used in case additional service operations should be added to a registered service.
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
 *             $ref: '#/components/schemas/IServiceOperationAddBodyDto'
 *     responses:
 *       '201':
 *         description: Service operations were added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IServiceResponseDto'
 *       '500':
 *         description: Internal error.
 */
router.post('/operation', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const srvcOpAdd: IServiceDto = { ...req.body };
        logger.info('Add service operation: ' + JSON.stringify(srvcOpAdd));

        let srvc = await ServiceModel.findById(srvcOpAdd._id);

        if (srvc === null) {
            const errMsg = `Service with id ${srvcOpAdd._id} not found`;
            logger.error(errMsg);
            return res.status(404).send(errMsg);
        }

        for (let i = 0; i < srvcOpAdd.operations.length; i++) {
            srvc.operations.push(srvcOpAdd.operations[i]);
        }

        srvc = await srvc.save();

        logger.info(`Service ${srvc._id} updated.`);

        return res.status(201).json(srvc);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service POST', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/services/{serviceId}:
 *   put:
 *     tags:
 *       - Services
 *     summary: Updates a registered service's information such as registered service name and registered service operation names.
 *     description: Used in case user friendly names should be corrected without affecting association with roles.
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
 *             $ref: '#/components/schemas/IServiceOperationPutBodyDto'
 *     responses:
 *       '201':
 *         description: Service operations were added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IServiceResponseDto'
 *       '500':
 *         description: Internal error.
 */
router.put('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const serviceId = req.params.id;
        logger.info('Updating service with ID: ' + serviceId);

        const srvcData: IServiceDto = { ...req.body };
        logger.debug('Updating service with data: ' + JSON.stringify(srvcData));

        let srvc = await ServiceModel.findById(serviceId);

        if (srvc === null) {
            const errMsg = `Service with id ${serviceId} not found`;
            logger.error(errMsg);
            return res.status(404).send(errMsg);
        }

        for (let i = 0; i < srvcData.operations.length; i++) {
            for (let j = 0; j < srvc.operations.length; j++) {
                if (srvc.operations[j]._id.equals(srvcData.operations[i]._id)) {
                    srvc.operations[j].name = srvcData.operations[i].name;
                    break;
                }
            }
        }

        srvc = await srvc.save();

        return res.status(201).json(srvc);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service PUT', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * @swagger
 * /api/v1/services/{serviceId}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Deletes a registered service. TODO - Remove this service's operation IDs from any role that might reference it.
 *     description: Used in case user friendly names should be corrected without affecting association with roles.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key to authorize access to the RBAC service.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '500':
 *         description: Internal error.
 */
router.delete('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const serviceId = req.params.id;
        logger.info('Deleting service with ID: ' + serviceId);

        await ServiceModel.deleteOne({ _id: serviceId });

        return res.status(200).send('Success');
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service DELETE', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * Works
 */
router.get('/:id', isValidApiKey, async (req: Request, res: Response) => {
    try {
        const serviceId = req.params.id;
        logger.info('Getting service with ID: ' + serviceId);

        const srvc = await ServiceModel.findById(serviceId);

        if (srvc === null) {
            const msg = `Service with ID ${serviceId} could not be found.`;
            logger.error(msg);
            return res.status(400).send(msg);
        }

        return res.status(201).json(srvc);
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service GET', ex, __filename);
        logger.error(msg);
        return res.status(500).send(msg);
    }
});

/**
 * Works
 */
router.get('/', isValidApiKey, async (req: Request, res: Response) => {
    try {
        logger.debug(`Services GET request`);

        const result = await getServices(req);

        if (typeof result[1] === 'string') {
            return res.status(result[0]).send(result[1]);
        } else {
            return res.status(result[0]).json(result[1]);
        }
    } catch (ex) {
        const msg = ErrorFormatter('Fatal error in Service GET', ex, __filename);
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
async function getServices(req: Request): Promise<[number, IPagedDataReturn<IServiceDto> | string]> {
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

    const products = await ServiceModel.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort('{name: 1}');

    const fullUrl: string = req.protocol + '://' + req.get('host') + req.originalUrl;
    const response = buildResponse<IServiceDto>(fullUrl, pageNumber, pageSize, products);

    logger.debug('Returning: ' + JSON.stringify(response));
    logger.info('Success');
    return [200, response];
}

/**
 * This function builds the return object that is returned from the GET call where
 * several products are returned. Paging help is provided.
 * @param req - HTTP Request object
 * @param pageNumber - Current page number that was requested
 * @param pageSize - Page size that was requested
 * @param products - Array of products that are returned
 * @returns {ProductsReturn} - JSON object of type ProductsReturn
 */
export function buildResponse<T>(fullUrl: string, pageNumber: number, pageSize: number, products: T[]): IPagedDataReturn<T> {
    const idx = fullUrl.lastIndexOf('?');

    if (idx !== -1) {
        fullUrl = fullUrl.substring(0, idx);
    }

    let response: IPagedDataReturn<T> = {
        pageSize: pageSize,
        pageNumber: pageNumber,
        _links: {
            base: fullUrl,
        },
        results: products,
    };

    if (pageNumber > 1) {
        response._links.prev = fullUrl + `?pageSize=${pageSize}&pageNumber=${pageNumber - 1}`;
    }

    if (products.length === pageSize) {
        response._links.next = fullUrl + `?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;
    }

    return response;
}

export async function validateServiceOps(serviceOpIds: string[]): Promise<boolean> {
    let isValid = true;

    const services = await ServiceModel.find({});

    for (let i = 0; i < serviceOpIds.length && isValid === true; i++) {
        let foundOpsId = false;

        for (let srvIdx = 0; srvIdx < services.length && foundOpsId === false; srvIdx++) {
            for (let srvOps = 0; srvOps < services[srvIdx].operations.length && foundOpsId === false; srvOps++) {
                foundOpsId = services[srvIdx].operations[srvOps].equals(serviceOpIds[i]);
            }
        }

        isValid = foundOpsId;
    }

    return isValid;
}

export default router;
