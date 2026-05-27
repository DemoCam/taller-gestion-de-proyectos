import {
  LayoutDashboard, FilePlus2, ClipboardList, ChartColumnBig, Download, Settings,
  Database, CircleCheckBig, Clock, MapPin, Map, CalendarDays, Sun, Moon,
  Search, Pencil, Check, X, Trash2, ChevronLeft, ChevronRight,
  ChevronsUpDown, ChevronUp, ChevronDown, User, Baby, ClipboardClock,
  FileSpreadsheet, FileText, FileType, SlidersHorizontal, GraduationCap,
  Users, Layers, UserCog, TriangleAlert, Plus, ClipboardCheck, Sparkles,
} from "lucide-react";

// Central icon registry — single source of truth for stroke + sizing tokens.
// Keeps every glyph in the app on one visual language (skill: icon-style-consistent).
export const ICONS = {
  // Sidebar / nav
  dashboard: LayoutDashboard,
  nueva: FilePlus2,
  encuestas: ClipboardList,
  analytics: ChartColumnBig,
  exportar: Download,
  opciones: Settings,
  brand: ClipboardCheck,
  // Stat cards
  total: Database,
  validadas: CircleCheckBig,
  pendientes: Clock,
  ciudad: MapPin,
  depto: Map,
  fecha: CalendarDays,
  // Jornada / estado
  manana: Sun,
  tarde: Moon,
  // Form section heads
  persona: User,
  residencia: MapPin,
  nacimiento: Baby,
  captura: ClipboardClock,
  // Table / actions
  buscar: Search,
  editar: Pencil,
  check: Check,
  eliminar: Trash2,
  cerrar: X,
  prev: ChevronLeft,
  next: ChevronRight,
  sort: ChevronsUpDown,
  sortAsc: ChevronUp,
  sortDesc: ChevronDown,
  agregar: Plus,
  // Export
  opcionesExport: SlidersHorizontal,
  xlsx: FileSpreadsheet,
  csv: FileText,
  txt: FileType,
  // Config lists
  educacion: GraduationCap,
  generos: Users,
  estratos: Layers,
  equipo: UserCog,
  peligro: TriangleAlert,
  sparkle: Sparkles,
};

const SIZES = { sm: 16, md: 18, lg: 20, xl: 24 };

export default function Icon({ name, size = "md", strokeWidth = 1.75, className, style, ...rest }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  const px = typeof size === "number" ? size : (SIZES[size] || SIZES.md);
  return (
    <Cmp
      size={px}
      strokeWidth={strokeWidth}
      className={className}
      style={{ flexShrink: 0, display: "block", ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
