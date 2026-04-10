const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================
// LISTAR IMÓVEIS (com filtros e paginação)
// ============================
router.get("/", async (req, res) => {
  const { city, type, purpose } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("properties")
    .select(`*, property_images (*)`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (city) query = query.ilike("city", `%${city}%`);
  if (type) query = query.eq("type", type);
  if (purpose) query = query.eq("purpose", purpose);

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({ data, total: count, page, limit });
});

// ============================
// BUSCAR IMÓVEL POR ID
// ============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("properties")
    .select(`*, property_images (*)`)
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Imóvel não encontrado" });

  res.json(data);
});

// ============================
// CRIAR IMÓVEL
// ============================
router.post(
  "/",
  authMiddleware,
  upload.array("images"),
  async (req, res) => {
    const { title, price, type, purpose, city, description, bedrooms, bathrooms, area } = req.body;

    // Insere o imóvel primeiro
    const { data: property, error: propError } = await supabase
      .from("properties")
      .insert([{ title, price, type, purpose, city, description, bedrooms, bathrooms, area }])
      .select()
      .single();

    if (propError) return res.status(400).json({ error: propError.message });

    // Upload das imagens (se houver)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${property.id}/${Date.now()}-${file.originalname}`;

        const { error: uploadError } = await supabase.storage
          .from("properties")
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from("properties")
            .getPublicUrl(fileName);

          await supabase.from("property_images").insert({
            property_id: property.id,
            image_url: publicData.publicUrl,
          });
        }
      }
    }

    res.json(property);
  }
);

// ============================
// ATUALIZAR IMÓVEL
// ============================
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, city, price, bedrooms, bathrooms, area, purpose, type, description } = req.body;

  const { error } = await supabase
    .from("properties")
    .update({ title, city, price, bedrooms, bathrooms, area, purpose, type, description })
    .eq("id", id);

  if (error) return res.status(500).json({ error: "Erro ao atualizar" });

  res.json({ message: "Imóvel atualizado com sucesso" });
});

// ============================
// DELETAR IMÓVEL
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await supabase.from("properties").delete().eq("id", id);

  res.json({ message: "Imóvel deletado" });
});

// ============================
// UPLOAD DE IMAGENS EM IMÓVEL EXISTENTE
// ============================
router.post(
  "/:id/images",
  authMiddleware,
  upload.array("images"),
  async (req, res) => {
    const propertyId = req.params.id;
    const uploadedImages = [];

    for (const file of req.files) {
      const fileName = `${propertyId}/${Date.now()}-${file.originalname}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) return res.status(500).json({ error: uploadError.message });

      const { data: publicData } = supabase.storage
        .from("properties")
        .getPublicUrl(fileName);

      const { data: img, error: insertError } = await supabase
        .from("property_images")
        .insert({ property_id: propertyId, image_url: publicData.publicUrl })
        .select()
        .single();

      if (insertError) return res.status(500).json({ error: insertError.message });

      uploadedImages.push(img);
    }

    res.json({ success: true, images: uploadedImages });
  }
);

module.exports = router;
