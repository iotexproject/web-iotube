import { observable, action, computed } from 'mobx';
import remotedev from 'mobx-remotedev';

@remotedev({ name: 'wallet' })
export class WalletStore {
  @observable walletAddress = 'io1s6mfntw5882yeus2m88lqkmykythjnecr7dd9z';
  @observable walletBalance = 100;
  @observable token = 'IOTX';
  @observable walletConnected = false;

  @action.bound
  connectWallet() {
    this.walletConnected = true;
  }

  @action.bound
  disconnectWallet() {
    this.walletConnected = false;
  }
}
