export const privateConfig = {
  JWT_SECRET: process.env.JWT_SECRET || "TEST",
  cookieOpts: {
    domain: "",
    secure: false,
    httpOnly: true,
    signed: false,
    maxAge: 7 * 24 * 3600 * 1000,
  },
};
