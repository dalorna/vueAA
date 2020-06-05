<template>
    <vue-global-frame 
    v-bind:user="User" v-bind:handleLogout="handleLogoutAction" v-bind:baseURL="baseAPIURL" v-bind:authToken="authToken" ref="vueglobalframe">
    <div slot="app-frame-slot">
      <div class="main-app-wrapper" v-if='isLoggedIn'>
      <!-- <div class="main-app-wrapper" v-if='hasHrChecklistAccess && isLoggedIn'> -->
        <div id="left-side-nav-container" v-bind:class="{'side-nav-collapsed' : sideNavCollapsed}">
          <main-nav class="main-nav-container" v-bind:class="{'side-nav-collapsed' : sideNavCollapsed}" :sideNavCollapsed='sideNavCollapsed'
            :user='User'></main-nav>
        </div>

    <!-- START NORMAL RIGHT NAV SECTION -->
        <div v-if="!showOverlapping">
          <div id="main-container" class="container-fluid" v-bind:class="{'side-nav-collapsed' : sideNavCollapsed}" v-bind:style="{'padding-right' : rightNavWidth}">
            <vue-snotify></vue-snotify>
            <router-view id='mainRouterContainer'></router-view>
          </div>
          <div id="right-side-nav-container" v-bind:style="{'width' : rightNavWidth}" v-bind:class="{'is-visible' : this.showRightNavSection}">
            <right-nav-section class="right-side-nav-container" v-bind:class="{'is-visible' : this.showRightNavSection}"></right-nav-section>
          </div>
        </div>
    <!-- END NORMAL RIGHT NAV SECTION -->

    <!-- START OVERLAPPING RIGHT NAV SECTION -->
    <!-- this is used for the dashboard so the nav section overlaps the dashboard instead of pushing it -->
        <div v-if="showOverlapping">
          <div id="main-container" class="container-fluid" v-bind:class="{'side-nav-collapsed' : sideNavCollapsed}">
            <vue-snotify></vue-snotify>
            <router-view id='mainRouterContainer'></router-view>
          </div>
          <div id="right-side-nav-container" v-bind:style="{'width' : rightNavWidth}" v-bind:class="{'is-visible' : this.showRightNavSection}">
            <right-nav-section class="right-side-nav-container" v-bind:class="{'is-visible' : this.showRightNavSection}"></right-nav-section>
          </div>
        </div>
    <!-- END OVERLAPPING RIGHT NAV SECTION -->

      </div>

      <div v-else class="invalid-user-note">
        <div class="invalid-user-note-icon">
          <img src="static/assets/img/pando-logo-lt-blue.png" />
        </div>
        <p>You are now logged out of Pando.</p>
        <button type="button" class="btn primary btn-lg" v-on:click="login()">Login</button>
        <img class="bg-bot" src="static/assets/img/svgs/byBot.svg" />
      </div>

      <!-- <marketing v-else></marketing>      -->
    </div>
  </vue-global-frame>
</template>

<script>
  import VueGlobalFrame from '@autoalert/vueglobalframe';
  import MainNav from '@/components/nav/MainNav'
  import RightNavSection from '@/components/nav/RightNavSection'
  import EventBus from "@/lib/utilities/eventBus.js";
  import Marketing from "@/views/Web/Marketing";
  import { SnotifyPosition} from 'vue-snotify';
  import { mapGetters } from 'vuex';
  import { webAuth } from '@/auth/index';

  export default {
    name: 'web',
    components: {
      VueGlobalFrame,
      MainNav,
      RightNavSection,
      Marketing
    },
    watch: {
      ErrorFromAPI: {
        handler(newError, oldError) {
          if(newError && newError !== oldError){
            this.$snotify.error(newError, 'Error', {
              showProgressBar: false,
              closeOnClick: false,
              timeout: 2500,
              pauseOnHover: true,
              position: SnotifyPosition.rightTop,
            });
            this.$store.dispatch('addErrorFromAPI', '');
          }
        }
      }
    },
    data() {
      return {
        windowWidth: 1200,
        baseAPIURL: process.env.MOTOFUZE_API
      }
    },
    created: function () {
      EventBus.$on('handleStoreUpdateNotification', (stores) => {
        try {
          if (this.$refs.vueglobalframe)
            this.$refs.vueglobalframe.handleStoreUpdateNotification(stores);
        } catch (err) {
          console.log("Error handling store update: ", err);
        }
      });
    },
    mounted: function () {
      window.addEventListener('resize', this.calculateWindowWidth);
      this.calculateWindowWidth();
    },
    computed: {
      ...mapGetters(['hasHrChecklistAccess','OIDCUser', 'sideNavCollapsed', 'User', 'showAvailModal', 'GlobalFrameBadges', 'authToken', 'detailsView', 'overlappingPane', 'ErrorFromAPI']),
      isLoggedIn: function () {
        return webAuth.user.isLoggedIn;
      },
      rightNavWidth: function () {
        let rnWidth = 0;
        if (this.showRightNavSection) {
          let leftNavWidth = this.sideNavCollapsed ? 0 : 300;
          var calcWidth = Math.floor((this.windowWidth - leftNavWidth) / 3);
          rnWidth = calcWidth < 400 ? 400 : (calcWidth > 550 ? 550 : calcWidth);
        }
        return rnWidth + 'px';
      },
      showRightNavSection: function () {
        return this.detailsView != undefined && this.detailsView != ''; //Supply a condition to trigger this
      },
      showOverlapping: function(){
        return this.overlappingPane;
      }
    },
    methods: {
      calculateWindowWidth: function () {
        this.windowWidth = document.documentElement.clientWidth;
      },
      handleLogoutAction: function () {
        // console.log("Handle logout action");
        webAuth.logout();
      }
    }
  }

</script>

<style lang='scss' scoped>

  #userActionsMenu {

    background-color: white;

  }

  .invalid-user-note {
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    margin: 10% 0;


    .invalid-user-note-icon {
      margin-bottom: 20px;
      font-size: 100px;
    }
    p {
      margin-bottom: 25px;
    }
  }

  .bg-bot {
    position: absolute;
    bottom: -15%;
    left: 23%;
    right: 50%;
    width: 30%;
    height: auto;
    z-index: -1;
  }

  .main-app-wrapper {
    position: relative;

    #left-side-nav-container {
      width: 300px;
      background-color: $white;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 1px solid $gray-lt;
      transition: $Transition-speed; // box-shadow: 0px 0px 20px 0px #BDC0C2;
      &.side-nav-collapsed {
        width: 44px;
      }
    }

    #main-container {
      transition: $Transition-speed;
      padding-left: 300px;
      padding-right: 0;

      &.side-nav-collapsed {
        padding-left: 45px;
      }

      #mainRouterContainer {
        height: 100%;
      }
    }

    #right-side-nav-container {
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 0;
      width: 0px;
      transition: $Transition-speed;
      background: #ffffff;

      &.is-visible {
        border-left: 1px solid $gray-lt;
        box-shadow: 0px 0px 20px 0px $platinum;
        z-index: 1001;
      }
    }

    #left-side-nav-container,
    #main-container,
    #right-side-nav-container {
      height: calc(100vh - #{$Global-frame-header-height});
    }
  }

</style>
