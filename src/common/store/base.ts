import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";

export const CARD_ERC20_XRC20 = "ERC20-XRC20";
export const CARD_XRC20_ERC20 = "XRC20-ERC20";
@remotedev({ name: "base" })
export class BaseStore {
  @observable NODE_ENV = "";
  @observable mode = CARD_ERC20_XRC20;
  @observable showComplete = false;

  @action.bound
  setMode(mode) {
    this.mode = mode;
  }

  @action.bound
  toggleComplete() {
    this.showComplete = !this.showComplete;
  }
}
