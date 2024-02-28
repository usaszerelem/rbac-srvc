# RBAC-SRVC

This is a RBAC service that keeps track of registered services and operations that they can perform.
It also allows for roles management so that these in turn can be assigned to users.

## Product Information

This service is intended to be used together with the user-srvc. Created roles and service operations
assigned to these roles can be associated with created user accounts. A user can have one or more
roles and also be assigned individual service operations as needed.

API documentation: http://localhost:3000/api-docs/

## Security

To call this service a unique API key is required. For this initial simple version, there is only one
API key that is read from an environment variable called 'RBAC_API_KEY'.

# Installation Dependecies

This service uses MongoDB and you need either an on-premise or cloud based Atlas MongoDB access.

To start mongodb/brew/mongodb-community now and restart at login:
brew services start mongodb/brew/mongodb-community

Or, if you don't want/need a background service you can just run:
mongod --config /usr/local/etc/mongod.conf

## Environment Variable Dependencies

-   NODE_ENV=development - Specified for what environment this configuration was created for.
-   USE_HTTPS=false - Boolean value that indicates whether to listen on HTTP or HTTPS
-   NODE_TLS_REJECT_UNAUTHORIZED=0 - Used for development purposes onlyu.
-   LOG_LEVEL=debug - Minimum log level that should be logged
-   CONSOLELOG_ENABLED=true - Whether all received and generated log should be output to the console
-   FILELOG_ENABLED=false - Whether all received and generated log should be saved in a circular log file
-   MONGOLOG_ENABLED=false - - Whether all received and generated log should be saved in the MongoDB database
-   SERVICE_NAME='rbac-srvc/1.0.0' - Name and version of the service. Used for logging and auditing.
-   PORT=3000 - Port number that the service should listen on.
-   MONGODB_URL='mongodb://localhost:27017/productmanager' - MongoDB connection string
-   AUDIT_URL='http://localhost:3001/api/v1/audit' - Audit service URL
-   AUDIT_ENABLED=false - Boolean value indicating whether auditing is enabled.
-   AUDIT_API_KEY="1234abcd" - API key that should be used to send audit messages.
-   RBAC_API_KEY="abcd1234" - API key that should be used to call this service's endpoints.

## Development

Follow these steps to build and launch the service:

-   Fork the repo
-   Launch terminal and navigate to the root folder where the project was copied to.
-   Update project dependencies: sudo npm update
-   Audit for vulnerabilities and fix: npm audit
-   Set environment variables: source ./setenv.sh
-   If configured to run local MongoDB, then start the DB.
-   Rebuild project: npm run build
-   Start the service: npm run start

# Helpful links that were referenced

-   Configure JEST: https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421
-   MongoDB Installation: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
