import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";

export const CARD_ERC20_XRC20 = "ERC20-XRC20";
export const CARD_XRC20_ERC20 = "XRC20-ERC20";
@remotedev({ name: "base" })
export class BaseStore {
  @observable NODE_ENV = "";
  @observable mode = CARD_ERC20_XRC20;
  @observable showComplete = false;

  @observable hash = "";
  @observable link = "";
  @observable address = "";
  @observable tokenName = "";
  @observable tokenInfoPair = null;
  @observable amount = "";

  @action.bound
  setMode(mode) {
    this.mode = mode;
  }

  @action.bound
  toggleComplete(hash = "", link = "", address = "", tokenName = "", tokenInfoPair = null, amount = "0") {
    this.showComplete = !this.showComplete;
    this.hash = hash;
    this.link = link;
    this.address = address;
    this.tokenName = tokenName;
    this.tokenInfoPair = tokenInfoPair;
    this.amount = amount;
  }
}
