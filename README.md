Cicero Imóveis

Site de corretagem imobiliária com backend próprio: catálogo de imóveis com busca e filtros para o visitante, e área administrativa para o corretor cadastrar e manter os anúncios.

Stack

Backend: Node.js, Express 5, PostgreSQL (driver pg, hospedado na Railway) Frontend: React 19, Vite, React Router 7, Tailwind CSS 4, Swiper Autenticação: JWT e bcrypt Imagens: upload com Multer e armazenamento no Cloudinary

O backend foi migrado do Supabase para PostgreSQL na Railway com Cloudinary.

Funcionalidades
Catálogo de imóveis com busca e filtros por características
Página de detalhe com galeria de fotos em carrossel
Área administrativa protegida para cadastro, edição e remoção de imóveis
Upload múltiplo de fotos por imóvel
Formulário de contato para interessados
Layout responsivo
Estrutura
imobiliaria-backend/    API Express, acesso ao banco e seed
imobiliaria-frontend/   aplicação React (Vite)
Como rodar

Pré-requisitos: Node.js 20 ou superior e um banco PostgreSQL.

bash
# backend
cd imobiliaria-backend
npm install
cp .env.example .env
npm run seed        # popula o banco com dados iniciais
npm start

# frontend
cd imobiliaria-frontend
npm install
npm run dev
Variáveis de ambiente

Backend: DATABASE_URL, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET Frontend: URL da API do backend

.env não é versionado.
