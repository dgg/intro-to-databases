import pg from "pg"
const { Pool } = pg

import data from "./data.json" assert {type: "json"}

//#region functions
const insertDepartment = async (client, department) => {
    const values = Object.values(department)
    let result = await client.query('INSERT INTO "Department" ("Name", "Location") VALUES ($1, $2) RETURNING "Id"', values)
    department.id = result.rows[0].Id
}

const insertInstructor = async (client, instructor) => {
    const values = Object.values(instructor)
    let result = await client.query('INSERT INTO "Instructor" ("FirstName", "LastName", "ContactPhone", "Department_Id") VALUES ($1, $2, $3, $4) RETURNING "Id"', values)
    instructor.id = result.rows[0].Id
}

const insertStudent = async (client, student) => {
    const values = Object.values(student)
    let result = await client.query('INSERT INTO "Student" ("FirstName", "LastName") VALUES ($1, $2) RETURNING "Id"', values)
    student.id = result.rows[0].Id
}
const insertCourse = async (client, course) => {
    const values = Object.values(course)
    let result = await client.query('INSERT INTO "Course"("Name", "Credits", "Department_Id", "Instructor_Id") VALUES ($1, $2, $3, $4) RETURNING "Id"', values)
    course.id = result.rows[0].Id
}

const enrollCourse = async (client, student, course) => {
    const values = [student.id, course.id]
    let result = await client.query('INSERT INTO "Student_Course" VALUES ($1, $2) RETURNING *', values)
    return result.rows[0]
}
//#endregion

const pool = new Pool({ connectionString: "postgresql://root@127.0.0.1:26257/school?sslmode=disable" })

const client = await pool.connect()

const empty = await client.query('SELECT * FROM "Department"')
console.log("no departments yet", empty.rows)

await insertDepartment(client, data.science)
console.log("Inserted department with Id", data.science.id)

//#region instructors

data.john.departmentId = data.science.id
await insertInstructor(client, data.john)
data.jane.departmentId = data.science.id
await insertInstructor(client, data.jane)
console.log("\x1b[33mInserted instructors %o\x1b[0m", [data.john, data.jane])
//#endregion

//#region students

await insertStudent(client, data.mark)
await insertStudent(client, data.oliver)
await insertStudent(client, data.benji)
await insertStudent(client, data.bruce)
console.log("\x1b[32mInserted students %o\x1b[0m", [data.mark, data.oliver, data.benji, data.bruce])

//#endregion

//#region courses
data.math.departmentId = data.science.id
data.math.instructorId = data.john.id
await insertCourse(client, data.math)
data.biology.departmentId = data.science.id
data.biology.instructorId = data.jane.id
await insertCourse(client, data.biology)
console.log("\x1b[36mInserted courses %o\x1b[0m", [data.math, data.biology])

//#endregion

//#region course enrollment
await enrollCourse(client, data.mark, data.math)
await enrollCourse(client, data.oliver, data.math)
await enrollCourse(client, data.benji, data.biology)
await enrollCourse(client, data.bruce, data.biology)
//#endregion

await client.release()
await pool.end()
