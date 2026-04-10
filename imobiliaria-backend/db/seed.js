// Script para criar o usuário admin inicial
// Uso: node db/seed.js
// Defina DATABASE_URL no .env antes de rodar

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const pool = require("../db");
const bcrypt = require("bcrypt");

async function seed() {
  const username = process.env.ADMIN_USERNAME || "cicero";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING",
    [username, hashed]
  );

  console.log(`Admin criado: username="${username}", senha="${password}"`);
  console.log("Altere a senha depois de fazer login!");

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
