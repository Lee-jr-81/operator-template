export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
};

export type CategoryFieldErrors = {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
};
