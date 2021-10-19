export type Status = "idle" | "active";

export type LoadingStatus = "loading" | "loaded" | "not-loaded";

interface URLV2 {
  exact?: boolean;
  is: string;
  type?: "404" | "302" | "2xx";
}

export interface LazyComponent {
  component: () => JSX.Element;
  import: () => Promise<{ default: any }>;
  status: LoadingStatus;
  transition?: {
    key: () => string;
    level: number;
  };
  protected?: {
    isAccessible: () => boolean;
    redirectTo: string;
  };
  url: URLV2;
  operationName?: string;
}

export type operationStatus = "pending" | "done" | "not-called";

export interface LazyOperation {
  status: operationStatus;
  actions: Array<(cb?: OpsCB) => void>;
  repeatable?: boolean;
  url: URLV2;
  operationName?: string;
}

export interface Err {
  code?: string;
  message: string;
}

export type OpsCB = (err?: Err) => void;
