import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { DEPARTAMENTOS_CIUDADES, calcularEdad, getJornada } from "../data/colombia";

const EMPTY = {
  nombres: "", apellidos: "", fechaNacimiento: "",
  genero: "",
  ciudadResidencia: "", departamentoResidencia: "",
  ciudadNacimiento: "", departamentoNacimiento: "",
  nivelEducativo: "", estrato: "",
  encuestadorId: "", jornada: "Mañana",
  fechaCaptura: new Date().toISOString().slice(0, 10),
  horaCaptura: new Date().toTimeString().slice(0, 5),
  validada: false,
};

function Field({ label, error, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
      {error && (
        <div style={{ fontSize: "0.7rem", color: "#f87171", marginTop: "0.3rem" }}>{error}</div>
      )}
    </div>
  );
}

export default function SurveyForm({ editando, onClose }) {
  const { agregarEncuesta, actualizarEncuesta, opciones, setActiveView } = useApp();
  const [form, setForm] = useState(editando || { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const deptos = useMemo(() => Object.keys(DEPARTAMENTOS_CIUDADES).sort(), []);
  const ciudadesResid = useMemo(() =>
    form.departamentoResidencia ? DEPARTAMENTOS_CIUDADES[form.departamentoResidencia] || [] : [],
    [form.departamentoResidencia]
  );
  const ciudadesNac = useMemo(() =>
    form.departamentoNacimiento ? DEPARTAMENTOS_CIUDADES[form.departamentoNacimiento] || [] : [],
    [form.departamentoNacimiento]
  );

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "departamentoResidencia") next.ciudadResidencia = "";
      if (field === "departamentoNacimiento") next.ciudadNacimiento = "";
      if (field === "horaCaptura") next.jornada = getJornada(value);
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.nombres.trim()) errs.nombres = "Campo requerido";
    if (!form.apellidos.trim()) errs.apellidos = "Campo requerido";
    if (!form.fechaNacimiento) {
      errs.fechaNacimiento = "Campo requerido";
    } else {
      const edad = calcularEdad(form.fechaNacimiento);
      if (edad < 18) errs.fechaNacimiento = "El encuestado debe ser mayor de 18 años";
    }
    if (!form.genero) errs.genero = "Seleccione un género";
    if (!form.departamentoResidencia) errs.departamentoResidencia = "Seleccione un departamento";
    if (!form.ciudadResidencia) errs.ciudadResidencia = "Seleccione una ciudad";
    if (!form.departamentoNacimiento) errs.departamentoNacimiento = "Seleccione un departamento";
    if (!form.ciudadNacimiento) errs.ciudadNacimiento = "Seleccione una ciudad";
    if (!form.nivelEducativo) errs.nivelEducativo = "Seleccione nivel educativo";
    if (!form.estrato) errs.estrato = "Seleccione un estrato";
    if (!form.encuestadorId) errs.encuestadorId = "Seleccione un encuestador";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const edad = calcularEdad(form.fechaNacimiento);
    const data = { ...form, edad };

    if (editando) {
      actualizarEncuesta(editando.id, data);
      onClose && onClose();
    } else {
      agregarEncuesta(data);
      setSuccess(true);
      setForm({ ...EMPTY, fechaCaptura: new Date().toISOString().slice(0, 10), horaCaptura: new Date().toTimeString().slice(0, 5) });
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", margin: 0 }}>
          {editando ? "Editar Encuesta" : "Nueva Encuesta"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Complete todos los campos. Los datos sensibles no serán compartidos con firmas externas.
        </p>
      </div>

      {success && (
        <div className="animate-scaleIn" style={{
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem",
          color: "#4ade80", fontWeight: 600, fontSize: "0.875rem", display: "flex", gap: "0.5rem", alignItems: "center",
        }}>
          ✓ Encuesta registrada exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Datos personales */}
        <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6366f1", marginBottom: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ◈ Datos Personales
          </h2>
          <div className="form-grid">
            <Field label="Nombres" error={errors.nombres}>
              <input value={form.nombres} onChange={(e) => set("nombres", e.target.value)} placeholder="Nombres del encuestado" />
            </Field>
            <Field label="Apellidos" error={errors.apellidos}>
              <input value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} placeholder="Apellidos del encuestado" />
            </Field>
            <Field label="Fecha de nacimiento" error={errors.fechaNacimiento}>
              <input type="date" value={form.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().slice(0,10)} />
            </Field>
            <Field label="Género" error={errors.genero}>
              <select value={form.genero} onChange={(e) => set("genero", e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {opciones.generos.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Nivel educativo" error={errors.nivelEducativo}>
              <select value={form.nivelEducativo} onChange={(e) => set("nivelEducativo", e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {opciones.nivelesEducativos.map((n) => <option key={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Estrato socioeconómico" error={errors.estrato}>
              <select value={form.estrato} onChange={(e) => set("estrato", e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {opciones.estratos.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Residencia */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ◉ Ciudad de Residencia
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label="Departamento de residencia" error={errors.departamentoResidencia}>
                <select value={form.departamentoResidencia} onChange={(e) => set("departamentoResidencia", e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  {deptos.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Ciudad de residencia" error={errors.ciudadResidencia}>
                <select value={form.ciudadResidencia} onChange={(e) => set("ciudadResidencia", e.target.value)}
                  disabled={!form.departamentoResidencia}>
                  <option value="">-- Seleccionar departamento primero --</option>
                  {ciudadesResid.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="glass" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#06b6d4", marginBottom: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ⬡ Ciudad de Nacimiento
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label="Departamento de nacimiento" error={errors.departamentoNacimiento}>
                <select value={form.departamentoNacimiento} onChange={(e) => set("departamentoNacimiento", e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  {deptos.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Ciudad de nacimiento" error={errors.ciudadNacimiento}>
                <select value={form.ciudadNacimiento} onChange={(e) => set("ciudadNacimiento", e.target.value)}
                  disabled={!form.departamentoNacimiento}>
                  <option value="">-- Seleccionar departamento primero --</option>
                  {ciudadesNac.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* Captura */}
        <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f59e0b", marginBottom: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ✦ Datos de Captura
          </h2>
          <div className="form-grid">
            <Field label="Encuestador" error={errors.encuestadorId}>
              <select value={form.encuestadorId} onChange={(e) => set("encuestadorId", e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {opciones.encuestadores.map((enc) => (
                  <option key={enc.id} value={enc.id}>{enc.nombre} ({enc.rol})</option>
                ))}
              </select>
            </Field>
            <Field label="Fecha de captura">
              <input type="date" value={form.fechaCaptura} onChange={(e) => set("fechaCaptura", e.target.value)} />
            </Field>
            <Field label="Hora de captura">
              <input type="time" value={form.horaCaptura} onChange={(e) => set("horaCaptura", e.target.value)} />
            </Field>
            <Field label="Jornada (automática)">
              <input value={form.jornada} readOnly style={{ opacity: 0.7, cursor: "default" }} />
            </Field>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
            {editando ? "Guardar cambios" : "✦ Registrar encuesta"}
          </button>
          {editando && (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          )}
          {!editando && (
            <button type="button" className="btn btn-secondary" onClick={() => setActiveView("encuestas")}>
              Ver encuestas
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
