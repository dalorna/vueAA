import Vue from 'vue';
import {
  UserAvailability
} from '@/lib/utilities/enums';
import router from '../../router'
import enums from '../../utilities/enums'
import {hashCode} from '../../utilities/custom'
import { PersonaClient, TenantClient } from '../ManagementAPI'

function initialState() {
  return {
    OIDCUser: {},
    EncryptionToken: "",
    User: {},
    sideNavCollapsed: false,
    showAvailModal: false,
    availabilityReasons: [],
    IsClockingIn: false,
    GlobalFrameBadges: {
      Inbox: 0,
      Messages: 0,
      Processes: 0
    },
    menuSelection: "onboarding",
    user: {}, //For employee search
    HrStores: [],
    selectedStores: [],
    currentSelectedAccount: {},
    hasHrGlobalAccess: false,
    hasHrAccountAccess: false,
    hasHrChecklistAccess: false,
    HrScopeInView: {},
    ContextReference: [],
    ContextAccount: {},
    ErrorFromAPI: {},
    getErrorMessage(methodName, val){
      let retMessage = '';
      if(val){
        if(val.message){
          retMessage = val.message
        } else if (val.messages && val.messages.length > 0){
          retMessage = val.messages[0].message;
        } else {
          retMessage = val;
        }
        if(retMessage.length > 20){
          retMessage = retMessage.substr(0, 20) + '\r\n' + retMessage.substr(20);
        }
        retMessage = methodName + '\r\n' + retMessage;
      }
      return retMessage;
    }
  }
}

const state = initialState()

const getters = {
  authToken: function (state) {
    // console.log('JUST AKSED FOR AUTH TOKEN', state.OIDCUser.access_token)
    return 'bearer ' + state.OIDCUser.access_token
  },
  OIDCUser: function () {
    return state.OIDCUser
  },
  EncryptionToken: function () {
    return state.EncryptionToken
  },
  User: function (state) {
    return state.User
  },
  sideNavCollapsed: function (state) {
    return state.sideNavCollapsed
  },
  showAvailModal(state) {
    return state.showAvailModal;
  },
  availabilityReasons(state) {
    return state.availabilityReasons;
  },
  IsClockingIn(state) {
    return state.IsClockingIn;
  },
  GlobalFrameBadges(state) {
    return state.GlobalFrameBadges;
  },
  menuSelection(state) {
    return state.menuSelection;
  },
  IsPluginView(state) {
    // console.log("Router: ", router.history.current);
    return (router.history.current.fullPath.indexOf('plugin') >= 0);
    //return location.href.indexOf("plugin") >= 0;
  },
  user: function (state) {
    return state.user;
  },
  HrStores: function (state) {
    return state.HrStores;
  },
  selectedStores: function (state) {
    return state.selectedStores;
  },
  hasHrGlobalAccess: function (state) {
    return state.hasHrGlobalAccess;
  },
  hasHrAccountAccess: function (state) {
    return state.hasHrAccountAccess;
  },
  hasHrChecklistAccess: function (state) {
    return state.hasHrChecklistAccess;
  },
  HrScopeInView: function (state){
    return state.HrScopeInView;
  },
  ContextReference: function (state) {
    return state.ContextReference;
  },
  ContextAccount: function (state) {
    return state.ContextAccount;
  },
  ErrorFromAPI: function (state) {
    return state.ErrorFromAPI;
  }
}

