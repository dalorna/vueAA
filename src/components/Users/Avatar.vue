<template>
    <div class="avatar-container" v-bind:style="{'width': width, 'height':height}" v-bind:class="{'rounded' : rounded}">
        <div v-if="type == 'member'" class="user-avatar">
            <div class="online-status" v-if="showOnlineStatus">
                <div class="online-status-icon" v-bind:class="onlineStatus(member)"></div>
            </div>
            <img class="avatar-image" v-if="member && member.AvatarUrl" :src="member.AvatarUrl" v-on:error="hideImage($event)" />
            <img class="avatar-image" v-if="member && !member.AvatarUrl && member.Id == '9999999'" src="static/assets/img/pando_bot_avatar.png" v-on:error="hideImage($event)" />
            <!-- <div class="avatar-image" v-if="member && member.AvatarUrl" v-bind:style="{'background-image': 'url('+member.AvatarUrl+')'}">&nbsp;</div> -->
            <div class="avatar-text" v-if="member && member.Name" v-html="getMemberInitials(member)" v-bind:style="{'background' : '#'+member.AvatarBGColor, 'line-height': height, 'font-size': getFontSizeForAvatar()}"></div>
            <!-- <div class="avatar-image" v-if="!member" v-bind:style="{'background-image': 'url(static/assets/img/avatar.png)'}">&nbsp;</div> -->
            <img class="avatar-image" v-if="!member" src="static/assets/img/avatar.png" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {UserAvailability} from "../../lib/utilities/enums";

export default {
  name: "avatar",
  props: [
    "type",
    "member",
    "group",
    "width",
    "height",
    "rounded",
    "showOnlineStatus",
    "user"
  ],
  computed: {
  },
  methods: {
    getLineHeightForGroupAvatar: function() {
      if (!this.recentSenders || this.recentSenders.length <= 1)
        return this.height;

      var height = this.height.substring(0, this.height.indexOf("px"));
      height = height || 40;
      return height - 10 + "px"; //We separate multi-group-avatars with a 10px gap via CSS
    },
    getFontSizeForGroupAvatar: function() {
      var height = this.height.substring(0, this.height.indexOf("px"));
      height = height || 40;
      if (this.recentSenders && this.recentSenders.length > 1)
        height = height - 10;
      return 2 * height / 5 + "px";
    },
    getFontSizeForAvatar: function() {
      var height = this.height.substring(0, this.height.indexOf("px"));
      height = height || 40;
      return 2 * height / 5 + "px";
    },
    hideImage: function(event) {
      if (!event.target.classList.contains("hide-image"))
        event.target.classList.add("hide-image");
    },
    onlineStatus: function(user) {
      if (user) {
        if (user.IsAvailable || user.Availability == UserAvailability.Available) return "is-available";
        else if (user.Availability == UserAvailability.Busy)
          return "is-busy";
      }
      return "is-unavailable";
    },
    getStatusDescription: function(user) {
      if (user) {
        if (user.IsAvailable) return "Available";
        else if (user.Availability == UserAvailability.Busy) {
          var busyDT = moment(user.BusyUntilDt);
          if (busyDT.isValid())
            return (
              "Busy until " +
              moment(user.BusyUntilDt).format("YYYY-MM-DD hh:mm A")
            );
          else return "Busy";
        }
      }
      return "Not available";
    },
    getMemberInitials: function(member) {
      var initials = "@";
      try {
        initials = member.FirstName.charAt(0) + member.LastName.charAt(0);
      } catch (err) {}
      return initials;
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "../../styles.less";

.avatar-container {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  min-width: 10px;
  min-height: 10px;
  position: relative;

  &.rounded {
    .user-avatar,
    .group-avatar.avatar-dynamic {
      .avatar-image,
      .avatar-text {
        border-radius: 50% !important;
      }
    }
  }

  .user-avatar {
    display: inline-block !important;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    text-align: center; 
    
    .avatar-image {
     
      height: 100%;
      width: 100%; 
    }

    .avatar-text {
      width: 100%;
      height: 100%;
      font-weight: 300;
      color: #ffffff;
      text-align: center;
      background-color: $blue-lt;
    }
  }

  .group-avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &.top-left,
    &.bottom-right {
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border-radius: 50%;
      overflow: hidden;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      top: initial;
      left: initial;
      z-index: 1;
    }

    .avatar-image {
     
      height: 100%;
      width: 100%; 
    }

    .avatar-text {
      width: 100%;
      height: 100%;

      font-weight: 300;
      color: #ffffff;
      text-align: center;
      background-color: $blue-lt; 
    }
  }

  .user-avatar,
  .group-avatar {
    .online-status {
      width: 33.33%;
      height: 33.33%;
      position: absolute;
      bottom: 0px;
      right: 0px;
      padding: 0%;
      background: #ffffff;
      border-radius: 50%;
      overflow: hidden;

      .online-status-icon {
        position: absolute;
        top: 2px;
        left: 2px;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 50%;
      }

      .is-available {
        background: $green;
      }

      .is-busy {
        background: $blue-dk;
      }

      .is-unavailable {
        background: $platinum;
      }
    }

    &.top-left,
    &.bottom-right {
      .online-status {
        display: none;
      }
    }
  }

  .generic-group-avatar {
    width: 100%;
    height: 100%;
  }

  .hide-image {
    display: none;
  }
}
</style>
