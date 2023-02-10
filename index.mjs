import sqlite from "sqlite3"
import { open } from "sqlite"

// import { existsSync, mkdirSync } from "node:fs"

process
    .on("uncaughtException", e => console.error("UNCAUGHT", e))
    .on("unhandledRejection", e => console.error("UNHANDLED", e))

const db = await open({ filename: ":memory:", driver: sqlite.Database })
/*if (!existsSync("./data")) { mkdirSync("./data") }
const db = await open({ filename: "./data/example.db", driver: sqlite.Database })*/

// DDL
await db.run("CREATE TABLE tbl (k INTEGER PRIMARY KEY ASC, name TEXT)")

// data insertion
const firstInsert = await db.prepare("INSERT INTO tbl VALUES(:k, :name)", { ":k": 1, ":name": "some name" })
await firstInsert.run()
await firstInsert.finalize()

const secondInsert = await db.prepare("INSERT INTO tbl VALUES(?, ?)")
await secondInsert.run(2, "other name")
await secondInsert.finalize()

// query
const rows = await db.all("SELECT * FROM tbl")
rows.forEach(r => {
    console.info(r.k, r.name)
})

await db.close()
