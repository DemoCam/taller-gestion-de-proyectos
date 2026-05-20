export const DEPARTAMENTOS_CIUDADES = {
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Rionegro", "Turbo", "Apartadó", "Caucasia", "Marinilla", "El Carmen de Viboral"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Baranoa", "Puerto Colombia", "Galapa", "Palmar de Varela", "Repeló", "Tubará"],
  "Bogotá D.C.": ["Bogotá"],
  "Bolívar": ["Cartagena", "Magangué", "El Carmen de Bolívar", "Mompós", "Turbaco", "Arjona", "Villanueva", "San Jacinto", "San Estanislao", "Mahates"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa", "Villa de Leyva", "Moniquirá", "Puerto Boyacá", "Nobsa", "Tibasosa"],
  "Caldas": ["Manizales", "Villamaría", "Chinchiná", "La Dorada", "Riosucio", "Salamina", "Aguadas", "Anserma", "Supía", "Filadelfia"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico", "El Doncello", "El Paujil", "Albania", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo", "La Montañita"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía", "Miranda", "Corinto", "Jambaló", "Toribío", "El Tambo", "Timbío"],
  "Cesar": ["Valledupar", "Aguachica", "Bosconia", "La Jagua de Ibirico", "Codazzi", "Curumaní", "Chimichagua", "Chiriguaná", "El Copey", "La Gloria"],
  "Chocó": ["Quibdó", "Istmina", "Tadó", "Riosucio", "Condoto", "Bagadó", "Bahía Solano", "Nuquí", "El Carmen de Atrato", "Litoral del San Juan"],
  "Córdoba": ["Montería", "Lorica", "Cereté", "Sahagún", "Montelíbano", "Planeta Rica", "Tierralta", "Ciénaga de Oro", "San Pelayo", "Ayapel"],
  "Cundinamarca": ["Soacha", "Facatativá", "Zipaquirá", "Chía", "Fusagasugá", "Mosquera", "Madrid", "Funza", "Cajicá", "Tocancipá"],
  "Guajira": ["Riohacha", "Maicao", "Uribia", "Manaure", "Fonseca", "Barrancas", "San Juan del Cesar", "Albania", "Hatonuevo", "La Jagua del Pilar"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre", "Rivera", "Palermo", "Yaguará", "Agrado", "Altamira"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Plato", "Aracataca", "El Banco", "Pivijay", "Santa Bárbara de Pinto", "Zona Bananera", "Pueblo Viejo"],
  "Meta": ["Villavicencio", "Acacías", "Granada", "Puerto López", "Cumaral", "Restrepo", "San Martín", "Guamal", "Castilla la Nueva", "Fuente de Oro"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres", "La Unión", "Samaniego", "Sandoná", "El Charco", "Barbacoas", "Cumbal"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Pamplona", "Villa del Rosario", "El Zulia", "Los Patios", "Tibú", "Sardinata", "Convención", "Hacarí"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Orito", "Villagarzón", "La Hormiga", "San Francisco", "Santiago", "Sibundoy", "Colón", "San Miguel"],
  "Quindío": ["Armenia", "Calarcá", "Montenegro", "Quimbaya", "Circasia", "La Tebaida", "Filandia", "Pijao", "Génova", "Buenavista"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia", "Marsella", "Quinchía", "Pueblo Rico", "Belén de Umbría", "Mistrató", "Santuario"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil", "Socorro", "Málaga", "Barbosa", "Vélez"],
  "Sucre": ["Sincelejo", "Corozal", "San Marcos", "Magangué", "Sampués", "Morroa", "Ovejas", "Tolú", "San Onofre", "Palmito"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda", "Girardot", "Líbano", "Mariquita", "Lérida", "Chaparral", "Purificación"],
  "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga", "Cartago", "Yumbo", "Jamundí", "Zarzal", "Roldanillo"],
  "Vaupés": ["Mitú", "Carurú", "Taraira", "Yavaraté", "Pacoa", "Papunaua"],
  "Vichada": ["Puerto Carreño", "La Primavera", "Santa Rosalía", "Cumaribo"],
};

export const NIVELES_EDUCATIVOS = [
  "Sin escolaridad",
  "Primaria incompleta",
  "Primaria completa",
  "Secundaria incompleta",
  "Secundaria completa",
  "Técnico",
  "Tecnólogo",
  "Universitario incompleto",
  "Universitario completo",
  "Posgrado",
];

export const ENCUESTADORES = [
  { id: "E001", nombre: "Carlos Rodríguez", rol: "Encuestador" },
  { id: "E002", nombre: "María López", rol: "Encuestador" },
  { id: "E003", nombre: "Juan Martínez", rol: "Encuestador" },
  { id: "E004", nombre: "Ana García", rol: "Encuestador" },
  { id: "S001", nombre: "Pedro Supervisor", rol: "Supervisor" },
];

export const GRUPOS_ETARIOS = [
  { label: "18-24 años", min: 18, max: 24 },
  { label: "25-35 años", min: 25, max: 35 },
  { label: "36-55 años", min: 36, max: 55 },
  { label: "56+ años", min: 56, max: 999 },
];

export function getGrupoEtario(edad) {
  const grupo = GRUPOS_ETARIOS.find((g) => edad >= g.min && edad <= g.max);
  return grupo ? grupo.label : "No clasificado";
}

export function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

export function getJornada(hora) {
  const h = parseInt(hora.split(":")[0]);
  return h < 12 ? "Mañana" : "Tarde";
}
