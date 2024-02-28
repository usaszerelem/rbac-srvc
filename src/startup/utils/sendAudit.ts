import axios from 'axios';
import { AppEnv, Env } from './AppEnv';
import parseBool from './parseBool';
import AppLogger from './Logger';
import { RouteHandlingError } from './RouteHandlingError';

const logger = new AppLogger(module);

export enum HttpMethod {
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
    Patch = 'PATCH',
    Get = 'GET',
}

export async function sendAudit(method: HttpMethod, data: string): Promise<void> {
    try {
        if (parseBool(AppEnv.Get(Env.AUDIT_ENABLED)) === true) {
            const srvcName = AppEnv.Get(Env.SERVICE_NAME);
            const auditApiKey = AppEnv.Get(Env.AUDIT_API_KEY);
            const auditUrl = AppEnv.Get(Env.AUDIT_URL);

            const body = {
                timeStamp: new Date().toISOString(),
                source: srvcName,
                method: method.toString(),
                data: data,
            };

            let strPayload = JSON.stringify(body);
            logger.debug(strPayload);

            // Specifying headers in the AppConfig object
            const reqHeader = {
                'content-type': 'application/json',
                'content-length': strPayload.length,
                'User-Agent': srvcName,
                Connection: 'keep-alive',
                'x-api-key': auditApiKey,
            };

            const response = await axios.post(auditUrl!, strPayload, {
                headers: reqHeader,
            });

            logger.debug(response.data);
        }
    } catch (ex) {
        throw new RouteHandlingError(
            424,
            'Auditing enabled but connection refused. Ensure the audit service is running an the API key is correct.'
        );
    }
}
