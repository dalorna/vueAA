import Oidc from 'oidc-client';
function whichStorage(){
    if(window && window.process && window.process.type){
        return new Oidc.WebStorageStateStore({ store: window.localStorage})        
    }
    else
    {
        return new Oidc.WebStorageStateStore({store: window.sessionStorage})
    }
}
new Oidc.UserManager({userStore: whichStorage()}).signinRedirectCallback().then(function (user) {
    if(sessionStorage.getItem('lastRoute')){
    window.location = sessionStorage.getItem('lastRoute');
    }
    else
    {        
        window.location = window.location.href
    }    
}).catch(function (e) {
    console.error(e);
});