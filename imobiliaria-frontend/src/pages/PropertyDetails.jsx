import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PropertyDetails() {

  // Pega o ID da URL
  const { id } = useParams();

  const [property, setProperty] = useState(null);

  useEffect(() => {

    fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
      .then(res => res.json())
      .then(data => {
        const found = data.data.find(p => p.id === id);
        setProperty(found);
      });

  }, [id]);

  if (!property) {
    return <div className="p-6 sm:p-10">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* CARROSSEL */}
      <div className="w-full h-52 sm:h-80 md:h-[500px] overflow-hidden">
        <img
          src={property.images?.[0]}
          className="w-full h-full object-cover"
        />
      </div>

      {/* INFORMAÇÕES */}
      <div className="max-w-6xl mx-auto p-5 sm:p-8 bg-white shadow rounded-xl relative z-10 -mt-6 sm:-mt-12 md:-mt-20 mx-4 sm:mx-6 md:mx-auto">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {property.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {property.city}
        </p>

        <p className="text-green-600 text-2xl sm:text-3xl font-bold mt-4">
          R$ {property.price}
        </p>

        <p className="mt-6 text-gray-700">
          {property.description}
        </p>

      </div>

    </div>
  );
}

export default PropertyDetails;