import { utils } from "../src/common/utils/index";
const { NODE_ENV } = utils.env.getEnv();

const IS_PROD = NODE_ENV == "production";

const { APP_NETWORK_URL,APP_FORTMATIC_KEY,APP_PORTIS_ID } = utils.env.getEnv();

export const publicConfig = {
  IS_PROD,
  IOTEX_CORE_ENDPOPINT: IS_PROD
    ? "https://api.iotex.one:443"
    : "https://api.testnet.iotex.one:443",
  APP_NETWORK_URL,
  APP_FORTMATIC_KEY,
  APP_PORTIS_ID
};
