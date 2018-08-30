const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'school',
    password: '1234',
    port: 5432
});

const data = require('./data.json')

let client;

(async () => {

    client = await pool.connect()

    // all courses, no relations
    let queryResult = await client.query('SELECT "Id", "Name", "Credits" FROM "Course"')
    const allCourses = queryResult.rows
    console.log('All Courses', allCourses)


    // science teachers, manipulating results
    let sql =
        `SELECT
            i."Id",
            i."FirstName",
            i."LastName"
        FROM "Instructor" AS i
            INNER JOIN "Department" AS d
                ON i."Department_Id" = d."Id"
        WHERE d."Name" = $1;`

    queryResult = await client.query(sql, ['Science'])
    const scienceTeachers = queryResult.rows.map(r => pascalToCamel(r))
    console.log('Science teachers', scienceTeachers)

    // Jane and her pupils. Object graphs suck
    sql =
        `SELECT 
            i."Id" as "InstructorId",
            i."FirstName" as "InstructorFirstName",
            i."LastName" as "InstructorLastName",
            s."Id",
            s."FirstName",
            s."LastName"
        FROM "Student" AS s
            INNER JOIN "Student_Course" AS sc
                ON s."Id" = sc."Student_Id"
            INNER JOIN "Course" AS c
                ON c."Id" = sc."Course_Id"
            INNER JOIN "Instructor" as i
                ON i."Id" = c."Instructor_Id"
        WHERE
            i."FirstName" = $1`

    queryResult = await client.query(sql, ['Jane'])
    const pupilRows = queryResult.rows
        .map(r => pascalToCamel(r))
    console.log('Jane and pupils', pupilRows)
    // but what I really like is this:
    let instructor = {
        id : 0,
        firstName: 'first',
        lastName: 'last',
        pupils : [
            { id: 0, firstName : 'f1', lastName : 'l1'},
            { id: 1, firstName : 'f1', lastName : 'l2'},
        ]
    }

    // ¯\_(ツ)_/¯

    await client.release()
    await pool.end()
})()
    .catch(async (err) => {
        try {
            await client.release()
            await pool.end()
        }
        catch (e) { }
        console.error('ERROR', err)
    })

let pascalToCamel = (obj) => {
    Object.keys(obj).map(k => {
        delete Object.assign(obj, { [camelize(k)]: obj[k] })[k];
    })
    return obj
}

let camelize = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
}