"use client";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomePanel } from "@/components/settingsPage/panels/homePanel/HomePanel";
import { ResponsiblesPanel } from "@/components/settingsPage/panels/responsiblesPanel/ResponsiblesPanel";
import { UsersPanel } from "@/components/settingsPage/panels/usersPanel/UsersPanel";
import {
  IconHome,
  IconMessageCircle,
  IconShield,
  IconUser,
  IconPaint,
} from "@tabler/icons-react";
import { VariationsPanel } from "@/components/settingsPage/panels/variationsPanel/VariationsPanel";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="rounded-lg shadow-md py-6 p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Configuración</h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-x-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-5 shrink-0">
            <TabsTrigger value="home">
              Home
              <IconHome className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="responsible">
              Responsables
              <IconShield className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="users">
              Usuarios
              <IconUser className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="variations">
              Variaciones
              <IconPaint className="w-4 h-4" />
            </TabsTrigger>
            {/* <TabsTrigger value="contact">
              Contacto
              <IconMessageCircle className="w-4 h-4" />
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="home" className="flex-1 mt-4 overflow-hidden">
            <HomePanel />
          </TabsContent>

          <TabsContent
            value="responsible"
            className="flex-1 mt-4 overflow-auto"
          >
            <ResponsiblesPanel />
          </TabsContent>

          <TabsContent value="users" className="flex-1 mt-4 overflow-auto">
            <UsersPanel />
          </TabsContent>

          <TabsContent value="variations" className="flex-1 mt-4 overflow-auto">
            <VariationsPanel />
          </TabsContent>

          {/* <TabsContent value="contact" className="flex-1 mt-4 overflow-auto">
            <span>Contacto</span>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export { SettingsPage };
