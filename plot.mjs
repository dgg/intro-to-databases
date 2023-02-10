import { plot, blue, lightblue } from "asciichart"

import ervy from "ervy"
const { bar, bg, gauge } = ervy

import { InfluxDB, flux } from "@influxdata/influxdb-client"

const opts = {
    url: "http://localhost:8086",
    token: "FFFF-EEEE-DDDD-CCCC"
}
const query = new InfluxDB(opts).getQueryApi("test_org")

const t101 = flux`
from(bucket: "sensors/highest")
  |> range(start: -1h, stop: -45m)
  |> filter(fn: (r) => r._field == "temperature")
  |> filter(fn: (r) => r.sensor_id == "TLM0101")
  |> keep(columns: ["_time", "_value"])
  |> rename(columns: {_value: "v", "_time": "t"})
`

const t101_data = (await query.collectRows(t101)).map(r => r.v).filter(v => v !== null)
console.log("TLM0101 (raw)")
console.log(plot(t101_data, { height: 8, colors: [blue] }))
console.log("-------")

const t101_aggregated = flux`
from(bucket: "sensors/highest")
  |> range(start: -1h, stop: -45m)
  |> filter(fn: (r) => r._field == "temperature")
  |> filter(fn: (r) => r.sensor_id == "TLM0101")
  |> aggregateWindow(every: 1m, fn: mean)
  |> keep(columns: ["_time", "_value"])
  |> rename(columns: {_value: "v", "_time": "t"})
`

const t101_aggregated_data = (await query.collectRows(t101_aggregated)).map(r => r.v).filter(v => v !== null)
console.log("TLM0101 (15m avg)")
console.log(plot(t101_aggregated_data, { height: 8, colors: [lightblue] }))
console.log("-------")

const lowestTemps = flux`
from(bucket: "sensors/highest")
  |> range(start: -6h)
  |> filter(fn: (r) => r._field == "temperature")
  |> min()
  |> keep(columns: ["sensor_id", "_value"])
  |> rename(columns: {sensor_id: "key", _value: "value"})
`

const lowestTemps_data = (await query.collectRows(lowestTemps))
    .map(r => ({ ...r, value: r.value.toFixed(3) }))
console.log("Lowest temps")
console.log(bar(lowestTemps_data, {
    style: bg("blue"),
    padding: 10
}))
console.log("-------")
