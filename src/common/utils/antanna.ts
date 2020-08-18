import Antenna from "iotex-antenna";
import { WsSignerPlugin } from "./ws-plugin";
import { utils } from "./index";
import { publicConfig } from "../../../configs/public";
import { _ } from "./lodash";

export class AntennaUtils {
  public static defaultContractOptions = {
    gasLimit: "20000000",
    gasPrice: "1000000000000",
  };
  public static antenna: Antenna | null = null;
  public static wsSigner: WsSignerPlugin = new WsSignerPlugin({
    options: {
      packMessage: (data) => JSON.stringify(data),
      //@ts-ignore
      unpackMessage: (data) => JSON.parse(data),
      attachRequestId: (data, requestId) =>
        Object.assign({ reqId: requestId }, data),
      extractRequestId: (data) => data && data.reqId,
    },
  });

  static getAntenna(): Antenna {
    if (this.antenna) {
      return this.antenna;
    }
    if (utils.env.isBrowser()) {
      const antenna = new Antenna(publicConfig.IOTEX_CORE_ENDPOPINT, {
        signer: this.wsSigner.start(),
      });
      //@ts-ignore
      this.antenna = antenna;
      return antenna;
    }
    if (utils.env.isSSR()) {
      const antenna = new Antenna(publicConfig.IOTEX_CORE_ENDPOPINT);
      //@ts-ignore
      this.antenna = antenna;
      return antenna;
    }
  }
}
