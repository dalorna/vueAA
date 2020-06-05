<template>
  <div class="avatar-container" v-bind:style="{'width': width, 'height':height}" v-bind:class="{'rounded-avatar' : rounded}">
    <div v-if="type == 'member'" class="user-avatar">
      <div class="online-status" v-if="showOnlineStatus">
        <div class="online-status-icon" v-bind:class="onlineStatus(member)"></div>
      </div>
      <img class="avatar-image" v-if="member && member.AvatarUrl" :src="member.AvatarUrl" v-on:error="hideImage($event)" />
      <img class="avatar-image" v-if="member && !member.AvatarUrl && member.Id == '9999999'" src="static/assets/img/pando_bot_avatar.png"
        v-on:error="hideImage($event)" />
      <!-- <div class="avatar-image" v-if="member && member.AvatarUrl" v-bind:style="{'background-image': 'url('+member.AvatarUrl+')'}">&nbsp;</div> -->
      <div class="avatar-text" v-if="member && member.Name" v-html="getMemberInitials(member)" v-bind:style="{'background' : '#'+member.AvatarBGColor, 'line-height': height, 'font-size': getFontSizeForAvatar()}"></div>
      <!-- <div class="avatar-image" v-if="!member" v-bind:style="{'background-image': 'url(static/assets/img/avatar.png)'}">&nbsp;</div> -->
      <img class="avatar-image" v-if="!member" src="static/assets/img/avatar.png" />
    </div>
    <div v-else-if="type == 'group' && group">
      <div v-if="isGenericGroup()" class="group-avatar">
        <img v-if="group.CanJoin" class="avatar-image" src="static/assets/img/svgs/icon_group_public.svg" />
        <img v-else class="avatar-image" src="static/assets/img/svgs/icon_group_private.svg" />
      </div>
      <div v-else-if="group.GroupType == GroupTypeEnum.CrmCustomer" class="group-avatar">
        <img class="avatar-image" src="static/assets/img/svgs/icon_customers.svg" />
      </div>
      <div v-else-if="group.GroupType == GroupTypeEnum.Request" class="group-avatar">
        <img class="avatar-image" src="static/assets/img/svgs/icon_process.svg" />
      </div>
      <div v-else-if="group.GroupType == GroupTypeEnum.Onboarding" class="group-avatar">
        <img class="avatar-image" src="static/assets/img/svgs/icon_process.svg" />
      </div>
      <div v-else>
        <div v-if="recentSenders && recentSenders.length > 0">
          <div v-for="(member,index) of recentSenders" v-bind:key="member.Id" class="group-avatar avatar-dynamic" v-bind:class="{'top-left' : recentSenders.length == 2 && index == 1, 'bottom-right' : recentSenders.length == 2 && index == 0}">
            <div class="online-status" v-if="showOnlineStatus">
              <div class="online-status-icon" v-bind:class="onlineStatus(member)"></div>
            </div>
            <img class="avatar-image" v-if="member && member.AvatarUrl" :src="member.AvatarUrl" v-on:error="hideImage($event)" />
            <img class="avatar-image" v-if="member && !member.AvatarUrl && member.Id == '9999999'" src="static/assets/img/pando_bot_avatar.png"
              v-on:error="hideImage($event)" />
            <div class="avatar-text" v-if="member && member.Name" v-html="getMemberInitials(member)" v-bind:style="{'background' : '#'+member.AvatarBGColor, 'line-height': getLineHeightForGroupAvatar(), 'font-size': getFontSizeForGroupAvatar()}"></div>
            <img class="avatar-image" v-if="!member" src="static/assets/img/avatar.png" />
          </div>
        </div>
        <img v-else src="static/assets/img/group_avatar_black.png" class="generic-group-avatar" />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import enums from "../../utilities/enums";

  export default {
    name: "avatar",
    props: [
      "type",
      "member",
      "group",
      "width",
      "height",
      "rounded",
      "showOnlineStatus"
    ],
    computed: {
      ...mapGetters(["user"]),
      recentSenders: function () {
        try {
          var currentUserId = this.user.Id;

          var recentSenders = [];
          var selectedMembers = [];

          if (this.group.Members && this.group.Members.length > 0) {
            //Find other users in this group
            var otherUsers = this.group.Members.filter(function (member) {
              return member.Id != currentUserId;
            });

            if (!otherUsers || otherUsers.length == 0) {
              //This might be the user's self direct message group
              recentSenders.push(this.group.Members[0]);
              return recentSenders;
            } else if (otherUsers.length == 1) {
              //This is a one-to-one direct message group
              recentSenders.push(otherUsers[0]);
              return recentSenders;
            } else {
              selectedMembers = otherUsers.splice(0, 2);
            }
          }

          if ((!recentSenders || recentSenders.length == 0) && this.group.Messages && this.group.Messages.length > 0) {
            var otherMessages = this.group.Messages.filter(function (msg) {
              return msg.SenderId != currentUserId;
            });
            if (otherMessages && otherMessages.length > 0) {
              var lastMessage = otherMessages[otherMessages.length - 1];
              if (lastMessage.Sender)
                recentSenders.push(lastMessage.Sender);

              otherMessages = otherMessages.filter(function (msg) {
                return msg.SenderId != lastMessage.SenderId;
              });

              if (otherMessages && otherMessages.length > 0) {
                lastMessage = otherMessages[otherMessages.length - 1];
                if (lastMessage.Sender)
                  recentSenders.push(lastMessage.Sender);
              }
            }
          }

          if (!recentSenders || recentSenders.length == 0)
            recentSenders = selectedMembers;
          else if (recentSenders.length == 1 && selectedMembers && selectedMembers.length > 0) {
            var otherSelectedMember = selectedMembers.find(function (member) {
              return member.Id != recentSenders[0].Id;
            });
            recentSenders.push(otherSelectedMember);
          }

          return recentSenders;
        } catch (err) {
          return [];
        }
      },
      GroupTypeEnum: function () {
        return enums.GroupType;
      }
    },
    methods: {
      getLineHeightForGroupAvatar: function () {
        if (!this.recentSenders || this.recentSenders.length <= 1)
          return this.height;

        var height = this.height.substring(0, this.height.indexOf("px"));
        height = height || 40;
        return height - 10 + "px"; //We separate multi-group-avatars with a 10px gap via CSS
      },
      getFontSizeForGroupAvatar: function () {
        var height = this.height.substring(0, this.height.indexOf("px"));
        height = height || 40;
        if (this.recentSenders && this.recentSenders.length > 1)
          height = height - 10;
        return 2 * height / 5 + "px";
      },
      getFontSizeForAvatar: function () {
        var height = this.height.substring(0, this.height.indexOf("px"));
        height = height || 40;
        return 2 * height / 5 + "px";
      },
      hideImage: function (event) {
        if (!event.target.classList.contains("hide-image"))
          event.target.classList.add("hide-image");
      },
      onlineStatus: function (user) {
        if (user) {
          if (user.IsAvailable || user.Availability == enums.UserAvailability.Available) return "is-available";
          else if (user.Availability == enums.UserAvailability.Busy)
            return "is-busy";
        }
        return "is-unavailable";
      },
      getStatusDescription: function (user) {
        if (user) {
          if (user.IsAvailable) return "Available";
          else if (user.Availability == enums.UserAvailability.Busy) {
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
      getMemberInitials: function (member) {
        var initials = "@";
        try {
          initials = member.FirstName.charAt(0) + member.LastName.charAt(0);
        } catch (err) {}
        return initials;
      },
      isGenericGroup: function () {  //For all groups which arent Direct Messages, CrmCustomers or Processes
        return this.group && this.group.GroupType != enums.GroupType.DirectMessage && this.group.GroupType != enums.GroupType.CrmCustomer && this.group.GroupType != enums.GroupType.Request;
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
    z-index: 1;

    &.rounded-avatar {
      // border-radius: 50% !important;
      // border: 2px solid#ffffff;
      // box-shadow: 0px 3px 5px #909090;
      // -webkit-transition: opacity .3s linear;
      // -moz-transition: opacity .3s linear;
      // -o-transition: opacity .3s linear;
      // transition: opacity .3s linear;

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
        letter-spacing: 1px;
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
        max-width: 40px;
        max-height: 40px;
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
          max-width: 40px;
          max-height: 40px;
          border-radius: 50%;
        }

        .is-available {
          background: $green;
        }

        .is-busy {
          background: $blue-xdk;
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