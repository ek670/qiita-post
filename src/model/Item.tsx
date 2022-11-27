export type item = {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  stocks_count: number;
  updated_at: string;
  page_views_count: string;
  user: {
    id: string;
    name: string;
    profile_image_url: string;
    organization: string;
  };
  tags: { name: string }[];
};
