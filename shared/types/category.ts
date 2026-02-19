import { Image } from "./image";

export interface Category {
  id?: number;
  name: string;
  slug: string;
  description: string;
  imageId: number;
  featured: boolean;
  image?: Image;
}
