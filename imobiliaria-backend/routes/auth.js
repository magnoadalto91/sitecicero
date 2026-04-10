// ============================
// IMPORTAÇÕES
// ============================

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

// Conecta no Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================
// LOGIN
// ============================

router.post("/login", async (req, res) => {

  const { email: username, password } = req.body;

  // Busca admin pelo username
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  // Verifica senha
  const validPassword = await bcrypt.compare(password, data.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  // Cria token
  const token = jwt.sign(
    { id: data.id },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

module.exports = router;