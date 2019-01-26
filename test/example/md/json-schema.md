# Note [/notes]

## Add a Note [POST]

+ Request Add a Note (application/json)

    + Schema

            {
                "type": "object",
                "required": ["id"],
                "properties": {
                    "id": {"type": "number"},
                    "title": {"type": "string" }
                }
            }


+ Response 201 (application/json)


