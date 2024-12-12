# Assignment Overview

Imagine you’re still working at the game studio. This week, your team needs you to create a RESTful API to provide data for a dashboard. Using your knowledge of Node.js, Express, and PostgreSQL, you’ll implement routes that fetch data from the database based on different requirements.

## Database Structure

You’ll use the same tables as last week:

Tables:

- Players

- Games

- Scores

## Step 1: Setting Up

1. Create a new folder for this project and add the docker-compose.yml file

2. Initialize Your Project

- Run

```
npm init -y
```

- Install the necessary dependencies:

```
npm install express pg dotenv nodemon
```

- Set up a .env file to store your PostgreSQL connection details.

3. Set Up the Database

- make sure docker is running in your local.

- Make sure your PostgreSQL database is running.

```
docker compose up
```

NOTE: to stop docker processes

```
docker compose down
```

- Setup pgAdmin and create database.
  - Go to http://localhost:8080/login
  - create database using the data from the docker-compose.yml file
  - Use the following schema and sample data to create the tables:

```SQL
-- Create tables
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  join_date DATE
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  genre VARCHAR(20)
);

CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  game_id INT REFERENCES games(id),
  score INT,
  play_date DATE
);

-- Insert sample data
INSERT INTO players (name, join_date) VALUES
('John', '2024-01-10'),
('Sarah', '2024-02-05'),
('Michael', '2024-02-20'),
('Emily', '2024-03-01');

INSERT INTO games (title, genre) VALUES
('Chess', 'Strategy'),
('Soccer', 'Sports'),
('Tennis', 'Sports');

INSERT INTO scores (player_id, game_id, score, play_date) VALUES
(1, 1, 150, '2024-03-10'),
(2, 2, 180, '2024-03-12'),
(3, 2, 200, '2024-03-15'),
(1, 3, 120, '2024-03-20'),
(2, 1, 140, '2024-03-22'),
(3, 3, 190, '2024-03-25');
```

4. Create a Basic Express Server

- Set up an Express app in index.js and configure it to connect to your PostgreSQL database.

  - import packages required.
  - Create server instance
  - Set dotenv config
  - Add the pool object:

  ```JavaScript
  const { Pool } = pg;

  const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
  });
  ```

  - Create the listener
  - Create a middleware to parse JSON payloads (set it at the top of the endpoints)
    ```JavaScript
    app.use(express.json());
    ```

## Step 2: The API Challenges

You’ll create the following API endpoints. Each endpoint should connect to the database, execute a query, and return the result as JSON.

### Task 1: List All Players and Their Scores

Endpoint: GET /players-scores

Description:
Write a route that uses an SQL query to list all players, the games they’ve played, and their scores. Include:

- Player’s name

- Game title

- Score

### Task 2: Find High Scorers

Endpoint: GET /top-players

Description:
Write a route that returns the top 3 players with the highest total scores across all games. Sort them in descending order.

### Task 3: Players Who Didn’t Play Any Games

Endpoint: GET /inactive-players

Description:
Write a route that lists all players who haven’t played any games yet.

### Task 4: Find Popular Game Genres

Endpoint: GET /popular-genres

Description:
Write a route that finds the most popular game genres based on the number of times they’ve been played.

### Task 5: Recently Joined Players

Endpoint: GET /recent-players

Description:
Write a route that lists all players who joined in the last 30 days.

### Bonus Task: Players' Favorite Games

Endpoint: GET /favorite-games

Description:
Write a route that returns each player’s favorite game (the game they’ve played the most).

## Step 3: Submission

1. Test all your endpoints with Postman or Insomnia to ensure they return the correct data.

2. Copy your code to a GitHub Gist and share the link in the bellow.

```

```
