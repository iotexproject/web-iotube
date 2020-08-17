import { authUtils } from "./auth.utils";
import { WildcardContext } from "./index";
import { privateConfig } from '../../../../configs/private';

export const AuthAPI = {
  me: async function () {
    try {
      const { userId } = authUtils.getUser(this as WildcardContext);
      return { ok: true, user: { userId } };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },
  login: async function (userId, password) {
    const ctx = this as WildcardContext;
    const token = authUtils.signToken({ userId: userId });
    ctx.req.res.cookie("Authorization", token, privateConfig.cookieOpts);
    return {
      token,
      user: {
        userId,
        password,
      },
    };
  },
  logout: async function () {
    const ctx = this as WildcardContext;
    ctx.req.res.cookie("Authorization", "", privateConfig.cookieOpts);
  },
};
