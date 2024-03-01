CREATE TABLE users(
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	phone varchar(15) UNIQUE NOT NULL,
	personality varchar(35),
	ai_model varchar(35) DEFAULT 'gpt-4'
);

CREATE TABLE message_history(
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	phone varchar(15) NOT NULL,
	role varchar(35) NOT NULL,
	created_at timestamp DEFAULT now(),
	body varchar(1024) NOT NULL
);