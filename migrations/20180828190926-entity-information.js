'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('Department', {
    Id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true },
    Name: { type: 'string', length: 256, notNull: true },
    Location: { type: 'string', length: 2048 }
  })
    .then(() => {
      db.createTable('Course', {
        Id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true },
        Name: { type: 'string', length: 256, notNull: true },
        Credits: { type: 'int', notNull: true }
      })
    })
    .then(() => createStudent(db))
    .then(() => createInstructor(db));
};

const createStudent = (db) => {
  return db.createTable('Student', {
    Id: _id,
    FirstName: { type: 'string', length: 512, notNull: true },
    LastName: { type: 'string', length: 1024, notNull: true },
    ContactPhone: { type: 'string', length: 32 }
  })
}

const createInstructor = (db) => {
  return db.createTable('Instructor', {
    Id: _id,
    FirstName: { type: 'string', length: 512, notNull: true },
    LastName: { type: 'string', length: 1024, notNull: true },
    ContactPhone: { type: 'string', length: 32 }
  })
}

const _id = { type: 'int', notNull: true, primaryKey: true, autoIncrement: true }

exports.down = function (db) {
  return db.dropTable('Department')
    .then(() => db.dropTable('Course'))
    .then(() => db.dropTable('Student'))
    .then(() => db.dropTable('Instructor'))
};

exports._meta = {
  "version": 1
};
