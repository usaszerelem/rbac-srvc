const mongoose = require('mongoose');
const Joi = require('joi-oid');

export namespace Limits {
    export const ROLENAME_MIN_LENGTH = 4;
    export const ROLENAME_MAX_LENGTH = 40;
}

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    serviceOpIds: [
        {
            type: String,
            required: true,
        },
    ],
});

export const Role = mongoose.model('roles', roleSchema);

export function validateRole(role: typeof Role) {
    const schema = Joi.object({
        name: Joi.string().min(Limits.ROLENAME_MIN_LENGTH).max(Limits.ROLENAME_MAX_LENGTH).required(),
        operations: Joi.array().items(),
    }).options({ allowUnknown: true });

    return schema.validate(role);
}
