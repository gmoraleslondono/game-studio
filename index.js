import express, { response } from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// console.log(process.env.DB_USER);

app.use(express.json());

// It should show all players, should be visible in the browser http://localhost:3000
app.get("/", async (req, res) => {
  //   res.send("Hello World");
  try {
    const result = await pool.query("SELECT * FROM players"); // The pool.query() method is used to send SQL commands to the database and retrieve results. It is part of the pg library and works with the connection pool to manage queries efficiently.
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create player. Test it using postman
app.post("/players", async (req, res) => {
  const { name, join_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO players (name, join_date) VALUES ($1, $2) RETURNING *",
      [name, join_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update player. Test it using postman
app.put("/players/:id", async (req, res) => {
  const { id } = req.params; // Gets the ID of the player to update from the URL
  const { name, join_date } = req.body; // Get the new details from the request body
  try {
    const result = await pool.query(
      "UPDATE players SET name = $1, join_date = $2 WHERE id = $3 RETURNING *",
      [name, join_date, id] // Replace placeholders with the new values and the id
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Player not found"); // If no player is found with the given ID, return an error
    }

    res.json(result.rows[0]); // Return the updated player
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete player. Test it using postman
app.delete("/players/:id", async (req, res) => {
  const { id } = req.params; // Gets the ID of the player to delete from the URL
  try {
    const result = await pool.query(
      "DELETE FROM players CASCADE WHERE id = $1 RETURNING *",
      [id]
    ); // Delete the player with the given ID
    if (result.rows.length === 0) {
      return res.status(404).send("Player not found"); // If no player is found with the given ID, return an error
    }
    res.send("Player deleted successfully!"); // Return message to confirm deletion
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 1: List All Players, game title and Their Scores
app.get("/players-scores", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT players.name, games.title, score FROM scores INNER JOIN players ON players.id = scores.player_id INNER JOIN games ON games.id = scores.game_id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 2: Find High Scorers
app.get("/top-players", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT players.name, MAX(scores.score) AS highest_score FROM players JOIN scores ON players.id = scores.player_id GROUP BY players.name ORDER BY highest_score DESC LIMIT 3"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 3: Players Who Didn’t Play Any Games
app.get("/inactive-players", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT players.name FROM players LEFT JOIN scores ON players.id = scores.player_id WHERE scores.player_id IS NULL;"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 4: Find Popular Game Genres
app.get("/popular-genres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT games.genre, COUNT(scores.player_id) AS player_count FROM games JOIN scores ON games.id = scores.game_id GROUP BY games.genre ORDER BY player_count DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 5: Recently Joined Players
app.get("/recent-players", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name FROM players WHERE join_date >= NOW() - INTERVAL '30 days';"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Bonus Task: Players' Favorite Games
app.get("/favorite-games", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT players.name AS player_name, games.title AS game_title, COUNT(scores.id) AS play_count FROM scores JOIN players ON players.id = scores.player_id JOIN games ON games.id = scores.game_id GROUP BY players.name, games.title ORDER BY play_count DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
