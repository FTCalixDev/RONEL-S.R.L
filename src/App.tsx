/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Car,
  Wrench,
  Settings,
  Sun,
  Moon,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Search,
  X,
  ArrowUpRight,
  Copy,
  Check,
  FileText,
  Truck,
  Cog,
  Disc,
  BatteryCharging,
  Mail,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Upload,
  Lock,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import {
  HERO_SHOWROOM_IMG,
  WORKSHOP_IMG,
  STRADA_PICKUP_IMG,
  FASTBACK_SUV_IMG,
  PULSE_CROSSOVER_IMG,
  SIGNAGE_PHOTO_IMG,
  FLYER_PHOTO_IMG,
  resolveAssetUrl,
} from './imageAssets';

// ---------------------------------------------------------------------------
// TYPES & CONSTANTS
// ---------------------------------------------------------------------------

type TabId = 'vehiculos' | 'service' | 'repuestos';
type VehicleCategory = 'todos' | '0km' | 'pickups' | 'usados';
type InquiryMode = 'service' | 'vehiculo' | 'repuesto' | 'general';

interface Vehicle {
  id: string;
  brand: string;
  name: string;
  version: string;
  description: string;
  category: '0km' | 'pickups' | 'usados';
  categoryLabel: string;
  year: number;
  km: string;
  engine: string;
  transmission: string;
  traction: string;
  priceUsd: number;
  initialDeliveryUsd: number;
  monthlyEstimateUsd: number;
  warranty: string;
  image: string;
  highlights: string[];
  availability: string;
}

interface ServiceBentoItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  warrantyNote: string;
  iconName: 'wrench' | 'car' | 'settings' | 'gauge';
  spanClass: string;
  image?: string;
  includedPoints: string[];
}

interface ServiceIntervalPlan {
  km: string;
  label: string;
  recommendedTime: string;
  estimatedTimeWorkshop: string;
  tasks: string[];
  partsIncluded: string[];
}

interface SparePartItem {
  id: string;
  code: string;
  name: string;
  category: string;
  compatibility: string;
  brand: string;
  stockStatus: 'En Stock en Tacuarembó' | 'Entrega 24hs';
  referencePriceUsd: string;
  description: string;
  iconName: 'settings' | 'disc' | 'wrench' | 'car' | 'battery' | 'cog';
  spanClass: string;
}

const STORAGE_KEY = 'ronel_srl_vehicles_catalog_v2';

// Authentic Contact Channels from RONEL S.R.L. Flyer & Facebook
const WHATSAPP_PRIMARY = '59899831229'; // 099 831 229
const PHONE_LANDLINE = '4632 4767';
const PHONE_EMERGENCY_1 = '099 831 229';
const PHONE_EMERGENCY_2 = '099 263 670';
const EMAIL_HOTMAIL = 'ronelsrl@hotmail.com';
const FACEBOOK_URL = 'https://www.facebook.com/search/top?q=RONEL%20S.R.L';
const ADDRESS_TACUAREMBO = 'W. Beltrán 318 (esq. Juan Ortiz), Tacuarembó, Uruguay';

// Bundled Production Assets (100% compatible with Cloudflare Pages & GitHub builds)
const SIGNAGE_PHOTO = SIGNAGE_PHOTO_IMG;
const FLYER_PHOTO = FLYER_PHOTO_IMG;
const HERO_IMAGE = HERO_SHOWROOM_IMG;
const WORKSHOP_IMAGE = WORKSHOP_IMG;

const OFFICIAL_BRANDS = [
  'TOYOTA',
  'FIAT',
  'SUBARU',
  'SUZUKI',
  'MAZDA',
  'JETOUR',
  'KIA',
  'SSANGYONG',
  'KARRY',
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'fiat-strada-volcano',
    brand: 'Fiat',
    name: 'Fiat Strada Volcano',
    version: '1.3 CVT Cabina Doble · 0km',
    description:
      'La pickup compacta líder en Uruguay. Equipada con transmisión automática CVT de 7 velocidades, control de tracción TC+ para caminos rurales y toda la respaldada garantía oficial en Tacuarembó.',
    category: 'pickups',
    categoryLabel: '0km Oficial · Pickup Trabajo y Ciudad',
    year: 2026,
    km: '0 km',
    engine: '1.3 Firefly 99 CV / Turbo 200',
    transmission: 'Automática CVT 7 vel.',
    traction: 'Delantera con TC+ (E-Locker)',
    priceUsd: 21490,
    initialDeliveryUsd: 6500,
    monthlyEstimateUsd: 345,
    warranty: 'Garantía Oficial 3 años o 100.000 km',
    image: STRADA_PICKUP_IMG,
    highlights: [
      'Capacidad de carga de hasta 650 kg ideal para establecimiento y ciudad',
      'Control de tracción avanzado TC+ para caminos de tierra o barro',
      'Faros Full LED y central multimedia Uconnect de 7" inalámbrica',
      'Climatizador digital y cargador inalámbrico de celular',
    ],
    availability: 'Entrega inmediata en salón',
  },
  {
    id: 'fiat-fastback-turbo',
    brand: 'Fiat',
    name: 'Fiat Fastback Turbo 270',
    version: 'Audace / Impetus AT6 · SUV Coupé',
    description:
      'El SUV Coupé tope de gama de Fiat con motorización Turbo 270 de 175 CV. Diseño deportivo italiano, asistencias activas a la conducción ADAS y baúl de 600 litros.',
    category: '0km',
    categoryLabel: '0km Oficial · SUV Coupé Turbo',
    year: 2026,
    km: '0 km',
    engine: '1.3 Turbo T270 175 CV',
    transmission: 'Automática 6 marchas (Modo Sport)',
    traction: 'Delantera con Torque Vectoring',
    priceUsd: 31990,
    initialDeliveryUsd: 9600,
    monthlyEstimateUsd: 495,
    warranty: 'Garantía Oficial 3 años o 100.000 km',
    image: FASTBACK_SUV_IMG,
    highlights: [
      'Baúl líder del segmento con 600 litros de capacidad real',
      'Frenado autónomo de emergencia (AEB) y mantenimiento activo de carril',
      'Tablero digital de 7" y pantalla multimedia flotante de 10.1"',
      'Freno de mano electrónico con función Auto Hold',
    ],
    availability: 'Unidad exhibida para Test Drive',
  },
  {
    id: 'fiat-pulse-audace',
    brand: 'Fiat',
    name: 'Fiat Pulse Audace',
    version: '1.0 Turbo 200 CVT · Crossover',
    description:
      'SUV compacto ágil, económico y robusto con motor Turbo 200 de 120 CV y gran despeje del suelo para transitar con total seguridad en ciudad y ruta.',
    category: '0km',
    categoryLabel: '0km Oficial · SUV Compacto',
    year: 2026,
    km: '0 km',
    engine: '1.0 Turbo T200 120 CV',
    transmission: 'Automática CVT 7 marchas',
    traction: 'Delantera con TC+',
    priceUsd: 26490,
    initialDeliveryUsd: 7900,
    monthlyEstimateUsd: 410,
    warranty: 'Garantía Oficial 3 años o 100.000 km',
    image: PULSE_CROSSOVER_IMG,
    highlights: [
      'Motor Turbo 200 con 200 Nm de torque desde bajas revoluciones',
      '4 Airbags de serie y paquete de asistencias ADAS',
      'Despeje del suelo elevado adaptado a rutas del norte uruguayo',
      'Apertura y arranque sin llave Keyless Enter-N-Go con encendido remoto',
    ],
    availability: 'Disponible en 3 colores',
  },
  {
    id: 'fiat-toro-ultra',
    brand: 'Fiat',
    name: 'Fiat Toro Volcano',
    version: '1.3 Turbo T270 / 2.0 TD 4x4',
    description:
      'Potencia, confort de SUV y chasis reforzado con suspensión trasera Multilink. Disponible en versiones Nafta Turbo T270 o Turbodiesel 4x4 con descuento de IMESI para empresas.',
    category: 'pickups',
    categoryLabel: '0km Oficial · Pickup Mediana',
    year: 2026,
    km: '0 km',
    engine: '1.3 Turbo T270 175 CV / 2.0 TD 4x4',
    transmission: 'Automática 6 / 9 marchas',
    traction: '4x2 con TC+ o 4x4 Integral',
    priceUsd: 33890,
    initialDeliveryUsd: 10500,
    monthlyEstimateUsd: 520,
    warranty: 'Garantía Oficial 3 años o 100.000 km',
    image: HERO_IMAGE,
    highlights: [
      'Suspensión trasera independiente Multilink de máximo confort',
      'Portón trasero de doble hoja con apertura lateral ergonómica',
      'Beneficio de descuento de IMESI para productores rurales y empresas con RUT',
      'Mantenimiento oficial garantizado en Ronel S.R.L. Tacuarembó',
    ],
    availability: 'Consulte versión 4x2 o 4x4 Diesel',
  },
  {
    id: 'usado-strada-freedom-2023',
    brand: 'Fiat',
    name: 'Fiat Strada Freedom',
    version: '1.4 Cabina Doble · Único Dueño',
    description:
      'Unidad seleccionada en estado impecable, atendida desde 0km en nuestro Service Oficial Ronel S.R.L. con historial completo verificable por matrícula.',
    category: 'usados',
    categoryLabel: 'Usado Seleccionado · Ficha Oficial Ronel',
    year: 2023,
    km: '38.400 km',
    engine: '1.4 Fire EVO 85 CV',
    transmission: 'Manual 5 marchas',
    traction: 'Delantera',
    priceUsd: 16900,
    initialDeliveryUsd: 5500,
    monthlyEstimateUsd: 275,
    warranty: 'Revisado en 40 puntos · Garantía Mecánica Ronel',
    image: STRADA_PICKUP_IMG,
    highlights: [
      'Todos los services oficiales sellados en Ronel S.R.L. Tacuarembó',
      'Cubiertas nuevas, lona marítima original y protector de caja',
      'Kilometraje real certificado por escáner oficial',
      'Pronta para transferir en el día · Tomamos tu usado en permuta',
    ],
    availability: 'Unidad verificada en salón',
  },
  {
    id: 'usado-pulse-drive-2024',
    brand: 'Fiat',
    name: 'Fiat Pulse Drive',
    version: '1.3 MT5 Pack Conectividad',
    description:
      'Prácticamente igual a 0km, con garantía de fábrica vigente y servicios de 10.000 y 20.000 km realizados en nuestro taller oficial de W. Beltrán 318.',
    category: 'usados',
    categoryLabel: 'Usado Seleccionado · En Garantía Oficial',
    year: 2024,
    km: '21.200 km',
    engine: '1.3 Firefly 99 CV',
    transmission: 'Manual 5 marchas',
    traction: 'Delantera',
    priceUsd: 19800,
    initialDeliveryUsd: 6200,
    monthlyEstimateUsd: 315,
    warranty: 'Garantía de Fábrica Vigente · Ficha Oficial',
    image: PULSE_CROSSOVER_IMG,
    highlights: [
      'Service de 10.000 km y 20.000 km realizados en nuestro taller oficial',
      'Sin detalles de pintura ni desgaste interior',
      'Rendimiento mixto de hasta 16,5 km/l en ruta',
      'Financiación bancaria hasta el 100% o crédito directo',
    ],
    availability: 'Entrega inmediata',
  },
];

