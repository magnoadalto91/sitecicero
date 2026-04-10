import { useState, useEffect } from "react";

export default function PropertyCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-neutral-800 flex items-center justify-center text-neutral-500 text-sm">
        Sem imagem
      </div>
    );
  }

  function next(e) {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  }

  function prev(e) {
    e.stopPropagation();
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden">

      <img
        src={images[current].image_url}
        alt=""
        className="w-full h-full object-cover transition duration-500"
      />

      {images.length > 1 && (
        <>
          {/* Botão anterior */}
          <button
            onClick={prev}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2
                       bg-white/90 text-black w-9 h-9 md:w-10 md:h-10
                       rounded-full shadow flex items-center justify-center
                       text-lg leading-none"
          >
            ‹
          </button>

          {/* Botão próximo */}
          <button
            onClick={next}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2
                       bg-white/90 text-black w-9 h-9 md:w-10 md:h-10
                       rounded-full shadow flex items-center justify-center
                       text-lg leading-none"
          >
            ›
          </button>

          {/* Indicadores — clicáveis */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}