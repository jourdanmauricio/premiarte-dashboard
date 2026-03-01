import z from "zod";

const HomeMenuSchema = z.object({
  siteName: z.string().min(1, { message: "Nombre del sitio requerido" }),
  logoId: z.number().min(1, { message: "ID del logo requerido" }),
});

const HomeSliderSchema = z.object({
  image: z.number().min(1, { message: "ID de imagen requerido" }),
  title: z.string().min(1, { message: "Título requerido" }),
  recommended: z.boolean(),
  text: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
});

const HomeHeroSchema = z.object({
  imageId: z.number().min(1, { message: "ID de imagen requerido" }),
  title: z.string().min(1, { message: "Título requerido" }),
  text: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  logoId: z.number().min(1, { message: "ID de imagen requerido" }),
});

const HomeFeaturedProductsSchema = z.object({
  title: z.string().min(1, { message: "Título requerido" }),
  text: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
});

const HomeSettingsSchema = z.object({
  menu: HomeMenuSchema,
  slider: z.array(HomeSliderSchema),
  hero: HomeHeroSchema,
  featuredProducts: HomeFeaturedProductsSchema,
  testimonials: z.object({
    title: z.string().min(1, { message: "Título requerido" }),
    testimonials: z.array(
      z.object({
        name: z.string().min(1, { message: "Nombre requerido" }),
        rating: z.string().min(1, { message: "Puntuación requerida" }),
        description: z.string().min(1, { message: "Descripción requerida" }),
      }),
    ),
  }),
  services: z.object({
    title: z.string().min(1, { message: "Título requerido" }),
    subtitle: z.string().optional(),
    services: z.array(
      z.object({
        title: z.string().min(1, { message: "Título requerido" }),
        description: z.string().min(1, { message: "Descripción requerida" }),
        image: z.number().min(1, { message: "Imagen requerida" }),
      }),
    ),
  }),
  featuredCategories: z.object({
    title: z.string().min(1, { message: "Título requerido" }),
    text: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
  }),
  footer: z.object({
    siteName: z.string().optional(),
    logoId: z.number().optional(),
    siteText: z.string().optional(),
    socialLinks: z.array(
      z.object({
        href: z.string().optional(),
        label: z.string().optional(),
        image: z.number().optional(),
      }),
    ),
    siteAbout: z.string().optional(),
    siteAboutDescription: z.string().optional(),
    siteAddress: z.string().optional(),
    siteCity: z.string().optional(),
    sitePhone: z.string().optional(),
    siteEmail: z.string().optional(),
  }),
});

export const SettingsFormSchema = z.object({
  home: HomeSettingsSchema,
});

export const SocialLinkFormSchema = z.object({
  // name: z.string().min(1, { message: "Nombre requerido" }),
  href: z.string().min(1, { message: "Enlace requerido" }),
  label: z.string().min(1, { message: "Etiqueta requerida" }),
  image: z.number().min(1, { message: "Imagen requerida" }),
});