const SERVICE_BENTO_ITEMS: ServiceBentoItem[] = [
  {
    id: 'service-oficial-multimarca',
    index: '01',
    title: 'Service Oficial Autorizado en Garantía',
    subtitle: 'Toyota · Fiat · Subaru · Suzuki · Mazda · Jetour · Kia · Ssangyong · Karry',
    description:
      'Somos el Service Oficial autorizado en Tacuarembó para las principales marcas del mercado uruguayo. Realizamos todos los mantenimientos programados sellando tu manual oficial para mantener intacta la garantía de fábrica.',
    duration: 'Entrega en el día (Horario 08:00–12:00 y 14:00–18:00)',
    warrantyNote: 'Sello Oficial de Garantía',
    iconName: 'wrench',
    spanClass: 'lg:col-span-2',
    image: WORKSHOP_IMAGE,
    includedPoints: [
      'Lubricantes sintéticos originales y filtros legítimos de cada marca',
      'Inspección multipunto bajo protocolo oficial de concesionario',
      'Sellado de libreta de garantía y registro en sistema oficial',
      'Atención de garantías y campañas técnicas de fábrica en Tacuarembó',
    ],
  },
  {
    id: 'diagnostico-computarizado',
    index: '02',
    title: 'Diagnóstico Electrónico e Inyección',
    subtitle: 'Escáneres Oficiales Multimarca de Última Generación',
    description:
      'Lectura de telemetría en tiempo real, programación de módulos electrónicos, sistemas híbridos, cajas automáticas CVT/AT, inyección Common Rail Diesel y sistemas ADAS.',
    duration: 'Diagnóstico en 45 min',
    warrantyNote: 'Informe Técnico Impreso',
    iconName: 'settings',
    spanClass: 'lg:col-span-1',
    includedPoints: [
      'Equipos oficiales para motores Nafta, Turbo, Diesel e Híbridos',
      'Regeneración y control de filtro de partículas (DPF) e inyectores',
      'Chequeo electrónico pre-compra con certificación de kilometraje',
    ],
  },
  {
    id: 'frenos-suspension-tren',
    index: '03',
    title: 'Servicio Integral de Mecánica General',
    subtitle: 'Tren Delantero, Frenos, Distribución y Embragues',
    description:
      'Fieles a nuestro lema "Servicio Integral de Mecánica General", resolvemos desde mantenimientos preventivos hasta reparaciones completas de motor, transmisión 4x4, frenos y suspensión.',
    duration: 'Presupuesto detallado previo',
    warrantyNote: 'Garantía Escrita Ronel S.R.L.',
    iconName: 'car',
    spanClass: 'lg:col-span-1',
    includedPoints: [
      'Recambio de kits de distribución, bombas de agua y correas',
      'Reparación de tren delantero y suspensión para caminos rurales',
      'Frenos ABS, discos, pastillas y purgado electrónico',
    ],
  },
  {
    id: 'atencion-flotas-emergencias',
    index: '04',
    title: 'Atención a Flotas, Productores y Asistencia de Emergencia',
    subtitle: 'Líneas de Emergencia: 099 831 229 · 099 263 670',
    description:
      'Prioridad operativa para camionetas de trabajo, flotas empresariales y productores agropecuarios del norte del país. Coordinación rápida para que tu herramienta de trabajo no se detenga.',
    duration: 'Recepción prioritaria 08:00 hs',
    warrantyNote: 'Facturación con RUT',
    iconName: 'gauge',
    spanClass: 'lg:col-span-2',
    includedPoints: [
      'Teléfonos directos de urgencia mecánica: 099 831 229 y 099 263 670',
      'Mantenimiento preventivo programado para pickups 4x2 y 4x4',
      'Historial clínico digitalizado por matrícula en nuestro taller',
      'Presupuestos oficiales para compañías de seguros y flotas',
    ],
  },
];

const SERVICE_INTERVALS: ServiceIntervalPlan[] = [
  {
    km: '10.000 km',
    label: 'Primer Service Oficial en Garantía (10k / 1 Año)',
    recommendedTime: '10.000 km o 12 meses',
    estimatedTimeWorkshop: '1h 45m',
    tasks: [
      'Cambio de aceite sintético original según norma de fábrica (Fiat / Toyota / Subaru / Suzuki / etc.)',
      'Sustitución de filtro de aceite y filtro de aire originales',
      'Control completo de niveles de refrigerante, líquido de frenos y limpiaparabrisas',
      'Escaneo electrónico preventivo y reseteo de intervalo de servicio',
      'Revisión de seguridad de tren delantero, frenos, luces y presión de neumáticos',
    ],
    partsIncluded: [
      'Lubricante Sintético Homologado',
      'Filtro de Aceite Original',
      'Filtro de Aire Original',
      'Sellado Oficial de Garantía',
    ],
  },
  {
    km: '20.000 km',
    label: 'Service Oficial Intermedio (20k / 2 Años)',
    recommendedTime: '20.000 km o 24 meses',
    estimatedTimeWorkshop: '2h 15m',
    tasks: [
      'Cambio de aceite sintético y filtro de aceite legítimo',
      'Reemplazo de filtro de aire, filtro de combustible y filtro de habitáculo (antipolen)',
      'Rotación de neumáticos e inspección de espesor de pastillas y discos de freno',
      'Diagnóstico computarizado de todos los módulos electrónicos y estado de batería',
      'Inspección en elevador de bujes, rótulas, amortiguadores y línea de escape',
    ],
    partsIncluded: [
      'Lubricante Sintético Original',
      'Filtro de Aceite y Aire',
      'Filtro de Combustible Original',
      'Filtro de Cabina / Habitáculo',
    ],
  },
  {
    km: '40.000 km',
    label: 'Service Mayor de Revisión Profunda (40k)',
    recommendedTime: '40.000 km o 48 meses',
    estimatedTimeWorkshop: '3h 30m',
    tasks: [
      'Recambio completo de los 4 filtros y lubricante sintético de motor',
      'Sustitución de bujías de encendido (según plan técnico del modelo)',
      'Reemplazo preventivo de líquido de frenos DOT 4 y control de circuito hidráulico',
      'Control de correa de accesorios, tensores, mangueras y circuito de refrigeración',
      'Verificación de fluidos de transmisión (CVT / AT / Manual) y diferenciales 4x4',
    ],
    partsIncluded: [
      'Pack 4 Filtros Originales',
      'Lubricante Sintético Oficial',
      'Juego de Bujías Originales',
      'Fluido de Frenos DOT 4',
    ],
  },
  {
    km: '60.000+ km',
    label: 'Service de Distribución y Mantenimiento Pesado',
    recommendedTime: '60.000 km a 100.000 km',
    estimatedTimeWorkshop: 'En el día',
    tasks: [
      'Reemplazo de Kit de Distribución original (correa dentada y tensores) o control de cadena',
      'Control y recambio preventivo de bomba de agua y líquido refrigerante de larga duración',
      'Cambio completo de filtros, aceite de motor y revisión de aceite de caja / diferencial',
      'Revisión integral de tren delantero, amortiguadores y sistema de frenos',
      'Prueba dinámica en ruta y entrega con garantía escrita de taller oficial',
    ],
    partsIncluded: [
      'Kit de Distribución Original',
      'Refrigerante Orgánico Oficial',
      'Pack Completo Filtros + Aceite',
      'Garantía Escrita Ronel S.R.L.',
    ],
  },
];

