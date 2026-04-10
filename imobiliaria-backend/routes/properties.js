const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../db");

const upload = multer({ storage: multer.memoryStorage() });

// Helper: faz upload de um buffer para o Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cicero-imoveis", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// ============================
// LISTAR IMÓVEIS (filtros + paginação)
// ============================
router.get("/", async (req, res) => {
  const { city, type, purpose } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];
  let i = 1;

  if (city) { conditions.push(`p.city ILIKE $${i++}`); values.push(`%${city}%`); }
  if (type) { conditions.push(`p.type = $${i++}`); values.push(type); }
  if (purpose) { conditions.push(`p.purpose = $${i++}`); values.push(purpose); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM properties p ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataValues = [...values, limit, offset];
    const { rows } = await pool.query(
      `SELECT p.*,
        COALESCE(
          json_agg(
            json_build_object('id', pi.id, 'image_url', pi.image_url, 'cloudinary_public_id', pi.cloudinary_public_id)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS property_images
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $${i} OFFSET $${i + 1}`,
      dataValues
    );

    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar imóveis" });
  }
});

// ============================
// BUSCAR IMÓVEL POR ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*,
        COALESCE(
          json_agg(
            json_build_object('id', pi.id, 'image_url', pi.image_url, 'cloudinary_public_id', pi.cloudinary_public_id)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS property_images
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Imóvel não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar imóvel" });
  }
});

// ============================
// CRIAR IMÓVEL
// ============================
router.post("/", authMiddleware, upload.array("images"), async (req, res) => {
  const { title, price, type, purpose, city, description, bedrooms, bathrooms, area } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO properties (title, price, type, purpose, city, description, bedrooms, bathrooms, area)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, price, type, purpose, city, description, bedrooms, bathrooms, area]
    );
    const property = rows[0];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        await pool.query(
          "INSERT INTO property_images (property_id, image_url, cloudinary_public_id) VALUES ($1,$2,$3)",
          [property.id, result.secure_url, result.public_id]
        );
      }
    }

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar imóvel" });
  }
});

// ============================
// ATUALIZAR IMÓVEL
// ============================
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, city, price, bedrooms, bathrooms, area, purpose, type, description } = req.body;

  try {
    await pool.query(
      `UPDATE properties
       SET title=$1, city=$2, price=$3, bedrooms=$4, bathrooms=$5, area=$6, purpose=$7, type=$8, description=$9
       WHERE id=$10`,
      [title, city, price, bedrooms, bathrooms, area, purpose, type, description, req.params.id]
    );
    res.json({ message: "Imóvel atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

// ============================
// DELETAR IMÓVEL
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Busca imagens para deletar do Cloudinary
    const { rows: images } = await pool.query(
      "SELECT cloudinary_public_id FROM property_images WHERE property_id = $1",
      [req.params.id]
    );

    for (const img of images) {
      if (img.cloudinary_public_id) {
        await cloudinary.uploader.destroy(img.cloudinary_public_id);
      }
    }

    // ON DELETE CASCADE cuida das imagens na tabela
    await pool.query("DELETE FROM properties WHERE id = $1", [req.params.id]);

    res.json({ message: "Imóvel deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar" });
  }
});

// ============================
// UPLOAD DE IMAGENS EM IMÓVEL EXISTENTE
// ============================
router.post("/:id/images", authMiddleware, upload.array("images"), async (req, res) => {
  const propertyId = req.params.id;
  const uploadedImages = [];

  try {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      const { rows } = await pool.query(
        "INSERT INTO property_images (property_id, image_url, cloudinary_public_id) VALUES ($1,$2,$3) RETURNING *",
        [propertyId, result.secure_url, result.public_id]
      );
      uploadedImages.push(rows[0]);
    }

    res.json({ success: true, images: uploadedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer upload das imagens" });
  }
});

module.exports = router;
