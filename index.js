var sqlite = require('sqlite');

(async () => {

    let db = await sqlite.open(':memory:')

    // DDL
    await db.run('CREATE TABLE tbl (k INTEGER PRIMARY KEY ASC, name TEXT)')

    // data insertion
    let statement = await db.prepare('INSERT INTO tbl VALUES(:k, :name)', {':k': 1, ':name': 'some name'})
    statement = await statement.run()
    statement.finalize()

    statement = await db.prepare('INSERT INTO tbl VALUES(?, ?)')
    statement = await statement.run(2, 'other name')
    statement.finalize()

    // query
    let rows = await db.all('SELECT * FROM tbl')
    rows.map(r => {
        console.log(r.k, r.name)
    })    

    await db.close()
})().catch(err => console.error('error ', err))
