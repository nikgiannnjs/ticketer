import { JwtPayload as JwtPayloadType } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload extends JwtPayloadType {
    email: string;
  }
}
