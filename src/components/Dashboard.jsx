import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useApp } from "../context/AppContext";
import { getGrupoEtario, calcularEdad } from "../data/colombia";

const COLORS = ["#6366f1","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#f97316","#14b8a6"];

function StatCard({ icon, label, value, sub, color = "#6366f1", delay = 0 }) {
  return (
    <div className="glass animate-fadeIn" style={{
      padding: "1.25rem",
      animationDelay: `${delay}s`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80,
        background: color,
        borderRadius: "50%",
        opacity: 0.06,
        filter: "blur(20px)",
      }} />
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            {label}
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", lineHeight: 1, letterSpacing: "-0.03em" }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>{sub}</div>}
        </div>
        <div style={{
          width: 40, height: 40,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem",
        }}>{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { encuestas } = useApp();

  const stats = useMemo(() => {
    const total = encuestas.length;
    const validadas = encuestas.filter((e) => e.validada).length;
    const pendientes = total - validadas;

    // Por ciudad
    const porCiudad = {};
    encuestas.forEach((e) => {
      porCiudad[e.ciudadResidencia] = (porCiudad[e.ciudadResidencia] || 0) + 1;
    });

    // Por departamento
    const porDepto = {};
    encuestas.forEach((e) => {
      porDepto[e.departamentoResidencia] = (porDepto[e.departamentoResidencia] || 0) + 1;
    });

    // Por fecha
    const porFecha = {};
    encuestas.forEach((e) => {
      porFecha[e.fechaCaptura] = (porFecha[e.fechaCaptura] || 0) + 1;
    });

    // Por nivel educativo
    const porEducacion = {};
    encuestas.forEach((e) => {
      porEducacion[e.nivelEducativo] = (porEducacion[e.nivelEducativo] || 0) + 1;
    });

    // Por grupo etario
    const porEdad = { "18-24": 0, "25-35": 0, "36-55": 0, "56+": 0 };
    encuestas.forEach((e) => {
      const edad = e.edad || calcularEdad(e.fechaNacimiento);
      const g = getGrupoEtario(edad);
      const key = g.split(" ")[0];
      if (porEdad[key] !== undefined) porEdad[key]++;
    });

    // Por encuestador
    const porEnc = {};
    encuestas.forEach((e) => {
      porEnc[e.encuestadorId] = (porEnc[e.encuestadorId] || 0) + 1;
    });

    // Por jornada
    const manana = encuestas.filter((e) => e.jornada === "Mañana").length;
    const tarde  = encuestas.filter((e) => e.jornada === "Tarde").length;

    return {
      total, validadas, pendientes,
      porCiudad: Object.entries(porCiudad).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0,8),
      porDepto: Object.entries(porDepto).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
      porFecha: Object.entries(porFecha).map(([name, value]) => ({ name: name.slice(5), value })).sort((a,b) => a.name.localeCompare(b.name)),
      porEducacion: Object.entries(porEducacion).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
      porEdad: Object.entries(porEdad).map(([name, value]) => ({ name: `${name} años`, value })),
      porEnc: Object.entries(porEnc).map(([name, value]) => ({ name, value })),
      jornada: [{ name: "Mañana", value: manana }, { name: "Tarde", value: tarde }],
    };
  }, [encuestas]);

  const topCiudad = stats.porCiudad[0]?.name || "—";
  const topDepto  = stats.porDepto[0]?.name || "—";

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Visión general del levantamiento de encuestas
          </p>
        </div>
        <div style={{
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 10,
          padding: "0.4rem 0.9rem",
          fontSize: "0.75rem",
          color: "#a5b4fc",
          fontWeight: 600,
        }}>
          {new Date().toLocaleDateString("es-CO", { day:"2-digit", month:"long", year:"numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        <StatCard icon="◈" label="Total Encuestas"  value={stats.total}     sub="registros capturados"   color="#6366f1" delay={0.0} />
        <StatCard icon="✓" label="Validadas"         value={stats.validadas}  sub="por supervisor"         color="#10b981" delay={0.05} />
        <StatCard icon="◎" label="Pendientes"        value={stats.pendientes} sub="por revisar"            color="#f59e0b" delay={0.1} />
        <StatCard icon="⬡" label="Top Ciudad"        value={topCiudad}        sub={`${stats.porCiudad[0]?.value || 0} encuestas`} color="#06b6d4" delay={0.15} />
        <StatCard icon="◉" label="Top Departamento"  value={topDepto}         sub={`${stats.porDepto[0]?.value || 0} encuestas`} color="#8b5cf6" delay={0.2} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Encuestas por fecha */}
        <div className="glass" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Encuestas por Fecha
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.porFecha}>
              <defs>
                <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
              <Area type="monotone" dataKey="value" name="Encuestas" stroke="#6366f1" strokeWidth={2} fill="url(#gArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Jornada */}
        <div className="glass" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Distribución por Jornada
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.jornada} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={4}
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats.jornada.map((_, i) => (
                  <Cell key={i} fill={["#6366f1","#06b6d4"][i]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.25rem" }}>
        {/* Educación */}
        <div className="glass" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Nivel Educativo
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.porEducacion} layout="vertical">
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="value" name="Personas" radius={[0,4,4,0]}>
                {stats.porEducacion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grupos etarios */}
        <div className="glass" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Grupos Etarios
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.porEdad} cx="50%" cy="50%" outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={3}
                label={({ name, value }) => value > 0 ? `${value}` : ""}
              >
                {stats.porEdad.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ciudades */}
      <div className="glass" style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Top Ciudades de Residencia
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.porCiudad}>
            <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="value" name="Encuestas" radius={[4,4,0,0]}>
              {stats.porCiudad.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
