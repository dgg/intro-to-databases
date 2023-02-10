import { InfluxDB, flux } from "@influxdata/influxdb-client"

const opts = {
    url: "http://localhost:8086",
    token: "FFFF-EEEE-DDDD-CCCC"
}
const reader = new InfluxDB(opts).getQueryApi("test_org")

const customer1 = flux`
from(bucket: "test_bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "customer_1")
`
const lines = await reader.collectLines(customer1)
console.info("A-CSV LINES", lines)

const rows = await reader.collectRows(customer1)
console.info("ROW-PER-VALUE", rows)

const aAndB = flux`
import "influxdata/influxdb/schema"
from(bucket: "test_bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "customer_1")
  |> filter(fn: (r) => r._field == "temp" or r._field == "offline")
  |> filter(fn: (r) => r.src == "A" or r.src == "B")
  |> schema.fieldsAsCols()
  |> drop(columns: ["_start", "_stop", "_measurement"])
  |> rename(columns: {_time: "_t"})
`
for await (const row of reader.iterateRows(aAndB)) {
    const t = new Date(row.tableMeta.get(row.values, "_t"))
    const {_t, result, table, ...o} = row.tableMeta.toObject(row.values)
    console.log("ROW", t, o)
}
