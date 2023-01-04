import { DocumentStore, QueryData } from "ravendb"

import { inspect } from "node:util"
import doc from "./18877.json" assert {type: "json"}

const store = new DocumentStore("http://localhost:8080", "test").initialize()

const session = store.openSession()

const id = `reports/${doc.id}`
await session.store(doc, id)

const one = await session.load(id)
console.info("ONE", inspect(one, { colors: true, depth: 10 }))

const all = await session
    .query({ collection: "@empty" })
    .all()
console.info("ALL", inspect(all, { colors: true, depth: 10 }))

const data = new QueryData(["name", "postProcessing.mode"], ["name", "mode"])
const partial = await session
    .query({ collection: "@empty" })
    .whereEquals("name", "test")
    .selectFields(data)
    .first()
console.info("PARTIAL", inspect(partial, { colors: true, depth: 10 }))
await session.saveChanges()

store.dispose()
