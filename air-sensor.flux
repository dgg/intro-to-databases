import "influxdata/influxdb/sample"

sample.data(set: "airSensor")
    |> to(bucket: "sensors/highest")
