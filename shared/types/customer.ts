export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "wholesale" | "retail";
  document?: string;
  address?: string;
  observation?: string;
  createdAt: string;
  updatedAt: string;
}
