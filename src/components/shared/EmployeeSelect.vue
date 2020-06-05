<template>
    <div id="create-group">
        <div class="component-header" v-if="!doNotShowTitle">
            <img class="group-type-image" v-bind:src="getModalIcon()" /> {{getModalName()}}
        </div>
        <div class="component-body">
            <div class="selected-list-container" v-on:click="focusOnFilterText()">
                <div class="selected-item-label">To:</div>
                <div v-for="(user, index) of selectedUsers" v-bind:key="user.Id" class="selected-item">
                    <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'30px'" v-bind:height="'30px'" class="selected-item-avatar"></avatar>
                    <div class="selected-item-title">{{user.Name}}</div>
                    <i class="fa fa-times selected-item-remove" v-on:click="deselectUser(index)"></i>
                </div>
                <input type="text" ref="filterText" class="filter-text" v-on:keydown="handleKeydownEvent($event)" placeholder="Search users"/>
            </div>
            <div class="user-selection-container">
                <small>Please enter at least one character to filter users. Use arrow keys (↑/↓) to scroll and enter/return key (↩) to select.</small>
                <div class="filtered-list-wrapper">
                    <div class="filtered-list-container" id="filtered_list_container" v-bind:class="{'is-not-visible' : !filterText || filterText.length == 0, 'user-list-empty' : filterText && filterText.length > 0 && (!filteredUsers || filteredUsers.length == 0)}">
                        <div class="no-matching-users-note" v-if="(!filteredUsers || filteredUsers.length == 0) && filterText && filterText.trim().length > 0">No matching users found</div>
                        <div v-for="(user, index) of filteredUsers" v-bind:key="index" class="filtered-item" v-on:click="selectUser(user, index)"
                             v-bind:class="{'show-alphabet-header' : showAlphabetHeader(user, index), 'current-scroll-item' : index == currentScrollIndex}"
                             v-bind:id="'filtered_item_'+index">
                            <div class="alphabet-header">{{user.Header}}</div>
                            <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'45px'" v-bind:height="'45px'" v-bind:rounded='true' v-bind:showOnlineStatus='true'
                                    class="filtered-item-avatar"></avatar>
                            <div class="filtered-item-select-hint">select</div>
                            <div class="filtered-item-title">{{user.Name}}</div>
                            <div class="filtered-item-detail">{{user.OrgGroupName ? user.OrgGroupName + ' | ' : ''}}{{user.Platform}}</div>
                        </div>
                    </div>
                    <div v-if="filterText && filterText.length > 0 && pages && pages.length > 1" class="pagination-wrapper">
                        <div class="btn-group pagination-btn-group" role="group">
                            <button type="button" class="btn page-btn" v-on:click="setCurrentPage(0)">
                                <i class="fa fa-step-backward"></i>
                            </button>
                            <button type="button" class="btn page-btn" v-bind:class="{'active-page' : currentPage == pageId}" v-for="pageId of pages"
                                    v-bind:key="pageId" v-on:click="setCurrentPage(pageId)">{{pageId + 1}}</button>
                            <button type="button" class="btn page-btn" v-on:click="setCurrentPage(totalPages-1)">
                                <i class="fa fa-step-forward"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Avatar from "../../components/shared/Avatar.vue";
  import NavMenu from "../../components/Plugins/NavMenu";
  import enums from "../../utilities/enums";
  import { generatePagingList } from '../../utilities/custom'


  export default {
    name: "EmployeeSelect",
    props: ['usersSelected', 'userIdSelected', 'doNotShowTitle'],
    components: { Avatar, NavMenu
    },
    watch: {
      userIdSelected: {
        handler(val, oldVal){
          if(val !== oldVal){
            this.selectedUsers = [];
            this.loadData();
          }
        }
      }
    },
    computed: {
      //...mapGetters(['Employees', 'EmployeesSelected', 'Groups'])
      ...mapGetters(['allowedUsers', 'user', 'groups', 'appUsers']),
      filteredUsers: function () {
        if (!this.filterText || this.filterText.trim().length == 0)
          return [];

        //Filtered users
        let users = [];
        let self = this;
        if (self.allowedUsers && self.allowedUsers.length > 0) {
          users = self.allowedUsers.filter(function (user) {
            return self.needsDisplay(user);
          });
        }

        //Filtered favorites
        let favorites = [];
        if (users && users.length > 0) {
          for (let user of users)
            user.Header = user.Name.charAt(0).toUpperCase();
          favorites = users.filter(function (user) {
            return user.IsFavorite;
          });
          if (favorites && favorites.length > 0) {
            favorites = JSON.parse(JSON.stringify(favorites));
            for (let user of favorites)
              user.Header = "Favorites";
          }
        }

        let filteredUsers = favorites && favorites.length > 0 ? favorites.concat(users) : users;
        this.totalPages = filteredUsers && filteredUsers.length > 0 ? Math.ceil(filteredUsers.length / this.pageLength) :
          0;
        //If the current page is greater than available, reset it
        if (this.currentPage >= this.totalPages)
          this.currentPage = this.totalPages - 1;

        if (this.currentPage < 0)
          this.currentPage = 0;

        //#region ********** EXTRACT USERS FOR CURRENT PAGE **********
        if (filteredUsers && filteredUsers.length > this.pageLength) {
          filteredUsers = filteredUsers.splice(this.currentPage * this.pageLength, this.pageLength);
        }
        ///#endregion

        if (filteredUsers && this.currentScrollIndex > filteredUsers.length)
          this.currentScrollIndex = filteredUsers.length - 1;

        return filteredUsers;
      },
      pages: function () {
        let pages = generatePagingList(this.totalPages, this.currentPage);
        return pages;
      }
    },
    data() {
      return {
        selectedUsers: [],
        filterText: null,
        errorMessage: null,
        groupName: null,
        groupDescription: null,
        isPrivate: false,
        inputTimeout: null,
        scrollTimeout: null,
        currentScrollIndex: 0,
        totalPages: 0,
        currentPage: 0,
        pageLength: 20
      };
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
        this.filterText = null;
        this.currentScrollIndex = 0;
        this.currentPage = 0;
        this.$emit('selectUserEvent', user);
      },
      deselectUser: function (index) {
        const removedUser = this.selectedUsers.splice(index, 1);
        if(removedUser && removedUser.length === 1){
          this.$emit('removeUserEvent', removedUser[0]);
        }
        this.$refs.filterText.focus();
      },
      needsDisplay: function (user) {
        try {
          //Do not display inactive
          if (!user.Active)
            return false;
          else if (this.selectedUsers && this.selectedUsers.length > 0 && this.selectedUsers.findIndex(member =>
            member.Id == user.Id) >= 0)
            return false;
          else if (this.filterText && this.filterText.trim().length > 0) {
            let searchText = this.filterText.trim().toLowerCase();
            return (
              user.Name.toLowerCase().indexOf(searchText) >= 0 ||
              (user.Email && user.Email.toLowerCase().indexOf(searchText) >= 0) ||
              (user.UserName && user.UserName.toLowerCase().indexOf(searchText) >= 0) ||
              (user.Platform && user.Platform.toLowerCase().indexOf(searchText) >= 0)
            );
          }
        } catch (err) {}
        return true;
      },
      handleKeydownEvent: function (event) {
        //8 = backspace
        if (event.keyCode == 8) {
          if ((!this.filterText || !this.filterText.trim()) && this.selectedUsers && this.selectedUsers.length > 0)
            this.selectedUsers.pop();
        } else if (event.keyCode == enums.KeyCodes.UpArrow) {
          event.preventDefault();
          let filteredCount = this.filteredUsers.length;
          if (this.currentScrollIndex == 0) {
            this.currentPage = this.currentPage > 0 ? this.currentPage - 1 : this.totalPages - 1;
            this.currentScrollIndex = this.filteredUsers.length - 1;
          } else
            this.currentScrollIndex = this.currentScrollIndex > 0 ? this.currentScrollIndex - 1 : filteredCount - 1;
          this.scrollToElementIfNeeded('filtered_item_' + this.currentScrollIndex);
        } else if (event.keyCode == enums.KeyCodes.DownArrow) {
          event.preventDefault();
          let filteredCount = this.filteredUsers.length;
          if (this.currentScrollIndex == filteredCount - 1)
            this.currentPage = this.currentPage < this.totalPages - 1 ? this.currentPage + 1 : 0;
          this.currentScrollIndex = this.currentScrollIndex == filteredCount - 1 ? 0 : this.currentScrollIndex + 1;
          this.scrollToElementIfNeeded('filtered_item_' + this.currentScrollIndex);
        } else if (event.keyCode == enums.KeyCodes.Enter) {
          if(!this.filteredUsers || this.filteredUsers.length == 0){
            return;
          }
          else{
            event.preventDefault();
            let user = this.filteredUsers[this.currentScrollIndex];
            this.selectUser(user, this.currentScrollIndex);
          }
        }

        if (this.inputTimeout)
          clearTimeout(this.inputTimeout);

        let self = this;
        self.inputTimeout = setTimeout(function () {
          self.filterText = event.target.value;
          if (!self.filterText || self.filterText.length == 0) {
            self.currentPage = 0;
            self.currentScrollIndex = 0;
          }
        }, 300);
      },
      scrollToElementIfNeeded: function (elementId) {
        try {
          if (!this.filteredUsers || this.filteredUsers.length == 0)
            return;

          if (this.scrollTimeout)
            clearTimeout(this.scrollTimeout);

          this.scrollTimeout = setTimeout(function () {
            let filteredListContainer = document.getElementById('filtered_list_container');
            let filteredElement = document.getElementById(elementId);

            let containerScrollPosition = filteredListContainer.scrollTop;
            let containerBottom = containerScrollPosition + filteredListContainer.offsetHeight;
            let elementOffsetInParent = filteredElement.offsetTop - filteredListContainer.offsetTop;
            let elementHeight = filteredElement.offsetHeight;
            let elementBottom = elementOffsetInParent + elementHeight;

            //Perfectly works - yayyy (do the math)
            if (elementBottom > containerBottom)
              filteredListContainer.scrollTop += elementBottom - containerBottom;
            // filteredListContainer.scrollBy(0, elementBottom - containerBottom);
            else if (elementOffsetInParent < containerScrollPosition)
              filteredListContainer.scrollTop = elementOffsetInParent;
          }, 100);
        } catch (err) {
          console.log(err);
        }
      },
      getModalName: function () {
        return "Select Employees";
      },
      getModalIcon: function () {
        return "static/assets/img/MainNavIcons/icon-team-directory-blue.svg";
      },
      toggleGroupAccess: function () {
        this.isPrivate = !this.isPrivate;
      },
      showAlphabetHeader: function (user, index) {
        let showHeader = index == 0;
        if (!showHeader) {
          let prevUser = this.filteredUsers[index - 1];
          showHeader = prevUser.Header != user.Header;
          // prevUser.Name.toLowerCase().charAt(0) !=
          // user.Name.toLowerCase().charAt(0);
        }
        return showHeader;
      },
      setCurrentPage: function (pageId) {
        this.currentPage = pageId;
        this.currentScrollIndex = 0;
      },
      loadData: function () {
        const vm = this;
         // vm.$store
         //   .dispatch('getAllUsers')
         //   .then(() => {
            //vm.$store.dispatch('getGroups');
            if(vm.usersSelected && vm.usersSelected.length) {
              for(let i = 0; i < vm.usersSelected.length; i++){
                this.selectedUsers.push(vm.usersSelected[i]);
              }
            } else if(vm.userIdSelected && vm.userIdSelected.length){
              for(let i = 0; i < vm.userIdSelected.length; i++){
                let selectedFromId = vm.appUsers.find(f => f.Id === vm.userIdSelected[i]);
                if(selectedFromId){
                  this.selectedUsers.push(selectedFromId);
                }
              }
            }
          // })
          // .catch((err) => {
          //   console.log('Failed to get users');
          //   console.log(err);
          // });
      }
    },
    created: function () {
      this.loadData();
    }
  }
