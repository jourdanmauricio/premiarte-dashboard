export interface Image {
  id?: number;
  url: string;
  alt: string;
  tag: string;
  publicId: string;
}

export interface CreateImageData {
  alt: string;
  tag?: string;
  observation?: string;
}
