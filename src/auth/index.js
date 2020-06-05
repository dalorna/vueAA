import Oidc from 'oidc-client'
import axios from 'axios'
import store from '../store/index'

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.ERROR;

var config = {
  authority: process.env.SSO_AUTHORITY,
  client_id: process.env.CLIENT,
  redirect_uri: getRedirectURI(),
  response_type: "id_token token",
  scope: "openid profile email address roles all_claims aauser roles",
  post_logout_redirect_uri: getPostLogoutRedirectURI(),
  userStore: whichStorage(),
  redirect_uri: getRedirectURI(),
  silent_redirect_uri: getSilentRedirectURI(),
  automaticSilentRenew: true
}

var encryptedConfig = {
  authority: process.env.SSO_AUTHORITY,
  client_id: process.env.CLIENT,
  redirect_uri: getRedirectURI(),
  response_type: "id_token token",
  scope: "openid profile email address roles all_claims aauser roles",
  post_logout_redirect_uri: getPostLogoutRedirectURI(),
  userStore: whichStorage(),
  silent_redirect_uri: getSilentRedirectURI(),
  automaticSilentRenew: false
}

export var webAuth = new Oidc.UserManager(config)

webAuth.user = {}
webAuth.user.isLoggedIn = false;

webAuth.login = function () {
  return new Promise((resolve,reject)=>{
    webAuth.getUser().then(function (user) {
      if (user && !user.expired) {
        webAuth.getAAToken(user).then(function (result) {
          store.dispatch('storeOIDCUser', result.data)
          webAuth.user.isLoggedIn = true;
          
          resolve(result.data);
        })
      } else {
        webAuth.user.isLoggedIn = false;
        sessionStorage.setItem('lastRoute', window.location)
        webAuth.signinRedirect();
        reject();
      }
    })
  })
}

webAuth.logout = function (){
    webAuth.user.isLoggedIn = false;
    webAuth.signoutRedirect();
}

webAuth.getAAToken = function (user) {
  return new Promise((resolve, reject) => {
    if (user && !user.expired) {
      resolve(axios.get(process.env.MOTOFUZE_API + '/account/ObtainLocalAccessToken?provider=sso&externalAccessToken=' + user.access_token))
    } else {
      reject({
        message: 'Error obtaining local access token',
        user: user
      })
    }
  })
}
//Start Secondary Token for Encrypted Fields
export var Encryption = new Oidc.UserManager(encryptedConfig)

Encryption.user = {}
Encryption.user.isLoggedIn = false;


Encryption.login = function (password) {
  return new Promise((resolve,rejct)=>{
    Encryption.getUser().then(function (user) {
      if (user && !user.expired) {
        webAuth.getAAToken(user).then(function (result) {
          Encryption.user.isLoggedIn = true;
          Encryption.getTokenForEncryption(result, password).then(function (r) {
            store.dispatch('storeEncryptionToken', r.data);
            resolve(r.data);
            return r;
          })
        });
      } else {
        Encryption.user.isLoggedIn = false;
        sessionStorage.setItem('lastRoute', window.location)
        Encryption.signinRedirect();
        reject();
      }
    })
  })
}

Encryption.logout = function (){
  Encryption.user.isLoggedIn = false;
  Encryption.signoutRedirect();
}

Encryption.getTokenForEncryption = function (user, password) {
  return new Promise((resolve, reject) => {
    if (user && !user.expired) {
      var data =  {'password': password}
      resolve(axios.post(process.env.MOTOFUZE_API + '/account/getTokenForEncryption', data, {headers: {Authorization: 'Bearer ' + user.data.access_token}}))
    } else {
      reject({
        message: 'Error obtaining local access token',
        user: user
      })
    }
  })
}
//End Secondary Token for Encrypted Fields

webAuth.events.addAccessTokenExpired(function () {
  sessionStorage.setItem('lastRoute', window.location)
  webAuth.signinRedirect();
})

webAuth.events.addUserLoaded(function (user) {
  //console.log('USER LOADED')
  webAuth.getAAToken(user).then(function (result) {
    store.dispatch('storeAuthToken', result.data.access_token).then(function (data) {})
  }).catch(function (error) {

  })
})


function getRedirectURI() {
  if (window.location.port) {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/callback.html'
  } else {
    return window.location.protocol + '//' + window.location.hostname + '/callback.html'
  }
}

function getPostLogoutRedirectURI() {
  if (window.location.port) {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
  } else {
    return window.location.protocol + '//' + window.location.hostname
  }
}

function getSilentRedirectURI() {
  if (window.location.port) {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/silent.html'
  } else {
    return window.location.protocol + '//' + window.location.hostname + '/silent.html'
  }
}



function whichStorage() {
  if (window && window.process && window.process.type) {
    return new Oidc.WebStorageStateStore({
      store: window.localStorage
    })
  } else {
    return new Oidc.WebStorageStateStore({
      store: window.sessionStorage
    })
  }
}
