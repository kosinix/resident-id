# Resident ID System
RIDSYS is a prototype of a resident ID system for a Philippine municipality. Supports digital ID and digital inbound and outbound passes for COVID-19 monitoring.


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