
//// Core modules

//// External modules

//// Modules
const allPermissions = require('./permissions-list');

const ROLES = [
    {
        key: 'root',
        name: 'Super Admin',
        description: 'Can do anything.',
        permissions: allPermissions
    },
    {
        key: 'admin',
        name: 'System Admin',
        description: 'Can do mostly anything.',
        permissions: allPermissions
    },
    {
        key: 'encoder',
        name: 'Encoder',
        description: 'Can create resident.',
        permissions: [
            'read_all_resident',
            'create_resident',
            'read_resident',
        ]
    },
    {
        key: 'border',
        name: 'Border Officer',
        description: 'Can create, read outbound pass.',
        permissions: [
            'read_all_pass',
            'create_pass',
            'read_pass',
            'read_resident',
        ]
    }
]

module.exports = ROLES