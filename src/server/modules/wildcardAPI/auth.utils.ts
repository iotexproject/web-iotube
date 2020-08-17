import { WildcardContext } from "./index";
import { verify } from "jsonwebtoken";
import { privateConfig } from "../../../../configs/private";
import { sign } from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
}

export const authUtils = {
  getUser(ctx: WildcardContext) {
    const Authorization = ctx.req.get("Authorization") || ctx.req.cookies["Authorization"];
    if (!Authorization) throw new Error("no Authorization token");
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, privateConfig.JWT_SECRET) as AuthPayload;
    if (!verifiedToken) throw new Error("Authorization falied");
    return verifiedToken;
  },
  signToken({ userId }) {
    return sign({ userId }, privateConfig.JWT_SECRET);
  },
};
