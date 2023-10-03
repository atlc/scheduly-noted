# Scheduly Noted

## Features

## Reference

### Postgres Tables

```sql
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  username VARCHAR(32) UNIQUE,
  email VARCHAR(128) UNIQUE,
  emailVerified SMALLINT DEFAULT 0,
  phone VARCHAR(16),
  phoneVerified SMALLINT DEFAULT 0,
  password CHAR(60),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Events (
  id SERIAL PRIMARY KEY,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  name VARCHAR(64),
  description VARCHAR(512),
  datetime VARCHAR(32)
);
```
