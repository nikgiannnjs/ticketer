/// <reference types="vite/client" />

import { JwtPayload as JwtPayloadType } from "jwt-decode";
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "jwt-decode" {
  export interface JwtPayload extends JwtPayloadType {
    isSuperAdmin: boolean;
  }
}
