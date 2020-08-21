import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";
import { utils } from "../utils/index";
import { AntennaUtils } from "../utils/antenna";

@remotedev({ name: "wallet" })
export class WalletStore {
  @observable walletAddress = "";
  @observable walletBalance = 100;
  @observable token = "IOTX";
  @observable walletConnected = false;

  @observable metaMaskConnected = false;

  @observable enableConnect = false;
  @action.bound
  async init() {
    this.initEvent();
    await this.initWS();
    await this.loadAccount();
  }

  initEvent() {
    utils.eventBus
      .on("client.iopay.connected", () => {
        this.walletConnected = true;
        console.log("iopay-desktop connected.");
      })
      .on("client.iopay.close", () => {
        this.walletConnected = false;
      });
  }

  @action.bound
  async initWS() {
    const [err, accounts] = await utils.helper.promise.runAsync(
      AntennaUtils.getAccounts()
    );
    if (err || !accounts.length) {
      if (this.enableConnect) {
        setTimeout(() => {
          this.initWS();
        }, 5000);
      }
      return;
    }

    this.walletAddress = accounts[0].address;
  }

  @action.bound
  async loadAccount() {
    if (!this.walletAddress) return;
    const data = await AntennaUtils.getAntenna().iotx.getAccount({
      address: this.walletAddress,
    });
    if (data?.accountMeta) {
      const { balance } = data?.accountMeta;
      this.walletBalance = Number(balance);
    }
  }

  @action.bound
  setMetaMaskConnected() {
    this.metaMaskConnected = true;
  }
}