const SPARE_PARTS: SparePartItem[] = [
  {
    id: 'kit-service-original',
    code: 'OEM-SERV-01',
    name: 'Kits de Filtros Originales y Lubricantes Homologados',
    category: 'Mantenimiento',
    compatibility: 'Fiat, Toyota, Subaru, Suzuki, Mazda, Jetour, Kia, Ssangyong, Karry',
    brand: 'MOPAR / Selenia / OEM Original',
    stockStatus: 'En Stock en Tacuarembó',
    referencePriceUsd: 'Desde USD 85',
    description:
      'Armamos el pack exacto para tu vehículo por número de chasis: filtros legítimos de aceite, aire, combustible y habitáculo junto al lubricante sintético especificado.',
    iconName: 'settings',
    spanClass: 'lg:col-span-2',
  },
  {
    id: 'kit-distribucion-oem',
    code: 'OEM-DIST-02',
    name: 'Kits de Distribución, Tensores y Bombas de Agua',
    category: 'Motor',
    compatibility: 'Motores Nafta, Turbo y Diesel (Strada, Toro, Hilux, Swift, Subaru, etc.)',
    brand: 'Repuestos Originales',
    stockStatus: 'En Stock en Tacuarembó',
    referencePriceUsd: 'Desde USD 135',
    description:
      'Correas dentadas, cadenas, tensores hidráulicos y bombas de agua originales para máxima confiabilidad en ruta y trabajo.',
    iconName: 'cog',
    spanClass: 'lg:col-span-1',
  },
  {
    id: 'pastillas-discos-freno',
    code: 'OEM-FREN-03',
    name: 'Pastillas, Discos de Freno y Kits de Embrague',
    category: 'Frenos',
    compatibility: 'Pickups, SUVs y Utilitarios de todas nuestras marcas oficiales',
    brand: 'MOPAR / OEM Genuine',
    stockStatus: 'En Stock en Tacuarembó',
    referencePriceUsd: 'Desde USD 78',
    description:
      'Frenado seguro sin ruidos ni desgaste prematuro. Contamos además con placas, discos y crapodinas de embrague originales.',
    iconName: 'disc',
    spanClass: 'lg:col-span-1',
  },
  {
    id: 'amortiguadores-suspension',
    code: 'OEM-SUSP-04',
    name: 'Amortiguadores, Parrillas, Rótulas y Tren Delantero',
    category: 'Suspensión',
    compatibility: 'Pickups de trabajo rural y vehículos de pasajeros',
    brand: 'Originales de Fábrica',
    stockStatus: 'En Stock en Tacuarembó',
    referencePriceUsd: 'Consultar por Chasis',
    description:
      'Componentes de suspensión diseñados para soportar las exigencias de los caminos rurales del norte uruguayo.',
    iconName: 'wrench',
    spanClass: 'lg:col-span-1',
  },
  {
    id: 'opticas-carroceria-accesorios',
    code: 'OEM-CARR-05',
    name: 'Ópticas, Paragolpes, Espejos y Accesorios Originales',
    category: 'Carrocería y Accesorios',
    compatibility: 'Presupuestos Oficiales para Seguros (BSE, Sancor, Porto, Mapfre)',
    brand: 'OEM / Accesorios Oficiales',
    stockStatus: 'Entrega 24hs',
    referencePriceUsd: 'Presupuesto Oficial',
    description:
      'Piezas de carrocería legítimas con calce exacto, lonas marítimas, enganches, barras y accesorios originales.',
    iconName: 'car',
    spanClass: 'lg:col-span-1',
  },
];

// ---------------------------------------------------------------------------
// AUTHENTIC RONEL S.R.L. VECTOR LOGO COMPONENT (Recreated from Official Signage)
// ---------------------------------------------------------------------------

