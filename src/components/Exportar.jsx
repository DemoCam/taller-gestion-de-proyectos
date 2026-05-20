import { useState } from "react";
import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";
import { getGrupoEtario } from "../data/colombia";

function encuestaToRow(e) {
  return {
    ID: e.id,
    Nombres: e.nombres,
    Apellidos: e.apellidos,
    Edad: e.edad,
    "Fecha Nacimiento": e.fechaNacimiento,
    Género: e.genero,
    "Ciudad Residencia": e.ciudadResidencia,
    "Departamento Residencia": e.departamentoResidencia,
    "Ciudad Nacimiento": e.ciudadNacimiento,
    "Departamento Nacimiento": e.departamentoNacimiento,
    "Nivel Educativo": e.nivelEducativo,
    Estrato: e.estrato,
    "Grupo Etario": getGrupoEtario(e.edad),
    Encuestador: e.encuestadorId,
    Jornada: e.jornada,
    "Fecha Captura": e.fechaCaptura,
    "Hora Captura": e.horaCaptura,
    Validada: e.validada ? "Sí" : "No",
  };
}

export default function Exportar() {
  const { encuestas } = useApp();
  const [soloValidadas, setSoloValidadas] = useState(false);
  const [incluirSensibles, setIncluirSensibles] = useState(false);
  const [status, setStatus] = useState(null);

  const datos = soloValidadas ? encuestas.filter((e) => e.validada) : encuestas;

  function getRows() {
    return datos.map((e) => {
      const row = encuestaToRow(e);
      if (!incluirSensibles) {
        delete row["Fecha Nacimiento"];
      }
      return row;
    });
  }

  function showStatus(msg, ok = true) {
    setStatus({ msg, ok });
    setTimeout(() => setStatus(null), 3000);
  }

  function exportCSV() {
    const rows = getRows();
    if (!rows.length) return showStatus("No hay datos para exportar", false);
    const header = Object.keys(rows[0]);
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    download(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), "encuestas.csv");
    showStatus(`✓ CSV exportado — ${rows.length} registros`);
  }

  function exportTXT() {
    const rows = getRows();
    if (!rows.length) return showStatus("No hay datos para exportar", false);
    const header = Object.keys(rows[0]);
    const txt = [
      header.join("\t"),
      ...rows.map((r) => header.map((h) => r[h] ?? "").join("\t")),
    ].join("\n");
    download(new Blob([txt], { type: "text/plain;charset=utf-8" }), "encuestas.txt");
    showStatus(`✓ TXT exportado — ${rows.length} registros`);
  }

  function exportXLSX() {
    const rows = getRows();
    if (!rows.length) return showStatus("No hay datos para exportar", false);
    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths
    ws["!cols"] = Object.keys(rows[0]).map((k) => ({ wch: Math.max(k.length, 16) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Encuestas");

    // Analytics sheet
    const porCiudad = {};
    datos.forEach((e) => { porCiudad[e.ciudadResidencia] = (porCiudad[e.ciudadResidencia] || 0) + 1; });
    const wsCity = XLSX.utils.json_to_sheet(
      Object.entries(porCiudad).map(([Ciudad, Cantidad]) => ({ Ciudad, Cantidad }))
    );
    XLSX.utils.book_append_sheet(wb, wsCity, "Por Ciudad");

    const porDepto = {};
    datos.forEach((e) => { porDepto[e.departamentoResidencia] = (porDepto[e.departamentoResidencia] || 0) + 1; });
    const wsDepto = XLSX.utils.json_to_sheet(
      Object.entries(porDepto).map(([Departamento, Cantidad]) => ({ Departamento, Cantidad }))
    );
    XLSX.utils.book_append_sheet(wb, wsDepto, "Por Departamento");

    const porEduc = {};
    datos.forEach((e) => { porEduc[e.nivelEducativo] = (porEduc[e.nivelEducativo] || 0) + 1; });
    const wsEduc = XLSX.utils.json_to_sheet(
      Object.entries(porEduc).map(([Nivel, Cantidad]) => ({ Nivel, Cantidad }))
    );
    XLSX.utils.book_append_sheet(wb, wsEduc, "Por Educación");

    XLSX.writeFile(wb, "encuestas.xlsx");
    showStatus(`✓ XLSX exportado — ${rows.length} registros, 4 hojas`);
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 700 }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
          Exportar Datos
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Descarga los datos en diferentes formatos para análisis externo
        </p>
      </div>

      {status && (
        <div className="animate-scaleIn" style={{
          background: status.ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
          border: `1px solid ${status.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 12, padding: "0.875rem 1.25rem", marginBottom: "1.5rem",
          color: status.ok ? "#4ade80" : "#f87171",
          fontWeight: 600, fontSize: "0.875rem",
        }}>
          {status.msg}
        </div>
      )}

      {/* Options */}
      <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6366f1", marginBottom: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ◈ Opciones de exportación
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {[
            { key: "soloValidadas", label: "Solo encuestas validadas", state: soloValidadas, set: setSoloValidadas,
              desc: "Excluye registros pendientes de validación" },
            { key: "sensibles", label: "Incluir datos sensibles (fecha de nacimiento)", state: incluirSensibles, set: setIncluirSensibles,
              desc: "Las firmas externas no requieren datos sensibles por política de privacidad" },
          ].map(({ key, label, state, set, desc }) => (
            <label key={key} style={{
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
              cursor: "pointer", textTransform: "none", letterSpacing: "normal",
              fontSize: "0.875rem", color: "#f8fafc",
            }}>
              <div
                onClick={() => set((v) => !v)}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: state ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  position: "relative", cursor: "pointer", transition: "all 0.25s", flexShrink: 0, marginTop: 2,
                }}
              >
                <div style={{
                  position: "absolute", top: 3, left: state ? 21 : 3,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "white", transition: "left 0.25s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.15rem" }}>{label}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stats preview */}
      <div className="glass" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Vista previa
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#a5b4fc" }}>{datos.length}</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.4rem" }}>registros</span>
          </div>
          <div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4ade80" }}>{datos.filter(e=>e.validada).length}</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.4rem" }}>validados</span>
          </div>
          <div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22d3ee" }}>
              {Object.keys(datos.reduce((m,e) => ({...m, [e.nivelEducativo]: 1}), {})).length}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.4rem" }}>niveles educativos</span>
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ flex: "1 1 180px", padding: "1rem", justifyContent: "center", flexDirection: "column", gap: "0.3rem" }}
          onClick={exportXLSX}>
          <span>Exportar XLSX</span>
          <span style={{ fontSize: "0.7rem", opacity: 0.75, fontWeight: 400 }}>Excel con múltiples hojas</span>
        </button>
        <button className="btn btn-cyan" style={{ flex: "1 1 140px", padding: "1rem", justifyContent: "center", flexDirection: "column", gap: "0.3rem" }}
          onClick={exportCSV}>
          <span>Exportar CSV</span>
          <span style={{ fontSize: "0.7rem", opacity: 0.75, fontWeight: 400 }}>Compatible con cualquier herramienta</span>
        </button>
        <button className="btn btn-secondary" style={{ flex: "1 1 140px", padding: "1rem", justifyContent: "center", flexDirection: "column", gap: "0.3rem" }}
          onClick={exportTXT}>
          <span>Exportar TXT</span>
          <span style={{ fontSize: "0.7rem", opacity: 0.75, fontWeight: 400 }}>Archivo plano separado por tabs</span>
        </button>
      </div>
    </div>
  );
}
