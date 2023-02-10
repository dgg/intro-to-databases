import { Sequelize } from "sequelize"
import { inspect } from "node:util"

//#region functions

const onlyData = (results) => {
    let data = null
    if (results) {
        data = results instanceof Array ? results.map(r => r.dataValues) : results.dataValues
    }
    return inspect(data, { depth: 30, colors: true })
}

const defineModel = (sequelize) => {
    const Department = sequelize.define("Department",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: "Id" },
            name: { type: Sequelize.STRING(256), allowNull: false, field: "Name" },
            location: { type: Sequelize.STRING(2048), allowNull: true, field: "Location" }
        },
        {
            tableName: "Department",
        })


    const Instructor = sequelize.define("Instructor",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: "Id" },
            firstName: { type: Sequelize.STRING(512), allowNull: false, field: "FirstName" },
            lastName: { type: Sequelize.STRING(2014), allowNull: false, field: "LastName" },
            contactPhone: { type: Sequelize.STRING(32), allowNull: true, field: "ContactPhone" }
        },
        {
            tableName: "Instructor",
        })
    Instructor.belongsTo(Department, { foreignKey: "Department_Id" })

    const Course = sequelize.define("Course",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: "Id" },
            name: { type: Sequelize.STRING(256), allowNull: false, field: "Name" },
            credits: { type: Sequelize.INTEGER, allowNull: false, field: "Credits" }
        },
        {
            tableName: "Course",
        })
    Course.belongsTo(Department, { foreignKey: "Department_Id" })
    Course.belongsTo(Instructor, { foreignKey: "Instructor_Id" })
    Instructor.hasMany(Course, { foreignKey: "Instructor_Id" })

    const Student = sequelize.define("Student",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: "Id" },
            firstName: { type: Sequelize.STRING(512), allowNull: false, field: "FirstName" },
            lastName: { type: Sequelize.STRING(2014), allowNull: false, field: "LastName" },
            contactPhone: { type: Sequelize.STRING(32), allowNull: true, field: "ContactPhone" }
        },
        {
            tableName: "Student",
        })
    Student.belongsToMany(Course, { through: "Student_Course", foreignKey: "Student_Id", otherKey: "Course_Id" })

    return { Department, Instructor, Course, Student }
}

//#endregion

const orm = new Sequelize("postgresql://root@127.0.0.1:26257/school?sslmode=disable", {
    logging: false,
    operatorsAliases: false,
    define: {
        timestamps: false,
    }
})

// another client for raw queries
const courses = await orm.query('SELECT "Id", "Name", "Credits" FROM "Course"')
console.info("query results:", courses)


let { Department, Instructor, Course, Student } = defineModel(orm)

const departments = await Department.findAll()
console.info("All departments", onlyData(departments))

// 1: N association
const instructorsAndDepartments = await Instructor.findAll(
    { include: [{ model: Department }] })
console.info("All instructors (with departments)", onlyData(instructorsAndDepartments))

// n:m association
const aStudentAndItsCourses = await Student.findOne({ include: [{ model: Course }] })
console.info("a student and its courses", onlyData(aStudentAndItsCourses))

const scienceTeachers = await Instructor.findAll({
    attributes: ["id", "firstName", "lastName"],
    include: [{
        model: Department,
        where: { name: "Science" }
    }]
})
console.info("science teachers", onlyData(scienceTeachers))

await orm.close()
