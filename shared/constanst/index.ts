import {
  IconDashboard,
  IconUserCircle,
  IconSearch,
  IconHelp,
  IconDatabase,
  IconFileWord,
  IconReport,
  IconSettings,
  IconUsers,
  IconCoins,
  IconCashBanknote,
  IconCategory,
  IconPackages,
  IconFileInvoice,
  IconShield,
  IconMessageCircle,
  IconMail,
} from "@tabler/icons-react";

export const menuItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: IconUserCircle,
    },
    {
      title: "Responsables",
      url: "/dashboard/responsibles",
      icon: IconShield,
    },
    {
      title: "Contactos",
      url: "/dashboard/contacts",
      icon: IconMessageCircle,
    },
    {
      title: "Newsletters",
      url: "/dashboard/newsletters",
      icon: IconMail,
    },
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: IconUsers,
    },
    {
      title: "Categorías",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
    {
      title: "Productos",
      url: "/dashboard/products",
      icon: IconPackages,
    },
    {
      title: "Presupuestos",
      url: "/dashboard/budgets",
      icon: IconFileInvoice,
    },
    {
      title: "Pedidos",
      url: "/dashboard/orders",
      icon: IconCoins,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Asistente de Word",
      url: "/dashboard/word-assistant",
      icon: IconFileWord,
    },
    {
      name: "Base de datos",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reportes",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Indicadores BCRA",
      url: "/dashboard/bcra",
      icon: IconCashBanknote,
    },
  ],
};

export const budgetStatusList = [
  {
    id: "pending",
    description: "Pendiente",
  },
  {
    id: "sent",
    description: "Enviado",
  },
  {
    id: "approved",
    description: "Aprobado",
  },
  {
    id: "closed",
    description: "Cerrado",
  },
];

export const customerTypeList = [
  { id: "wholesale", description: "Mayorista" },
  { id: "retail", description: "Minorista" },
];

export const operationsList = [
  { id: "add", description: "Incrementar" },
  { id: "subtract", description: "Decrementar" },
];

export const imageTagsList = [
  { id: "Todas", description: "Todas" },
  { id: "Categorías", description: "Categorías" },
  { id: "Productos", description: "Productos" },
  { id: "Páginas", description: "Páginas" },
  { id: "Otros", description: "Otros" },
];

export const orderStatusList = [
  { id: "pending", description: "Pendiente" },
  { id: "delivered", description: "Entregado" },
  { id: "cancelled", description: "Cancelado" },
];
