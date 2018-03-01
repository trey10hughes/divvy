DROP DATABASE IF EXISTS divvy_db;
CREATE database divvy_db;

USE divvy_db;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(25) NOT NULL,
  email varchar(100) NOT NULL,
  password varbinary(60) NOT NULL,
  PRIMARY KEY (id)
);

