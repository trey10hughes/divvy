DROP DATABASE IF EXISTS divvy_db;
CREATE database divvy_db;

USE divvy_db;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(25) NOT NULL,
  email varchar(100) NOT NULL,
  first_name varchar(25) NOT NULL,
  last_name varchar(25) NOT NULL,
  password varbinary(60) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE userInfo (
	id int NOT NULL AUTO_INCREMENT,
	users_id int NOT NULL,
	keyword_1 varchar(25),
	keyword_2 varchar(25),
	keyword_3 varchar(25),
	keyword_4 varchar(25),
	keyword_5 varchar(25),
	keyword_6 varchar(25),
	keyword_7 varchar(25),
	keyword_8 varchar(25),
	keyword_9 varchar(25),
	keyword_10 varchar(25),
	FOREIGN KEY (users_id) REFERENCES users(id),
	KEY (id),
	KEY (users_id)
) ENGINE = INNODB;


