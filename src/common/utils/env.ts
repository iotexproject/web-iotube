export class Env {
  isSSR() {
    return typeof window === "undefined";
  }
  onSSR(func) {
    if (this.isSSR()) {
      func();
    }
  }
  isBrowser() {
    return typeof window === "object";
  }
  onBrowser(func) {
    if (this.isBrowser()) {
      func();
    }
  }
  getEnv() {
    if (this.isBrowser()) {
      //@ts-ignore
      return window.__ROOT__STORE__.base;
    }
    if (this.isSSR()) {
      return process.env;
    }
  }

  isIoPayMobile() {
    if (
      this.isBrowser() &&
      // @ts-ignore
      window.__ROOT__STORE__ &&
      // @ts-ignore
      window.__ROOT__STORE__.base
    ) {
      //@ts-ignore
      return Boolean(window.__ROOT__STORE__.base.isIoPayMobile);
    }
    return false;
  }
  getBoolean(val: string | boolean) {
    if (typeof val == "string") {
      return val == "true";
    } else if (typeof val == "boolean") {
      return val;
    }
    return false;
  }
}
