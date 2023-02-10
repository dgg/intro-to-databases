-- SAMPLE: https://www.careerbless.com/db/rdbms/c1/er2.php

/* basic entity information */

CREATE TABLE "Department" (
    "Id" INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    "Name" character varying(256) NOT NULL,
    "Location" character varying(2048),
    PRIMARY KEY ("Id")
);

CREATE TABLE "Course" (
    "Id" INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    "Name" character varying(256) NOT NULL,
    "Credits" INT NOT NULL,
    PRIMARY KEY ("Id")
);

CREATE TABLE "Student" (
    "Id" INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    "FirstName" character varying(512) NOT NULL,
    "LastName" character varying(1024) NOT NULL,
    "ContactPhone" character varying(32),
    PRIMARY KEY ("Id")
);

CREATE TABLE "Instructor" (
    "Id" INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    "FirstName" character varying(512) NOT NULL,
    "LastName" character varying(1024) NOT NULL,
    "ContactPhone" character varying(32),
    PRIMARY KEY ("Id")
);

/* add relations */

-- A deparment offers many courses, but a course can only be offered by only one department (1:N)
ALTER TABLE "Course" ADD COLUMN "Department_Id" INT NOT NULL REFERENCES "Department"("Id") ON DELETE CASCADE;

-- A department has multiple instructors, but an instructor belongs to only one department (1:N)
ALTER TABLE "Instructor" ADD COLUMN "Department_Id" INT NOT NULL REFERENCES "Department"("Id") ON DELETE CASCADE;

-- A course can be enrolled by many students and one student can enroll in many courses (N:M)
CREATE TABLE "Student_Course" (
    "Student_Id" INT NOT NULL REFERENCES "Student"("Id") ON DELETE CASCADE,
    "Course_Id" INT NOT NULL REFERENCES "Course"("Id") ON DELETE CASCADE,
    PRIMARY KEY ("Student_Id", "Course_Id")
);

-- A course is taught by only one instructor, but one instructor can teach many courses (N:1)
ALTER TABLE "Course" ADD COLUMN "Instructor_Id" INT NOT NULL REFERENCES "Instructor"("Id") ON DELETE NO ACTION;

-- A department has only one head, and the head of deparment can only be such of one department (1:1)
/* 
    ALTER TABLE "Instructor" ADD COLUMN "HeadOfDepartment" BOOL NOT NULL DEFAULT FALSE;
    ALTER TABLE "Department" ADD COLUMN "HeadedBy" INT NULL REFERENCES "Instructor"("Id") 

    CREATE TABLE "Department_Head" (
        "Department_Id" INT NOT NULL REFERENCES "Department"("Id"),
        "Instructor_Id" INT NOT NULL REFERENCES "Instructor"("Id"),
        UNIQUE("Department_Id")
    );
    
    in all cases there is an extra data consistency check to be done by the application or a db trigger
*/
