import { RouteHandlingError } from '../startup/utils/RouteHandlingError';

const mongoose = require('mongoose');
const Joi = require('joi-oid');

export namespace Limits {
    export const SERVICENAME_MIN_LENGTH = 4;
    export const SERVICENAME_MAX_LENGTH = 30;
}

const serviceOperationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    operations: [serviceOperationSchema],
});

export const ServiceModel = mongoose.model('services', serviceSchema);

export function validateService(srvc: typeof ServiceModel) {
    const schema = Joi.object({
        name: Joi.string().min(Limits.SERVICENAME_MIN_LENGTH).max(Limits.SERVICENAME_MAX_LENGTH).required(),
        operations: Joi.array().items(),
    }).options({ allowUnknown: true });

    const { error } = schema.validate(srvc);

    if (error) {
        throw new RouteHandlingError(400, error.details[0].message);
    }
}
