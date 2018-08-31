const Sequelize = require('sequelize');

const sequelize = new Sequelize('school', 'postgres', '1234', {
    dialect: 'postgres',
    host: "localhost",
    port: 5432,
    define: {
        timestamps: false
    },
    logging: true,
    operatorsAliases: false
});

(async () => {
    // another client for raw queries
    //let result = await sequelize.query('SELECT "Id", "Name", "Credits" FROM "Course"')
    //console.log('query results:', result[0])

    let { Department, Instructor, Course, Student } = defineModel(sequelize)

    /*let departments = await Department.findAll()
    //console.log('All departments', onlyData(departments))

    // 1: N association
    let instructorsAndDepartments = await Instructor.findAll(
        { include: [{ model: Department }] })
    //console.log('All instructors (with departments)', onlyData(instructorsAndDepartments))

    // n:m association
    let aStudentAndItsCourses = await Student.findOne({ include: [{ model: Course }] })
    //console.log('a student and its courses', onlyData(aStudentAndItsCourses))
    

    let scienceTeachers = await Instructor.findAll({
        attributes: ['id', 'firstName', 'lastName'],
        include: [{
            model: Department,
            where: { name: 'Science' }
        }]
    })
    console.log('science teachers', onlyData(scienceTeachers))*/

    let janePlus = await Instructor.findAll({
        where : {firstName : 'Jane'},
        include : [ Course, Student ]
    })
    console.log('science teachers', onlyData(janePlus))


})()
    .finally(async () => {
        try {
            sequelize.close()
        }
        catch (e) { }
    })
    .catch(async (err) => {
        console.error('ERROR', err)
    })

function onlyData(results) {
    let data = null
    if (results) {
        data = results instanceof Array ? results.map(r => r.dataValues) : results.dataValues;
    }
    return data
}

function defineModel(sequelize) {
    const Department = sequelize.define('Department',
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'Id' },
            name: { type: Sequelize.STRING(256), allowNull: false, field: "Name" },
            location: { type: Sequelize.STRING(2048), allowNull: true, field: "Location" }
        },
        {
            tableName: "Department",
        })


    const Instructor = sequelize.define('Instructor',
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'Id' },
            firstName: { type: Sequelize.STRING(512), allowNull: false, field: "FirstName" },
            lastName: { type: Sequelize.STRING(2014), allowNull: false, field: "LastName" },
            contactPhone: { type: Sequelize.STRING(32), allowNull: true, field: "ContactPhone" }
        },
        {
            tableName: "Instructor",
        })
    Instructor.belongsTo(Department, { foreignKey: 'Department_Id' })

    const Course = sequelize.define('Course',
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'Id' },
            name: { type: Sequelize.STRING(256), allowNull: false, field: "Name" },
            credits: { type: Sequelize.INTEGER, allowNull: false, field: "Credits" }
        },
        {
            tableName: "Course",
        })
    Course.belongsTo(Department, { foreignKey: 'Department_Id' })
    Course.belongsTo(Instructor, { foreignKey: 'Instructor_Id' })
    Instructor.hasMany(Course, {foreignKey :  "Instructor_Id"})

    const Student = sequelize.define('Student',
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'Id' },
            firstName: { type: Sequelize.STRING(512), allowNull: false, field: "FirstName" },
            lastName: { type: Sequelize.STRING(2014), allowNull: false, field: "LastName" },
            contactPhone: { type: Sequelize.STRING(32), allowNull: true, field: "ContactPhone" }
        },
        {
            tableName: "Student",
        })
    Student.belongsToMany(Course, { through: "Student_Course", foreignKey: 'Student_Id', otherKey: 'Course_Id' })

    return { Department, Instructor, Course, Student }
}