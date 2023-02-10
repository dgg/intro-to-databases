import pg from "pg"
const { Pool } = pg

const pool = new Pool({ connectionString: "postgresql://root@127.0.0.1:26257/school?sslmode=disable" })

const client = await pool.connect()

// all courses, no relations
const allCourses = await client.query('SELECT "Id", "Name", "Credits" FROM "Course"')
console.info("All Courses", allCourses.rows)


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

const scienceTeachers = await client.query(sql, ["Science"])
console.info("Science teachers", scienceTeachers.rows)

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

const janeAndPupils = await client.query(sql, ["Jane"])
console.info("Jane and pupils", janeAndPupils.rows)
// but what I really like is this:
const instructor = {
    id: 0,
    firstName: "first",
    lastName: "last",
    pupils: [
        { id: 0, firstName: "f1", lastName: "l1" },
        { id: 1, firstName: "f1", lastName: "l2" },
    ]
}

// ¯\_(ツ)_/¯

await client.release()
await pool.end()
