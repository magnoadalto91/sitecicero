const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================
// DELETAR IMAGEM POR ID
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  const imageId = req.params.id;

  const { data: image } = await supabase
    .from("property_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!image) return res.status(404).json({ error: "Imagem não encontrada" });

  // Extrai o caminho dentro do bucket a partir da URL pública
  const urlParts = image.image_url.split("/storage/v1/object/public/properties/");
  const filePath = urlParts[1];

  if (filePath) {
    await supabase.storage.from("properties").remove([filePath]);
  }

  await supabase.from("property_images").delete().eq("id", imageId);

  res.json({ message: "Imagem removida" });
});

module.exports = router;
