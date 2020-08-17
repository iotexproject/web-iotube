import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";

@remotedev({ name: "base" })
export class BaseStore {
  @observable NODE_ENV = "";
}
