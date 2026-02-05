
import { ServiceItem, Ticket, Client, TechnicalStaff } from './types';

export const TECH_STAFF: TechnicalStaff[] = [
  { 
    id: 'TEC-101', dni: '69916674', name: 'David Flores', email: 'david.flores@technova.pe', password: 'DF69916674', phone: '977451964', 
    level: 2, seniority: 'Senior', specialty: 'CCTV, Alarmas', secondarySkills: ['Routers', 'Pozos a Tierra'], 
    address: 'Calle Real #8274, Pilcomayo', currentWorkload: 40, isVersatile: true 
  },
  { 
    id: 'TEC-102', dni: '46798492', name: 'Miguel Ramírez', email: 'miguel.ramirez@technova.pe', password: 'MR46798492', phone: '933052052', 
    level: 2, seniority: 'Semi Senior', specialty: 'Soldadura, Ensamblaje PC Gamer', secondarySkills: ['Reparación Laptops', 'Gestión Proyectos'], 
    address: 'Jr. Los Andes #6868, Pilcomayo', currentWorkload: 65, isVersatile: true 
  },
  { 
    id: 'TEC-103', dni: '73002266', name: 'Laura Sánchez', email: 'laura.sanchez@technova.pe', password: 'LS73002266', phone: '963587556', 
    level: 1, seniority: 'Novato', specialty: 'Formateo, Backups', secondarySkills: ['Instalación Office', 'Wifi'], 
    address: 'Jr. Los Andes #329, Huancayo', currentWorkload: 80 
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '47583825',
    type: 'natural',
    name: 'Eduardo',
    lastName: 'Araujo',
    email: 'araujo.edu@gmail.com',
    phone: '981818121',
    address: 'Av. Nicolas de Pierola 456, Lima',
    password: '123',
    createdAt: '2024-01-15'
  }
];

export const DEVICE_TYPES: Record<string, string[]> = {
  'computo': ['Laptop Corporativa', 'Desktop Business', 'Workstation Pro', 'Servidor de Datos', 'PC Gamer/Diseño (Custom)'],
  'redes': ['Router Core / Firewall', 'Switch Administrable', 'Access Point WiFi 6', 'Rack de Comunicaciones'],
  'impresion': ['Multifuncional Láser', 'Plotter de Diseño', 'Impresora Térmica'],
  'seguridad': ['Grabador NVR/DVR', 'Cámara IP 4K', 'Panel de Alarma'],
  'software': ['Sistema Operativo', 'Software ERP/Contable', 'Licenciamiento Office'],
  'clima_energia': ['UPS Online', 'Sistema de Aire Precisión', 'Pozo a Tierra']
};

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'computo',
    title: "Soporte de Computadoras y Laptops",
    desc: "Mantenimiento, Optimización, Instalación de SO, Upgrades de RAM/SSD y Ensamblaje Profesional.",
    iconName: "Cpu",
    color: "blue",
    subServices: ["Optimización (Lentitud/Virus)", "Limpieza de Hardware", "Formateo Windows/Linux", "Upgrade RAM/SSD"],
    basePrice: 85
  },
  {
    id: 'redes',
    title: "Infraestructura de Redes & WiFi",
    desc: "Certificación de puntos, configuración de Firewalls, optimización de señal WiFi 6 y Racks.",
    iconName: "Network",
    color: "cyan",
    subServices: ["Ponchado Cat6/6A", "Configuración de Switch", "VPN & Seguridad", "Auditoría de Red"],
    basePrice: 120
  },
  {
    id: 'impresion',
    title: "Sistemas de Impresión & Plotters",
    desc: "Reparación de fusores, limpieza de cabezales y mantenimiento preventivo multimarca.",
    iconName: "Printer",
    color: "teal",
    subServices: ["Mantenimiento Preventivo", "Cambio de Rodillos", "Configuración en Red", "Reseteo de Contador"],
    basePrice: 75
  },
  {
    id: 'seguridad',
    title: "Seguridad Electrónica & CCTV",
    desc: "Monitoreo remoto, instalación de cámaras IP, cercos eléctricos y alarmas inteligentes.",
    iconName: "Shield",
    color: "indigo",
    subServices: ["Instalación de Cámaras", "Configuración Móvil", "Mantenimiento de DVR", "Sensores de Movimiento"],
    basePrice: 150
  },
  {
    id: 'software',
    title: "Software & Licenciamiento",
    desc: "Gestión de licencias corporativas, migración a la nube y recuperación de datos críticos.",
    iconName: "Code",
    color: "orange",
    subServices: ["Licencias Windows/Office", "Recuperación de Datos", "Soporte Remoto ERP", "Copias de Seguridad"],
    basePrice: 90
  },
  {
    id: 'clima_energia',
    title: "Climatización & Energía Crítica",
    desc: "Mantenimiento de UPS, sistemas de aire acondicionado para servidores y pozos a tierra.",
    iconName: "Wind",
    color: "emerald",
    subServices: ["Limpieza de Aire Acondicionado", "Prueba de Baterías UPS", "Medición Pozo Tierra", "Tableros Eléctricos"],
    basePrice: 180
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'R-9635',
    type: 'Mantenimiento',
    title: 'Mantenimiento Core Switch & Optimización',
    status: 'Reparado',
    priority: 'Normal',
    client: 'Eduardo Araujo',
    clientId: '47583825',
    date: '2026-02-13',
    location: 'Sede Lima Centro',
    estimatedCost: 235.00,
    modality: 'Domicilio',
    technicalReport: {
      techNotes: 'Se detectó que el switch principal requiere cambio de ventiladores y una optimización de firmware urgente para evitar reinicios aleatorios.',
      items: [
        { id: '1', description: 'VENTILADOR CORE SWITCH 40MM', price: 4.00 }
      ],
      laborCost: 4.00,
      priceAdjustment: -20.00,
      adjustmentReason: 'AJUSTE POR PRECIO JUSTO TECHNOVA',
      timestamp: '13/02/2026 14:00'
    },
    assignedTeam: [
      { 
        id: 'TEC-101', name: 'David Flores', level: 2, seniority: 'Senior', specialty: 'CCTV, Alarmas', 
        email: 'david.flores@technova.pe', currentWorkload: 40 
      }
    ],
    history: [{ status: 'Registrado', timestamp: '13/02 10:00', note: 'Reserva vía portal' }]
  }
];
