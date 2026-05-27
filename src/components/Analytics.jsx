import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { getGrupoEtario, GRUPOS_ETARIOS } from "../data/colombia";

const COLORS = ["#6366f1","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#f97316","#14b8a6","#a855f7","#3b82f6"];
const GRUPOS = GRUPOS_ETARIOS.map((g) => g.label);

export default function Analytics() {
  const { encuestas } = useApp();
  const [filtroDepto, setFiltroDepto] = useState("Todos");
  const [filtroEdad, setFiltroEdad] = useState("Todos");

  const deptos = useMemo(() => {
    const set = new Set(encuestas.map((e) => e.departamentoResidencia));
    return ["Todos", ...Array.from(set).sort()];
  }, [encuestas]);

  const filtradas = useMemo(() => {
    return encuestas.filter((e) => {
      const pasaDepto = filtroDepto === "Todos" || e.departamentoResidencia === filtroDepto;
      const grupo = getGrupoEtario(e.edad);
      const pasaEdad = filtroEdad === "Todos" || grupo === filtroEdad;
      return pasaDepto && pasaEdad;
    });
  }, [encuestas, filtroDepto, filtroEdad]);

  // Educación × ciudad
  const edxCiudad = useMemo(() => {
    const mapa = {};
    filtradas.forEach((e) => {
      if (!mapa[e.ciudadResidencia]) mapa[e.ciudadResidencia] = {};
      mapa[e.ciudadResidencia][e.nivelEducativo] = (mapa[e.ciudadResidencia][e.nivelEducativo] || 0) + 1;
    });
    return Object.entries(mapa).map(([ciudad, niveles]) => ({ ciudad, ...niveles }));
  }, [filtradas]);

  // Educación × departamento
  const edxDepto = useMemo(() => {
    const mapa = {};
    filtradas.forEach((e) => {
      if (!mapa[e.departamentoResidencia]) mapa[e.departamentoResidencia] = {};
      mapa[e.departamentoResidencia][e.nivelEducativo] = (mapa[e.departamentoResidencia][e.nivelEducativo] || 0) + 1;
    });
    return Object.entries(mapa).map(([depto, niveles]) => ({ depto, ...niveles }));
  }, [filtradas]);

  // Educación × grupo etario (radar)
  const edxEdad = useMemo(() => {
    const mapa = {};
    filtradas.forEach((e) => {
      const g = getGrupoEtario(e.edad);
      if (!mapa[g]) mapa[g] = {};
      mapa[g][e.nivelEducativo] = (mapa[g][e.nivelEducativo] || 0) + 1;
    });
    const niveles = [...new Set(filtradas.map((e) => e.nivelEducativo))];
    return niveles.map((niv) => {
      const entry = { nivel: niv };
      GRUPOS.forEach((g) => { entry[g] = mapa[g]?.[niv] || 0; });
      return entry;
    });
  }, [filtradas]);

  // Encuestadores performance
  const rendimiento = useMemo(() => {
    const mapa = {};
    encuestas.forEach((e) => {
      if (!mapa[e.encuestadorId]) mapa[e.encuestadorId] = { total: 0, manana: 0, tarde: 0, validadas: 0 };
      mapa[e.encuestadorId].total++;
      if (e.jornada === "Mañana") mapa[e.encuestadorId].manana++;
      else mapa[e.encuestadorId].tarde++;
      if (e.validada) mapa[e.encuestadorId].validadas++;
    });
    return Object.entries(mapa).map(([id, d]) => ({ id, ...d }));
  }, [encuestas]);

  const nivelesUnicos = [...new Set(filtradas.map((e) => e.nivelEducativo))];

  const prefersReducedMotion = useReducedMotion();

  const kpiContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 },
    },
  };
  const kpiItem = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      };

  const cardReveal = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
            Análisis
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Estudio poblacional — educación por ciudad, departamento y grupo etario
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: "0.68rem", marginBottom: "0.3rem" }}>Departamento</label>
            <select value={filtroDepto} onChange={(e) => setFiltroDepto(e.target.value)} style={{ width: 180 }}>
              {deptos.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", marginBottom: "0.3rem" }}>Grupo etario</label>
            <select value={filtroEdad} onChange={(e) => setFiltroEdad(e.target.value)} style={{ width: 160 }}>
              <option>Todos</option>
              {GRUPOS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPIs filtradas */}
      <motion.div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }} variants={kpiContainer} initial="hidden" animate="show">
        {[
          { label: "Registros filtrados", value: filtradas.length, color: "#6366f1" },
          { label: "Ciudades únicas", value: new Set(filtradas.map((e) => e.ciudadResidencia)).size, color: "#8b5cf6" },
          { label: "Departamentos", value: new Set(filtradas.map((e) => e.departamentoResidencia)).size, color: "#06b6d4" },
          { label: "Niveles educativos", value: new Set(filtradas.map((e) => e.nivelEducativo)).size, color: "#10b981" },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="glass card-interactive" style={{ flex: "1 1 160px", padding: "1rem 1.25rem" }} variants={kpiItem}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color, lineHeight: 1.2, marginTop: "0.25rem" }}>{value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Educación × Ciudad */}
      <motion.div {...cardReveal}>
      <div className="glass" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Escolaridad por Ciudad de Residencia
        </h3>
        {edxCiudad.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={edxCiudad}>
              <XAxis dataKey="ciudad" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              {nivelesUnicos.slice(0, 8).map((niv, i) => (
                <Bar key={niv} dataKey={niv} stackId="a" fill={COLORS[i % COLORS.length]} radius={nivelesUnicos.indexOf(niv) === nivelesUnicos.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", color: "#475569", padding: "2rem" }}>Sin datos para el filtro seleccionado</div>
        )}
      </div>
      </motion.div>

      {/* Educación × Departamento */}
      <motion.div {...cardReveal}>
      <div className="glass" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Escolaridad por Departamento
        </h3>
        {edxDepto.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={edxDepto}>
              <XAxis dataKey="depto" tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              {nivelesUnicos.slice(0, 8).map((niv, i) => (
                <Bar key={niv} dataKey={niv} stackId="a" fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", color: "#475569", padding: "2rem" }}>Sin datos</div>
        )}
      </div>
      </motion.div>

      {/* Educación × Grupo etario (radar) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <motion.div {...cardReveal}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Escolaridad × Grupo Etario (Radar)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={edxEdad}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="nivel" tick={{ fill: "#94a3b8", fontSize: 9 }} />
              {GRUPOS.map((g, i) => (
                <Radar key={g} name={g} dataKey={g} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
              ))}
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        </motion.div>

        {/* Rendimiento encuestadores */}
        <motion.div {...cardReveal}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Rendimiento por Encuestador
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rendimiento}>
              <XAxis dataKey="id" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              <Bar dataKey="manana" name="Mañana" fill="#6366f1" radius={[0,0,0,0]} stackId="j" />
              <Bar dataKey="tarde"  name="Tarde"  fill="#06b6d4" radius={[4,4,0,0]} stackId="j" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </motion.div>
      </div>

      {/* Tabla detallada */}
      <motion.div {...cardReveal}>
      <div className="glass" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Tabla Detallada — Educación × Ciudad × Departamento × Grupo Etario
        </h3>
        <div className="table-container" style={{ maxHeight: "50vh", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Ciudad</th>
                <th>Departamento</th>
                <th>Grupo Etario</th>
                <th>Nivel Educativo</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const mapa = {};
                filtradas.forEach((e) => {
                  const k = `${e.ciudadResidencia}|${e.departamentoResidencia}|${getGrupoEtario(e.edad)}|${e.nivelEducativo}`;
                  mapa[k] = (mapa[k] || 0) + 1;
                });
                return Object.entries(mapa)
                  .sort(([,a],[,b]) => b - a)
                  .map(([k, cnt]) => {
                    const [ciudad, depto, grupo, nivel] = k.split("|");
                    return (
                      <tr key={k}>
                        <td>{ciudad}</td>
                        <td style={{ color: "#94a3b8" }}>{depto}</td>
                        <td><span className="badge badge-violet">{grupo}</span></td>
                        <td style={{ fontSize: "0.78rem" }}>{nivel}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: "#a5b4fc", fontSize: "1rem" }}>{cnt}</span>
                        </td>
                      </tr>
                    );
                  });
              })()}
            </tbody>
          </table>
        </div>
      </div>
      </motion.div>
    </div>
  );
}
