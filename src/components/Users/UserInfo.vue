<template>
  <div id="user-actions">
    <div class="user-actions-container">
      <div class="user-actions-wrapper" v-bind:class="{'side-nav-collapsed' : sideNavCollapsed && !isPluginView }" tabindex="1">
        <div class="user-avatar-wrapper" v-on:click="toggleUserActionsPopup" tabindex="1" v-on:blur="closeUserActionsPopup">
          <!-- v-on:blur="closeUserActionsPopup" -->
          <avatar slot="activator" class="user-avatar" v-bind:type="'member'" v-bind:member="user" v-bind:width="'32px'" v-bind:height="'32px'"
            v-bind:rounded="true" v-bind:showOnlineStatus='true' data-qa-id="avatar-btn">
          </avatar>
          <div class="user-actions-dropdown" v-bind:class="{'hide-dropdown' : !showUserActionsMenu}">
            <div class="user-actions-dropdown-container">
              <div v-on:click="openUserInDirectory()" class="user-actions-dropdown-item profile-link">
                <div class="dropdown-option-wrapper">
                  <img src="static/assets/img/SVGIcons/icon-user-circle-blue.svg" class="icon-image" />
                  <div class="link-text">My Profile</div>
                </div>
              </div>
              <div v-if="!isPluginView" v-on:click="logout()" class="user-actions-dropdown-item logout-link">
                <div class="dropdown-option-wrapper">
                  <img src="static/assets/img/SVGIcons/icon_locked_blue.svg" class="icon-image" />
                  <div class="link-text">Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="avail" v-if="IsClockingIn">
          <i class="fa fa-spinner fa-spin clock-in-spinner"></i>
        </div>
        <div class="avail" v-on:click="openAvailabilityModal" v-if="!IsClockingIn">
          <img src="static/assets/img/availability-not-avaliable.png" v-if=" user.Availability == 100" />
          <img src="static/assets/img/availability-available.png" v-if=" user.Availability == 10" />
          <img src="static/assets/img/availability-busy.png" v-if=" user.Availability == 20" />
        </div>
        <div class="user-info-wrapper" v-on:click="toggleUserActionsPopup()">
          <div class="user-name">{{user.Name}}</div>
          <div class="logout-btn" v-bind:title="getSelectedStoresText()">{{user.Account}}</div>
          <!-- <div class="logout-btn" v-on:click='logout()'>Logout</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Avatar from './Avatar.vue'
  import {
    webAuth
  } from '@/auth/index'

  export default {
    name: 'userInfo',
    props: [
      'user',
      'isPluginView',
      'sideNavCollapsed',
      'logoutFunc',
      'availFunc',
      "IsClockingIn"
    ],
    components: {
      Avatar
    },
    data: () => {
      return {
        showUserActionsMenu: false
      }
    },
    methods: {
      toggleUserActionsPopup: function () {
        this.showUserActionsMenu = !this.showUserActionsMenu;
      },
      closeUserActionsPopup: function () {
        this.showUserActionsMenu = false;
      },
      getSelectedStoresText: function () {
        var text = "";
        if (this.user && this.user.SelectedStores && this.user.SelectedStores.length > 0) {
          text = this.user.SelectedStores
            .map(function (store) {
              return store.Name;
            })
            .join(", ");
        }
        return text;
      },
      logout() {
        webAuth.logout();
      },
      openAvailabilityModal: function () {
        alert("NOT IMPLEMENTED IN TEMPLATE");
      },
      openUserInDirectory: function () {
        alert("NOT IMPLEMENTED IN TEMPLATE");
      }
    }
  }

</script>

<style lang='scss' scoped>
  #user-actions {
    position: relative;

    &.is-plugin-view {
      .user-actions-container {
        max-width: $Plugin-width;
      }
    }

    .user-actions-container {
      padding: 5px 0;
      border-bottom: 1px solid $gray-lt;
      width: 100%;
      max-width: 300px;
      height: $Content-nav-height;
      display: block; // overflow-x: hidden;
      // overflow-y: hidden;
      .user-actions-wrapper {
        position: relative;

        .toggle-main-nav {
          font-size: 20px;
          width: 44px;
          height: 44px;
          line-height: 20px;
          padding: 12px;
          position: absolute;
          top: 0;
          left: 0;
          text-align: center;
          cursor: pointer;
        }

        .user-avatar-wrapper {
          position: absolute;
          top: 0px;
          left: 7px;
          padding: 6px 6px 6px 0px;
          cursor: pointer;

          .user-actions-dropdown {
            transition: $Transition-speed;
            background: #ffffff;
            position: relative;
            z-index: 1001;
            width: 210px;
            height: 80px;
            border-radius: 10px;
            overflow: hidden;

            &.hide-dropdown {
              width: 0px;
              height: 0px;
            }

            .user-actions-dropdown-container {
              border: 1px solid $gray-lt;
              border-radius: 10px;
              overflow: hidden;

              .user-actions-dropdown-item {
                &.profile-link {
                  padding: 8px 50px 4px 20px;
                }

                &.logout-link {
                  padding: 4px 50px 8px 20px;
                }

                &:active,
                &:focus,
                &:hover {
                  background: $gray-lt;
                  color: inherit;
                }

                .dropdown-option-wrapper {
                  .icon-image {
                    width: 25px;
                    height: 25px;
                    margin-right: 10px;
                    vertical-align: top;
                    display: inline-block;
                  }

                  &.logout-link {
                    .icon-image {
                      padding: 2.5px;
                    }
                  }

                  .link-text {
                    line-height: 25px;
                    font-size: 16px;
                    display: inline-block;
                    vertical-align: text-top;
                  }
                }
              }
            }
          }
        }

        .avail {
          position: absolute;
          right: 0px;
          top: 0px;
          padding: 6px 12px 6px 6px;

          img {
            width: 32px;
            height: 32px;
            cursor: pointer;
          }

          .clock-in-spinner {
            font-size: 25px;
            line-height: 32px;
          }
        }

        .user-info-wrapper {
          margin: 0px 0px 0px 48px;
          padding: 5px 0px;
          cursor: pointer;

          .user-name {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-weight: 500;
            line-height: 18px;
          }

          .logout-btn {
            color: #555555;
            font-size: 12px;
            line-height: 14px;
            padding-top: 2px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden; // &:hover {
            // 	color: @Color-blue-lt;
            // 	text-decoration: underline;
            // }
          }
        }

        &.side-nav-collapsed {
          // .user-avatar-wrapper,
          .user-info-wrapper,
          .avail {
            display: none;
          }
        }
        .text-decoration-none:hover {
          a {
            text-decoration: strikethrough;
          }
          text-decoration:none;
        }
      }
    }
  }

  .available {
    color: black; //color: #a25f2f
  }

  .busy {
    color: $blue-dk;
  }

  .nonAvailable {
    color: $gray-lt;
  }

</style>
