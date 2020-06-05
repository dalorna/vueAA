import Vue from 'vue'
import moment from 'moment'
import enums from '../../utilities/enums'
import {
  convertIdToPubNubKind
} from '../../utilities/custom'

function initialState() {
  return {
    groups: []
  }
}

// ********** BEGIN HELPER METHODS **********

//Find group from the given list
function getGroupForId(groups, groupId) {
  if (groupId && groups && groups.length > 0)
    return groups.find(function (grp) {
      return grp.GroupId === groupId
    });
  return null
}

//Add properties to group for UI
function generateGroupObject(group, user) {
  try {
    group.LastMessage = {}; //Most recent message in this conversation

    // Set initial visibility state (prior to filtering being applied)
    group.isVisible = !group.IsHidden;

    // For composing new messages
    group.ComposedMessage = '';
    group.MarkdownMessage = '';

    // For handling typing list
    group.TypingList = [];
    group.StateResetTimer = null;
    group.SettingUserState = false;

    // For handling scroll position on updates to message list
    group.ScrollToMessageId = '';

    // These time tokens are .NET ticks and are used to sort groups
    group.Timetoken = moment(group.LastMessageDT).valueOf() * 10000 + enums.EpochTicks;
    group.CreatedTimetoken = moment(group.CreateDT).valueOf() * 10000 + enums.EpochTicks;

    group.CanSend = group.GroupMessagingType === enums.GroupMessagingType.Direct; //Default to true if it is a new Direct message
    if (group.GroupMessagingType == enums.GroupMessagingType.Interactive)
      group.CanSend = true;
    else if (group.GroupMessagingType == enums.GroupMessagingType.Broadcast && group.AdminUserIds && group.AdminUserIds.length > 0)
      group.CanSend = group.AdminUserIds.indexOf(user.Id) >= 0;

    //PubNub properties to manage messages
    group.PubnubId = convertIdToPubNubKind(group.GroupId);

    //Generate workflow related params
    group.WorkflowInstanceStatusText = null;
    group.PlatformName = null;
    if (group.GroupType == enums.GroupType.Request || group.GroupType == enums.GroupType.HR) {
      if (group.WorkflowInstanceStatus > 0) {
        if (group.WorkflowInstanceStatus == enums.WorkflowInstanceStatus.New)
          group.WorkflowInstanceStatusText = "New";
        else if (group.WorkflowInstanceStatus == enums.WorkflowInstanceStatus.InProgress)
          group.WorkflowInstanceStatusText = "In Progress";
        else if (group.WorkflowInstanceStatus == enums.WorkflowInstanceStatus.Overdue)
          group.WorkflowInstanceStatusText = "Overdue";
      }

      if (group.PlatformId > 0 && user.AllowedStores && user.AllowedStores.length > 0) {
        const platform = user.AllowedStores.find(function (platform) {
          return platform.AccountPlatformID == group.PlatformId;
        });
        if (platform && platform.AccountPlatformID > 0)
          group.PlatformName = platform.Name;
      }
    }

    group.MarkGroupAsViewedInProgress = false; //To prevent multiple calls to API for marking a group as read

    group.Members = group.Members || [];

    return group;
  } catch (err) {
    console.log("Error generating group object", err);
    return null;
  }
}

//Update group members
function getGroupMembers(group, appUsers) {
  if (group && group.UserIds && group.UserIds.length > 0 && appUsers && appUsers.length > 0) {
    let grpMembers = appUsers.filter(function (user) {
      return group.UserIds.indexOf(user.Id) >= 0
    })
    if (grpMembers && grpMembers.length > 0) {
      grpMembers.sort(function (member1, member2) {
        if (member1.Name && member2.Name && member1.Name.toLowerCase() != member2.Name.toLowerCase())
          return member1.Name.toLowerCase() > member2.Name.toLowerCase() ? 1 : -1
        else
          return member1.Id > member2.Id ? 1 : -1
      })
      return grpMembers
    }
  }
  return []
}

// ********** END HELPER METHODS **********

const state = initialState()

const getters = {
  groups(state) {
    return state.groups
  }
}

const actions = {
  getGroups(context) {
    Vue.http.get('/groupslm')
      .then((response) => {
        context.dispatch('gotGroups', response);
      }).catch((error) => {
      console.log('Error fetching groups: ', error);
    });
  },
  gotGroups(context, response) {
    if (response && response.data && response.data.Data && response.data.Data.length > 0) {
      for (let grp of response.data.Data) {
        context.dispatch('addGroupToList', grp);
      }
    }
  },
  async getGroupById(context, groupId) {

    await Vue.http.get('/group/' + groupId)
      .then((response) => {
        console.log('getting group by ID:', response.data)
        context.dispatch('addGroupToList', response.data.Data)
      }).catch((error) => {
        console.log('Error fetching group by Id: ', error);
      })
  },
  addGroupToList(context, group) {
    try {
      let appUsers = context.getters.appUsers
      let user = context.getters.user;

      let existingGroup = getGroupForId(context.getters.groups, group.GroupId);

      //If we already have the latest group information, return
      if (existingGroup && existingGroup.Uid && group.Uid && existingGroup.Uid > group.Uid) {
        return;
      }

      //Get group with properties for UI
      group = generateGroupObject(group, user);

      //Update group members
      group.Members = getGroupMembers(group, appUsers);

      //If the current group is hidden, select next visible group
      let currentIndex;
      if (context.getters.group && context.getters.group.GroupId === group.GroupId && group.IsHidden && context.getters.filteredGroups && context.getters.filteredGroups.length > 0) {
        currentIndex = context.getters.filteredGroups.findIndex((grp) => {
          return grp.GroupId === group.GroupId;
        });
      }

      if (existingGroup && existingGroup.GroupId) {
        //Copy existing values for the group
        group.TypingList = existingGroup.TypingList;
        group.StateResetTimer = existingGroup.StateResetTimer;
        group.SettingUserState = existingGroup.SettingUserState;
        group.ComposedMessage = existingGroup.ComposedMessage;
        group.MarkdownMessage = existingGroup.MarkdownMessage;
        group.ScrollToMessageId = existingGroup.ScrollToMessageId;

        const index = state.groups.indexOf(existingGroup);
        context.commit('replaceGroupInList', {
          Group: group,
          Index: index
        });

        // context.dispatch('updateGroup', group);
      } else {
        context.commit('addNewGroupToList', group);
      }


    } catch (err) {
      console.log("Error adding group to list: ", err);
    }
  }
}

const mutations = {
  updateGroupLoadingStatus(state, status) {
    state.groupsLoadingStatus = status;
  },
  replaceGroupInList(state, data) {
    if (data.Index >= 0 && data.Group && data.Group.GroupId)
      state.groups.splice(data.Index, 1, data.Group);
  },
  addNewGroupToList(state, group) {
    state.groups.push(group);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
