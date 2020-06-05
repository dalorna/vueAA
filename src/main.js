// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Built off of https://vuejs-templates.github.io/webpack/

import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Snotify from 'vue-snotify';
// import vuexI18n from 'vuex-i18n';

// Http Request Library
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';

import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import {webAuth} from './auth/index';

import '../styles/custom.scss';
import '../styles/main.scss';
import '../styles/aa-ux-v1.min.css';
import '../styles/snotify/toastr-hr.scss';
import Lang from '../static/resources/lang';

// Show Production Tip if in Development
Vue.config.productionTip === process.env.NODE_ENV !== 'development';

// Setup Axios
Vue.http = Vue.prototype.$http = axios.create({
  baseURL: process.env.MOTOFUZE_API
});

Vue.http.interceptors.request.use(async function (config) {
  const user = await webAuth.getUser();
  if (user && !user.expired) {
    config.headers = {
      'Authorization': store.getters.authToken
    };
    return config;
  } else {
    sessionStorage.setItem('lastRoute', window.location);
    webAuth.signinRedirect();
    return Promise.reject('User Expired');
  }
});

Vue.http.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  let originalRequest = error.config;
  if (error.response.status === 401) {
    return Promise.reject('UNAUTHORIZED');
  }
});

Vue.use(BootstrapVue);
Vue.use(Snotify);
Lang.setLang();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
