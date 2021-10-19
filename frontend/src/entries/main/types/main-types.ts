import { mainStore } from "t9redux/main";

export type LandingLoaded = boolean;

export type MainStoreStateInterface = typeof mainStore.getState;

type MainThunkInterface = (dispatch: DispatchInterface, getState: MainStoreStateInterface) => void;

export type DispatchInterface =
  (action: { type: string, payload?: object } | MainThunkInterface) => void;

export interface Image {
  url: string;
}

export interface Filter {
  key?: string;
  name: string;
  checked?: boolean;
}

export interface Slide {
  image: Image;
}

export type Category = Filter;

export interface Topic {
  actionLink: string;
  actionText: string;
  description: string;
  image: Image;
  title: string;
}

export interface Collection {
  glasses: Glasses[];
  title: string;
}

export type Lense = Filter;

export type Shape = Filter;

export type Brand = Filter;

export interface Glasses {
  thumbnail: Image;
  price?: number;
  id: string;

  brand: {
    name: string;
  };
  name: string;
  images: Array<{ image: Image }>;

  categories?: Category[];
  code?: string;
  lenses?: Lense[];
  shapes?: Shape[];
}
