import React from "react";

function Filters({ setFilters }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow w-full">

      <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4">

        {/* FILTRO TIPO */}
        <select
          className="w-full md:w-auto border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: e.target.value
            }))
          }
        >
          <option value="">Tipo</option>
          <option value="Casa">Casa</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Chácara">Chácara</option>
        </select>

        {/* FILTRO FINALIDADE */}
        <select
          className="w-full md:w-auto border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              purpose: e.target.value
            }))
          }
        >
          <option value="">Finalidade</option>
          <option value="Venda">Venda</option>
          <option value="Aluguel">Aluguel</option>
        </select>

        {/* FILTRO CIDADE */}
        <input
          type="text"
          className="col-span-2 w-full md:flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
          placeholder="Cidade"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              city: e.target.value
            }))
          }
        />

      </div>
    </div>
  );
}

export default Filters;