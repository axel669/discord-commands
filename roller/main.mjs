import nacl from "tweetnacl"

import roll from "./roll.mjs"

const publicKey =
    "34ee5725eb3ef695074c1c837864fe6193b1931034ab4860272d161c829600f0"

// https://discord.com/api/oauth2/authorize?client_id=1029620534943678514&permissions=0&scope=bot%20applications.commands

const response = (data) => ({
    statusCode: 200,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})

export const handler = async (event) => {
    console.log(event)
    const ed = event.headers["x-signature-ed25519"]
    const time = event.headers["x-signature-timestamp"]

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(`${time}${event.body}`),
        Buffer.from(ed, "hex"),
        Buffer.from(publicKey, "hex")
    )

    if (isVerified === false) {
        return {
            statusCode: 401
        }
    }

    const data = JSON.parse(event.body)

    if (data.type === 1) {
        return response({
            type: 1
        })
    }

    return response({
        type: 4,
        data: {
            content: `\`\`\`\n${roll(data.data.options[0].value)}\n\`\`\``,
            // content: funCase(
            //     data.data.options[0].value,
            //     nthRule(2)
            // )
        }
    })
}
