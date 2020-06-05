import Vue from 'vue';
import VeeValidate from 'vee-validate';
import translationsEn from '../../static/resources/i18n/en';
import translationsDe from '../../static/resources/i18n/de';
import translationsEnBr from '../../static/resources/i18n/en-br';
// import errorde from '../../static/resources/Errors/error-de';
import erroren from '../../static/resources/Errors/error-en';
import vuexI18n from 'vuex-i18n';
import store from '../../src/store';
import assetNameRequired from '../../static/resources/Rules/assetNameRequired';
import assetRequired from '../../static/resources/Rules/assetRequired';
import assigneeRequired from '../../static/resources/Rules/assigneeRequired';
import HrFormTakerRequired from '../../static/resources/Rules/HrFormTakerRequired';
import dataTypeSelected from '../../static/resources/Rules/dataTypeSelected';

export const Lang = {
  setLang: function () {
    Vue.use(vuexI18n.plugin, store);
    Vue.i18n.add('en', translationsEn);
    Vue.i18n.add('de', translationsDe);
    Vue.i18n.add('en-br', translationsEnBr);

    Vue.i18n.set('en');
    VeeValidate.Validator.extend('assetNameRequired', assetNameRequired);
    VeeValidate.Validator.extend('assetRequired', assetRequired);
    VeeValidate.Validator.extend('assigneeRequired', assigneeRequired);
    VeeValidate.Validator.extend('HrFormTakerRequired', HrFormTakerRequired);;
    VeeValidate.Validator.extend('dataTypeSelected', dataTypeSelected);
    Vue.use(VeeValidate, { locale: 'en', dictionary: erroren });

    // if (process.env.NODE_ENV === 'development') {
    //   Vue.i18n.set('de');
    //   Vue.use(VeeValidate, { locale: 'de', dictionary: errorde });
    // } else {
    //   Vue.i18n.set('en');
    //   Vue.use(VeeValidate, { locale: 'en', dictionary: erroren });
    // }
  }
  // Need to be able to set local dictionaries by locale
  // setLangByLang: function (locale) {
  //   Vue.use(vuexI18n.plugin, store);
  //   Vue.i18n.add(locale, translationsEn);
  //   Vue.i18n.set(locale);
  //   Vue.use(VeeValidate, { locale: 'de', dictionary: errorde });
  // }
};
export default Lang;