</script>

<style lang="scss">
    // @import "../../styles.less";
    #create-group {
        position: relative;
        height: 100%;

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
            max-height: calc(100% - 162px);

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
                color: lighten($gray-dk, 25%) !important;
            }

            .selected-list-container {
                border: 1px solid #d5d5d5;
                border-radius: 5px;
                padding: 4px;
                max-height: 135px;
                overflow-x: hidden;
                cursor: text;

                .selected-item-label {
                    line-height: 30px;
                    margin: 5px;
                    width: 20px;
                    text-align: left;
                    float: left;
                }

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
                        padding: 3px 3px 3px 0px;
                    }

                    .selected-item-remove {
                        margin-right: 3px;
                        cursor: pointer;
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

            .user-selection-container {
                position: relative;

                .filtered-list-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ffffff;

                    .filtered-list-container {
                        // margin-top: 15px; // margin-bottom: 0px;
                        border: 1px solid $platinum;
                        border-radius: 5px;
                        height: 300px;
                        overflow-x: hidden;
                        transition: $Transition-speed;

                        &.is-not-visible {
                            height: 0px;
                            border-width: 0px;
                        }

                        &.user-list-empty {
                            height: 62px !important;
                        }

                        .contacts-header {
                            background: #e7e7e7;
                            font-weight: 600;
                            padding: 0px 5px;
                        }

                        .filtered-item {
                            padding: 5px;
                            border-top: 1px solid $gray-lt;
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

                        .no-matching-users-note {
                            text-align: center;
                            padding: 20px 10px;
                            font-size: 20px;
                            line-height: 20px;
                            font-weight: 300;
                        }
                    }

                    .pagination-wrapper {
                        margin-top: 15px;
                    }
                }
            }

            .existing-direct-messages-container {
                margin-top: 15px;
                border-top: 1px solid $gray-lt;

                .existing-direct-messages-header {
                    margin: 15px 0px;
                }

                .existing-direct-messages-list {
                    border: 1px solid $gray-lt;
                    max-height: 340px;
                    overflow-x: hidden;

                    .existing-direct-message {
                        font-size: 16px;
                        line-height: 25px;
                        font-weight: 500;
                        padding: 10px;
                        margin: 10px;
                        background: lighten($gray-lt, 5%); // border-top: 1px solid $gray-lt;
                        height: 45px;
                        overflow: hidden; // &:first-child {
                        //   border-top-width: 0px;
                        // }
                    }
                }
            }
        }

        .component-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            min-height: 102px;
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
