/**
 * @swagger
 * components:
 *   schemas:
 *     IServiceOperation:
 *       required:
 *         - name
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User friendly name of the service operation.
 *           example: Delete Users
 *         _id:
 *           type: string
 *           description: Upon data return this property is present and contains the unique identifier for the data.
 */
export type IServiceOperation = {
    _id?: string;
    name: string;

    createdAt?: string;
    updatedAt?: string;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     IServiceDto:
 *       required:
 *         - name
 *         - operations
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Role's name. A role is a set of connected behaviors, rights, obligations, beliefs, and norms as conceptualized by people in a social situation.
 *           example: User Manager Service
 *         operations:
 *           type: array
 *           description: List of service operations that this role is allowed to perform.
 *           items:
 *             $ref: '#/components/schemas/IServiceOperation'
 *           example: [{"name": "UserUpsert"}, {"name": "UserDelete"}, {"name": "UserList"}]
 */
export default interface IServiceDto {
    _id?: string;
    name: string;
    operations: IServiceOperation[];

    createdAt?: string;
    updatedAt?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IServiceResponseDto:
 *       required:
 *         - _id
 *         - name
 *         - operations
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Role's name. A role is a set of connected behaviors, rights, obligations, beliefs, and norms as conceptualized by people in a social situation.
 *           example: User Manager Service
 *         operations:
 *           type: array
 *           description: List of service operations that this role is allowed to perform.
 *           items:
 *             $ref: '#/components/schemas/IServiceOperation'
 *           example: [{"name": "UserUpsert", "_id": "65cc4fbfe0316b3bd5d04c29"}, {"name": "UserDelete", "_id": "65cc4fbfe0316b3bd5d04c2a"}, {"name": "UserList", "_id": "65cc4fbfe0316b3bd5d04c2b"}]
 *         _id:
 *           type: string
 *           description: Unique entity identifier for the created service. Returned upon data creation, retrieval.
 *           example: 37c1279a3dc27454e0bca472
 *         createdAt:
 *           type: string
 *           description: Returned upon data retrieval. Timestamp in ISO Date format.
 *           example:  2021-11-17T03:19:56.186Z
 *         updatedAt:
 *           type: string
 *           description: Returned upon data retrieval. Timestamp in ISO Date format.
 *           example:  2021-11-17T03:19:56.186Z
 */
export default interface IServiceResponseDto {
    _id?: string;
    name: string;
    operations: IServiceOperation[];

    createdAt?: string;
    updatedAt?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IServiceOperationAddBodyDto:
 *       required:
 *         - _id
 *         - operations
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique entity identifier for the added service operation.
 *           example: 37c1279a3dc27454e0bca472
 *         operations:
 *           type: array
 *           description: List of service operations that should be added to this service. Note that the _id field is not provided. It is returned upon successful completion.
 *           items:
 *             $ref: '#/components/schemas/IServiceOperation'
 *           example: [{"name": "UserUpsert"}, {"name": "UserDelete"}, {"name": "UserList"}]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     IServiceOperationPutBodyDto:
 *       required:
 *         - name
 *         - operations
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name for the registered service.
 *           example: 37c1279a3dc27454e0bca472
 *         operations:
 *           type: array
 *           description: List of service operations that should be updated for this service. Each service operation must have its _id and name property.
 *           items:
 *             $ref: '#/components/schemas/IServiceOperation'
 *           example: [{"_id": "65b4cf760dc6ffad894ce5bc", "name": "User Create/Update"}, {"_id": "65b4cf760dc6ffad894ce5bd", "name": "User Delete"}, {"_id": "65b4cf760dc6ffad894ce5be", "name": "User List"}]
 */
