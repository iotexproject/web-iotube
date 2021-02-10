import { utils } from "../src/common/utils/index";
const { NODE_ENV } = utils.env.getEnv();

const IS_PROD = NODE_ENV == "production";

const { APP_NETWORK_URL, APP_FORTMATIC_KEY, APP_PORTIS_ID, DEFAULT_IOTEX_CHAIN_ID, IOTEX_CORE_ENDPOPINT, IOTX_ETH_PRICE, SENTRY_DSN, FORCE_HTTPS } = utils.env.getEnv();

export const publicConfig = {
  IS_PROD,
  NODE_ENV,
  IOTEX_CORE_ENDPOPINT: IOTEX_CORE_ENDPOPINT || (IS_PROD ? "https://api.iotex.one:443" : "https://api.testnet.iotex.one:443"),
  APP_NETWORK_URL,
  APP_FORTMATIC_KEY,
  APP_PORTIS_ID,
  DEFAULT_IOTEX_CHAIN_ID,
  IOTX_ETH_PRICE,
  SENTRY_DSN: SENTRY_DSN,
  FORCE_HTTPS: utils.env.getBoolean(FORCE_HTTPS),
};
