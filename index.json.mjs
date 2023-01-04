import { createClient } from "redis"
import { inspect } from "node:util"
import flat from "flat"
const { unflatten } = flat

import basket from "./basket.json" assert { type: "json" }

const client = createClient({ url: "redis://localhost:6378" })
    .on("connect", () => {
        console.info("JSON connected...")
    })
    .on("end", () => {
        console.info("...bye JSON")
    })

await client.connect()

const userId = "7c872647-f804-48d1-9386-4846c5d595bb"
const jsonKey = `user:${userId}:basket:json`

await client.json.set(jsonKey, "$", basket)

const result = await client.json.get(jsonKey)
console.info("straight from redis", inspect(result, { depth: 5, colors: true }))

const partialResult = await client.json.get(jsonKey, { path: ["name", "owner", "billing.city"] })
console.info("partial from redis", inspect(partialResult, { depth: 5, colors: true }))
console.info("unflatten from redis", inspect(unflatten(partialResult), { depth: 5, colors: true }))

await client.quit()
