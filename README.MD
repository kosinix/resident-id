# Resident ID System
Resident ID System


## Install

In mongo

    use ridsys
    db.createUser(
        {
            user: "ridsysUser",
            pwd: '{{see credentials.json}}',
            roles: [
                { role: "readWrite", db: "ridsys" }
            ]
        }
    )