function RonelOfficialLogo({
  size = 'md',
  showSubtitle = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}) {
  const dimensions =
    size === 'lg'
      ? 'h-12 sm:h-15 max-w-[260px] sm:max-w-[330px]'
      : size === 'md'
      ? 'h-10 sm:h-12 max-w-[220px] sm:max-w-[280px]'
      : 'h-7 sm:h-9 max-w-[155px] sm:max-w-[200px]';

  return (
    <div className="inline-flex flex-col select-none shrink-0">
      {/* Iconic RONEL S.R.L. Speed-Stripe & Wheel Emblem Banner */}
      <svg
        viewBox="0 0 430 88"
        className={`${dimensions} w-full`}
        role="img"
        aria-label="RONEL S.R.L. Servicio Integral de Mecánica General"
      >
        <defs>
          <linearGradient id="ronelBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="65%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* Main Solid Block with 5 Speed Stripes on Left and Wheel Cutout on Right */}
        <path
          d="M 4 6 H 388 L 382 14 H 4 Z"
          fill="url(#ronelBlueGrad)"
          className="dark:fill-[#1D4ED8]"
        />
        {/* 5 Horizontal Speed Stripes on the left leading into main chassis block */}
        <rect x="4" y="6" width="58" height="8" rx="1" fill="#1E3A8A" className="dark:fill-[#2563EB]" />
        <rect x="4" y="19" width="54" height="8" rx="1" fill="#1E3A8A" className="dark:fill-[#2563EB]" />
        <rect x="4" y="32" width="50" height="8" rx="1" fill="#1E3A8A" className="dark:fill-[#2563EB]" />
        <rect x="4" y="45" width="46" height="8" rx="1" fill="#1E3A8A" className="dark:fill-[#2563EB]" />
        <rect x="4" y="58" width="42" height="8" rx="1" fill="#1E3A8A" className="dark:fill-[#2563EB]" />

        {/* Central Banner Body */}
        <polygon
          points="48,6 408,6 392,66 36,66"
          fill="url(#ronelBlueGrad)"
        />

        {/* Red Racing Accent Line under Banner */}
        <polygon points="36,68 392,68 390,72 34,72" fill="#D9381E" />

        {/* Italic Bold "RONEL" Letters */}
        <text
          x="64"
          y="56"
          fill="#FFFFFF"
          fontFamily="'Archivo', 'Barlow Condensed', sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="54"
          letterSpacing="2"
        >
          RONEL
        </text>

        {/* "S.R.L." Label */}
        <text
          x="306"
          y="59"
          fill="#E2E8F0"
          fontFamily="'Archivo', sans-serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="1"
        >
          S.R.L.
        </text>

        {/* Right Wheel / Tire Emblem (Authentic Hubcap from Flyer) */}
        <g transform="translate(384, 36)">
          <circle cx="0" cy="0" r="30" fill="#0F172A" stroke="#FFFFFF" strokeWidth="3.5" />
          <circle cx="0" cy="0" r="19" fill="#1E3A8A" stroke="#E2E8F0" strokeWidth="2.5" />
          {/* Hubcap 8 lug dots */}
          <circle cx="0" cy="-11" r="2.2" fill="#FFFFFF" />
          <circle cx="8" cy="-8" r="2.2" fill="#FFFFFF" />
          <circle cx="11" cy="0" r="2.2" fill="#FFFFFF" />
          <circle cx="8" cy="8" r="2.2" fill="#FFFFFF" />
          <circle cx="0" cy="11" r="2.2" fill="#FFFFFF" />
          <circle cx="-8" cy="8" r="2.2" fill="#FFFFFF" />
          <circle cx="-11" cy="0" r="2.2" fill="#FFFFFF" />
          <circle cx="-8" cy="-8" r="2.2" fill="#FFFFFF" />
          {/* Center Axle Cross */}
          <circle cx="0" cy="0" r="3.2" fill="#D9381E" />
        </g>

        {/* Subtitle: SERVICIO INTEGRAL DE MECANICA GENERAL */}
        {showSubtitle && (
          <text
            x="40"
            y="85"
            fill="currentColor"
            className="text-slate-800 dark:text-slate-200"
            fontFamily="'Archivo', sans-serif"
            fontWeight="800"
            fontStyle="italic"
            fontSize="11.5"
            letterSpacing="1.6"
          >
            SERVICIO INTEGRAL DE MECÁNICA GENERAL
          </text>
        )}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELPER COMPONENTS
// ---------------------------------------------------------------------------

function ResilientImage({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const resolvedSrc = useMemo(() => resolveAssetUrl(src), [src]);
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes (e.g. when admin updates image)
  useEffect(() => {
    setHasError(false);
  }, [resolvedSrc]);

  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-300 p-6 text-center ${className || ''}`}
      >
        <Car className="w-10 h-10 text-[#D9381E] mb-2 opacity-90" />
        <span className="text-xs font-medium tracking-wide text-slate-300">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

function BentoIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: ServiceBentoItem['iconName'] | SparePartItem['iconName'];
  className?: string;
}) {
  switch (name) {
    case 'wrench':
      return <Wrench className={className} />;
    case 'car':
      return <Car className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'gauge':
      return <Gauge className={className} />;
    case 'disc':
      return <Disc className={className} />;
    case 'cog':
      return <Cog className={className} />;
    case 'battery':
      return <BatteryCharging className={className} />;
    default:
      return <Settings className={className} />;
  }
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function App() {
  // Theme state (Dark mode by default)
  const [isDark, setIsDark] = useState<boolean>(true);

  // Dynamic Vehicles State (persisted in localStorage, auto-healing legacy image paths)
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((v: Vehicle) => ({
            ...v,
            image: resolveAssetUrl(v.image),
          }));
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_VEHICLES;
  });

  // Save vehicles to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // ignore quota errors
    }
  }, [vehicles]);

  // Active Multi-Page Tab
  const [activeTab, setActiveTab] = useState<TabId>('vehiculos');

  // Tab 1 (Vehículos) filters & detail modal
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('todos');
  const [vehicleSearch, setVehicleSearch] = useState<string>('');
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<Vehicle | null>(null);

  // Tab 2 (Service Oficial) interactive km plan selector
  const [selectedKmIndex, setSelectedKmIndex] = useState<number>(0);

  // Tab 3 (Repuestos) search & category filter
  const [partQuery, setPartQuery] = useState<string>('');
  const [partCategoryFilter, setPartCategoryFilter] = useState<string>('Todos');

  // Interactive WhatsApp Consultation Drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [inquiryMode, setInquiryMode] = useState<InquiryMode>('service');
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Service Oficial Autorizado');
  const [vehicleOrChassisDetail, setVehicleOrChassisDetail] = useState<string>('');
  const [preferredDay, setPreferredDay] = useState<string>('Mañana (08:00 a 12:00 hs)');
  const [selectedWhatsappLine, setSelectedWhatsappLine] = useState<string>(WHATSAPP_PRIMARY);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // SECRET KEYBOARD SHORTCUT ADMIN STATE (NO VISIBLE BUTTON ON PAGE)
  // Combinations supported:
  //   1. Ctrl + Shift + A (or Cmd + Shift + A)
  //   2. Ctrl + Alt + R (or Cmd + Alt + R)
  //   3. Typing "roneladmin" anywhere outside an input field
  // -------------------------------------------------------------------------
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [adminSavedToast, setAdminSavedToast] = useState<string>('');
  const secretBufferRef = useRef<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Combo 1: Ctrl/Cmd + Shift + A or Ctrl/Cmd + Shift + M
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'm')) {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
        return;
      }
      // Combo 2: Ctrl/Cmd + Alt + R
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
        return;
      }

      // Combo 3: Secret key sequence "roneladmin" when not typing in an input/textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (!isInput && e.key.length === 1) {
        secretBufferRef.current = (secretBufferRef.current + e.key.toLowerCase()).slice(-10);
        if (secretBufferRef.current.endsWith('roneladmin')) {
          secretBufferRef.current = '';
          setAdminOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode class on <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0B1120';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#F8FAFC';
    }
  }, [isDark]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesCategory =
        vehicleCategory === 'todos' ? true : v.category === vehicleCategory;
      const q = vehicleSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.engine.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [vehicles, vehicleCategory, vehicleSearch]);

  // Filtered spare parts
  const filteredParts = useMemo(() => {
    return SPARE_PARTS.filter((p) => {
      const matchesCategory =
        partCategoryFilter === 'Todos' ? true : p.category === partCategoryFilter;
      const q = partQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [partCategoryFilter, partQuery]);

  // Open WhatsApp Drawer with contextual prefill
  const openInquiryDrawer = (options: {
    mode: InquiryMode;
    subject: string;
    detail?: string;
    notes?: string;
  }) => {
    setInquiryMode(options.mode);
    setSelectedSubject(options.subject);
    if (options.detail !== undefined) {
      setVehicleOrChassisDetail(options.detail);
    }
    if (options.notes !== undefined) {
      setAdditionalNotes(options.notes);
    }
    setDrawerOpen(true);
  };

  // Switch tab and smoothly scroll
  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    const el = document.getElementById('workspace-tabs');
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Dynamically build the Uruguayan Spanish WhatsApp message
  const composedWhatsAppText = useMemo(() => {
    const greeting = customerName.trim()
      ? `Hola equipo de RONEL S.R.L., mi nombre es ${customerName.trim()}.`
      : 'Hola equipo de RONEL S.R.L. Automotores (Tacuarembó).';

    let body = '';
    if (inquiryMode === 'vehiculo') {
      body = `Me comunico desde la web para consultar por el vehículo *${selectedSubject}*${
        vehicleOrChassisDetail.trim() ? ` (${vehicleOrChassisDetail.trim()})` : ''
      }. Me gustaría recibir información sobre precio contado, financiación/permuta o coordinar para verlo en W. Beltrán 318.`;
    } else if (inquiryMode === 'service') {
      body = `Quiero agendar un turno en el Service Oficial para *${selectedSubject}*${
        vehicleOrChassisDetail.trim()
          ? ` de mi vehículo *${vehicleOrChassisDetail.trim()}*`
          : ''
      }. Preferencia de horario: ${preferredDay}.`;
    } else if (inquiryMode === 'repuesto') {
      body = `Quiero consultar disponibilidad y precio del repuesto *${selectedSubject}*${
        vehicleOrChassisDetail.trim()
          ? ` para el vehículo / chasis: *${vehicleOrChassisDetail.trim()}*`
          : ''
      }.`;
    } else {
      body = `Me gustaría realizar una consulta sobre *${selectedSubject}*.`;
    }

    const extra = additionalNotes.trim()
      ? `\n\nDetalle adicional: ${additionalNotes.trim()}`
      : '';

    return `${greeting}\n\n${body}${extra}\n\nMuchas gracias.`;
  }, [
    customerName,
    inquiryMode,
    selectedSubject,
    vehicleOrChassisDetail,
    preferredDay,
    additionalNotes,
  ]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${selectedWhatsappLine}?text=${encodeURIComponent(composedWhatsAppText)}`;
  }, [selectedWhatsappLine, composedWhatsAppText]);

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(composedWhatsAppText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2200);
  };

  // -------------------------------------------------------------------------
  // ADMIN CRUD HANDLERS
  // -------------------------------------------------------------------------

  const triggerAdminToast = (msg: string) => {
    setAdminSavedToast(msg);
    setTimeout(() => setAdminSavedToast(''), 3000);
  };

  const handleStartAddVehicle = () => {
    const newBlank: Vehicle = {
      id: `vehiculo-${Date.now()}`,
      brand: 'Fiat',
      name: '',
      version: '',
      description: '',
      category: '0km',
      categoryLabel: '0km Oficial · Entrega Inmediata',
      year: 2026,
      km: '0 km',
      engine: '1.3 Firefly / Turbo',
      transmission: 'Manual / Automática',
      traction: 'Delantera',
      priceUsd: 22900,
      initialDeliveryUsd: 7000,
      monthlyEstimateUsd: 360,
      warranty: 'Garantía Oficial 3 años o 100.000 km',
      image: STRADA_PICKUP_IMG,
      highlights: [
        'Respaldo de Service Oficial RONEL S.R.L. en Tacuarembó',
        'Financiación bancaria y toma de permutas',
        'Entrega inmediata en W. Beltrán 318',
      ],
      availability: 'Disponible en salón',
    };
    setIsCreatingNew(true);
    setEditingVehicle(newBlank);
  };

  const handleStartEditVehicle = (vehicle: Vehicle) => {
    setIsCreatingNew(false);
    setEditingVehicle({ ...vehicle, highlights: [...vehicle.highlights] });
  };

  const handleSaveVehicleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    const cleaned: Vehicle = {
      ...editingVehicle,
      name: editingVehicle.name.trim() || 'Nuevo Vehículo',
      version: editingVehicle.version.trim() || 'Versión Oficial',
      description:
        editingVehicle.description.trim() ||
        'Unidad disponible en salón Ronel S.R.L. Tacuarembó con respaldo técnico oficial.',
      priceUsd: Number(editingVehicle.priceUsd) || 0,
      initialDeliveryUsd: Number(editingVehicle.initialDeliveryUsd) || 0,
      monthlyEstimateUsd: Number(editingVehicle.monthlyEstimateUsd) || 0,
      year: Number(editingVehicle.year) || 2026,
      highlights: editingVehicle.highlights.map((h) => h.trim()).filter(Boolean),
    };

    if (isCreatingNew) {
      setVehicles((prev) => [cleaned, ...prev]);
      triggerAdminToast(`Vehículo "${cleaned.name}" añadido al catálogo.`);
    } else {
      setVehicles((prev) => prev.map((v) => (v.id === cleaned.id ? cleaned : v)));
      triggerAdminToast(`Cambios guardados en "${cleaned.name}".`);
    }

    setEditingVehicle(null);
    setIsCreatingNew(false);
  };

  const handleQuickPriceChange = (id: string, newPrice: number, newDelivery: number) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              priceUsd: Number.isFinite(newPrice) ? newPrice : v.priceUsd,
              initialDeliveryUsd: Number.isFinite(newDelivery) ? newDelivery : v.initialDeliveryUsd,
            }
          : v
      )
    );
    triggerAdminToast('Precio actualizado automáticamente.');
  };

  const handleDeleteVehicle = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setDeleteConfirmId(null);
    if (editingVehicle?.id === id) {
      setEditingVehicle(null);
    }
    triggerAdminToast(`Vehículo "${target?.name || ''}" eliminado del catálogo.`);
  };

  const handleResetCatalog = () => {
    setVehicles(INITIAL_VEHICLES);
    setEditingVehicle(null);
    triggerAdminToast('Catálogo original restaurado correctamente.');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingVehicle) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingVehicle((prev) => (prev ? { ...prev, image: reader.result as string } : null));
        triggerAdminToast('Imagen cargada correctamente.');
      }
    };
    reader.readAsDataURL(file);
  };

  const currentServicePlan = SERVICE_INTERVALS[selectedKmIndex];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-28 sm:pb-32">
      {/* =====================================================================
          1. STICKY HEADER (Minimalist 3-Zone Top Bar Contract with RONEL Logo)
         ===================================================================== */}
      <header className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Authentic RONEL S.R.L. Vector Brand Mark */}
          <a
            href="#top"
            className="flex items-center whitespace-nowrap shrink-0 focus:outline-none"
            aria-label="Ronel S.R.L. Inicio"
          >
            <RonelOfficialLogo size="sm" showSubtitle={false} />
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => handleSelectTab('vehiculos')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'vehiculos'
                  ? 'border-[#D9381E] text-slate-900 dark:text-white'
                  : 'border-transparent'
              }`}
            >
              Vehículos ({vehicles.length})
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('service')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'service'
                  ? 'border-[#D9381E] text-slate-900 dark:text-white'
                  : 'border-transparent'
              }`}
            >
              Service Oficial
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('repuestos')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'repuestos'
                  ? 'border-[#D9381E] text-slate-900 dark:text-white'
                  : 'border-transparent'
              }`}
            >
              Repuestos
            </button>
            <a
              href="#ubicacion"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Contacto y Taller
            </a>
          </nav>

          {/* Zone 3: Theme Toggle + Direct WhatsApp Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() =>
                openInquiryDrawer({
                  mode: 'general',
                  subject: 'Consulta Directa — RONEL S.R.L. Tacuarembó',
                })
              }
              aria-label="Contactar por WhatsApp"
              className="min-h-[40px] px-3 sm:px-4 py-2 rounded-lg bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs font-bold tracking-wide flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">099 831 229</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION (Authentic RONEL S.R.L. Identity, Zero Overflow)
         ===================================================================== */}
      <section id="top" className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
        {/* Subtle dual radial atmosphere: Royal Blue + Racing Red */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(29,78,216,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(217,56,30,0.12),_transparent_55%)]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Official Logo Banner, Kicker, Massive Headline, CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 min-w-0 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Official RONEL Full Emblem */}
                <div className="pb-1">
                  <RonelOfficialLogo size="md" showSubtitle={true} />
                </div>

                {/* Unboxed Metadata Kicker */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-bold tracking-wide text-[#D9381E]">
                  <span>Service Oficial y Venta de Vehículos</span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="text-[#1D4ED8] dark:text-blue-400">
                    Toyota · Fiat · Subaru · Suzuki · Mazda · Jetour · Kia · Ssangyong · Karry
                  </span>
                </div>

                {/* Massive Headline */}
                <h1
                  className="text-3xl sm:text-4xl xl:text-[3.25rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-display"
                  style={{ textWrap: 'balance' }}
                >
                  Tu próximo 0km y el mejor respaldo técnico en Tacuarembó.
                </h1>

                {/* Description grounded in RONEL S.R.L. reality */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Venta de unidades <strong>0km y usados seleccionados</strong>, servicio integral
                  de mecánica general y <strong>Service Oficial autorizado</strong> en{' '}
                  <strong>W. Beltrán 318</strong>. Diagnóstico computarizado original, repuestos
                  legítimos y atención de emergencias mecánicas.
                </p>
              </div>

              {/* Primary CTA & Direct Contact Channels (Wrapped cleanly, zero horizontal overflow) */}
              <div className="pt-1 space-y-4">
                {/* Tier 1: Primary & Secondary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openInquiryDrawer({
                        mode: 'service',
                        subject: 'Agendar Service Oficial o Test Drive',
                      })
                    }
                    className="min-h-[48px] px-5 py-3 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D9381E]/25 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="truncate">Agendar Service o Test Drive</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTab('vehiculos')}
                    className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-[#D9381E] shrink-0" />
                    <span className="truncate">Ver Vehículos en Venta ({vehicles.length})</span>
                  </button>
                </div>

                {/* Tier 2: Facebook & Hotmail Direct Cards (Contained 2-column grid inside Left Col) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 hover:border-[#1877F2]/50 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <FacebookIcon className="w-4 h-4 text-[#1877F2] shrink-0" />
                      <span className="truncate">Facebook: RONEL S.R.L</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </a>

                  <a
                    href={`mailto:${EMAIL_HOTMAIL}`}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 hover:border-[#D9381E]/50 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-4 h-4 text-[#D9381E] shrink-0" />
                      <span className="truncate">{EMAIL_HOTMAIL}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </a>
                </div>

                {/* Unboxed Authentic Contact & Hours Bar */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-[#D9381E] shrink-0" />
                    W. Beltrán 318, Tacuarembó
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num font-semibold text-slate-800 dark:text-slate-200">
                    Tel: {PHONE_LANDLINE}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    Emergencias: {PHONE_EMERGENCY_1} / {PHONE_EMERGENCY_2}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Horario: 8:00 a 12:00 y 14:00 a 18:00 hs</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Showroom Visual + Real RONEL S.R.L. Emblem Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 min-w-0 flex"
            >
              <div className="relative w-full min-h-[320px] sm:min-h-[380px] lg:h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-900 flex flex-col justify-between gap-6">
                <ResilientImage
                  src={HERO_IMAGE}
                  alt="Salón de Ventas y Service Oficial RONEL S.R.L. en Tacuarembó"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Measured Scrim for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/55 to-black/30" />

                {/* Top Corner: Real RONEL S.R.L. Plaque Badge */}
                <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-white/15 rounded-xl p-2 pr-3.5 max-w-full">
                    <ResilientImage
                      src={SIGNAGE_PHOTO}
                      alt="Cartel Oficial RONEL S.R.L."
                      className="w-11 h-11 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-wider text-blue-400 uppercase truncate">
                        Taller y Salón Oficial
                      </span>
                      <span className="block text-xs font-bold text-white truncate">
                        RONEL S.R.L. · Tacuarembó
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay Info (No colliding email/button) */}
                <div className="relative z-10 p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                    <span>Venta de Vehículos & Postventa Oficial</span>
                    <span aria-hidden="true">·</span>
                    <span>Garantía de Fábrica</span>
                  </div>

                  <p className="text-lg sm:text-xl font-bold text-white font-display leading-snug">
                    Respaldo multimarca oficial y unidades listas para entrega inmediata
                  </p>

                  <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
                    <div className="space-y-0.5 min-w-0">
                      <span className="block text-slate-400">Atención en Salón</span>
                      <span className="block font-semibold text-white">
                        W. Beltrán 318 · Tel: {PHONE_LANDLINE}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openInquiryDrawer({
                          mode: 'vehiculo',
                          subject: 'Consulta de Unidades en Salón W. Beltrán 318',
                        })
                      }
                      className="min-h-[38px] px-4 py-2 rounded-lg bg-[#D9381E] hover:bg-[#b82d16] text-white font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Consultar Ahora</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Official Multi-Brand Authorization Bar (Directly from RONEL Signage & Facebook) */}
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase shrink-0">
                Service Oficial Autorizado en Tacuarembó:
              </div>
              <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-xs sm:text-sm font-extrabold tracking-wider text-slate-800 dark:text-slate-200 font-condensed">
                {OFFICIAL_BRANDS.map((brand, idx) => (
                  <React.Fragment key={brand}>
                    <span className="hover:text-[#D9381E] transition-colors">{brand}</span>
                    {idx < OFFICIAL_BRANDS.length - 1 && (
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                        /
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. APP-LIKE MULTI-PAGE TABS & BENTO CONTENT
         ===================================================================== */}
      <main id="workspace-tabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Segmented Multi-Page Tab Controller */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Catálogo de Vehículos, Service Oficial y Repuestos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Seleccioná una sección para ver precios actualizados, agendar turno en taller o cotizar piezas.
            </p>
          </div>

          {/* 3 App-Like Tabs: [Vehículos, Service Oficial, Repuestos] */}
          <div
            role="tablist"
            aria-label="Secciones principales de Ronel S.R.L."
            className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/80 dark:border-white/10 w-full lg:w-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'vehiculos'}
              onClick={() => setActiveTab('vehiculos')}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vehiculos'
                  ? 'bg-[#D9381E] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Car className="w-4 h-4 shrink-0" />
              <span className="truncate">Vehículos</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'service'}
              onClick={() => setActiveTab('service')}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'service'
                  ? 'bg-[#D9381E] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className="truncate">Service Oficial</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'repuestos'}
              onClick={() => setActiveTab('repuestos')}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'repuestos'
                  ? 'bg-[#D9381E] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="truncate">Repuestos</span>
            </button>
          </div>
        </div>

        {/* Smooth Animated Tab Content Container */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {/* ===============================================================
                TAB 1: VEHÍCULOS (Dynamic Showroom Catalog)
               =============================================================== */}
            {activeTab === 'vehiculos' && (
              <motion.div
                key="tab-vehiculos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Swipeable Filter Rail + Search Input */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 min-w-0">
                    {[
                      { id: 'todos', label: `Todos (${vehicles.length})` },
                      {
                        id: '0km',
                        label: `SUVs & Pasajeros 0km (${vehicles.filter((v) => v.category === '0km').length})`,
                      },
                      {
                        id: 'pickups',
                        label: `Pickups & Utilitarios (${vehicles.filter((v) => v.category === 'pickups').length})`,
                      },
                      {
                        id: 'usados',
                        label: `Usados Seleccionados (${vehicles.filter((v) => v.category === 'usados').length})`,
                      },
                    ].map((cat) => {
                      const active = vehicleCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setVehicleCategory(cat.id as VehicleCategory)}
                          className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                            active
                              ? 'bg-[#1E3A8A] dark:bg-white text-white dark:text-slate-950 border-[#1E3A8A] dark:border-white'
                              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Model Search */}
                  <div className="relative w-full md:w-72 shrink-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                      placeholder="Buscar modelo, marca, motor..."
                      className="w-full min-h-[42px] pl-10 pr-8 py-2 rounded-lg text-xs sm:text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D9381E]"
                    />
                    {vehicleSearch && (
                      <button
                        type="button"
                        onClick={() => setVehicleSearch('')}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle Bento / Showroom Grid */}
                {filteredVehicles.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-3">
                    <Car className="w-10 h-10 text-[#D9381E] mx-auto" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No encontramos vehículos con ese criterio
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      Consultanos directamente por WhatsApp si buscás un modelo 0km o usado
                      específico en Tacuarembó.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setVehicleCategory('todos');
                        setVehicleSearch('');
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                    >
                      Mostrar todos los vehículos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => (
                      <article
                        key={vehicle.id}
                        className="group min-w-0 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between transition-colors hover:border-slate-300 dark:hover:border-white/25"
                      >
                        <div>
                          {/* Vehicle Image Slot (4:3) */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                            <ResilientImage
                              src={vehicle.image}
                              alt={`${vehicle.name} ${vehicle.version}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                              <span className="text-xs font-medium text-slate-200 truncate">
                                {vehicle.availability}
                              </span>
                              <span className="text-xs font-mono-num font-bold text-white bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15 shrink-0">
                                {vehicle.year} · {vehicle.km}
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 space-y-4">
                            {/* Unboxed Metadata Kicker */}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#D9381E] font-bold">
                                <span>{vehicle.brand}</span>
                                <span aria-hidden="true">·</span>
                                <span>{vehicle.categoryLabel}</span>
                              </div>
                              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                                {vehicle.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
                                {vehicle.version}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {vehicle.description}
                            </p>

                            {/* Technical Specs Row */}
                            <div className="pt-3 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-3 text-xs">
                              <div className="min-w-0">
                                <span className="block text-slate-400 dark:text-slate-500">
                                  Motorización
                                </span>
                                <span className="block font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {vehicle.engine}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="block text-slate-400 dark:text-slate-500">
                                  Transmisión
                                </span>
                                <span className="block font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {vehicle.transmission}
                                </span>
                              </div>
                            </div>

                            {/* Key Highlights Preview */}
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                              {vehicle.highlights.slice(0, 2).map((point, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9381E] shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Pricing & Actions Footer */}
                        <div className="p-5 pt-0 space-y-3">
                          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                Precio Contado Ref.
                              </span>
                              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono-num">
                                USD {vehicle.priceUsd.toLocaleString('es-UY')}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                Entrega Inicial
                              </span>
                              <span className="text-xs font-bold text-[#D9381E] font-mono-num">
                                Desde USD {vehicle.initialDeliveryUsd.toLocaleString('es-UY')}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setSelectedVehicleModal(vehicle)}
                              className="min-h-[44px] px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Ficha Técnica</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openInquiryDrawer({
                                  mode: 'vehiculo',
                                  subject: `${vehicle.name} — ${vehicle.version}`,
                                  detail: `Año ${vehicle.year} (${vehicle.km}) · USD ${vehicle.priceUsd.toLocaleString('es-UY')}`,
                                })
                              }
                              className="min-h-[44px] px-2.5 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Cotizar / Test</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ===============================================================
                TAB 2: SERVICE OFICIAL (Bento Grid + Interactive Km Estimator)
               =============================================================== */}
            {activeTab === 'service' && (
              <motion.div
                key="tab-service"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Asymmetric Bento Grid of Official Services */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {SERVICE_BENTO_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`${item.spanClass} min-w-0 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-6 transition-colors hover:border-slate-300 dark:hover:border-white/25`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#D9381E]">
                            <span className="font-mono-num">{item.index}.</span>
                            <span>{item.warrantyNote}</span>
                            <span aria-hidden="true" className="text-slate-400">
                              ·
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-normal">
                              {item.duration}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/15 dark:bg-white/10 border border-[#1E3A8A]/30 dark:border-white/15 text-[#1E3A8A] dark:text-white flex items-center justify-center shrink-0">
                            <BentoIcon name={item.iconName} className="w-5 h-5 text-[#D9381E]" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-[#1D4ED8] dark:text-blue-400">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {item.image && (
                          <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                            <ResilientImage
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                              <span className="text-xs text-white font-medium">
                                Servicio Integral de Mecánica General · W. Beltrán 318, Tacuarembó
                              </span>
                            </div>
                          </div>
                        )}

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {item.includedPoints.map((pt, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Tel: {PHONE_LANDLINE} · Urgencias: {PHONE_EMERGENCY_1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            openInquiryDrawer({
                              mode: 'service',
                              subject: item.title,
                              detail: item.subtitle,
                            })
                          }
                          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Agendar Turno Oficial</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Official Service Plan Calculator by Kilometraje */}
                <div className="rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
                    <div>
                      <div className="text-xs font-bold text-[#D9381E]">
                        Mantenimiento Oficial Programado
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                        Seleccioná el kilometraje para ver el protocolo de taller
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {SERVICE_INTERVALS.map((plan, idx) => (
                        <button
                          key={plan.km}
                          type="button"
                          onClick={() => setSelectedKmIndex(idx)}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold font-mono-num transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                            selectedKmIndex === idx
                              ? 'bg-[#D9381E] text-white border-[#D9381E] shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {plan.km}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 min-w-0 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {currentServicePlan.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Frecuencia: {currentServicePlan.recommendedTime}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          Tiempo estimado: {currentServicePlan.estimatedTimeWorkshop}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {currentServicePlan.tasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 min-w-0 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-5 space-y-4">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Repuestos e Insumos Incluidos
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                        {currentServicePlan.partsIncluded.map((part, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#D9381E] shrink-0" />
                            <span>{part}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-3">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Indicá la marca y modelo de tu vehículo para confirmar turno en W. Beltrán
                          318.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openInquiryDrawer({
                              mode: 'service',
                              subject: `Service Oficial ${currentServicePlan.km}`,
                              detail: currentServicePlan.label,
                            })
                          }
                          className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span className="truncate">Agendar Service de {currentServicePlan.km}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===============================================================
                TAB 3: REPUESTOS (Bento Grid + Fast OEM / Chassis Lookup)
               =============================================================== */}
            {activeTab === 'repuestos' && (
              <motion.div
                key="tab-repuestos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-5 min-w-0 space-y-1">
                      <div className="text-xs font-bold text-[#D9381E]">
                        Venta de Repuestos Originales en Tacuarembó
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                        Consultá por Pieza, Marca o Número de Chasis
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Stock permanente para Fiat, Toyota, Subaru, Suzuki, Mazda, Jetour, Kia,
                        Ssangyong y Karry.
                      </p>
                    </div>

                    <div className="lg:col-span-7 min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 min-w-0">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={partQuery}
                          onChange={(e) => setPartQuery(e.target.value)}
                          placeholder="Ej: Kit distribución Strada, filtros Hilux, pastillas Swift..."
                          className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D9381E]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openInquiryDrawer({
                            mode: 'repuesto',
                            subject: partQuery.trim()
                              ? `Cotización de Repuesto: ${partQuery.trim()}`
                              : 'Cotización de Repuesto Original por Chasis',
                          })
                        }
                        className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Cotizar por Chasis</span>
                      </button>
                    </div>
                  </div>

                  {/* Swipeable Part Category Buttons */}
                  <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                      'Todos',
                      'Mantenimiento',
                      'Motor',
                      'Frenos',
                      'Suspensión',
                      'Carrocería y Accesorios',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPartCategoryFilter(cat)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                          partCategoryFilter === cat
                            ? 'bg-[#1E3A8A] dark:bg-white text-white dark:text-slate-950 border-[#1E3A8A] dark:border-white'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spare Parts Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredParts.map((part) => (
                    <div
                      key={part.id}
                      className={`${part.spanClass} min-w-0 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-5 transition-colors hover:border-slate-300 dark:hover:border-white/25`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-mono-num font-bold text-[#D9381E]">
                              {part.code}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{part.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {part.stockStatus}
                            </span>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center shrink-0">
                            <BentoIcon name={part.iconName} className="w-5 h-5 text-[#D9381E]" />
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                          {part.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {part.description}
                        </p>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 text-xs space-y-1">
                          <div className="text-slate-400 dark:text-slate-500">
                            Compatibilidad multimarca:
                          </div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {part.compatibility}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                            Referencia Mostrador
                          </span>
                          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono-num">
                            {part.referencePriceUsd}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openInquiryDrawer({
                              mode: 'repuesto',
                              subject: `${part.name} (${part.code})`,
                              detail: part.compatibility,
                            })
                          }
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Pedir Cotización</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===================================================================
            4. INSTITUTIONAL IDENTITY, FACEBOOK, HOTMAIL & LOCATION SECTION
           =================================================================== */}
        <section
          id="ubicacion"
          className="mt-14 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left 7 Cols: Tacuarembó Facility & Direct Digital Channels */}
          <div className="lg:col-span-7 min-w-0 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#D9381E] uppercase tracking-wider">
                Casa Central · Tacuarembó, Uruguay
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                RONEL S.R.L. — Servicio Integral de Mecánica General
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Somos Service Oficial autorizado para{' '}
                <strong>
                  Toyota, Fiat, Subaru, Suzuki, Mazda, Jetour, Kia, Ssangyong y Karry
                </strong>
                . Estamos a tu disposición en el centro de Tacuarembó con atención personalizada,
                diagnóstico oficial y venta de vehículos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span>Dirección en Tacuarembó</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {ADDRESS_TACUAREMBO}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span>Horario de Atención</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono-num">
                  De 8:00 a 12:00 y de 14:00 a 18:00 hs
                  <br />
                  Sábados de 8:00 a 12:00 hs
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Phone className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span>Teléfonos y Emergencias</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono-num">
                  Tel. Fijo: <strong>{PHONE_LANDLINE}</strong>
                  <br />
                  Emergencias: <strong>{PHONE_EMERGENCY_1}</strong> y{' '}
                  <strong>{PHONE_EMERGENCY_2}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Mail className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span>Correo Hotmail y Facebook Oficial</span>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <a
                    href={`mailto:${EMAIL_HOTMAIL}`}
                    className="block font-semibold text-[#1D4ED8] dark:text-blue-400 hover:underline truncate"
                  >
                    {EMAIL_HOTMAIL}
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 hover:text-[#1877F2] dark:hover:text-blue-400"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                    <span>Facebook: RONEL S.R.L</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Authentic RONEL S.R.L. Visual Identity & Signage Showcase */}
          <div className="lg:col-span-5 min-w-0 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D9381E] uppercase tracking-wider">
                Tradición y Confianza en el Norte
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Identidad Oficial RONEL S.R.L.
              </h3>

              {/* Authentic Uploaded Signage & Flyer Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-900 aspect-[4/3]">
                  <ResilientImage
                    src={SIGNAGE_PHOTO}
                    alt="Placa Oficial RONEL S.R.L. Servicio Integral de Mecánica General"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-900 aspect-[4/3]">
                  <ResilientImage
                    src={FLYER_PHOTO}
                    alt="Comunicado Oficial RONEL S.R.L. Horarios y Teléfonos"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  “Como siempre, a vuestra disposición en W. Beltrán 318. Service Oficial multimarca
                  con repuestos legítimos, herramientas de diagnóstico original y respaldo humano en
                  Tacuarembó.”
                </p>
                <footer className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Equipo Técnico y Comercial · RONEL S.R.L.
                </footer>
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>© {new Date().getFullYear()} RONEL S.R.L. · W. Beltrán 318, Tacuarembó</span>
              <a href={`mailto:${EMAIL_HOTMAIL}`} className="font-semibold hover:underline">
                {EMAIL_HOTMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          5. VEHICLE TECHNICAL SPEC MODAL (Interactive Detail View)
         ===================================================================== */}
      <AnimatePresence>
        {selectedVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/15 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#D9381E]">
                    {selectedVehicleModal.brand} · {selectedVehicleModal.categoryLabel}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                    {selectedVehicleModal.name} — {selectedVehicleModal.version}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleModal(null)}
                  aria-label="Cerrar ficha técnica"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10">
                <ResilientImage
                  src={selectedVehicleModal.image}
                  alt={selectedVehicleModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedVehicleModal.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Motor</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedVehicleModal.engine}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Transmisión</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedVehicleModal.transmission}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Tracción</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedVehicleModal.traction}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Precio Contado Ref.</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono-num">
                    USD {selectedVehicleModal.priceUsd.toLocaleString('es-UY')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Entrega Sugerida</span>
                  <span className="font-extrabold text-[#D9381E] font-mono-num">
                    USD {selectedVehicleModal.initialDeliveryUsd.toLocaleString('es-UY')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="block text-slate-400">Respaldo</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedVehicleModal.warranty}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Equipamiento y Ventajas Destacadas
                </div>
                <ul className="space-y-2">
                  {selectedVehicleModal.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const v = selectedVehicleModal;
                    setSelectedVehicleModal(null);
                    openInquiryDrawer({
                      mode: 'vehiculo',
                      subject: `${v.name} — ${v.version}`,
                      detail: `Año ${v.year} (${v.km}) · USD ${v.priceUsd.toLocaleString('es-UY')}`,
                    });
                  }}
                  className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp sobre esta unidad</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          6. INTERACTIVE WHATSAPP CONSULTATION DRAWER (Pre-Filled Builder)
         ===================================================================== */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/15 shadow-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#D9381E]">
                    Atención Directa · RONEL S.R.L. (W. Beltrán 318)
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                    Enviar consulta por WhatsApp
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar asistente de consulta"
                  className="min-h-[40px] min-w-[40px] rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                {[
                  { id: 'service', label: 'Agendar Service' },
                  { id: 'vehiculo', label: 'Vehículo / 0km' },
                  { id: 'repuesto', label: 'Repuestos' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setInquiryMode(m.id as InquiryMode);
                      if (m.id === 'service') setSelectedSubject('Turno de Service Oficial');
                      if (m.id === 'vehiculo') setSelectedSubject('Cotización / Test Drive Vehículo');
                      if (m.id === 'repuesto') setSelectedSubject('Consulta de Repuesto Original');
                    }}
                    className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      inquiryMode === m.id
                        ? 'bg-[#D9381E] text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Input Fields */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo o Unidad Seleccionada
                  </label>
                  <input
                    type="text"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:border-[#D9381E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Juan Rodríguez"
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D9381E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {inquiryMode === 'repuesto'
                        ? 'Marca, Modelo o N° de Chasis'
                        : inquiryMode === 'service'
                        ? 'Marca, Modelo y Kilometraje'
                        : 'Permuta o Financiación (Opcional)'}
                    </label>
                    <input
                      type="text"
                      value={vehicleOrChassisDetail}
                      onChange={(e) => setVehicleOrChassisDetail(e.target.value)}
                      placeholder={
                        inquiryMode === 'repuesto'
                          ? 'Ej: Fiat Strada / Toyota Hilux...'
                          : inquiryMode === 'service'
                          ? 'Ej: Fiat Pulse 20.000 km'
                          : 'Ej: Entrego usado / Financiado'
                      }
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D9381E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inquiryMode === 'service' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Horario Preferido (8–12 / 14–18 hs)
                      </label>
                      <select
                        value={preferredDay}
                        onChange={(e) => setPreferredDay(e.target.value)}
                        className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:border-[#D9381E]"
                      >
                        <option value="Mañana (08:00 a 12:00 hs)">
                          Turno Mañana (08:00 a 12:00 hs)
                        </option>
                        <option value="Tarde (14:00 a 18:00 hs)">
                          Turno Tarde (14:00 a 18:00 hs)
                        </option>
                        <option value="Sábado de mañana (08:00 a 12:00 hs)">
                          Sábado de mañana (08:00 a 12:00 hs)
                        </option>
                        <option value="Urgencia Mecánica / Vehículo de Trabajo">
                          Urgencia / Flota de Trabajo
                        </option>
                      </select>
                    </div>
                  )}

                  <div className={inquiryMode === 'service' ? '' : 'sm:col-span-2'}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Línea de WhatsApp RONEL S.R.L.
                    </label>
                    <select
                      value={selectedWhatsappLine}
                      onChange={(e) => setSelectedWhatsappLine(e.target.value)}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-mono-num focus:outline-none focus:border-[#D9381E]"
                    >
                      <option value="59899831229">Línea 1: 099 831 229 (Atención y Emergencias)</option>
                      <option value="59899263670">Línea 2: 099 263 670 (Atención y Emergencias)</option>
                      <option value="59891839000">Línea 3: 091 839 000 (Recepción Taller)</option>
                    </select>
                  </div>
                </div>

                {/* Live WhatsApp Message Preview */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Vista previa del mensaje
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="text-xs font-bold text-[#D9381E] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar texto</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {composedWhatsAppText}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D9381E]/25 transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Enviar por WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          7. SECRET KEYBOARD-ONLY ADMIN INVENTORY & PRICING PANEL
             (Opened exclusively via Ctrl+Shift+A, Ctrl+Alt+R, or typing "roneladmin")
         ===================================================================== */}
      <AnimatePresence>
        {adminOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Admin Top Header */}
              <div className="px-6 py-4 bg-slate-900 text-white border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D9381E] flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono-num uppercase tracking-wider text-slate-400">
                      Panel Interno de Gestión · Acceso por Teclado (Ctrl+Shift+A)
                    </div>
                    <h2 className="text-lg font-extrabold font-display">
                      Administrador de Vehículos y Precios — RONEL S.R.L.
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleStartAddVehicle}
                    className="min-h-[38px] px-4 py-2 rounded-lg bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Nuevo Vehículo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCatalog}
                    title="Restaurar los 6 vehículos por defecto"
                    className="min-h-[38px] px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Restaurar Catálogo Base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminOpen(false);
                      setEditingVehicle(null);
                    }}
                    aria-label="Cerrar panel de administración"
                    className="min-h-[38px] min-w-[38px] rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toast Notification Banner inside Admin */}
              {adminSavedToast && (
                <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{adminSavedToast}</span>
                  </div>
                  <span className="text-[11px] opacity-90">Guardado en este navegador</span>
                </div>
              )}

              {/* Admin Body: Split View or List View */}
              <div className="flex-1 overflow-y-auto p-6">
                {editingVehicle ? (
                  /* ---------------------------------------------------------
                     COMPLETE VEHICLE CREATE / EDIT FORM
                     --------------------------------------------------------- */
                  <form onSubmit={handleSaveVehicleForm} className="space-y-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                      <div>
                        <span className="text-xs font-bold text-[#D9381E] uppercase">
                          {isCreatingNew ? 'Alta de Unidad' : 'Edición de Unidad'}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                          {isCreatingNew
                            ? 'Añadir Nuevo Vehículo al Catálogo'
                            : `Modificando: ${editingVehicle.name}`}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingVehicle(null)}
                        className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                      >
                        Volver al listado
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Marca Oficial
                        </label>
                        <select
                          value={editingVehicle.brand}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, brand: e.target.value })
                          }
                          className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        >
                          <option value="Fiat">Fiat</option>
                          <option value="Toyota">Toyota</option>
                          <option value="Subaru">Subaru</option>
                          <option value="Suzuki">Suzuki</option>
                          <option value="Mazda">Mazda</option>
                          <option value="Jetour">Jetour</option>
                          <option value="Kia">Kia</option>
                          <option value="Ssangyong">Ssangyong</option>
                          <option value="Karry">Karry</option>
                          <option value="Otra Marca">Otra Marca</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nombre del Modelo *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingVehicle.name}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, name: e.target.value })
                          }
                          placeholder="Ej: Fiat Strada Volcano / Toyota Hilux"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Versión / Subtítulo *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingVehicle.version}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, version: e.target.value })
                          }
                          placeholder="Ej: 1.3 CVT Cabina Doble"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Categoría de Filtro
                        </label>
                        <select
                          value={editingVehicle.category}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              category: e.target.value as '0km' | 'pickups' | 'usados',
                            })
                          }
                          className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        >
                          <option value="0km">SUVs & Pasajeros 0km</option>
                          <option value="pickups">Pickups & Utilitarios</option>
                          <option value="usados">Usados Seleccionados</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Etiqueta Superior (Kicker)
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.categoryLabel}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              categoryLabel: e.target.value,
                            })
                          }
                          placeholder="Ej: 0km Oficial · SUV Compacto"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Estado de Disponibilidad
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.availability}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              availability: e.target.value,
                            })
                          }
                          placeholder="Ej: Entrega inmediata en salón"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#D9381E] mb-1">
                          Precio Contado (USD) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          step={50}
                          value={editingVehicle.priceUsd}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              priceUsd: Number(e.target.value),
                            })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#D9381E]/50 text-slate-900 dark:text-white font-mono-num font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Entrega Inicial Sugerida (USD)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={editingVehicle.initialDeliveryUsd}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              initialDeliveryUsd: Number(e.target.value),
                            })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Año y Kilometraje
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={editingVehicle.year}
                            onChange={(e) =>
                              setEditingVehicle({
                                ...editingVehicle,
                                year: Number(e.target.value),
                              })
                            }
                            placeholder="Año"
                            className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono-num"
                          />
                          <input
                            type="text"
                            value={editingVehicle.km}
                            onChange={(e) =>
                              setEditingVehicle({ ...editingVehicle, km: e.target.value })
                            }
                            placeholder="0 km / 35.000 km"
                            className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono-num"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Motor
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.engine}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, engine: e.target.value })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Transmisión
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.transmission}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              transmission: e.target.value,
                            })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Garantía / Respaldo
                        </label>
                        <input
                          type="text"
                          value={editingVehicle.warranty}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, warranty: e.target.value })
                          }
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Descripción Comercial del Vehículo
                      </label>
                      <textarea
                        rows={2}
                        value={editingVehicle.description}
                        onChange={(e) =>
                          setEditingVehicle({ ...editingVehicle, description: e.target.value })
                        }
                        placeholder="Descripción breve que verán los clientes en la tarjeta y en la ficha técnica..."
                        className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Image Selector & File Upload */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#D9381E]" />
                          <span>Fotografía del Vehículo (URL o Subir desde tu dispositivo)</span>
                        </label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Foto desde PC / Celular</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-8 space-y-2">
                          <input
                            type="text"
                            value={editingVehicle.image}
                            onChange={(e) =>
                              setEditingVehicle({ ...editingVehicle, image: e.target.value })
                            }
                            placeholder="Pegar enlace https://... o seleccionar galería abajo"
                            className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] text-slate-500">Fotos de Salón:</span>
                            {[
                              {
                                label: 'Pickup Strada',
                                url: STRADA_PICKUP_IMG,
                              },
                              {
                                label: 'SUV Fastback Rojo',
                                url: FASTBACK_SUV_IMG,
                              },
                              {
                                label: 'SUV Pulse Plata',
                                url: PULSE_CROSSOVER_IMG,
                              },
                              {
                                label: 'Salón Doble Unidad',
                                url: HERO_IMAGE,
                              },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() =>
                                  setEditingVehicle({ ...editingVehicle, image: preset.url })
                                }
                                className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="sm:col-span-4 aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-white/15">
                          <ResilientImage
                            src={editingVehicle.image}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Highlights (1 per line) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Puntos Destacados de Equipamiento (Escribir 1 ventaja por línea)
                      </label>
                      <textarea
                        rows={4}
                        value={editingVehicle.highlights.join('\n')}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            highlights: e.target.value.split('\n'),
                          })
                        }
                        className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingVehicle(null)}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Vehículo en el Catálogo</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ---------------------------------------------------------
                     ADMIN VEHICLE LIST & QUICK PRICE EDITOR
                     --------------------------------------------------------- */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        Podés modificar los precios directamente en la tabla o hacer clic en{' '}
                        <strong>Editar Todo</strong> para cambiar fotos, descripciones y ficha
                        técnica.
                      </p>
                      <span className="text-xs font-mono-num font-bold text-slate-500">
                        Total unidades publicadas: {vehicles.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {vehicles.map((v) => (
                        <div
                          key={v.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shrink-0">
                              <ResilientImage
                                src={v.image}
                                alt={v.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-xs font-bold text-[#D9381E]">
                                <span>{v.brand}</span>
                                <span>·</span>
                                <span>{v.category.toUpperCase()}</span>
                                <span>·</span>
                                <span className="text-slate-500 dark:text-slate-400 font-mono-num">
                                  {v.year} ({v.km})
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                                {v.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {v.version}
                              </p>
                            </div>
                          </div>

                          {/* Inline Quick Price & Delivery Inputs + Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                                Precio Contado (USD)
                              </label>
                              <div className="relative">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="number"
                                  value={v.priceUsd}
                                  onChange={(e) =>
                                    handleQuickPriceChange(
                                      v.id,
                                      Number(e.target.value),
                                      v.initialDeliveryUsd
                                    )
                                  }
                                  className="w-32 min-h-[38px] pl-7 pr-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs font-mono-num font-bold text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                                Entrega Inicial (USD)
                              </label>
                              <div className="relative">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="number"
                                  value={v.initialDeliveryUsd}
                                  onChange={(e) =>
                                    handleQuickPriceChange(
                                      v.id,
                                      v.priceUsd,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-28 min-h-[38px] pl-7 pr-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs font-mono-num font-semibold text-[#D9381E]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-3 lg:pt-4">
                              <button
                                type="button"
                                onClick={() => handleStartEditVehicle(v)}
                                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar Todo</span>
                              </button>

                              {deleteConfirmId === v.id ? (
                                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVehicle(v.id)}
                                    className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold cursor-pointer"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(v.id)}
                                  aria-label={`Eliminar ${v.name}`}
                                  className="min-h-[38px] px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Eliminar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Footer */}
              <div className="px-6 py-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Atajos ocultos: <strong>Ctrl + Shift + A</strong> ·{' '}
                  <strong>Ctrl + Alt + R</strong> · o escribir <strong>roneladmin</strong> en la
                  página.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminOpen(false);
                    setEditingVehicle(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold cursor-pointer"
                >
                  Cerrar y Ver Página
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          8. PERMANENT STICKY BOTTOM ACTION BAR (z-50 Mobile-First Conversion)
         ===================================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white font-display">
              RONEL S.R.L.
            </span>
            <span aria-hidden="true" className="text-slate-400">
              ·
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              W. Beltrán 318, Tacuarembó · Tel: {PHONE_LANDLINE} · {EMAIL_HOTMAIL}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              openInquiryDrawer({
                mode:
                  activeTab === 'vehiculos'
                    ? 'vehiculo'
                    : activeTab === 'service'
                    ? 'service'
                    : 'repuesto',
                subject:
                  activeTab === 'vehiculos'
                    ? 'Consulta sobre Vehículos en Venta'
                    : activeTab === 'service'
                    ? 'Agendar Turno de Service Oficial'
                    : 'Consulta de Repuestos Originales',
              })
            }
            className="w-full sm:w-auto sm:min-w-[320px] min-h-[46px] px-6 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#b82d16] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#D9381E]/25 transition-all whitespace-nowrap cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
