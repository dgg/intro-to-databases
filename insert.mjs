import { InfluxDB, Point } from "@influxdata/influxdb-client"

const opts = {
    url: "http://localhost:8086",
    token: "FFFF-EEEE-DDDD-CCCC"
}
const writer = new InfluxDB(opts).getWriteApi("test_org", "test_bucket", "ms", { batchSize: 2 })

class Readout {
    #point
    constructor(customer, src, ts = new Date().valueOf()) {
        this.#point = new Point(customer).tag("src", src).timestamp(ts)
    }

    status(n) {
        this.#point.uintField("status", n)
        return this
    }

    mode(n) {
        this.#point.intField("mode", n)
        return this
    }

    temp(n) {
        this.#point.floatField("temp", n)
        return this
    }
    offline(b) {
        this.#point.booleanField("offline", b)
        return this
    }

    serial(s) {
        this.#point.stringField("serial", s)
        return this
    }

    toPoint() {
        return this.#point
    }
}


writer.writePoints([
    new Point("customer_1").tag("A").uintField("status", 2).intField("mode", -2).floatField("temp", 40.8).stringField("serial", "0001234"),
    new Readout("customer_1", "B").status(1).mode(-1).temp(40.7).offline(true).serial("0001235").toPoint(),
    new Readout("customer_1", "C").status(2).mode(-1).temp(41.7).offline(true).serial("0001236").toPoint()
])

try {
    await writer.close()
} catch (e) {
    console.error("ERROR writing", e)
}
