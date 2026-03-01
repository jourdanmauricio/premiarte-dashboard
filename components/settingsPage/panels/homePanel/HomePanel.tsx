import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import { useGetImages } from "@/hooks/use-media";
import { useGetSettings, useUpdateSettings } from "@/hooks/use-settings";
import { SettingsFormSchema } from "@/shared/schemas";
import { useEffect } from "react";
import { toast } from "sonner";
import { Settings, UpdateSettingsData } from "@/shared/types";
import { Separator } from "@/components/ui/separator";
import { MenuPanel } from "./menu-panel/MenuPanel";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { Button } from "@/components/ui/button";
import { SliderPanel } from "@/components/settingsPage/panels/homePanel/slider-panel/SliderPanel";
import HeroPanel from "@/components/settingsPage/panels/homePanel/hero-panel/HeroPanel";
import { FeaturedProductsPanel } from "@/components/settingsPage/panels/homePanel/products-panel/FeatuedProductsPanel";
import ServicesPanel from "@/components/settingsPage/panels/homePanel/services-panel/servicesPanel";
import { FeaturedCategoriesPanel } from "@/components/settingsPage/panels/homePanel/categories-panel/FeaturedCategoriesPanel";
import TestimonialsPanel from "@/components/settingsPage/panels/homePanel/testimonials-panel/TestimonialsPanel";
import { FooterPanel } from "@/components/settingsPage/panels/homePanel/footer-panel/FooterPanel";
import { LoaderIcon } from "lucide-react";

const HomePanel = () => {
  const { data: settingsData, isLoading: isLoadingSettings } = useGetSettings();
  const homeSetting = settingsData?.find((s: Settings) => s.key === "home");
  const homeSettingId = homeSetting ? String(homeSetting.id) : null;
  const { mutate: updateSettings, isPending: isUpdatingSettings } =
    useUpdateSettings();
  const { data: images } = useGetImages();

  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      home: {
        menu: {
          siteName: "",
          logoId: 0,
        },
        slider: [],
        hero: {
          logoId: 0,
          imageId: 0,
          title: "",
          text: "",
          buttonText: "",
          buttonLink: "",
        },
        featuredProducts: {
          title: "",
          text: "",
          buttonText: "",
          buttonLink: "",
        },
        services: {
          title: "",
          subtitle: "",
          services: [],
        },
        testimonials: {
          title: "",
          testimonials: [],
        },
        featuredCategories: {
          title: "",
          text: "",
          buttonText: "",
          buttonLink: "",
        },
        footer: {
          siteName: "",
          logoId: 0,
          siteText: "",
          socialLinks: [],
          siteAbout: "",
          siteAboutDescription: "",
          siteAddress: "",
          siteCity: "",
          sitePhone: "",
          siteEmail: "",
        },
      },
    },
  });

  useEffect(() => {
    if (settingsData) {
      const setting = settingsData.find((s: Settings) => s.key === "home");
      if (setting) {
        try {
          const homeConfig = JSON.parse(setting.value);
          form.reset({
            home: homeConfig,
          });
        } catch (error) {
          console.error("Error parsing home config:", error);
        }
      }
    }
  }, [settingsData, form]);

  const onSubmit = (data: z.infer<typeof SettingsFormSchema>) => {
    const id = homeSettingId;
    if (!id) {
      toast.error(
        "No se encontró la configuración 'home'. Cárgala desde la API primero.",
      );
      return;
    }
    updateSettings({
      id,
      sectionData: data.home as UpdateSettingsData,
    });
  };

  const onError = () => console.log("errors", form.formState.errors);

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-full mt-10">
        <LoaderIcon className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <MenuPanel form={form} images={images || []} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <SliderPanel form={form} images={images || []} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <HeroPanel form={form} images={images || []} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <FeaturedProductsPanel form={form} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <ServicesPanel form={form} images={images || []} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <FeaturedCategoriesPanel form={form} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <TestimonialsPanel form={form} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <FooterPanel form={form} images={images || []} />

          <Separator
            className="my-4 border border-primary/50"
            orientation="horizontal"
          />

          <div className="flex justify-end gap-2 mt-12">
            <Button type="button" className="min-w-[150px]" variant="outline">
              Cancelar
            </Button>
            <SubmitButton
              text="Guardar"
              className="min-w-[150px]"
              isLoading={isUpdatingSettings}
              disabled={false}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export { HomePanel };
