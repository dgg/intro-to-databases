import { MongoClient } from "mongodb"

import { inspect } from "node:util"
import doc from "./18877.json" assert {type: "json"}

const client = await MongoClient.connect("mongodb://localhost:27017/test")
client
    .on("connectionReady", () => console.debug("connected..."))
    .on("serverClosed", () => console.debug("...bye"))

const reports = client.db().collection("reports")
await reports.deleteMany({})

await reports.insertOne(doc)

const options = {
    projection: { name: 1, specifier: 1, lastModified: 1 }
}
const allReports = await reports.find({}, options).toArray()
console.info("all", allReports)

const single = {
    _id: 18877
}
const oneReport = await reports.findOne(single)
console.info("one", inspect(oneReport, { colors: true, depth: 10 }))
await client.close()
