import Vue from 'vue'
import Router from 'vue-router'
import Web from '@/views/Web/Web'
import Home from '@/views/Web/Home'

import {webAuth} from '../../src/auth/index.js'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Web',
      component: Web,
      beforeEnter: onChange,
      children: [
        {
            name: 'Home',
            component: Home,
            path: ''          
        }
      ]
    }
  ]
})

function onChange (to, from, next){
  webAuth.getUser().then(function(user){
    if(user && !user.expired){
      webAuth.user.isLoggedIn = true;
      next();
    }
    else{
      webAuth.user.isLoggedIn = false;
      webAuth.login();
    }
  })
}
