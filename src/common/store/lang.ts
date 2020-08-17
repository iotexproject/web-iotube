import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";
import en from "../../../public/translations/en.json";
import { Dict } from "../../type";
import axios from "axios";

type Translation = typeof en;

@remotedev({ name: "lang" })
export class LangStore {
  langPath = "/translations";
  @observable lang: string = "en";
  @observable translations: { [key: string]: Translation } = {
    en,
  };
  @computed
  get translation() {
    return this.translations[this.lang];
  }

  initLang() {
    const lang = localStorage.getItem("lang");
    this.setLang(lang || this.lang);
  }

  async setLang(lang: string) {
    await this.loadTranslation(lang);
    localStorage.setItem("lang", lang);
    this.lang = lang;
  }

  async loadTranslation(lang) {
    if (this.translations[lang]) {
      return;
    }
    const res = await axios.get(`${this.langPath}/${lang}.json`);
    if (res.data) {
      this.translations[lang] = res.data;
    }
  }

  t(str: keyof Translation, data?: Dict) {
    let processed = this.translation[str];
    if (!processed) {
      return str;
    }
    if (data) {
      Object.keys(data).forEach((key) => {
        processed = processed.replace(`\${${key}}`, data[key]);
      });
    }

    return processed;
  }
}
