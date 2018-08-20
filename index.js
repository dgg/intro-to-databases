const MongoClient = require('mongodb').MongoClient;


(async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    const reports = await client.db('test').collection('reports')
    let _test = require('./18877.json')
    await reports.insertOne(_test)
    let query = {
        _id: 18877
    }
    let options = {
        projection : { name: 1, specifier: 1, lastModified: 1 }
    }
    let allReports = await reports.find(query, options).toArray()
    console.log(allReports)
    client.close()
})().catch(err => console.error(err))
