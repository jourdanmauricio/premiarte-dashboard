import { ChartAreaInteractive } from "@/components/dashboardPage/chart-area-interactive";
import { DataTable } from "@/components/dashboardPage/data-table";

import data from "./data.json";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <ChartAreaInteractive />

      <DataTable data={data} />
    </div>
  );
};

export { DashboardPage };
