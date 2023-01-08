const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const databasePath = path.join(__dirname, "sample.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(9001, () =>
      console.log("Server Running at http://localhost:9001/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


app.get("/sample/", async (request, response) => {
    
    const getSampleQuery = `
        SELECT
          *
        FROM
          tasks
        ;`;
    const s = await db.all(getSampleQuery);
    response.send(s)

   

    
  });
  app.get("/user/", async (request, response) => {
    
    const getSampleQuery = `
        SELECT
          *
        FROM
          user
        ;`;
    const s = await db.all(getSampleQuery);
    response.send("tasks Data")

   
  });

  app.get("/all/", async (request, response) => {
    
    const getAllQuery = `
        SELECT
          user.name,user.id, tasks.id as task_id, tasks.task, tasks.isChecked, tasks.user_id
        FROM
          tasks
          INNER JOIN 
          user ON
          tasks.user_id = user.id
          GROUP BY user.name
      
        ;`;
    const a = await db.all(getAllQuery);
    response.send(a)
    
  });



  app.post("/add/", async (request, response) => {
    const {name, todo, isChecked} = request.body
    const identifyUser = `
    SELECT *
    from user
    WHERE name = '${name}';`;
    const data = await db.get(identifyUser)
    

    const id = uuidv4()
    const taskID = uuidv4()
    

    if(data === undefined){
      const postSample = `
      INSERT INTO user(name, id)
      VALUES ('${name}', "${id}");`;
      await db.run(postSample);
  
      
const postTask = `
INSERT INTO tasks (id, task, user_id, isChecked)
VALUES ("${taskID}", '${todo}',"${id}", "${isChecked}" );`;
await db.run(postTask)




    }
    else{
      getUserTaskQuery = `
      SELECT
        *
      FROM
        user
        WHERE name = '${name}'
      ;`;
  const z = await db.get(getUserTaskQuery);

  const UI = z.id

  const getUserTaskStatus = `
      SELECT
        task
      FROM
        tasks
        INNER JOIN 
        user ON 
        tasks.user_id = "${UI}"

        WHERE tasks.task = '${todo}'
      ;`;
  const task = await db.get(getUserTaskStatus);

  if(task === undefined){
    const newTask = `
    INSERT INTO tasks (id, task, user_id, isChecked)
VALUES ("${taskID}", '${todo}',"${UI}", "${isChecked}" );`;
await db.run(newTask)

  }else{
    response.send("Task already exists")
  }

  
    }
  })
    

module.exports = app;