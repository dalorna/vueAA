import { webAuth } from '../auth/index';
import store from '../store'

export default class ManagementApiClient {
    constructor(){}
    transformOptions(options) {
      return new Promise(async (resolve, reject) =>{
        let user = await webAuth.getUser();
        if(user && !user.expired){
          options.headers["Authorization"] = 'Bearer ' + user.access_token;
          options.headers["Tenant"] = JSON.stringify(store.getters.HrScopeInView);
          options.headers["ClientId"] = '00000000-0000-0000-0000-000000000000' ;
          options.headers["EncryptionToken"] = store.getters.EncryptionToken;

           resolve(options);
        }
        else {
          sessionStorage.setItem('lastRoute', window.location);
          webAuth.signinRedirect();
          reject('User Expired')
        }
      });
    }
    getBaseUrl(value){
       return process.env.PANDOHR_API_BASEURL;
    }
  }
