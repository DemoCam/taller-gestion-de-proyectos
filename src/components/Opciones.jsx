import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";

function SectionHead({ icon, color, children }) {
  return (
    <h3 style={{
      fontSize: "0.78rem", fontWeight: 700, color, marginBottom: "1.2rem",
      textTransform: "uppercase", letterSpacing: "0.08em",
      display: "flex", alignItems: "center", gap: "0.55rem",
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `${color}1f`, border: `1px solid ${color}3d`, color,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}><Icon name={icon} size="sm" /></span>
      {children}
    </h3>
  );
}

function ListaEditable({ titulo, icon, items, onAdd, onRemove, color = "#6366f1", placeholder = "Nuevo elemento..." }) {
  const [nuevo, setNuevo] = useState("");

  function agregar() {
    const v = nuevo.trim();
    if (!v || items.includes(v)) return;
    onAdd(v);
    setNuevo("");
  }

  return (
    <div className="glass" style={{ padding: "1.5rem" }}>
      <SectionHead icon={icon} color={color}>{titulo}</SectionHead>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" style={{ padding: "0.6rem 1rem" }} onClick={agregar}>
          <Icon name="agregar" size="sm" /> Agregar
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {items.map((item) => (
          <div key={item} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "0.3rem 0.7rem 0.3rem 0.9rem",
            fontSize: "0.8rem", color: "#f8fafc",
          }}>
            <span>{item}</span>
            <button onClick={() => onRemove(item)} style={{
              background: "none", border: "none", color: "#64748b",
              cursor: "pointer", padding: 0, lineHeight: 1,
              display: "flex", alignItems: "center", transition: "color 0.15s",
            }}
              title="Eliminar"
              onMouseOver={(e) => e.currentTarget.style.color = "#f87171"}
              onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}
            ><Icon name="cerrar" size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EncuestadoresPanel({ encuestadores, onChange }) {
  const [form, setForm] = useState({ id: "", nombre: "", rol: "Encuestador" });

  function agregar() {
    if (!form.id.trim() || !form.nombre.trim()) return;
    if (encuestadores.find((e) => e.id === form.id.trim())) return;
    onChange([...encuestadores, { id: form.id.trim(), nombre: form.nombre.trim(), rol: form.rol }]);
    setForm({ id: "", nombre: "", rol: "Encuestador" });
  }

  function eliminar(id) {
    onChange(encuestadores.filter((e) => e.id !== id));
  }

  return (
    <div className="glass" style={{ padding: "1.5rem" }}>
      <SectionHead icon="equipo" color="#f59e0b">Equipo de Encuestadores</SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto auto", gap: "0.5rem", marginBottom: "1rem", alignItems: "end" }}>
        <div>
          <label>ID</label>
          <input value={form.id} onChange={(e) => setForm((p) => ({...p, id: e.target.value}))} placeholder="E005" />
        </div>
        <div>
          <label>Nombre completo</label>
          <input value={form.nombre} onChange={(e) => setForm((p) => ({...p, nombre: e.target.value}))} placeholder="Nombre del encuestador" />
        </div>
        <div>
          <label>Rol</label>
          <select value={form.rol} onChange={(e) => setForm((p) => ({...p, rol: e.target.value}))}>
            <option>Encuestador</option>
            <option>Supervisor</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ marginTop: "auto" }} onClick={agregar}>
          <Icon name="agregar" size="sm" /> Agregar
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {encuestadores.map((enc) => (
          <div key={enc.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "0.6rem 1rem",
          }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#f59e0b", fontWeight: 700 }}>{enc.id}</span>
              <span style={{ fontSize: "0.875rem", color: "#f8fafc" }}>{enc.nombre}</span>
              <span className={`badge ${enc.rol === "Supervisor" ? "badge-info" : "badge-violet"}`}>{enc.rol}</span>
            </div>
            <button className="btn btn-danger btn-icon"
              title="Eliminar" onClick={() => eliminar(enc.id)}><Icon name="cerrar" size="sm" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Opciones() {
  const { opciones, actualizarOpciones, resetearDatos } = useApp();

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 800 }}>
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
          Configuración
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Administra las listas desplegables del formulario sin depender del equipo desarrollador
        </p>
      </div>

      <ListaEditable
        titulo="Niveles Educativos"
        icon="educacion"
        items={opciones.nivelesEducativos}
        color="#6366f1"
        placeholder="Ej: Doctorado"
        onAdd={(v) => actualizarOpciones("nivelesEducativos", [...opciones.nivelesEducativos, v])}
        onRemove={(v) => actualizarOpciones("nivelesEducativos", opciones.nivelesEducativos.filter((x) => x !== v))}
      />

      <ListaEditable
        titulo="Géneros"
        icon="generos"
        items={opciones.generos}
        color="#8b5cf6"
        placeholder="Ej: Intersexual"
        onAdd={(v) => actualizarOpciones("generos", [...opciones.generos, v])}
        onRemove={(v) => actualizarOpciones("generos", opciones.generos.filter((x) => x !== v))}
      />

      <ListaEditable
        titulo="Estratos Socioeconómicos"
        icon="estratos"
        items={opciones.estratos}
        color="#06b6d4"
        placeholder="Ej: Sin estrato"
        onAdd={(v) => actualizarOpciones("estratos", [...opciones.estratos, v])}
        onRemove={(v) => actualizarOpciones("estratos", opciones.estratos.filter((x) => x !== v))}
      />

      <EncuestadoresPanel
        encuestadores={opciones.encuestadores}
        onChange={(v) => actualizarOpciones("encuestadores", v)}
      />

      {/* Danger zone */}
      <div style={{
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 16,
        padding: "1.25rem",
        background: "rgba(239,68,68,0.04)",
      }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f87171", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Icon name="peligro" size="sm" /> Zona de Peligro
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#f8fafc", fontWeight: 600 }}>Restaurar datos de ejemplo</div>
            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Reemplaza todos los registros actuales con los 20 datos ficticios iniciales</div>
          </div>
          <button className="btn btn-danger" onClick={() => {
            if (confirm("¿Seguro? Esto eliminará todos los registros actuales y restaurará los datos de ejemplo.")) {
              resetearDatos();
            }
          }}>
            Restaurar datos
          </button>
        </div>
      </div>
    </div>
  );
}
