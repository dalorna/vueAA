import {NotificationType} from '../utilities/enums'
import store from '../../store'
import EventBus from '../utilities/eventBus.js';

export const listener = function (vendorInfo) {
  return {
    status: function (status) {
      console.log(status)
    },
    message: function (message) {
      let channelName = message.actualChannel ? message.actualChannel : message.subscribedChannel;
      if (!channelName || !message.message)
        return;
      if (vendorInfo.Channels.indexOf(channelName) >= 0) {
        handleControlMessage(message.message)
      }
    },
    presence: function (presence) {
      console.log(presence)
    }
  }
}

export const subscriber = function (vendorInfo) {
  return {
    channels: vendorInfo.Channels,
    channelGroups: vendorInfo.channelGroups,
    message: function (message, envelope, channelOrGroup, time, channel) {
      console.log(message)
    },
    error: function (error) {
      console.log(error)
    }
  }
}

function handleControlMessage(message) {
  var notificationType = null;
  var notification = null;

  if (message && message.msg) //Via listener
    notification = message.msg;
  if (message.rtid)
    notificationType = message.rtid;

  // store.dispatch('updateGlobalFrameBadges', notification);

  if ((notificationType === NotificationType.AccountUserResponse) || (notificationType === NotificationType.UserResponse)) {
    store.dispatch('userUpdated', notification)
  } else if (notificationType == NotificationType.FavoriteUserResponse)
    store.dispatch('handleUserFavoriteResponse', notification)
  else if (notificationType == NotificationType.ViewStoreUpdate) {
    EventBus.$emit('handleStoreUpdateNotification', notification);
  }
}