import { createClient } from "redis"
import { inspect } from "node:util"

import flat from "flat"
const { flatten, unflatten } = flat

import basket from "./basket.json" assert { type: "json" }

const merge = (keys, values) => (
    keys.reduce((acc, e, i) => {
        acc[keys[i]] = values[i]
        return acc
    }, {})
)

const client = createClient({ url: "redis://localhost:6379" })
    .on("connect", () => {
        console.info("connected...")
    })
    .on("end", () => {
        console.info("...bye")
    })

await client.connect()

const userId = "7c872647-f804-48d1-9386-4846c5d595bb"
const jsonKey = `user:${userId}:basket:json`

/* Meh: JSON-ify */
await client.set(jsonKey, JSON.stringify(basket))

const result = await client.get(jsonKey)
console.info("straight from redis", result)
console.info("parsed", inspect(JSON.parse(result), { depth: 5, colors: true }))

/* thought provoking: hashing objects */


const hashKey = `user:${userId}:basket:hash`
const flattened = flatten(basket)
console.debug("FLAT BASKET", flattened)

/* BAD: multiple commands to Redis
Object.keys(flattened).map(hk => {
    client.hset(basketKey, hk, flattened[hk])
})*/

// BETTER: convert object to array and single command to Redis
const objArray = Object.entries(flattened).flat()

await client.hSet(hashKey, objArray)
const results = await client.hGetAll(hashKey)
console.info("straight from redis", results)
console.info("unflatten", inspect(unflatten(results), { depth: 5, colors: true }))

const fields = ["name", "owner", "billing.city"]
const partialResults = await client.hmGet(hashKey, fields)
console.info("partial straight from redis", partialResults)
console.info("unflatten", inspect(unflatten(merge(fields, partialResults)), { depth: 5, colors: true }))

await client.quit()
