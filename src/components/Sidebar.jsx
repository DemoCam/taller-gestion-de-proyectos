import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const MENU = [
  { id: "dashboard",  icon: "dashboard", label: "Dashboard" },
  { id: "nueva",      icon: "nueva",     label: "Nueva Encuesta" },
  { id: "encuestas",  icon: "encuestas", label: "Encuestas" },
  { id: "analytics",  icon: "analytics", label: "Análisis" },
  { id: "exportar",   icon: "exportar",  label: "Exportar" },
  { id: "opciones",   icon: "opciones",  label: "Configuración" },
];

export default function Sidebar() {
  const { activeView, setActiveView, encuestas } = useApp();
  const total   = encuestas.length;
  const validadas = encuestas.filter((e) => e.validada).length;
  const pct = total ? Math.round((validadas / total) * 100) : 0;

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: "rgba(3,7,18,0.8)",
      backdropFilter: "blur(24px)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem 1rem",
      position: "sticky",
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}><Icon name="brand" size="lg" strokeWidth={2} /></div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              SurveyOS
            </div>
            <div style={{ fontSize: "0.65rem", color: "#6366f1", fontWeight: 600, letterSpacing: "0.08em" }}>
              GESTIÓN DE ENCUESTAS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            style={{ background: "none", fontFamily: "inherit", textAlign: "left", cursor: "pointer" }}
          >
            <span className="nav-indicator" />
            <Icon name={item.icon} size="lg" />
            <span>{item.label}</span>
            {item.id === "nueva" && (
              <span style={{
                marginLeft: "auto",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "white",
                borderRadius: 6,
                fontSize: "0.62rem",
                padding: "0.15rem 0.45rem",
                fontWeight: 700,
                display: "inline-flex",
              }}><Icon name="agregar" size={12} strokeWidth={2.5} /></span>
            )}
          </button>
        ))}
      </nav>

      {/* Stats pill */}
      <div style={{
        marginTop: "2rem",
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 14,
        padding: "0.9rem",
      }}>
        <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Estado de datos
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#f8fafc" }}>{validadas} / {total} validadas</span>
          <span style={{ fontSize: "0.75rem", color: "#a5b4fc", fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            borderRadius: 2,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>
    </aside>
  );
}
