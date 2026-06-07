export interface StoreHours {
  day: string;
  open: string | null;
  close: string | null;
  closed: boolean;
}

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  ariaLabel: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  phone: string;
  email: string;
  mapEmbedUrl: string;
  directionsUrl: string;
}

export interface MetaInfo {
  title: string;
  description: string;
  url: string;
  ogImage: string;
}
