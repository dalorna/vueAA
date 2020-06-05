import Vue from 'vue'
import {
  isEmpty,
  hashCode
} from '../../utilities/custom'
import enums from '../../utilities/enums'
import {
  userInfo
} from 'os'

function getFilteredUsers(state, getters) {
  let results = []
  try {
    let val = state.filterCriteria
    if (getters.allowedUsers && getters.allowedUsers.length > 0) {
      results = getters.allowedUsers
    }

    if (val.isValid) {
      //Apply Org If Any
      if (!isEmpty(val.orgCriteria)) {
        let orgCriteria = []
        for (let criteria = 0; criteria < val.orgCriteria.length; criteria++) {
          orgCriteria.push(val.orgCriteria[criteria].OrgGroupId)
        }
        results = results.filter(y => {
          return orgCriteria.includes(y.OrgGroupId)
        })
      }
      //Apply Store If Any
      if (!isEmpty(val.platformCriteria)) {
        let platformCriteria = []
        for (let criteria = 0; criteria < val.platformCriteria.length; criteria++) {
          platformCriteria.push(val.platformCriteria[criteria].AccountPlatformId)
        }
        for (let x = 0; x < val.platformCriteria.length; x++) {
          results = results.filter(y => {
            return platformCriteria.includes(y.AccountPlatformId)
          })
        }
      }

      if (val.filterText && val.filterText.trim().length > 0) {
        let searchText = val.filterText.trim().toLowerCase()

        //Apply Text If Any
        results = results.filter(user => {
          //console.log(user)
          // return user.Name.toLowerCase().indexOf(val.filterText.trim().toLowerCase()) >= 0 ||
          //     user.Email.toLowerCase().indexOf(val.filterText.trim().toLowerCase()) >= 0
          return (
            user.Name.toLowerCase().indexOf(searchText) >= 0 ||
            (user.Email && user.Email.toLowerCase().indexOf(searchText) >= 0) ||
            (user.UserName && user.UserName.toLowerCase().indexOf(searchText) >= 0) ||
            (user.Platform && user.Platform.toLowerCase().indexOf(searchText) >= 0)
          )
        })
      }
    }

    results = results.filter(function (usr) {
      return usr.Active && usr.IsApproved
    })
  } catch (err) {
    // Nothing to do
  }
  return results
}

function initialState() {
  return {
    appUsers: [],
    // filteredUsers: [],
    isLoadingUsers: false,
    orgGroups: [],
    filterCriteria: {
      orgCriteria: [],
      platformCriteria: [],
      filterText: '',
      isValid: false
    }
  }
}
const state = initialState()

const getters = {
  appUsers(state) {
    return state.appUsers
  },
  allowedUsers(state, getters) {
    let allowedUsers = []
    if (state.appUsers && state.appUsers.length > 0 && getters.user.AllowedStores && getters.user.AllowedStores.length > 0) {
      let allowedStores = getters.user.AllowedStores.map((platform) => {
        return platform.AccountPlatformID
      })

      allowedUsers = state.appUsers.filter((usr) => {
        return allowedStores.indexOf(usr.AccountPlatformID) >= 0
      })
    }
    return allowedUsers
  },
  filteredUsers(state, getters) {
    let results = getFilteredUsers(state, getters)
    return results
  },
  orgGroups(state) {
    return state.orgGroups || []
  },
  filteredFavorites(state, getters) {
    let favorites = []
    let results = getFilteredUsers(state, getters)
    if (results && results.length > 0) {
      favorites = results.filter(function (user) {
        return user.IsFavorite
      })
    }
    return favorites
  },
  isLoadingUsers(state) {
    return state.isLoadingUsers
  }
}

