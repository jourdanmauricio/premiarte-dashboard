export interface DatabaseBackup {
  id: number;
  createdAt: string;
  status: "success" | "error";
  message: string;
  triggeredBy: "manual" | "scheduled";
}