const actions = {
  storeOIDCUser: function (context, val) {
    return new Promise((resolve, reject) => {
      context.commit('storeOIDCUser', val)
      resolve();
    })
  },
  storeEncryptionToken: function (context, val) {
    return new Promise((resolve, reject) => {
      context.commit('storeEncryptionToken', val)
      resolve();
    })
  },
  setCurrentUser: function (context, val) {
    return new Promise((resolve, reject) => {
      context.commit('setCurrentUser', val);
      context.commit('setUser', val);
      // context.dispatch('loadAppBundle');
      resolve();
    })
  },
  setStoreAccess: function (context, user) {
    // Get user HR permissions.
    if (user.Permissions && user.Permissions.length > 0) {
      context.commit('hasHrChecklistAccess', user.Permissions.indexOf('system.hr.checklist.admin') > 0);
      context.commit('hasHrAccountAccess', user.Permissions.indexOf('system.hr.account.checklist.admin') > 0);
      context.commit('hasHrGlobalAccess', user.Permissions.indexOf('system.hr.global.checklist.admin') > 0);
    }

    // Set HR store list that huser has access
    let selectedStoresList = [];
    const selectedStores = user.ViewSelectedStores;
    selectedStores.forEach(function(val, i, selectedStores) {
      selectedStoresList.push({ AccountPlatformID: selectedStores[i].AccountPlatformID, name: selectedStores[i].Name })
    });

    return new Promise((resolve, reject) => {
      const accountId = user.ViewAccountID
      let params = "accountId=" + accountId;
      params += "&platformId=0";
      params += "&productId=20"; // 20-HR Module
      params += "&productStatusId=2"; // 2 - Active
      Vue.http.get('/products?' + params).then(function (data) {
        let stores = [];
        if(state.hasHrAccountAccess || state.hasHrGlobalAccess){
          stores.push({ AccountPlatformID: user.ViewAccountID, name: user.ViewAccount + ' - Account', level: 'Account' });
          if(state.hasHrGlobalAccess){
            context.commit('addGlobalHrStore');
          }
        }
        const platforms = data.data.Data;
        platforms.forEach(function(val, i, platforms) {
          let store = { AccountPlatformID: platforms[i].AccountPlatformID, name: platforms[i].AccountPlatform, level: 'Store'};
          const features = platforms[i].Features;
          features.forEach(function(val2, i2, features) {
            if (features[i2].FeatureName === "HR" && features[i2].Active && selectedStoresList.find(f => f.AccountPlatformID === store.AccountPlatformID)) {
              stores.push(store);
            }
          });
        });

        if(state.hasHrChecklistAccess && !state.hasHrGlobalAccess && !state.hasHrAccountAccess && stores.length > 1){
          //Sets the default Store...
          let firstStoreIndex = stores.findIndex(i => i.AccountPlatformID === user.AccountPlatformID);
          let firstStore = stores.find(i => i.AccountPlatformID === user.AccountPlatformID);
          stores.splice(firstStoreIndex, 1);
          stores.unshift(firstStore);
        }

        context.commit('selectedStores', selectedStoresList);
        context.commit('HrStores', stores);
        resolve(data);
      }).catch(function (data) {
        reject(data);
      })
    })
  },
  setChecklistGlobalAdmin: function(context, val) {
    context.commit('hasHrGlobalAccess', val)
  },
  setChecklistAccountAdmin: function(context, val) {
    context.commit('hasHrAccountAccess', val)
  },
  setChecklistAdmin: function(context, val) {
    context.commit('hasHrChecklistAccess', val)
  },
  toggleSideNav: function (context, val) {
    return new Promise((resolve, reject) => {
      context.commit('toggleSideNav', val)
      resolve();
    })
  },
  toggleAvailModal(context, val) {
    context.commit('toggleAvailModal', val)
  },
  userUpdated: function (context, val) {
    return new Promise((resolve, reject) => {
      if (val.Id == context.getters.User.Id) {
        context.commit('userUpdated', val)
      }
      resolve();
    })
  },
  handleUserFavoriteResponse: function (context, data) {
    context.commit('handleUserFavoriteResponse', data);
  },
  getAvailabilityReasons(context, val) {
    return new Promise((resolve, reject) => {
      if (context.getters.availabilityReasons.length === 0) {
        Vue.http('/users/availabilityreasons').then(function (data) {
          context.commit('getAvailabilityReasons', data.data.Data)
          resolve();
        }).catch(function () {})
      }
      resolve();
    })
  },
  putAvailability(context, val) {
    return new Promise((resolve, reject) => {
      var reason = val.Reason;
      var availability = val.Availability;
      if (availability === UserAvailability.Available) {
        context.dispatch('clockin').then(function (data) {
          resolve(data.data.Data)
        })
      } else if (availability === UserAvailability.Busy) {
        Vue.http.put('/users/busy/' + reason.time, {
          AvailabilityReasonId: reason.id,
          Notes: reason.reason
        }).then(function (data) {
          resolve(data.data.Data)
        })
      } else if (availability === UserAvailability.NotAvailable) {
        Vue.http.put('/users/clockout').then(function (data) {
          resolve(data.data.Data)
        })
      }
    })
  },
  clockin(context, val) {
    context.commit('updateClockInSpinner', true);
    return new Promise((resolve, reject) => {
      Vue.http.put('/users/clockin').then(function (data) {
        context.commit('updateClockInSpinner', false);
        resolve(data);
      }).catch(function (data) {
        context.commit('updateClockInSpinner', false);
        reject(data);
      })
    })
  },
  loadAppBundle(context) {
    Vue.http.get('users/appbundle')
      .then(function (resp) {
        if (resp.data && resp.data.Data)
          context.dispatch('updateGlobalFrameBadges', resp.data.Data);
      })
      .catch(function (resp) {})
  },
  updateGlobalFrameBadges(context, data) {
    context.commit('updateGlobalFrameBadges', data);
  },
  setMenuSelection(context, view) {
    context.commit('setMenuSelection', view);
  },
  user: function (state) {
    return state.user; //For employee search
  },
  setSelectedScopeInView  (context, store) {
    context.commit('setScopeInView', store);
  },
  removeGlobalHrStore(context){
    context.commit('removeGlobalHrStore');
  },
  addGlobalHrStore(context){
    context.commit('addGlobalHrStore');
  },
  getReferenceContext(context){
    return new Promise(async(resolve, reject) => {
      let client = new TenantClient();
      resolve(await client.getUserTenants().then((r) => {
        // let thing = JSON.parse('{"data":[{"key":"8919","name":"AutoAlert Irvine - AAIRV","referenceType":3,"id":"e28d67a3-5583-d065-4445-fc66079fac27","createdDate":"2018-10-09T11:28:08.506406+00:00","lastUpdatedDate":"2018-10-09T11:28:08.506406+00:00","createdUserId":"dataload_accountplatform","lastUpdatedUserId":"dataload_accountplatform"},{"key":"8918","name":"AutoAlert Boston - AABOS","referenceType":3,"id":"38cf8678-335a-21d3-02af-40083aaf00ac","createdDate":"2018-10-09T11:28:08.506406+00:00","lastUpdatedDate":"2018-10-09T11:28:08.506406+00:00","createdUserId":"dataload_accountplatform","lastUpdatedUserId":"dataload_accountplatform"},{"key":"1090","name":"AutoAlert KC - AAKC","referenceType":3,"id":"93b6126e-0c80-474d-4815-27f4fa32c3f4","createdDate":"2018-10-09T11:28:08.506406+00:00","lastUpdatedDate":"2018-10-09T11:28:08.506406+00:00","createdUserId":"dataload_accountplatform","lastUpdatedUserId":"dataload_accountplatform"},{"key":"1","name":"MotoFuze.com","referenceType":4,"id":"64d3ad7a-892d-9c0c-21be-709d74e1f6fe","createdDate":"2018-10-09T11:27:59.890312+00:00","lastUpdatedDate":"2018-10-09T11:27:59.890312+00:00","createdUserId":"dataload_account","lastUpdatedUserId":"dataload_account"}],"errorMessages":[],"statusCode":200,"successful":true}'); 
        context.commit('setReferenceContext', r.data);
        // context.commit('setReferenceContext', thing.data);
      }, err => reject(err)));
    });
  },
  addErrorFromAPI(context, error){
    context.commit('setErrorFromAPI', error);
  }
}

