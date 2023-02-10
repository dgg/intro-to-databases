"use strict"

let dbm
let type
let seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = (db) => {
  return relateCourse_Department(db)
    .then(() => relateIntructor_Department(db))
    .then(() => relateStudents_Courses(db))
    .then(() => relateCourse_Instructor(db))
}

const relateCourse_Department = (db) => {
  return db.addColumn("Course", "Department_Id", departmentFk);
}
const departmentFk = {
  type: "int",
  notNull: true,
  foreignKey: {
    name: "Department_fk",
    table: "Department",
    rules: { onDelete: "CASCADE" },
    mapping: { "Department_Id": "Id" }
  }
}

const relateIntructor_Department = (db) => {
  return db.addColumn("Instructor", "Department_Id", departmentFk);
}

const relateStudents_Courses = (db) => {
  return db.createTable("Student_Course", {
    "Student_Id": {
      type: "int",
      notNull: true,
      primaryKey: true,
      foreignKey: {
        name: "Student_fk",
        table: "Student",
        rules: { onDelete: "CASCADE" },
        mapping: { "Student_Id": "Id" }
      }
    },
    "Course_Id": {
      type: "int",
      notNull: true,
      primaryKey: true,
      foreignKey: {
        name: "Course_fk",
        table: "Course",
        rules: { onDelete: "CASCADE" },
        mapping: { "Course_Id": "Id" }
      }
    }
  })
}

const relateCourse_Instructor = (db) => {
  return db.addColumn("Course", "Instructor_Id", {
    type: "int",
    notNull: true,
    foreignKey: {
      name: "Instructor_fk",
      table: "Instructor",
      rules: { onDelete: "CASCADE" },
      mapping: { "Instructor_Id": "Id" }
    }
  })
}

exports.down = (db) => {
  return db.removeColumn("Course", "Department_Id")
    .then(() => db.removeColumn("Instructor", "Department_Id"))
    .then(() => db.dropTable("Student_Course"))
    .then(() => db.removeColumn("Course", "Instructor_Id"))
}

exports._meta = {
  "version": 1
}
