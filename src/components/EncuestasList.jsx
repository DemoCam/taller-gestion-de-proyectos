import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import SurveyForm from "./SurveyForm";

export default function EncuestasList() {
  const { encuestas, eliminarEncuesta, validarEncuesta } = useApp();
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroValidada, setFiltroValidada] = useState("todas");
  const [orden, setOrden] = useState({ campo: "fechaCaptura", dir: "desc" });
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 10;

  const filtradas = useMemo(() => {
    let list = [...encuestas];

    if (busqueda) {
      const q = busqueda.toLowerCase();
      list = list.filter(
        (e) =>
          e.nombres.toLowerCase().includes(q) ||
          e.apellidos.toLowerCase().includes(q) ||
          e.ciudadResidencia.toLowerCase().includes(q) ||
          e.departamentoResidencia.toLowerCase().includes(q) ||
          e.nivelEducativo.toLowerCase().includes(q)
      );
    }

    if (filtroValidada === "validadas") list = list.filter((e) => e.validada);
    if (filtroValidada === "pendientes") list = list.filter((e) => !e.validada);

    list.sort((a, b) => {
      const av = a[orden.campo] ?? "";
      const bv = b[orden.campo] ?? "";
      return orden.dir === "asc"
        ? av.toString().localeCompare(bv.toString())
        : bv.toString().localeCompare(av.toString());
    });

    return list;
  }, [encuestas, busqueda, filtroValidada, orden]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const pagActual = Math.min(pagina, totalPaginas);
  const paginadas = filtradas.slice((pagActual - 1) * POR_PAGINA, pagActual * POR_PAGINA);

  function toggleOrden(campo) {
    setOrden((prev) =>
      prev.campo === campo
        ? { campo, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { campo, dir: "asc" }
    );
    setPagina(1);
  }

  function sortIcon(campo) {
    if (orden.campo !== campo) return " ↕";
    return orden.dir === "asc" ? " ↑" : " ↓";
  }

  if (editando) {
    return <SurveyForm editando={editando} onClose={() => setEditando(null)} />;
  }

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
            Encuestas
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            {filtradas.length} de {encuestas.length} registros
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            placeholder="🔍  Buscar..."
            style={{ width: 200 }}
          />
          <select
            value={filtroValidada}
            onChange={(e) => { setFiltroValidada(e.target.value); setPagina(1); }}
            style={{ width: 150 }}
          >
            <option value="todas">Todas</option>
            <option value="validadas">Validadas</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass" style={{ overflow: "hidden" }}>
        <div className="table-container" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                {[
                  ["fechaCaptura","Fecha"],
                  ["nombres","Nombre"],
                  ["edad","Edad"],
                  ["ciudadResidencia","Ciudad"],
                  ["departamentoResidencia","Depto."],
                  ["nivelEducativo","Educación"],
                  ["encuestadorId","Encuestador"],
                  ["jornada","Jornada"],
                ].map(([campo, titulo]) => (
                  <th key={campo} style={{ cursor: "pointer", userSelect: "none" }} onClick={() => toggleOrden(campo)}>
                    {titulo}{sortIcon(campo)}
                  </th>
                ))}
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginadas.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "2rem", color: "#475569" }}>
                    No se encontraron encuestas
                  </td>
                </tr>
              ) : paginadas.map((enc) => (
                <tr key={enc.id}>
                  <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{enc.fechaCaptura}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{enc.nombres} {enc.apellidos}</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{enc.genero}</div>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{enc.edad} años</td>
                  <td>{enc.ciudadResidencia}</td>
                  <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{enc.departamentoResidencia}</td>
                  <td style={{ fontSize: "0.78rem", maxWidth: 140, whiteSpace: "normal" }}>{enc.nivelEducativo}</td>
                  <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{enc.encuestadorId}</td>
                  <td>
                    <span className={`badge ${enc.jornada === "Mañana" ? "badge-info" : "badge-violet"}`}>
                      {enc.jornada === "Mañana" ? "☀" : "🌙"} {enc.jornada}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${enc.validada ? "badge-ok" : "badge-warn"}`}>
                      {enc.validada ? "✓ Válida" : "⏳ Pendiente"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button className="btn btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}
                        onClick={() => setEditando(enc)}>✎</button>
                      {!enc.validada && (
                        <button className="btn btn-success" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}
                          onClick={() => validarEncuesta(enc.id)}>✓</button>
                      )}
                      <button className="btn btn-danger" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}
                        onClick={() => { if (confirm(`¿Eliminar encuesta de ${enc.nombres} ${enc.apellidos}?`)) eliminarEncuesta(enc.id); }}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button className="btn btn-secondary" style={{ padding: "0.35rem 0.75rem" }}
              onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagActual === 1}>
              ←
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPagina(p)}
                className={`btn ${p === pagActual ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.35rem 0.75rem", minWidth: 36 }}>
                {p}
              </button>
            ))}
            <button className="btn btn-secondary" style={{ padding: "0.35rem 0.75rem" }}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagActual === totalPaginas}>
              →
            </button>
          </div>
        )}
      </div>

      {/* Summary strip */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          { label: "Total filtradas", value: filtradas.length, color: "#6366f1" },
          { label: "Validadas", value: filtradas.filter((e) => e.validada).length, color: "#22c55e" },
          { label: "Pendientes", value: filtradas.filter((e) => !e.validada).length, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-sm" style={{ padding: "0.75rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{label}:</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