const mutations = {
  storeOIDCUser: function (state, OIDCUser) {
    state.OIDCUser = Object.assign({}, OIDCUser)
  },
  storeEncryptionToken: function (state, OIDCUser) {
    state.EncryptionToken = Object.assign({}, OIDCUser)
  },
  setCurrentUser: function (state, User) {
    state.User = Object.assign({}, User)
  },
  toggleSideNav: function (state, sideNavVal) {
    state.sideNavCollapsed = sideNavVal;
  },
  toggleAvailModal(state, val) {
    state.showAvailModal = val;
  },
  userUpdated: function (state, updatedUser) {
    if (state.User.Id === updatedUser.Id) {
      console.log("Updated user: ", updatedUser);
      let isFavorite = state.User.IsFavorite;
      for (var prop in updatedUser) {
        try {
          state.User[prop] = updatedUser[prop];
        } catch (err) {
          console.log('Error copying property');
        }
      }
      state.User.IsFavorite = isFavorite;
    }
  },
  handleUserFavoriteResponse: function (state, updatedUser) {
    if (state.User.Id === updatedUser.Id) {
      state.User.IsFavorite = updatedUser.IsFavorite;
    }
  },
  getAvailabilityReasons(state, val) {
    state.availabilityReasons = val;
  },
  updateClockInSpinner(state, val) {
    state.IsClockingIn = val;
  },
  updateGlobalFrameBadges(state, data) {
    //Ignore updates which do not contain this property
    if (!data || (typeof data.TotalBadgeCount === 'undefined') || data.TotalBadgeCount < 0)
      return;

    state.GlobalFrameBadges.Inbox = data.TotalBadgeCount;
    state.GlobalFrameBadges.Messages = data.TotalMessageCount;
    state.GlobalFrameBadges.Processes = data.TotalRequestCount;
  },
  setMenuSelection(state, view) {
    state.menuSelection = view;
  },
  setUser(state, val) {
    if (!val || !val.Id)
      return

    var randomInt = Math.abs(hashCode(val.Name)) % enums.Colors.length
    //These will be used for users with no avatar
    var color = enums.Colors[randomInt]
    val.AvatarBGColor = color || enums.Colors[0]

    //Find what products the user's account has (if the user account is approved)
    val.HasPandoLite = val && val.IsApproved && ((val.FeatureFlags & enums.FeatureFlags.PandoLite) == enums.FeatureFlags.PandoLite)
    val.HasPando = val && val.IsApproved && ((val.FeatureFlags & enums.FeatureFlags.Pando) == enums.FeatureFlags.Pando)

    var logData = false //For debugging purposes
    if (logData) {
      console.log('HasPandoLite: ', val.HasPandoLite)
      console.log('HasPando: ', val.HasPando)
      console.log(val)
    }

    state.user = val
  },
  HrStores(state, stores) {
    let possibleStores = state.ContextReference.filter(f => stores.map(m => m.AccountPlatformID).includes(f.accountPlatformId)).slice();
    state.HrStores = possibleStores;
    let firstStoreIndex = state.HrStores.findIndex(f => f.type === 2);
    if(firstStoreIndex >= 0 ){
      this.commit('setScopeInView', possibleStores[firstStoreIndex])
    }
  },
  selectedStores(state, stores) {
    state.selectedStores = stores;
  },
  hasHrGlobalAccess(state, val) {
    state.hasHrGlobalAccess = val;
  },
  hasHrAccountAccess(state, val) {
    state.hasHrAccountAccess = val;
  },
  hasHrChecklistAccess(state, val) {
    state.hasHrChecklistAccess = val;
  },
  setScopeInView (state, store){
    state.HrScopeInView = store;
  },
  removeGlobalHrStore(state){
    state.HrStores.shift();
  },
  addGlobalHrStore(state){
   state.HrStores.unshift({ contextKey:'78bded49-408f-4e76-a6e4-bbb3742ec3ac', accountPlatformId: '-999', name: 'Global', level: 'Global' });
  },
  setReferenceContext(state, val){
    state.ContextReference = val;
    state.ContextAccount = val.find(f => f.type === 1);
  },
  setErrorFromAPI(state, val){
    state.ErrorFromAPI = val;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
