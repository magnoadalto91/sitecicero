const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../db");

// ============================
// DELETAR IMAGEM POR ID
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM property_images WHERE id = $1",
      [req.params.id]
    );
    const image = rows[0];

    if (!image) return res.status(404).json({ error: "Imagem não encontrada" });

    // Remove do Cloudinary
    if (image.cloudinary_public_id) {
      await cloudinary.uploader.destroy(image.cloudinary_public_id);
    }

    await pool.query("DELETE FROM property_images WHERE id = $1", [req.params.id]);

    res.json({ message: "Imagem removida" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover imagem" });
  }
});

module.exports = router;
