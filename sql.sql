--CREATE TABLE user(
  --  name VARCHAR(200),
  --  id TEXT NOT NULL PRIMARY KEY
--)
--CREATE TABLE tasks(id TEXT NOT NULL PRIMARY KEY,task TEXT,isChecked BOOLEAN,user_id TEXT,FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE)