/* all courses */
SELECT * FROM "Course";

/* science teachers */
SELECT 
    i."FirstName",
    i."LastName"
FROM "Instructor" AS i
    INNER JOIN "Department" AS d
        ON i."Department_Id" = d."Id"
WHERE d."Name" = 'Science';

/* Jane and her pupils */
SELECT 
    i."FirstName",
    i."LastName",
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
	i."FirstName" = 'Jane'

/* CLEAR school */
DELETE FROM "Department";
DELETE FROM "Student";
