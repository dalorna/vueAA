<template>
  <div class="global-frame">
    <header class="global-frame-header">
      <div class="navbar-brand">
        <img src="static/assets/img/autoalert_logo_caption.svg" />
      </div>
      <div class="navbar-user-info" v-if="user && user.Id">
        <div class="navbar-account" v-on:click="openStoreSwitcher" v-bind:class="{'cant-switch' : !canSwitch}">
          <div class="info-text">
            <i class="fa fa-home"></i>&nbsp;{{viewSelectedStoreName}}</div>
        </div>
        <div class="navbar-status" v-on:click="openAvailabilityModal">
          <img class="icon-image" v-bind:style="{'width' : avatarHeight+'px' , 'height' : avatarHeight+'px'}" src="static/assets/img/availability-not-available.png"
            v-if="user.Availability == 100" />
          <img class="icon-image" v-bind:style="{'width' : avatarHeight+'px' , 'height' : avatarHeight+'px'}" src="static/assets/img/availability-available.png"
            v-if="user.Availability == 10" />
          <img class="icon-image" v-bind:style="{'width' : avatarHeight+'px' , 'height' : avatarHeight+'px'}" src="static/assets/img/availability-busy.png"
            v-if="user.Availability == 20" />
        </div>
        <div class="navbar-user" v-on:click="toggleUserActionsPopup" tabindex="1" v-on:blur="closeUserActionsPopup">
          <div class="avatar-container rounded icon-image" v-bind:style="{'width' : avatarHeight+'px' , 'height' : avatarHeight+'px'}">
            <div class="user-avatar">
              <div class="online-status">
                <div class="online-status-icon" v-bind:class="onlineStatus(user)"></div>
              </div>
              <img class="avatar-image" v-if="user && user.AvatarUrl" :src="user.AvatarUrl" v-on:error="hideImage($event)" />
              <img class="avatar-image" v-if="user && !user.AvatarUrl && user.Id == '9999999'" src="static/assets/img/pando_bot_avatar.png"
                v-on:error="hideImage($event)" />
              <div class="avatar-text" v-if="user && user.Name" v-html="getMemberInitials(user)" v-bind:style="{'background' : getAvatarBGColor(), 'font-size': getFontSizeForAvatar(), 'line-height' : avatarHeight+'px'}"></div>
              <img class="avatar-image" v-if="!user" src="static/assets/img/avatar.png" />
            </div>
          </div>
          <div class="info-text">
            {{user.Name}}
            <i class="fa fa-caret-down down-icon"></i>
          </div>
          <div class="user-actions-dropdown" v-bind:class="{'hide-dropdown' : !showUserActionsMenu}">
            <div class="user-actions-dropdown-container">
              <div v-on:click="openProfile()" class="user-actions-dropdown-item profile-link">
                <div class="dropdown-option-wrapper">
                  <img src="static/assets/img/SVGIcons/icon-user-circle-blue.svg" class="option-image" />
                  <div class="link-text">My Profile</div>
                </div>
              </div>
              <div v-on:click="logoutUser()" class="user-actions-dropdown-item logout-link">
                <div class="dropdown-option-wrapper">
                  <img src="static/assets/img/SVGIcons/icon_locked_blue.svg" class="option-image" />
                  <div class="link-text">Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="global-frame-body">
      <div class="app-switcher-section">
        <nav class="app-switcher-menu">
          <ul class="app-switcher-list">
            <li class="app-switcher-list-item inbox-item" title="Pando Inbox">
              <a class="app-link" :href="getUrlForInboxOption('inbox')">
                <div class="unread-badge" v-if="inboxBadgeCount">{{inboxBadgeCount}}</div>
                <div class="svg-icon" v-html="getIconForName('inbox')"></div>
              </a>
            </li>
            <li class="app-switcher-list-item inbox-item" title="Messages">
              <a class="app-link" :href="getUrlForInboxOption('messages')">
                <div class="unread-badge" v-if="messagesBadgeCount">{{messagesBadgeCount}}</div>
                <div class="svg-icon" v-html="getIconForName('messages')"></div>
              </a>
            </li>
            <li class="app-switcher-list-item inbox-item" title="Processes">
              <a class="app-link" :href="getUrlForInboxOption('processes')">
                <div class="unread-badge" v-if="processesBadgeCount">{{processesBadgeCount}}</div>
                <div class="svg-icon" v-html="getIconForName('processes')"></div>
              </a>
            </li>
            <li class="app-switcher-list-item list-separator"></li>
            <li class="app-switcher-list-item" v-for="appItem in appsList" v-bind:key="appItem.Type" v-bind:title="getNameForAppEnum(appItem.Type)"
              v-on:click="handleAppClick(appItem.Type)">
              <a class="app-link" :href="getUrlForApp(appItem.Type)" v-bind:class="{'is-active' : isCurrentApp(appItem.Type)}">
                <div class="svg-icon" v-html="getSVGIconForAppEnum(appItem.Type)"></div>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="app-frame-container">
        <slot name="app-frame-slot"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'globalFrame',
    props: [
      "inboxBadgeCount",
      "messagesBadgeCount",
      "processesBadgeCount",
      "user",
      "handleProfile",
      "handleLogout",
      "handleAvailability",
      "handleStoreSwitcher"
    ],
    data: () => {
      return {
        appsEnum: {
          PandoInbox: 1,
          PandoConnect: 2,
          // PandoSocial: 3,
          ReviewPro: 4,
          PandoWorkScheduler: 5,
          PandoHR: 6
        },
        domainUrlsEnum: {
          Production: {
            PandoInbox: "https://inbox.autoalert.com",
            PandoConnect: "https://connect.autoalert.com",
            PandoSocial: "https://social.autoalert.com",
            ReviewPro: "https://reviewpro.autoalert.com",
            PandoWorkScheduler: "https://pando-ws.autoalert.com",
            PandoHR: "https://pando-hr.autoalert.com"
          },
          Stage: {
            PandoInbox: "https://stage-inbox.autoalert.com",
            PandoConnect: "https://stage-connect.autoalert.com",
            PandoSocial: "https://stage-social.autoalert.com",
            ReviewPro: "https://stage-reviewpro.autoalert.com",
            PandoWorkScheduler: "https://stage-pando-ws.autoalert.com",
            PandoHR: "https://stage-pando-hr.autoalert.com"
          },
          Development: {
            PandoInbox: "http://localhost:9080",
            PandoConnect: "http://localhost:9082",
            PandoSocial: "http://localhost:9084",
            ReviewPro: "http://localhost:9083",
            PandoWorkScheduler: "http://localhost:9081",
            PandoHR: "http://localhost:9085"
          }
        },
        AvailabilityEnum: {
          Available: 10,
          Busy: 20,
          NotAvailable: 100
        },
        avatarHeight: 32,
        showUserActionsMenu: false
      }
    },
    computed: {
      appsList: function () {
        let apps = [];
        for (let appEnum in this.appsEnum) {
          if (this.appsEnum[appEnum] != this.appsEnum.PandoHR || (this.appsEnum[appEnum] == this.appsEnum.PandoHR &&
              this.verifyPandoHRPermission())) {
            apps.push({
              Name: this.getNameForAppEnum(this.appsEnum[appEnum]),
              Type: this.appsEnum[appEnum]
            });
          }

        }

        return apps;
      },
      env: function () {
        let env = "production";
        if (location.hostname.indexOf("stage-") >= 0)
          env = "stage";
        else if (location.hostname.indexOf("localhost") >= 0)
          env = "development";
        return env;
      },
      viewSelectedStoreName: function () {
        let displayName = "";
        if (this.user) {
          displayName = this.user.ViewAccount;
          if (this.user.ViewSelectedStores && this.user.ViewSelectedStores.length == 1)
            displayName = this.user.ViewSelectedStores[0].Name;
        }
        return displayName;
      },
      canSwitch: function () {
        let canswitch = (this.user.AccountID == 1);

        if (!canswitch && this.user.AllowedStores && this.user.AllowedStores.length > 1)
          canswitch = true;

        return canswitch;
      }
    },
    methods: {
      verifyPandoHRPermission() {
        let permissionFound = false
        if (this.user && this.user.Permissions) {
          this.user.Permissions.forEach(perm => {
            if (perm == 'pando.hr.user' || perm == 'pando.hr.admin') {
              permissionFound = true
            }
          });
        }
        return permissionFound;
      },
      getMemberInitials: function () {
        var initials = "@";
        try {
          initials = this.user.FirstName.charAt(0) + this.user.LastName.charAt(0);
        } catch (err) {}
        return initials;
      },
      getAvatarBGColor: function () {
        return '#172751'; // '#' + (this.user.AvatarBGColor || '1F8BD5');
      },
      getFontSizeForAvatar: function () {
        var height = this.avatarHeight;
        return 2 * height / 5 + "px";
      },
      hideImage: function (event) {
        if (!event.target.classList.contains("hide-image"))
          event.target.classList.add("hide-image");
      },
      onlineStatus: function (user) {
        if (user) {
          if (user.IsAvailable || user.Availability == this.AvailabilityEnum.Available) return "is-available";
          else if (user.Availability == this.AvailabilityEnum.Busy)
            return "is-busy";
        }
        return "is-unavailable";
      },
      toggleUserActionsPopup: function () {
        this.showUserActionsMenu = !this.showUserActionsMenu;
      },
      closeUserActionsPopup: function () {
        this.showUserActionsMenu = false;
      },
      openStoreSwitcher: function () {
        if (this.canSwitch && this.handleStoreSwitcher)
          this.handleStoreSwitcher();
      },
      openAvailabilityModal: function () {
        if (this.handleAvailability)
          this.handleAvailability();
      },
      openProfile: function () {
        if (this.handleProfile)
          this.handleProfile();
        // let appUrl = this.getUrlForApp(this.appsEnum.PandoInbox) + '/#/app/teamDirectory?category=profile';
        // location.href = appUrl;
      },
      logoutUser: function () {
        if (this.handleLogout)
          this.handleLogout();
      },
      getUrlForInboxOption: function (optionName) {
        let appUrl = this.getUrlForApp(this.appsEnum.PandoInbox) + '/#/app/inbox?category=' + optionName;
        return appUrl;
      },
      handleAppClick: function (appEnum) {
        let appUrl = this.getUrlForApp(appEnum);
        location.href = appUrl;
      },
      getNameForAppEnum: function (appEnum) {
        switch (appEnum) {
          case this.appsEnum.PandoInbox:
            return "Pando Inbox";
          case this.appsEnum.PandoConnect:
            return "Pando Connect";
          case this.appsEnum.PandoSocial:
            return "Pando Social";
          case this.appsEnum.ReviewPro:
            return "Review Pro";
          case this.appsEnum.PandoWorkScheduler:
            return "Pando Work Scheduler";
          case this.appsEnum.PandoHR:
            return "Pando HR";
        }

        return "Pando";
      },
      isCurrentApp: function (appEnum) {
        let appUrl = this.getUrlForApp(appEnum);
        let currentHost = location.host;
        return appUrl.indexOf(currentHost) >= 0;
      },
      getUrlForApp: function (appEnum) {
        if (this.env == "production") {
          switch (appEnum) {
            case this.appsEnum.PandoInbox:
              return this.domainUrlsEnum.Production.PandoInbox;
            case this.appsEnum.PandoConnect:
              return this.domainUrlsEnum.Production.PandoConnect;
            case this.appsEnum.PandoSocial:
              return this.domainUrlsEnum.Production.PandoSocial;
            case this.appsEnum.ReviewPro:
              return this.domainUrlsEnum.Production.ReviewPro;
            case this.appsEnum.PandoWorkScheduler:
              return this.domainUrlsEnum.Production.PandoWorkScheduler;
            case this.appsEnum.PandoHR:
              return this.domainUrlsEnum.Production.PandoHR;
          }
        } else if (this.env == "stage") {
          switch (appEnum) {
            case this.appsEnum.PandoInbox:
              return this.domainUrlsEnum.Stage.PandoInbox;
            case this.appsEnum.PandoConnect:
              return this.domainUrlsEnum.Stage.PandoConnect;
            case this.appsEnum.PandoSocial:
              return this.domainUrlsEnum.Stage.PandoSocial;
            case this.appsEnum.ReviewPro:
              return this.domainUrlsEnum.Stage.ReviewPro;
            case this.appsEnum.PandoWorkScheduler:
              return this.domainUrlsEnum.Stage.PandoWorkScheduler;
            case this.appsEnum.PandoHR:
              return this.domainUrlsEnum.Stage.PandoHR;
          }
        } else if (this.env == "development") {
          switch (appEnum) {
            case this.appsEnum.PandoInbox:
              return this.domainUrlsEnum.Development.PandoInbox;
            case this.appsEnum.PandoConnect:
              return this.domainUrlsEnum.Development.PandoConnect;
            case this.appsEnum.PandoSocial:
              return this.domainUrlsEnum.Development.PandoSocial;
            case this.appsEnum.ReviewPro:
              return this.domainUrlsEnum.Development.ReviewPro;
            case this.appsEnum.PandoWorkScheduler:
              return this.domainUrlsEnum.Development.PandoWorkScheduler;
            case this.appsEnum.PandoHR:
              return this.domainUrlsEnum.Development.PandoHR;
          }
        }

        return "javscript:;";
      },
      getIconForName: function (name) {
        if (name == "autoalert")
          return ``;
        else if (name == "inbox")
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.42 32"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M40,15.79a.75.75,0,0,0,0-.42L36.5,1.89A2.57,2.57,0,0,0,34.06,0H6.36A2.49,2.49,0,0,0,3.92,1.89L.46,15.37a.75.75,0,0,0,0,.42A4.28,4.28,0,0,0,0,17.68V27.79A4.23,4.23,0,0,0,4.21,32h32a4.23,4.23,0,0,0,4.21-4.21V17.68A4.28,4.28,0,0,0,40,15.79ZM5.52,2.32a.81.81,0,0,1,.84-.64h27.7a.9.9,0,0,1,.84.64l3,11.49a4.25,4.25,0,0,0-1.69-.34H28.46a2.53,2.53,0,0,0-2.48,2,5.89,5.89,0,0,1-11.54,0,2.53,2.53,0,0,0-2.48-2H4.21a4.22,4.22,0,0,0-1.64.34ZM38.74,27.79a2.54,2.54,0,0,1-2.53,2.53h-32a2.54,2.54,0,0,1-2.53-2.53V17.68a2.54,2.54,0,0,1,2.53-2.52H12a.79.79,0,0,1,.8.67,7.61,7.61,0,0,0,14.9,0,.81.81,0,0,1,.8-.67h7.75a2.54,2.54,0,0,1,2.53,2.52Z"/></g></g></svg>`;
        else if (name == 'messages')
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.52 40.72"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M18.4,17.61H6.9a1.09,1.09,0,0,1,0-2.18H18.4a1.09,1.09,0,1,1,0,2.18Z" /><path class="cls-1" d="M29,23.1H6.9a1.1,1.1,0,0,1-.21-2.19H29a1.11,1.11,0,0,1,1.2,1,1.09,1.09,0,0,1-1,1.2Z" /><path class="cls-1" d="M29,28.37H6.9a1.09,1.09,0,0,1,0-2.18H29a1.09,1.09,0,0,1,0,2.18Z" /><path class="cls-1" d="M33.19,9.23h-30A3.23,3.23,0,0,0,0,12.47V31.3a3.22,3.22,0,0,0,3.19,3.24h4v4.62a1.54,1.54,0,0,0,2.56,1.17l6.54-5.79h16.9a3.22,3.22,0,0,0,3.19-3.24V12.47A3.23,3.23,0,0,0,33.19,9.23Zm1,22.07a1,1,0,0,1-.95,1.05H15.72L13,34.54H13L9.43,37.68V32.35H3.22a1,1,0,0,1-1-1V12.47a1,1,0,0,1,.95-1.05H33.22a1,1,0,0,1,1,1v.05Z"/><path class="cls-1" d="M40.3,0H9.86A3.1,3.1,0,0,0,6.62,2.93v7.91H8.85V2.93a1,1,0,0,1,1-1H40.3a1,1,0,0,1,1,1v17a1,1,0,0,1-1,1H35.07v2h5.2A3.1,3.1,0,0,0,43.52,20V3A3.1,3.1,0,0,0,40.3,0Z"/></g></g></svg>`;
        else if (name == 'processes')
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.18 47.7"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M46.59,30.7a2.59,2.59,0,0,0,2.59-2.59h0V19.59A2.59,2.59,0,0,0,46.59,17H28.94a2.59,2.59,0,0,0-2.59,2.59h0v2.76H22.87V19.59A2.59,2.59,0,0,0,20.28,17H12.94V13.7h7.34a2.59,2.59,0,0,0,2.59-2.59h0V2.58A2.59,2.59,0,0,0,20.28,0H2.59A2.59,2.59,0,0,0,0,2.58v8.53A2.59,2.59,0,0,0,2.59,13.7H9.92V17H2.59A2.59,2.59,0,0,0,0,19.59H0v8.52A2.59,2.59,0,0,0,2.59,30.7H9.92V34H2.59A2.59,2.59,0,0,0,0,36.59H0v8.53A2.59,2.59,0,0,0,2.59,47.7H20.28a2.59,2.59,0,0,0,2.59-2.58V36.59A2.59,2.59,0,0,0,20.28,34H12.94V30.7h7.34a2.59,2.59,0,0,0,2.59-2.59h0V25.35h3.48v2.76a2.59,2.59,0,0,0,2.59,2.59h7.34V34H28.94a2.59,2.59,0,0,0-2.59,2.59h0v8.53a2.59,2.59,0,0,0,2.59,2.58H46.59a2.59,2.59,0,0,0,2.59-2.58V36.59A2.59,2.59,0,0,0,46.59,34H39.28V30.7ZM3.91,11.85A1.87,1.87,0,0,1,2.05,10V3.72A1.87,1.87,0,0,1,3.91,1.85H19a1.88,1.88,0,0,1,1.86,1.86V10A1.87,1.87,0,0,1,19,11.85H3.91ZM19,36a1.86,1.86,0,0,1,1.86,1.86h0v6.22A1.86,1.86,0,0,1,19,45.93H4A1.86,1.86,0,0,1,2.1,44.07h0V37.85A1.86,1.86,0,0,1,4,36H19Zm1.86-9A1.86,1.86,0,0,1,19,28.85H4A1.86,1.86,0,0,1,2.1,27h0V20.74a1.86,1.86,0,0,1,1.81-1.89H19a1.86,1.86,0,0,1,1.86,1.86h0Zm24.55,9a1.86,1.86,0,0,1,1.86,1.86h0v6.22a1.86,1.86,0,0,1-1.86,1.86h-15a1.86,1.86,0,0,1-1.86-1.86h0V37.85A1.86,1.86,0,0,1,30.32,36h15Zm-15-7.13A1.86,1.86,0,0,1,28.46,27h0V20.74a1.86,1.86,0,0,1,1.83-1.89H45.37a1.86,1.86,0,0,1,1.86,1.86h0v6.22a1.86,1.86,0,0,1-1.8,1.92H30.32Z"/></g></g></svg>`;

      },
      getSVGIconForAppEnum: function (appEnum) {
        switch (appEnum) {
          case this.appsEnum.PandoConnect:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-964.295 15894.987 34.394 40.605"><g id="Layer_1" data-name="Layer 1" transform="translate(-964.295 15894.987)"><path id="Path_6789" data-name="Path 6789" class="cls-1" d="M34.384,5.567A5.567,5.567,0,0,0,28.817,0H5.567A5.567,5.567,0,0,0,0,5.567V7.473H12.206a5.414,5.414,0,0,1,10.655,0H34.384Z"/><path id="Path_6790" data-name="Path 6790" class="cls-1" d="M85.548,61.983V55.34H76.61a12.416,12.416,0,0,1,3.059,6.643Z" transform="translate(-51.164 -36.959)" /><path id="Path_6791" data-name="Path 6791" class="cls-1" d="M0,55.35v6.643H6.56A12.416,12.416,0,0,1,9.619,55.35Z" transform="translate(0 -36.966)"/><path id="Path_6792" data-name="Path 6792" class="cls-1" d="M0,83.421a5.567,5.567,0,0,0,5.567,5.567H21.018v6.221l7.8-6.221a5.567,5.567,0,0,0,5.567-5.567V81.76H0Z" transform="translate(0 -54.604)" /><path id="Path_6793" data-name="Path 6793" class="cls-1" d="M17.531,33.181a5.417,5.417,0,0,1-5.288-4.251H0v6.643H12.223a10.343,10.343,0,0,1,10.629,0H34.394V28.93H22.822A5.417,5.417,0,0,1,17.531,33.181Z" transform="translate(0 -19.321)" /></g></svg>`;
          case this.appsEnum.PandoSocial:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-966.295 17257 34.394 40.529"><path id="Path_7000" data-name="Path 7000" class="cls-1" d="M34.361,7.462V5.572A5.556,5.556,0,0,0,28.822,0H5.605A5.563,5.563,0,0,0,.033,5.572v.4H0V29.684H.133a5.531,5.531,0,0,0,5.472,4.643H21.028v6.2l7.794-6.2a5.562,5.562,0,0,0,5.472-4.643h.033v-.2a4.969,4.969,0,0,0,.066-.73V27.1h-.066V24.974h.066V18.341h-.066V16.218h.066V9.585h-.066V7.462h.033ZM26.434,30.878a4.133,4.133,0,0,1-4.113-4.113,3.824,3.824,0,0,1,.1-.862l-6.2-4.046a6.881,6.881,0,1,1-.431-9.021l6.7-4.444a3.726,3.726,0,0,1-.133-1.061,4.113,4.113,0,1,1,4.113,4.113,4.032,4.032,0,0,1-2.255-.7l-6.9,4.577a6.761,6.761,0,0,1,.2,3.914l6.5,4.212a4.2,4.2,0,0,1,2.454-.829,4.129,4.129,0,0,1-.033,8.258Z" transform="translate(-966.295 17257)" /></svg>`;
          case this.appsEnum.ReviewPro:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.03 104.03"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M86.4,0H17.63A17.68,17.68,0,0,0,0,17.63V86.4A17.68,17.68,0,0,0,17.63,104H86.4A17.68,17.68,0,0,0,104,86.4V17.63A17.68,17.68,0,0,0,86.4,0ZM40.65,14.54a1.18,1.18,0,0,1,.69-.35l7-1,3.14-6.33a1.19,1.19,0,0,1,2.13,0l3.14,6.35,7,1a1.18,1.18,0,0,1,.66,2l-5.07,4.95,1.2,7a1.18,1.18,0,0,1-.48,1.16,1.16,1.16,0,0,1-.7.22,1.18,1.18,0,0,1-.55-.14l-6.27-3.29-6.27,3.3a1.19,1.19,0,0,1-1.73-1.26l1.2-7-5.07-5A1.18,1.18,0,0,1,40.65,14.54ZM52.5,36.25A13.88,13.88,0,1,1,38.62,50.12,13.88,13.88,0,0,1,52.5,36.25ZM13.66,29.42a1.19,1.19,0,0,1-1.73-1.26l1.2-7-5.07-5a1.18,1.18,0,0,1,.66-2l7-1,3.14-6.33a1.19,1.19,0,0,1,2.13,0l3.14,6.35,7,1a1.18,1.18,0,0,1,.66,2l-5.07,4.95,1.2,7a1.18,1.18,0,0,1-.48,1.16,1.16,1.16,0,0,1-.7.22,1.18,1.18,0,0,1-.55-.14l-6.27-3.29ZM24.08,97.21a28.42,28.42,0,1,1,56.83,0Zm71.82-81-5.07,4.95,1.2,7a1.18,1.18,0,0,1-.48,1.16,1.16,1.16,0,0,1-.7.22,1.18,1.18,0,0,1-.55-.14L84,26.12l-6.27,3.3A1.19,1.19,0,0,1,76,28.16l1.2-7-5.07-5a1.18,1.18,0,0,1,.66-2l7-1L83,6.83a1.19,1.19,0,0,1,2.13,0l3.14,6.35,7,1a1.18,1.18,0,0,1,.66,2Z"/></g></g></svg>`;
          case this.appsEnum.PandoWorkScheduler:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.03 104.03"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M79.08,95.77a3.65,3.65,0,0,1-3.65-3.65V85.68A3.65,3.65,0,0,1,79.08,82h25V76.77h-25a3.65,3.65,0,0,1-3.65-3.65V66.69A3.65,3.65,0,0,1,79.08,63h25V57.53h-25a3.65,3.65,0,0,1-3.65-3.65V47.45a3.65,3.65,0,0,1,3.65-3.65h25V17.63A17.68,17.68,0,0,0,86.4,0H17.63A17.68,17.68,0,0,0,0,17.63V24.8H27.12a3.65,3.65,0,0,1,3.65,3.65v6.43a3.65,3.65,0,0,1-3.65,3.65H0v5.25H27.12a3.65,3.65,0,0,1,3.65,3.65v6.43a3.65,3.65,0,0,1-3.65,3.65H0V86.4A17.68,17.68,0,0,0,17.63,104H86.4a17.64,17.64,0,0,0,14.9-8.26Zm-8.29-3.65a3.65,3.65,0,0,1-3.65,3.65H38.57a3.65,3.65,0,0,1-3.65-3.65V85.68A3.65,3.65,0,0,1,38.57,82H67.13a3.65,3.65,0,0,1,3.65,3.65Zm0-19a3.65,3.65,0,0,1-3.65,3.65H38.57a3.65,3.65,0,0,1-3.65-3.65V66.69A3.65,3.65,0,0,1,38.57,63H67.13a3.65,3.65,0,0,1,3.65,3.65Zm0-19.24a3.65,3.65,0,0,1-3.65,3.65H38.57a3.65,3.65,0,0,1-3.65-3.65V47.45a3.65,3.65,0,0,1,3.65-3.65H67.13a3.65,3.65,0,0,1,3.65,3.65Zm0-19a3.65,3.65,0,0,1-3.65,3.65H38.57a3.65,3.65,0,0,1-3.65-3.65V28.46a3.65,3.65,0,0,1,3.65-3.65H67.13a3.65,3.65,0,0,1,3.65,3.65Zm0-19a3.65,3.65,0,0,1-3.65,3.65H38.57a3.65,3.65,0,0,1-3.65-3.65V9.46a3.65,3.65,0,0,1,3.65-3.65H67.13a3.65,3.65,0,0,1,3.65,3.65Z" /></g></g></svg>`;
          case this.appsEnum.PandoHR:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.03 104.03"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M77.86,25.38,67.6,28.73,71.28,40,81.54,36.7c3.4-1.11,5.55-4.23,4.42-7.7S81.25,24.28,77.86,25.38Z"/><path class="cls-1" d="M95.52,63.2l-14-14.3-6.64,2.16,5.55,17.05-13,4.23L51.05,22l25.2-8.21c11.17-3.64,19.92,1.69,23,11,2.85,8.75-1,15.18-5.12,18.36L104,52.44V17.63A17.68,17.68,0,0,0,86.4,0H17.63A17.68,17.68,0,0,0,0,17.63v21L8.12,36l6.12,18.79L35.14,48,29,29.19,42,25,58.4,75.29l-13,4.23L38.83,59.3l-20.9,6.81,6.59,20.22-13,4.23L0,55.15V86.4A17.68,17.68,0,0,0,17.63,104H86.4A17.68,17.68,0,0,0,104,86.4v-26Z"/></g></g></svg>`;
          default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-965.502 17106 33.988 40.76"><g id="Symbol_1186_22" data-name="Symbol 1186 – 22" transform="translate(-991 17006)"><path id="Path_4379" data-name="Path 4379" class="cls-1" d="M33.988,5.576A5.535,5.535,0,0,0,28.5,0H5.483A5.564,5.564,0,0,0,0,5.576V7.524H33.988Z" transform="translate(25.498 100)" /><rect id="Rectangle_1670" data-name="Rectangle 1670" class="cls-1" width="33.988" height="6.683" transform="translate(25.498 118.455)"/><path id="Path_4380" data-name="Path 4380" class="cls-1" d="M0,63.282a5.535,5.535,0,0,0,5.483,5.576H20.759V75.1l7.7-6.24a5.535,5.535,0,0,0,5.483-5.576V61.6H0Z" transform="translate(25.498 65.662)" /><rect id="Rectangle_1671" data-name="Rectangle 1671" class="cls-1" width="33.988" height="6.683" transform="translate(25.498 109.648)"/></g></svg>`;
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  /* Global Frame */

  // THE BELOW VALUES ARE FOR REFERENCE IF THIS FILE IS PORTED TO ANOTHER APP
  // PLEASE ENSURE THAT THE BELOW VALUES ARE DEFINED IN THE APP'S VARIABLES AND COLORS SCSS FILES
  // AND IF THIS FILE IS PORTED, PLEASE REPLACE THE PATH FOR APP LOGO WITH A VALID PATH
  // $Global-app-switcher-width: 60px;
  // $Global-frame-header-height: 60px;
  // $gray-lt: #E7E7E7
  // $blue-dk: #172751
  // $blue-lt: #1F8BD5
  // $red: #ED2124
  // $platinum: #BDC0C2;
  // $green:   #3FAF49;
  // $blue-xdk: #08173e;
  .global-frame {
    background: $blue-lt; // background: -moz-linear-gradient(-45deg, #{$blue-dk} 0%, #{$blue-lt} 50%, #{$blue-lt} 100%);
    // background: -webkit-linear-gradient(-45deg, #{$blue-dk} 0%, #{$blue-lt} 50%, #{$blue-lt} 100%);
    // background: linear-gradient(135deg, #{$blue-dk} 0%, #{$blue-lt} 50%, #{$blue-lt} 100%);
    // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#{$blue-dk}', endColorstr='#{$blue-lt}', GradientType=1);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    -webkit-box-direction: normal;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    min-width: 850px;

    .global-frame-header {
      position: relative;
      height: $Global-frame-header-height;
      padding: 0;
      flex-direction: row;
      -webkit-box-direction: normal;
      -webkit-box-orient: horizontal;
      -webkit-flex-direction: row;
      -ms-flex-direction: row;
      width: 100%;
      background: $blue-lt;
      background: -moz-linear-gradient(left, $blue-dk 0%, $blue-lt 50%, $blue-lt 100%);
      background: -webkit-linear-gradient(left, $blue-dk 0%, $blue-lt 50%, $blue-lt 100%);
      background: linear-gradient(to right, $blue-dk 0%, $blue-lt 50%, $blue-lt 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#{$blue-dk}', endColorstr='#{$blue-lt}', GradientType=1);

      .navbar-brand img {
        height: 36px;
        width: auto;
        margin-left: $Global-app-switcher-width;
        margin-top: 7px;
      }

      .navbar-user-info {
        float: right;

        .navbar-user,
        .navbar-status,
        .navbar-account {
          display: inline-block;
          height: 60px;
          margin: 0px 10px;
          vertical-align: top;
          cursor: pointer;

          .info-text {
            line-height: 60px;
            display: inline-block;
            color: #fff;
            font-weight: 500;
            font-size: 14px;
            margin: 0px 5px;

            .down-icon {
              font-size: 20px;
              vertical-align: middle;
            }
          }

          .icon-image {
            margin: 14px 5px;
            display: inline-block;
            vertical-align: middle;
          }
        }

        .navbar-account {
          &.cant-switch {
            cursor: not-allowed;

            .info-text {
              color: $gray-lt;
            }
          }
        }

        .navbar-user {
          position: relative;

          .avatar-container {
            overflow: hidden;
            position: relative;
            z-index: 1;

            &.rounded {
              .user-avatar {
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

            .user-avatar {
              .online-status {
                width: 33.33%;
                height: 33.33%;
                max-width: 40px;
                max-height: 40px;
                position: absolute;
                bottom: 0px;
                right: 0px;
                padding: 0%;
                background: $platinum;
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

            .hide-image {
              display: none;
            }
          }

          .user-actions-dropdown {
            transition: $Transition-speed;
            background: #ffffff;
            position: relative;
            width: 100%;
            height: 80px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            overflow: hidden;
            z-index: 10001;
            margin-top: -1px;

            &.hide-dropdown {
              // width: 0px;
              height: 0px;
            }

            .user-actions-dropdown-container {
              border: 1px solid $gray-lt;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
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
                  .option-image {
                    width: 25px;
                    height: 25px;
                    margin-right: 10px;
                    vertical-align: top;
                    display: inline-block;
                  }

                  &.logout-link {
                    .option-image {
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
      }
    }

    .global-frame-body {
      position: relative;
      height: calc(100vh - #{$Global-frame-header-height}); // overflow: hidden;
      .app-switcher-section {
        width: $Global-app-switcher-width;
        height: calc(100vh - #{$Global-frame-header-height});
        padding: 0;
        position: absolute;
        left: 0;
        top: 0;
        overflow-x: hidden;
        overflow-y: auto;
        color: $blue-lt;
        text-align: center;
        background: $blue-lt;
        background: -moz-linear-gradient(top, $blue-dk 1%, $blue-lt 40%, $blue-lt 100%);
        background: -webkit-linear-gradient(top, $blue-dk 1%, $blue-lt 40%, $blue-lt 100%);
        background: linear-gradient(to bottom, $blue-dk 1%, $blue-lt 40%, $blue-lt 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=#{$blue-dk}, endColorstr=#{$blue-lt}, GradientType=0);

        .app-switcher-menu {
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          width: $Global-app-switcher-width;

          .app-switcher-list {
            list-style: none;
            padding: 0px;

            .app-switcher-list-item {
              display: block;
              cursor: pointer;
              padding: 0px;
              transition: all .3s ease;
              text-decoration: none;
              color: #fff;
              outline: none;
              line-height: 1.5;
              height: 60px;
              overflow: hidden;

              &.list-separator {
                border-bottom: 1px solid lighten($color: $blue-dk, $amount: 45);
                height: 1px;
                padding: 0px;
                margin: 5px 10px;
                cursor: none;
              }

              .app-link {
                text-decoration: none;
                display: block;
                width: 100%;
                height: 60px;
                padding: 15px 0px;
                position: relative;

                .unread-badge {
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  background: $red;
                  color: #ffffff;
                  padding: 1px 5px;
                  font-size: 11px;
                  min-width: 16px;
                  line-height: 15px;
                  height: 16px;
                  border-radius: 8px;
                  display: inline-block;
                  vertical-align: top;
                  text-align: center;
                  -webkit-transition: all .3s ease;
                  -moz-transition: all .3s ease;
                  -ms-transition: all .3s ease;
                  -o-transition: all .3s ease;
                  transition: all .3s ease;

                  &.is-hidden {
                    -webkit-opacity: 0;
                    -moz-opacity: 0;
                    opacity: 0;
                  }
                }

                .svg-icon {
                  fill: #fff;
                  transition: all .3s ease;
                  width: 30px;
                  height: 30px; // overflow: hidden;
                  display: inline-block;
                  line-height: 45px;
                }

                &:hover,
                &:focus,
                &:active,
                &.is-active {
                  background: #fff;

                  .svg-icon {
                    fill: $blue-lt;
                  }
                }
              }

              &.inbox-item {
                .app-link {
                  &:focus,
                  &:active,
                    {
                    background: transparent;

                    .svg-icon {
                      fill: #ffffff;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .app-frame-container {
        flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        margin-left: $Global-app-switcher-width;
        display: block;
        position: relative;
        height: calc(100vh - #{$Global-frame-header-height});
        overflow: auto;
        padding: 0;
        background: $gray-lt;
      }
    }
  }

  /* End Global Frame */

</style>
