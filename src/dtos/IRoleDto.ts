/**
 * @swagger
 * components:
 *   schemas:
 *     IRoleDto:
 *       required:
 *         - name
 *         - serviceOpIds
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Role's name. A role is a set of connected behaviors, rights, obligations, beliefs, and norms as conceptualized by people in a social situation.
 *           example: Power Users
 *         serviceOpIds:
 *           type: array
 *           description: List of service operation IDs that this role is allowed to perform.
 *           items:
 *             type: string
 *           example: ["65b8179a3dc27454e0bc8978", "65b8179a3dc27454e0bc897a", "65b817e03dc27454e0bc897d"]
 *         _id:
 *           type: string
 *           description: Unique entity identifier for the created role. Returned upon data creation, retrieval.
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
export default interface IRoleDto {
    _id?: string;
    name: string;
    serviceOpIds: [string];

    createdAt?: string;
    updatedAt?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IPagedRoleDto:
 *       type: object
 *       description: Paging information about requested roles and an array of IRoleDto objects.
 *       properties:
 *         pageSize:
 *           type: number
 *           example: 10
 *           description: Maximum number of entities that this page can contain.
 *         pageNumber:
 *           type: number
 *           example: 2
 *           description: Requested page number of entities.
 *         _links:
 *           type: object
 *           properties:
 *             base:
 *               type: string
 *               example: "http://localhost:3000/api/v1/roles"
 *               description: Base URL to use for retrieving roles information
 *             prev:
 *               type: string
 *               example: "http://localhost:3000/api/v1/roles?pageSize=10&pageNumber=1"
 *               description: URL to use to retreive the previous page with roles information. This property is only returned if there is a previous page with information, therebody allowing the UI to enable/disable paging controls.
 *             next:
 *               type: string
 *               example: "http://localhost:3000/api/v1/roles?pageSize=10&pageNumber=3"
 *               description: URL to use to retreive the next page with roles information. This property is only returned if there is a next page with information, therebody allowing the UI to enable/disable paging controls.
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IRoleDto'
 */
