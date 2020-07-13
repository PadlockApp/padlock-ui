export interface FileDocument {
    _id: string
    name: string
    cid: string
}

export const FileSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        _id: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        cid: {
            type: 'string',
        },
    },
    required: ['name', 'cid', '_id'],
};
