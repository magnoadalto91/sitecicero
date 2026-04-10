const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  const { email: username, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

module.exports = router;
