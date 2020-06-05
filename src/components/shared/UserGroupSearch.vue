<template>
  <div id="create-group" v-bind:class="{'is-plugin-view' : IsPluginView}">
    <div class="component-header">
      <img class="group-type-image" v-bind:src="getModalIcon()" /> {{getModalName()}}
    </div>
    <div class="component-body">
      <p v-show="createGroupModal.GroupCreationError" v-html="createGroupModal.GroupCreationError" class="error-message"></p>

      <!-- Search User Section -->
      <div v-if="searchType == 'user'">
        <div class="selected-list-container" v-on:click="focusOnFilterText()">
          <div v-for="user of selectedUsers" v-bind:key="user.Id" class="selected-item">
            <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'30px'" v-bind:height="'30px'" class="selected-item-avatar"></avatar>
            <div class="selected-item-title">{{user.Name}}</div>
            <span v-on:click="removeUser(user)">
              <i class="fa fa-times selected-item-remove"></i>
            </span>
          </div>
          <input type="text" ref="filterText" class="filter-text" v-on:keydown="handleKeydownEvent($event)" placeholder="Search users"
          />
        </div>

        <div class="filtered-list-container" id="filtered_list_container">
          <div v-for="(user, index) of filteredUsers" v-bind:key="index" class="filtered-item" v-on:click="selectUser(user, index)"
            v-bind:class="{'show-alphabet-header' : showUserAlphabetHeader(user, index), 'current-scroll-item' : index == currentScrollIndex}"
            v-bind:id="'filtered_item_'+index">
            <div class="alphabet-header">{{user.Header}}</div>
            <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'45px'" v-bind:height="'45px'" v-bind:rounded='true' v-bind:showOnlineStatus='true'
              class="filtered-item-avatar"></avatar>
            <div class="filtered-item-select-hint">select</div>
            <div class="filtered-item-title">{{user.Name}}</div>
            <div class="filtered-item-detail">{{user.OrgGroupName ? user.OrgGroupName + ' | ' : ''}}{{user.Platform}}</div>
          </div>
        </div>
      </div>

      <!-- Search Group Section -->
      <div v-if="searchType == 'group'">
        <div class="selected-list-container" v-on:click="focusOnFilterText()">
          <div v-for="(group, index) of selectedGroups" v-bind:key="group.OrgGroupId" class="selected-item" v-bind:class="{'current-scroll-item' : index == currentScrollIndex}" v-bind:id="'tfiltered_item_'+index">
            <div class="selected-item-title groupitem">{{group.OrgGroupName}} ({{group.Platform}})</div>
            <span v-on:click="removeGroup(group)">
              <i class="fa fa-times selected-item-remove"></i>
            </span>
          </div>
          <input type="text" ref="filterText" class="filter-text" v-on:keydown="handleGroupKeydownEvent($event)" placeholder="Search groups" />
        </div>

        <div class="filtered-list-container" id="filtered_list_container">
          <div v-for="(group, index) of filteredGroups" v-bind:key="index" class="filtered-item" v-on:click="selectGroup(group, index)"
            v-bind:class="{'current-scroll-item' : index == currentScrollIndex}" v-bind:id="'filtered_item_'+index">
            <div class="filtered-item-select-hint">select</div>
            <div class="filtered-item-title">{{group.OrgGroupName}} | {{group.Platform}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="component-footer">
      <button class="btn primary--text" v-on:click="closeCreateGroupModal()">Close</button>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import Avatar from "../../components/shared/Avatar.vue";
  import NavMenu from "../Plugins//NavMenu";
  import router from "../../router";
  import enums from "../../utilities/enums";

  export default {
    name: "userGroupSearch",
    components: {
      Avatar,
      NavMenu
    },
    props: {
      callBack: {
        type: Function,
        required: true
      },
      model: {
        type: Array,
        required: true
      },
      searchType: {
        type: String,
        required: true
      }
    },
    watch: {

    },
    computed: {
      ...mapGetters([
        "appUsers",
        "teams",
        "createGroupModal",
        "User",
        "globalSelectedStores",
        "IsPluginView"
      ]),
      filteredUsers: function () {
        //Filtered users
        var users = [];
        var self = this;
        if (self.appUsers && self.appUsers.length > 0) {
          users = self.appUsers.filter(function (user) {
            return self.userNeedsDisplay(user);
          });
        }

        //Filtered favorites
        var favorites = [];
        if (users && users.length > 0) {
          for (var user of users)
            user.Header = user.Name.charAt(0).toUpperCase();
          favorites = users.filter(function (user) {
            return user.IsFavorite;
          });
          if (favorites && favorites.length > 0) {
            favorites = JSON.parse(JSON.stringify(favorites));
            for (var user of favorites)
              user.Header = "Favorites";
          }
        }

        var filteredUsers = favorites && favorites.length > 0 ? favorites.concat(users) : users;
        if (filteredUsers && this.currentScrollIndex > filteredUsers.length)
          this.currentScrollIndex = filteredUsers.length - 1;

        return filteredUsers;
      },
      filteredGroups: function () {
        //Filtered groups
        var groups = [];
        var self = this;

        if (self.teams && self.teams.length > 0) {
          groups = self.teams.filter(function (group) {
            return self.groupNeedsDisplay(group);
          });
        }

        var filteredGroups = groups;
        if (filteredGroups && this.currentScrollIndex > filteredGroups.length)
          this.currentScrollIndex = filteredGroups.length - 1;

        return filteredGroups;
      }
    },
    data: () => {
      return {
        selectedUsers: [],
        selectedGroups: [],
        filterText: null,
        // groupName: null,
        // groupDescription: null,
        // isPrivate: false,
        // inputTimeout: null,
        currentScrollIndex: 0,
        // selectedStoreIds: []
      };
    },
    beforeMount: function () {
      if (
        this.User.AllowedStores &&
        this.User.AllowedStores.length > 1 &&
        this.globalSelectedStores &&
        this.User.AllowedStores.length != this.globalSelectedStores.length
      ) {
        this.selectedStoreIds = this.globalSelectedStores.map(function (store) {
          return store.AccountPlatformID;
        });
      }

    },
    mounted: function () {
      if(this.searchType == "user"){
        this.selectedUsers = this.model;
      }
      else if(this.searchType == "group"){
        this.selectedGroups = this.model;
      }
      
    },
    beforeDestroy: function () {
      if (!this.createGroupModal.ShowCreateGroupDialog) {
        this.selectedUsers = [];
        this.selectedGroups = [];
        this.filterText = null;
        // this.groupName = null;
        // this.groupDescription = null;
        // this.isPrivate = false;
        // this.inputTimeout = null;
        // this.selectedStoreIds = [];
      }
      this.$store.dispatch('resetCreateGroupStateData');
    },
    methods: {
      focusOnFilterText: function () {
        try {
          this.$refs.filterText.focus();
        } catch (err) {}
      },

      selectUser: function (user, index) {
        this.selectedUsers.push(user);
        this.$refs.filterText.focus();
        this.$refs.filterText.value = null;
        this.currentScrollIndex = index;
        if (this.filteredUsers && this.currentScrollIndex >= this.filteredUsers.length)
          this.currentScrollIndex = this.filteredUsers.length - 1;

        if (this.inputTimeout)
          clearTimeout(this.inputTimeout);

        var self = this;
        self.inputTimeout = setTimeout(function () {
          self.filterText = null;
        }, 300);
        this.callBack(this.selectedUsers);
      },
      removeUser: function (u) {
        this.selectedUsers = this.selectedUsers.filter(x => x != u);
        this.$refs.filterText.focus();
        this.callBack(this.selectedUsers);
      },
      selectGroup: function (group, index){
        this.selectedGroups.push(group);
        this.$refs.filterText.focus();
        this.$refs.filterText.value = null;
        this.currentScrollIndex = index;
        if (this.filteredGroups && this.currentScrollIndex >= this.filteredGroups.length)
          this.currentScrollIndex = this.filteredGroups.length - 1;

        if (this.inputTimeout)
          clearTimeout(this.inputTimeout);

        var self = this;
        self.inputTimeout = setTimeout(function () {
          self.filterText = null;
        }, 300);
        this.callBack(this.selectedGroups);
      },
      removeGroup: function (g) {
        this.selectedGroups = this.selectedGroups.filter(x => x != g);
        this.$refs.filterText.focus();
        this.callBack(this.selectedGroups);
      },

      userNeedsDisplay: function (user) {
        try {
          //Do not display inactive and unapproved users
          if (!user.Active || !user.IsApproved) return false;
          else if (
            this.selectedStoreIds &&
            this.selectedStoreIds.length > 0 &&
            this.selectedStoreIds.indexOf(user.AccountPlatformID) < 0
          )
            //If global store filter is enabled, display users from selected stores only
            return false;
          else if (
            this.createGroupModal.IsExistingGroup &&
            this.createGroupModal.ExistingGroup &&
            this.createGroupModal.ExistingGroup.UserIds &&
            this.createGroupModal.ExistingGroup.UserIds.length > 0 &&
            this.createGroupModal.ExistingGroup.UserIds.indexOf(user.Id) >= 0
          )
            //If this is an existing group, dont display members who are already part of it
            return false;
          else if (this.selectedUsers && this.selectedUsers.length > 0 && this.selectedUsers.findIndex(member =>
              member.Id == user.Id) >= 0)
            return false;
          else if (this.filterText && this.filterText.trim().length > 0) {
            var searchText = this.filterText.trim().toLowerCase();
            return (
              user.Name.toLowerCase().indexOf(searchText) >= 0 ||
              (user.Email && user.Email.toLowerCase().indexOf(searchText) >= 0) ||
              (user.Platform &&
                user.Platform.toLowerCase().indexOf(searchText) >= 0)
            );
          }
        } catch (err) {}
        return true;
      },
      groupNeedsDisplay: function (group) {
        try {
          //Do not display inactive and unapproved users
          if (
            this.selectedStoreIds &&
            this.selectedStoreIds.length > 0 &&
            this.selectedStoreIds.indexOf(group.AccountPlatformId) < 0
          ){
            return false;
          }
          else if (this.selectedGroups && this.selectedGroups.length > 0 && this.selectedGroups.findIndex(member =>
              member.OrgGroupId == group.OrgGroupId) >= 0){
                return false;
              }
          else if (this.filterText && this.filterText.trim().length > 0) {
            var searchText = this.filterText.trim().toLowerCase();
            return (
              group.OrgGroupName.toLowerCase().indexOf(searchText) >= 0 ||
              (group.Platform && group.Platform.toLowerCase().indexOf(searchText) >= 0)
            );
          }
        } catch (err) {}
        return true;
      },


      closeCreateGroupModal: function () {
        this.$store.dispatch("closeNewGroupModal");
      },
      handleKeydownEvent: function (event) {
        //8 = backspace
        if (event.keyCode == 8) {
          if ((!this.filterText || !this.filterText.trim()) && this.selectedUsers && this.selectedUsers.length > 0)
            this.selectedUsers.pop();
        } else if (event.keyCode == enums.KeyCodes.UpArrow) {
          event.preventDefault();
          this.currentScrollIndex = this.currentScrollIndex > 0 ? this.currentScrollIndex - 1 : this.filteredUsers
            .length - 1;
          this.scrollToElementIfNeeded('filtered_item_' + this.currentScrollIndex);
        } else if (event.keyCode == enums.KeyCodes.DownArrow) {
          event.preventDefault();
          this.currentScrollIndex = this.currentScrollIndex == this.filteredUsers.length - 1 ? 0 : this.currentScrollIndex +
            1;
          this.scrollToElementIfNeeded('filtered_item_' + this.currentScrollIndex);
        } else if (event.keyCode == enums.KeyCodes.Enter) {
          event.preventDefault();
          var user = this.filteredUsers[this.currentScrollIndex];
          this.selectUser(user, this.currentScrollIndex);
        }

        if (this.inputTimeout)
          clearTimeout(this.inputTimeout);

        var self = this;
        self.inputTimeout = setTimeout(function () {
          self.filterText = event.target.value;
        }, 300);
      },
      handleGroupKeydownEvent: function (event) {
        //8 = backspace
        if (event.keyCode == 8) {
          if ((!this.filterText || !this.filterText.trim()) && this.selectedGroups && this.selectedGroups.length > 0){
            this.selectedGroups.pop();
          }
        } 
        else if (event.keyCode == enums.KeyCodes.UpArrow) {
          event.preventDefault();
          this.currentScrollIndex = this.currentScrollIndex > 0 ? this.currentScrollIndex - 1 : this.filteredGroups.length - 1;
          this.scrollToElementIfNeeded('tfiltered_item_' + this.currentScrollIndex);
        } 
        else if (event.keyCode == enums.KeyCodes.DownArrow) {
          event.preventDefault();
          this.currentScrollIndex = this.currentScrollIndex == this.filteredGroups.length - 1 ? 0 : this.currentScrollIndex + 1;
          this.scrollToElementIfNeeded('tfiltered_item_' + this.currentScrollIndex);
        } 
        else if (event.keyCode == enums.KeyCodes.Enter) {
          event.preventDefault();
          var group = this.filteredGroups[this.currentScrollIndex];
          this.selectGroup(group, this.currentScrollIndex);
        }

        if (this.inputTimeout){
          clearTimeout(this.inputTimeout);
        }
        
        var self = this;
        self.inputTimeout = setTimeout(function () {
          self.filterText = event.target.value;
        }, 300);
      },
      scrollToElementIfNeeded: function (elementId) {
        try {
          var filteredListContainer = document.getElementById('filtered_list_container');
          var filteredElement = document.getElementById(elementId);
          var containerScrollPosition = filteredListContainer.scrollTop;
          var containerBottom = containerScrollPosition + filteredListContainer.offsetHeight;
          var elementOffsetInParent = filteredElement.offsetTop - filteredListContainer.offsetTop;
          var elementHeight = filteredElement.offsetHeight;
          var elementBottom = elementOffsetInParent + elementHeight;

          //kinda works (not a better solution)
          //filteredListContainer.scrollTop = elementTop - containerTop;

          //Perfectly works - yayyy (do the math)
          if (elementBottom > containerBottom)
            filteredListContainer.scrollTop += elementBottom - containerBottom;
          // filteredListContainer.scrollBy(0, elementBottom - containerBottom);
          else if (elementOffsetInParent < containerScrollPosition)
            filteredListContainer.scrollTop = elementOffsetInParent;
        } catch (err) {
          console.log(err);
        }
      },
      getModalName: function () {
        if (this.searchType == "user") {
          return "Search Users";
        } else if (this.searchType == "group") {
          return "Search Groups";
        }
        return "";
      },
      getModalIcon: function () {
        if (this.searchType == "user")
          return "static/assets/img/MainNavIcons/icon-groups-blue.svg";
        else if (this.searchType == "group")
          return "static/assets/img/MainNavIcons/icon-team-directory-blue.svg";
        else return "static/assets/img/MainNavIcons/icon-team-directory-blue.svg";
      },
      hasErrors: function () {
        var hasErrors = !this.selectedUsers || this.selectedUsers.length == 0;
        // if (this.createGroupModal.NewGroupType == "adhoc" && !hasErrors)
        //   hasErrors = !this.groupName || !this.groupName.trim(); // || !this.groupDescription || !this.groupDescription.trim();
        return hasErrors;
      },
      toggleGroupAccess: function () {
        //this.isPrivate = !this.isPrivate;
      },
      showUserAlphabetHeader: function (user, index) {
        var showHeader = index == 0;
        if (!showHeader) {
          var prevUser = this.filteredUsers[index - 1];
          showHeader = prevUser.Header != user.Header;
        }
        return showHeader;
      }
    }
  };

</script>

<style lang="scss">
  // @import "../../styles.less";
  #create-group {
    &.is-plugin-view {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      overflow-x: hidden;
      background-color: $white;
      width: $Plugin-width;

      .filtered-list-container {
        height: 40vh;
      }
    }

    .component-header {
      font-size: 20px;
      color: $blue-lt;
      padding: 15px;
      border-bottom: 1px solid $gray-lt;

      .group-type-image {
        width: 30px;
        height: 30px;
        margin-right: 5px;
        display: inline-block;
        vertical-align: bottom;
      }
    }

    .component-body {
      padding: 15px;
      border-bottom: 1px solid $gray-lt;

      .error-message {
        color: $red;
      }

      .group-access-toggle {
        display: inline-block;
        padding: 4px;
        font-size: 12px;
        line-height: 15px;
        background-color: $green;
        color: #ffffff;
        font-weight: 300;
        border-radius: 12px;

        .access-icon {
          width: 15px;
          height: 15px;
          text-align: center;
          background-color: #ffffff;
          color: #555555;
          border-radius: 50%;
          font-size: 11px;
        }

        .access-icon.access-private {
          margin-left: 5px;
          color: $blue-lt;
        }

        .access-icon.access-public {
          margin-right: 5px;
          color: $green;
        }

        .access-title {
          width: 35px;
        }

        .access-title.access-private {
          margin-left: 5px;
        }

        .access-title.access-public {
          margin-right: 5px;
        }

        &.is-public {
          .access-private {
            display: none;
          }
          .access-public {
            display: inline-block;
          }
        }

        &.is-private {
          background-color: $blue-lt;

          .access-public {
            display: none;
          }
          .access-private {
            display: inline-block;
          }
        }
      }

      .group-access-note {
        display: inline-block;
        padding: 4px 6px;
        font-size: 12px;
      }

      .content-nav {
        height: $Content-nav-height;
        padding: 10px;
        width: 100%;
        clear: both;
        border-bottom: 1px solid $gray-lt;
        border-left: 1px solid $gray-lt;
        border-radius: 10px 10px 0 0;
        background-color: $white;
        .content-title {
          color: $primary;
        }

        .create-btn {
          margin-top: 4px;
        }
      }

      .input-text-field {
        font-size: 14px;
      }

      .input-text-field::placeholder,
      .filter-text::placeholder {
        color: $gray-dk !important;
      }

      .selected-list-container {
        border: 1px solid #d5d5d5;
        border-radius: 5px;
        padding: 4px;
        max-height: 135px;
        overflow-x: hidden;
        cursor: text;

        .selected-item {
          border: 1px solid #e5e5e5;
          display: inline-block;
          margin: 5px;
          border-radius: 5px;
          overflow: hidden;
          vertical-align: top;

          .selected-item-avatar {
            display: inline-block;
            background-color: #555555;
          }

          .selected-item-title {
            display: inline-block;
            font-size: 12px;
            padding: 3px 3px 3px 3px;
          }

          .selected-item-remove {
            margin-right: 3px;
            cursor: pointer;
          }

          .groupitem{
            background-color: #1B80CF;
            color: #ffffff;
          }
        }

        .filter-text {
          border-width: 0px; // background-color: #fafafa;
          width: 200px;
          font-size: 16px;
          padding: 4px;
          margin: 4px;
          line-height: 24px;
          vertical-align: top;
        }
      }

      .filtered-list-container {
        margin-top: 20px;
        margin-bottom: 15px;
        border: 1px solid #d5d5d5;
        border-radius: 5px;
        height: 300px;
        overflow-x: hidden;

        .contacts-header {
          background: #e7e7e7;
          font-weight: 600;
          padding: 0px 5px;
        }

        .filtered-item {
          padding: 5px;
          border-top: 1px solid #e5e5e5;
          cursor: pointer;
          position: relative;

          .alphabet-header {
            display: none;
            background: $gray-lt;
            color: $gray-dk;
            font-weight: 600;
            padding: 0px 5px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
          }

          &.show-alphabet-header {
            padding-top: 25px !important;

            .alphabet-header {
              display: block;
            }
          }

          &:first-child {
            border-top-width: 0px;
          }

          &:hover {
            background-color: #fafafa;
          }

          &.current-scroll-item {
            background: $blue-lt;
            color: #ffffff;

            .filtered-item-select-hint {
              float: right;
              display: block;
            }
          }

          .filtered-item-avatar {
            float: left;
            margin-right: 10px;
          }

          .filtered-item-select-hint {
            display: none;
          }

          .filtered-item-title {
            line-height: 25px;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: auto;
          }

          .filtered-item-detail {
            width: auto;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0px;
            line-height: 15px;
            font-size: 12px;
            height: 15px;
            margin-bottom: 5px;
          }
        }
      }
    }

    .component-footer {
      padding: 15px;
      text-align: right;
    }

    ::placeholder {
      font-weight: normal;
      color: #d5d5d5;
    }

    .form-control {
      border: 1px solid #d5d5d5 !important;
      box-shadow: none;
    } // .cancel-btn {
    //     background-color: @Color-gray-lt;
    // }
    label {
      font-weight: normal;
    }
  }

</style>
