import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function fetchProperties() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties`);
    const data = await response.json();
    setProperties(data.data);
  }

  async function deleteImage(imageId) {
    await fetch(`${import.meta.env.VITE_API_URL}/api/property-images/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProperties();
  }

  function removeSelectedImage(propertyId, indexToRemove) {
    setSelectedImages((prev) => {
      const filesArray = Array.from(prev[propertyId]);
      filesArray.splice(indexToRemove, 1);

      return {
        ...prev,
        [propertyId]: filesArray.length > 0 ? filesArray : null,
      };
    });
  }

  async function handleSaveProperty(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const property = {
      title: formData.get("title"),
      city: formData.get("city"),
      price: Number(formData.get("price")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      area: Number(formData.get("area")),
      purpose: formData.get("purpose"),
      type: formData.get("type"),
      description: formData.get("description"),
    };

    try {
      let response;

      if (editingProperty) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/properties/${editingProperty.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(property),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/properties`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(property),
          }
        );
      }

      if (!response.ok) {
        console.error("Erro ao salvar imóvel");
        return;
      }

      setIsModalOpen(false);
      setEditingProperty(null);
      await fetchProperties();

    } catch (error) {
      console.error("Erro:", error);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Deseja realmente deletar este imóvel?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Erro ao deletar");
        return;
      }

      await fetchProperties();

    } catch (error) {
      console.error("Erro:", error);
    }
  }

  async function uploadImages(propertyId) {
    const files = selectedImages[propertyId];

    if (!files || files.length === 0) return;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties/${propertyId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro no upload:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Upload sucesso:", result);

      setSelectedImages((prev) => ({
        ...prev,
        [propertyId]: null,
      }));

      await fetchProperties();
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-neutral-900 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex flex-row lg:flex-col justify-between items-center lg:items-stretch">
        <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-6 lg:gap-0">
          <h2 className="text-lg lg:text-xl font-bold lg:mb-10">Painel Admin</h2>

          <nav className="flex flex-row lg:flex-col gap-4 text-sm">
            <button className="text-left hover:text-emerald-400 transition">
              Dashboard
            </button>

            <button className="text-left hover:text-emerald-400 transition">
              Imóveis
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 lg:p-2 rounded-lg transition text-sm"
        >
          Sair
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">

        {/* TOPBAR */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard</h1>

          <button
            onClick={() => {
              setEditingProperty(null);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
          >
            + Novo Imóvel
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <div className="bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-white/10">
            <p className="text-sm text-gray-400">Total de Imóveis</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">
              {properties.length}
            </h3>
          </div>

          <div className="bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-white/10">
            <p className="text-sm text-gray-400">Imóveis à Venda</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">
              {properties.filter(p => p.purpose === "Venda").length}
            </h3>
          </div>

          <div className="bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-white/10">
            <p className="text-sm text-gray-400">Imóveis para Aluguel</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">
              {properties.filter(p => p.purpose === "Aluguel").length}
            </h3>
          </div>
        </div>

        {/* LISTA */}
        <div className="bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="p-3 sm:p-4 text-left">Título</th>
                  <th className="p-3 sm:p-4 text-left hidden sm:table-cell">Cidade</th>
                  <th className="p-3 sm:p-4 text-left hidden md:table-cell">Preço</th>
                  <th className="p-3 sm:p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-t border-white/5 hover:bg-neutral-800 transition"
                  >
                    <td className="p-3 sm:p-4">
                      <span className="block">{property.title}</span>
                      {/* Cidade e preço visíveis só no mobile, dentro da célula */}
                      <span className="block text-xs text-neutral-400 mt-1 sm:hidden">{property.city}</span>
                      <span className="block text-xs text-emerald-500 mt-0.5 md:hidden">R$ {property.price}</span>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">{property.city}</td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">R$ {property.price}</td>

                    <td className="p-3 sm:p-4 space-y-3">

                      {/* IMAGENS EXISTENTES */}
                      <div className="flex flex-row gap-2 flex-wrap">
                        {(property.property_images).map((img) => (
                          <div key={img.id} className="relative w-14 h-14 sm:w-16 sm:h-16">
                            <img
                              src={img.image_url}
                              className="w-full h-full object-cover rounded-lg"
                              alt=""
                            />

                            <button
                              onClick={() => deleteImage(img.id)}
                              className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-50"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* PREVIEW DAS NOVAS IMAGENS */}
                      {selectedImages[property.id] && (
                        <div className="flex flex-row gap-2 flex-wrap">
                          {Array.from(selectedImages[property.id]).map((file, index) => (
                            <div key={index} className="relative w-14 h-14 sm:w-16 sm:h-16">
                              <img
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover rounded-lg border border-emerald-500"
                                alt="preview"
                              />

                              <button
                                type="button"
                                onClick={() => removeSelectedImage(property.id, index)}
                                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* INPUT + BOTÕES */}
                      <div className="flex flex-wrap items-center gap-2">

                        <input
                          type="file"
                          multiple
                          id={`file-${property.id}`}
                          className="hidden"
                          onChange={(e) =>
                            setSelectedImages((prev) => ({
                              ...prev,
                              [property.id]: e.target.files,
                            }))
                          }
                        />

                        <label
                          htmlFor={`file-${property.id}`}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-xs transition"
                        >
                          📷 Selecionar
                        </label>

                        <button
                          onClick={() => uploadImages(property.id)}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg text-xs transition"
                        >
                          ⬆ Enviar
                        </button>

                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setIsModalOpen(true);
                          }}
                          className="cursor-pointer bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-xs transition"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(property.id)}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-xs transition"
                        >
                          Deletar
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 w-full max-w-2xl rounded-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              {editingProperty ? "Editar Imóvel" : "Novo Imóvel"}
            </h2>

            <form onSubmit={handleSaveProperty} className="grid sm:grid-cols-2 gap-4">

              <input
                name="title"
                defaultValue={editingProperty?.title || ""}
                placeholder="Título"
                className="bg-neutral-800 p-3 rounded-lg sm:col-span-2"
                required
              />

              <input
                name="city"
                defaultValue={editingProperty?.city || ""}
                placeholder="Cidade"
                className="bg-neutral-800 p-3 rounded-lg sm:col-span-2"
                required
              />

              <input
                name="price"
                defaultValue={editingProperty?.price || ""}
                type="number"
                placeholder="Preço"
                className="bg-neutral-800 p-3 rounded-lg sm:col-span-2"
                required
              />

              <input
                name="bedrooms"
                defaultValue={editingProperty?.bedrooms || ""}
                type="number"
                placeholder="Quartos"
                className="bg-neutral-800 p-3 rounded-lg"
              />

              <input
                name="bathrooms"
                defaultValue={editingProperty?.bathrooms || ""}
                type="number"
                placeholder="Banheiros"
                className="bg-neutral-800 p-3 rounded-lg"
              />

              <input
                name="area"
                defaultValue={editingProperty?.area || ""}
                type="number"
                placeholder="Área (m²)"
                className="bg-neutral-800 p-3 rounded-lg"
              />

              <select
                name="purpose"
                defaultValue={editingProperty?.purpose || ""}
                className="bg-neutral-800 p-3 rounded-lg"
              >
                <option value="Venda">Venda</option>
                <option value="Aluguel">Aluguel</option>
              </select>

              <select
                name="type"
                defaultValue={editingProperty?.type || ""}
                className="bg-neutral-800 p-3 rounded-lg sm:col-span-2"
              >
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cobertura">Cobertura</option>
              </select>

              <textarea
                name="description"
                defaultValue={editingProperty?.description || ""}
                placeholder="Descrição do imóvel"
                className="bg-neutral-800 p-3 rounded-lg min-h-[120px] resize-none sm:col-span-2"
                required
              />

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-semibold transition sm:col-span-2"
              >
                {editingProperty ? "Salvar Alterações" : "Cadastrar Imóvel"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}