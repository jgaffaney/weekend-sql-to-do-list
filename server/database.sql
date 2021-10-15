CREATE TABLE "todo" (
    "id" SERIAL PRIMARY KEY,
    "task" VARCHAR(255),
    "due_date" DATE,
    "priority" INT,
    "completed_date" DATE
);