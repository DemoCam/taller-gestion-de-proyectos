import { createContext, useContext, useState, useEffect } from "react";
import { SEED_ENCUESTAS } from "../data/seedData";
import { NIVELES_EDUCATIVOS, ENCUESTADORES } from "../data/colombia";

const AppContext = createContext(null);

const STORAGE_KEY = "survey_app_data";
const OPTIONS_KEY = "survey_app_options";

export function AppProvider({ children }) {
  const [encuestas, setEncuestas] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_ENCUESTAS;
    } catch {
      return SEED_ENCUESTAS;
    }
  });

  const [opciones, setOpciones] = useState(() => {
    try {
      const saved = localStorage.getItem(OPTIONS_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            nivelesEducativos: [...NIVELES_EDUCATIVOS],
            estratos: ["1", "2", "3", "4", "5", "6"],
            generos: ["Masculino", "Femenino", "No binario", "Prefiero no decir"],
            encuestadores: [...ENCUESTADORES],
          };
    } catch {
      return {
        nivelesEducativos: [...NIVELES_EDUCATIVOS],
        estratos: ["1", "2", "3", "4", "5", "6"],
        generos: ["Masculino", "Femenino", "No binario", "Prefiero no decir"],
        encuestadores: [...ENCUESTADORES],
      };
    }
  });

  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encuestas));
  }, [encuestas]);

  useEffect(() => {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(opciones));
  }, [opciones]);

  function agregarEncuesta(enc) {
    const nueva = { ...enc, id: `enc-${Date.now()}` };
    setEncuestas((prev) => [...prev, nueva]);
    return nueva;
  }

  function actualizarEncuesta(id, datos) {
    setEncuestas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...datos } : e))
    );
  }

  function eliminarEncuesta(id) {
    setEncuestas((prev) => prev.filter((e) => e.id !== id));
  }

  function validarEncuesta(id) {
    setEncuestas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, validada: true } : e))
    );
  }

  function resetearDatos() {
    setEncuestas(SEED_ENCUESTAS);
  }

  function actualizarOpciones(campo, valores) {
    setOpciones((prev) => ({ ...prev, [campo]: valores }));
  }

  return (
    <AppContext.Provider
      value={{
        encuestas,
        opciones,
        activeView,
        setActiveView,
        agregarEncuesta,
        actualizarEncuesta,
        eliminarEncuesta,
        validarEncuesta,
        resetearDatos,
        actualizarOpciones,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