const actions = {
  getOrgGroups(context) {
    return new Promise((resolve, reject) => {
      if (!context.getters.orgGroups || context.getters.orgGroups.length == 0) {
        Vue.http.get('/core/groups/org').then(function (data) {
          context.commit('getOrgGroups', data.data.Data)
          resolve()
        }).catch(function (error) {
          reject(error)
        })
      } else {
        resolve()
      }
    })
  },
  resetTeamDirectoryState(context) {
    context.commit('resetTeamDirectoryState')
  },
  userObjSearch(context, userArray) {
    return new Promise((resolve, reject) => {
      if (userArray.length > 0) {
        let returnArray = []
        for (let user = 0; user < userArray.length; user++) {
          let result = context.getters.appUsers.filter(x => x.Id == userArray[user])
          if (result.length == 1) {
            returnArray.push(result[0])
          } else {
            reject('MULTIPLE USERS FOR UserId: ' + userArray[user])
          }
        }
        resolve(returnArray)
      } else {
        reject('THERE WERE NO USERS PROVIDED')
      }
    })
  },
  async loadDirectory(context) {
    if (context.getters.appUsers.length == 0) {
      await context.dispatch('getAllUsers')
    }
  },
  getAllUsers({ commit, rootGetters	}) {
    // console.log ('In TeamDirectory/getAllUsers...', rootGetters);
    return new Promise(async (resolve, reject) => {
      commit('updateLoadingUsersStatus', true);
      await Vue.http.get('/users/all')
        .then((response) => {
          if (response && response.data) {
            let rdd = rootGetters.HrScopeInView.accountPlatformId === rootGetters.HrScopeInView.accountId ? response.data.Data : response.data.Data.filter(f => f.AccountPlatformID === rootGetters.HrScopeInView.accountPlatformId);
            const payload = {
              userId: rootGetters.user.Id,
              color: rootGetters.user.AvatarBGColor,
              data: rdd
            };
            commit('setAppUsers', payload);
          }
          // commit('updateLoadingUsersStatus', false)
          resolve(response.data.Data)
        })
        .catch((error) => {
          // commit('updateLoadingUsersStatus', false)
          reject(error)
        })
    })
  },
  async getReturnUsers({ commit, rootGetters, dispatch	}, val) {
    return new Promise((resolve, reject) => {
      Vue.http.get('/users/all')
        .then((response) => {
          let u = null;
          if (response && response.data) {
            const payload = {
              userId: rootGetters.user.Id,
              color: rootGetters.user.AvatarBGColor,
              data: response.data.Data
            };
            u = dispatch('retAppUsers', payload);
          }
          resolve(response.data.Data);
          return u;
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async selectDirectoryUser(context, val) {
    await context.dispatch('setSelectedProfile', val)
  },
  filterUsers(context, val) {
    context.commit('filterUsers', val)
  },
  userUpdated(context, val) {
    context.commit('userUpdated', val)
    if (val.Id == context.getters.user.Id) {
      val.IsFavorite = context.getters.user.IsFavorite
      context.dispatch('updateCurrentUser', val)
    }
  },
  handleUserFavoriteResponse(context, val) {
    context.commit('handleUserFavoriteResponse', val)
    if (val.Id == context.getters.user.Id) {
      context.dispatch('updateCurrentUser', val)
    }
  },

  retAppUsers(payload) {
    try {
      // console.log('TeamDirectory: mutations/setAppUsers - payload: ', payload)
      if (payload.data && payload.data.length > 0) {
        for (let user of payload.data) {
          if (user.Id === payload.userId) {
            user.AvatarBGColor = payload.color
          } else {
            const randomInt = Math.abs(hashCode(user.Name)) % enums.Colors.length
            //These will be used for users with no avatar
            const color = enums.Colors[randomInt]
            user.AvatarBGColor = color || enums.Colors[0]
          }
        }
      }
      return payload.data;
    } catch (err) {
      console.log('Error setting app users: ', err)
    }
  },
}

const mutations = {
  resetTeamDirectoryState(state) {
    state = Object.assign({}, initialState())
  },
  filterUsers(state, val) {
    if (val == 'reset') {
      state.filterCriteria.orgCriteria = []
      state.filterCriteria.platformCriteria = []
      state.filterCriteria.filterText = ''
      state.filterCriteria.isValid = false
    } else {
      state.filterCriteria.orgCriteria = val.orgCriteria
      state.filterCriteria.platformCriteria = val.platformCriteria
      state.filterCriteria.filterText = val.filterText
      state.filterCriteria.isValid = true
    }
  },
  setAppUsers(state, payload) {
    try {
      // console.log('TeamDirectory: mutations/setAppUsers - payload: ', payload)
      if (payload.data && payload.data.length > 0) {
        for (let user of payload.data) {
          if (user.Id == payload.userId) {
            user.AvatarBGColor = payload.color
          } else {
            const randomInt = Math.abs(hashCode(user.Name)) % enums.Colors.length
            //These will be used for users with no avatar
            const color = enums.Colors[randomInt]
            user.AvatarBGColor = color || enums.Colors[0]
          }
        }
      }

      state.appUsers = payload.data
      state.filteredUsers = payload.data.filter(function (usr) {
        return usr.Active && usr.IsApproved
      })
    } catch (err) {
      console.log('Error setting app users: ', err)
    }
  },
  appendGroupInfo(state, val) {
    let index = state.appUsers.findIndex(x => x.Id == val.Id)
    state.appUsers.splice(index, 1, val)
  },
  userUpdated(state, val) {
    if (val && val.Id) {
      let userObj = state.appUsers.find(function (usr) {
        return usr.Id == val.Id
      })

      if (userObj && userObj.Id) {
        let color = userObj.AvatarBGColor
        let isFavorite = userObj.IsFavorite
        for (let prop in val) {
          try {
            userObj[prop] = val[prop]
          } catch (err) {
            console.log('Error copying property')
          }
        }
        userObj.AvatarBGColor = color
        userObj.IsFavorite = isFavorite
      } else {
        let randomInt = Math.abs(hashCode(val.Name)) % enums.Colors.length
        //These will be used for users with no avatar
        let color = enums.Colors[randomInt]
        val.AvatarBGColor = color || enums.Colors[0]

        if (!state.appUsers || state.appUsers.length == 0)
          state.appUsers = []

        state.appUsers.push(val)
      }
    }
  },
  handleUserFavoriteResponse(state, val) {
    if (val && val.Id) {
      let userObj = state.appUsers.find(function (usr) {
        return usr.Id == val.Id
      })

      if (userObj && userObj.Id) {
        userObj.IsFavorite = val.IsFavorite
      }
    }
  },
  getOrgGroups(state, val) {
    state.orgGroups = val
  },
  updateLoadingUsersStatus(state, val) {
    state.isLoadingUsers = val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
