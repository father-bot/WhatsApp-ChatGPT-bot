CREATE TABLE users(
	id uuid PRIMARY KEY,
	phone varchar(15) UNIQUE NOT NULL,
	personality VARCHAR(35)
);
