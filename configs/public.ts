import { utils } from "../src/common/utils/index";
const { NODE_ENV } = utils.env.getEnv();

const IS_PROD = NODE_ENV == "production";

const {
  APP_NETWORK_URL,
  APP_FORTMATIC_KEY,
  APP_PORTIS_ID,
  CASHIER_CONTRACT_ADDRESS_1, // MAINNET
  CASHIER_CONTRACT_ADDRESS_3, // ROSPTEN
  SENTRY_DSN,
} = utils.env.getEnv();

export const publicConfig = {
  IS_PROD,
  NODE_ENV,
  IOTEX_CORE_ENDPOPINT: IS_PROD
    ? "https://api.iotex.one:443"
    : "https://api.testnet.iotex.one:443",
  APP_NETWORK_URL,
  APP_FORTMATIC_KEY,
  APP_PORTIS_ID,
  CASHIER_CONTRACT_ADDRESS_1,
  CASHIER_CONTRACT_ADDRESS_3,
  SENTRY_DSN:
    SENTRY_DSN ||
    "https://89e3100998d54964b65a16ada1edeabc@sentry.gcap1.iotex.io/3",
};
