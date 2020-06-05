<template>
  <div id="left-nav-menu" v-bind:class="{'side-nav-collapsed': sideNavCollapsed, 'is-plugin-view' : isPluginView}">
    <div class='app-logo' v-bind:class="{'app-logo-collapsed': sideNavCollapsed}" v-if="!sideNavCollapsed">
      <img class="app-logo-img" src='static/assets/img/pando-hr-logo.svg' />
    </div>
    <div class='app-logo' v-bind:class="{'app-logo-collapsed': sideNavCollapsed}" v-else-if="sideNavCollapsed">
      <img class="app-logo-img" src='static/assets/img/icon-product-hr-lake.svg' />
    </div>
    <div class="side-nav-list-wrapper">
      <ul class="side-nav-list">
        <li class='subcategories'>
          <ul class="subcategory-list">
            <li id="assign-hr-checklist" class='subcategory-item' v-on:click="setMenuSelection('task-mgmt') + changeActiveTab('assign-hr-checklist') + changeActiveCategory('none')">
              <!-- <div id="assign-hr-checklist-lake"> -->
                <img class="subcategory-icon" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-lake.svg">
              <!-- </div>
              <div  id="assign-hr-checklist-vanilla" class="hidden">
                <img class="subcategory-icon hidden" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg">
              </div> -->
              Assign HR Checklist
            </li>
          </ul>
        </li>

        <li id="Pando-HR-Dashboards" class="category active" v-on:click="dashboardOpen = !dashboardOpen">
          <div class="category-accessory-btn">
           <img class="accessory-btn-icon" v-if="dashboardOpen" v-bind:src="'https://assets.autoalert.com/img/autoalert-icons/icon-chevron-down-' + (activeCategory === 'Pando-HR-Dashboards' ? 'vanilla' : 'lake') + '.svg'" />
           <img class="accessory-btn-icon" v-if="!dashboardOpen" v-bind:src="'https://assets.autoalert.com/img/autoalert-icons/icon-chevron-right-' + (activeCategory === 'Pando-HR-Dashboards' ? 'vanilla' : 'lake') + '.svg'" />
          </div>
            <div class="category-link">
              <div id="Pando-HR-Dashboards-lake" class="icon-container hidden">
                <img src="static/assets/img/SVGIcons/icon-dashboard-lake.svg" class="icon-image">
              </div>
              <div id="Pando-HR-Dashboards-vanilla" class="icon-container">
                <img src="https://assets.autoalert.com/img/autoalert-icons/icon-dashboard-vanilla.svg" class="icon-image">
              </div>
              <div class="category-name">
                Dashboards
              </div>
            </div>
        </li>
        <li class='subcategories' v-bind:class="dashboardOpen ? 'dashboard-subcategories' : 'is-not-visible'">
          <ul class="subcategory-list" v-on:click="changeActiveCategory('Pando-HR-Dashboards')">
            <li id="all-dashboards" class='subcategory-item active' v-on:click="setMenuSelection('dashboard') + changeActiveTab('all-dashboards')">
              All
            </li>
            <li id="current-employees" class='subcategory-item' v-on:click="setMenuSelection('current-employees') + changeActiveTab('current-employees')">
              Current Employees
            </li>
            <li id="new-hires" class='subcategory-item' v-on:click="setMenuSelection('new-hires') + changeActiveTab('new-hires')">
              New Hires
            </li>
            <!-- <li id="terminated" class='subcategory-item' v-on:click="setMenuSelection('terminated') + changeActiveTab('terminated')">
              Terminated
            </li> -->
            <li id="assets" class='subcategory-item' v-on:click="setMenuSelection('assets') + changeActiveTab('assets')">
              Assets
            </li>
            <!-- <li id="documents" class='subcategory-item' v-on:click="setMenuSelection('documents') + changeActiveTab('documents')">
              Documents
            </li> -->
          </ul>
        </li>

        <li id="Pando-HR-Task-Builder" class="category" v-on:click="taskBuilderOpen = !taskBuilderOpen" >
          <div class="category-accessory-btn">
            <img class="accessory-btn-icon" v-if="taskBuilderOpen" v-bind:src="'https://assets.autoalert.com/img/autoalert-icons/icon-chevron-down-' + (activeCategory === 'Pando-HR-Task-Builder' ? 'vanilla' : 'lake') + '.svg'" />
            <img class="accessory-btn-icon" v-if="!taskBuilderOpen" v-bind:src="'https://assets.autoalert.com/img/autoalert-icons/icon-chevron-right-' + (activeCategory === 'Pando-HR-Task-Builder' ? 'vanilla' : 'lake') + '.svg'" />
          </div>
            <div class="category-link">
              <div id="Pando-HR-Task-Builder-lake" class="icon-container">
                <img class="icon-image" src="static/assets/img/SVGIcons/icon-task-builder-lake.svg">
              </div>
              <div id="Pando-HR-Task-Builder-vanilla" class="icon-container hidden">
                <img class="icon-image" src="static/assets/img/SVGIcons/icon-task-builder-vanilla.svg">
              </div>
                <div class="category-name">
                  Task Builder
                </div>
              </div>
        </li>
        <li class='subcategories' v-bind:class="taskBuilderOpen ? 'task-builder-subcategories' : 'is-not-visible'">
          <ul class="subcategory-list" v-on:click="changeActiveCategory('Pando-HR-Task-Builder')">
            <li id="document-manager" class='subcategory-item' v-on:click="setMenuSelection('doc-mgmt') + changeActiveTab('document-manager')">
              <!-- <div id="document-manager-lake"> -->
                <img src="static/assets/img/SVGIcons/icon-form-lake.svg" class="subcategory-icon">
              <!-- </div> -->
              <!-- <div id="document-manager-vanilla" class="hidden">
                <img  src="https://assets.autoalert.com/img/autoalert-icons/icon-form-vanilla.svg" class="subcategory-icon hidden">
              </div> -->
              Document Manager
            </li>
            <li id="asset-manager" class='subcategory-item' v-on:click="setMenuSelection('asset-mgmt') + changeActiveTab('asset-manager')">
              <!-- <div id="asset-manager-lake"> -->
                <img src="static/assets/img/SVGIcons/icon-asset-management-lake.svg" class="subcategory-icon">
              <!-- </div> -->
              <!-- <div id="asset-manager-vanilla" class="hidden">
                <img src="static/assets/img/SVGIcons/icon-asset-management-vanilla.svg" class="subcategory-icon hidden">
              </div> -->
              Asset Manager
            </li>
            <li id="checklist-manager" class='subcategory-item'  v-on:click="setMenuSelection('list-mgmt') + changeActiveTab('checklist-manager')">
              <!-- <div id="checklist-manager-lake"> -->
                <img src="static/assets/img/SVGIcons/icon-processes-lake.svg" class="subcategory-icon">
              <!-- </div> -->
              <!-- <div id="checklist-manager-vanilla" class="hidden">
                <img src="https://assets.autoalert.com/img/autoalert-icons/icon-processes-vanilla.svg" class="subcategory-icon hidden">                
              </div> -->
              Checklist Manager
            </li>
          </ul>
        </li>
      </ul>
    </div>
      <!-- <div class='app-logo' v-bind:class="{'app-logo-collapsed': sideNavCollapsed}">
        <img class="app-logo-img" v-if="sideNavCollapsed" :src='sideNavLogo' />
        <div class="app-logo-text" v-if="!sideNavCollapsed"><img :src="mainNavLogo" v-on:click="refreshPubNub" /></div>
      </div> -->
  </div>
</template>

<script>
  import EventBus from "@/lib/utilities/eventBus.js";
  import { mapGetters } from 'vuex';
  import { SnotifyPosition} from 'vue-snotify';

  export default {
    name: 'sideNav',
    props: [
      'sideNavCollapsed',
      'isPluginView'
    ],
    computed: {
      ...mapGetters(['menuTab', 'menuCategory', 'EndOfChecklist']),
      sideNavLogo: function () {
        let vm = this;
        if (!vm.sideNavCollapsed) {
          return 'static/assets/img/pando-logo-white.png'
        } else {
          return 'static/assets/img/pando_connect_logo.png';
        }
      },
      mainNavLogo: function () {
        if (!this.collapseSideNav) {
          return "static/assets/img/PandoLongLogo.png";
        } else {
          return "static/assets/img/pando_connect_logo.png";
        }
      }
    },
    created: function(){
      this.setMenuSelection('dashboard');
    },
    mounted: function(){
      this.changeActiveTab('all-dashboards');      
    },
    data() {
      return {
        activeTab: '',
        activeCategory: 'Pando-HR-Dashboards',
        dashboardOpen: true,
        taskBuilderOpen: true,

      }
    },
    watch: {
      menuTab: function(){
        if(this.menuTab.length > 0){
          this.changeActiveTab(this.menuTab);
        }
      },
      menuCategory: function(){
        if(this.menuCategory.length > 0){
          this.changeActiveCategory(this.menuCategory);     
        }             
      }
    },
    methods:{
      changeActiveCategory(id){
        if(id === 'none'){
          if(this.EndOfChecklist.isTerminating || this.EndOfChecklist.isAdHoc){
            document.getElementById(this.activeCategory).classList.remove('active');
            document.getElementById(this.activeCategory + '-lake').classList.remove('hidden');
            document.getElementById(this.activeCategory + '-vanilla').classList.add('hidden'); 
            this.activeCategory = id;
          }
        }
        else if(this.activeCategory === 'none' && id !== 'none'){
          document.getElementById(id).classList.add('active');
          document.getElementById(id + '-lake').classList.add('hidden');
          document.getElementById(id + '-vanilla').classList.remove('hidden'); 
          this.activeCategory = id;
        }
        else if(id !== this.activeCategory){
          document.getElementById(id).classList.add('active');
          document.getElementById(id + '-lake').classList.add('hidden');
          document.getElementById(id + '-vanilla').classList.remove('hidden'); 

          document.getElementById(this.activeCategory).classList.remove('active');
          document.getElementById(this.activeCategory + '-lake').classList.remove('hidden');
          document.getElementById(this.activeCategory + '-vanilla').classList.add('hidden'); 
          this.activeCategory = id;
        }
      },
      changeActiveTab(id){
        if(id !== this.activeTab){
          if(this.activeTab.length > 0){
            document.getElementById(this.activeTab).classList.remove('active');
          }
          document.getElementById(id).classList.add('active');
          this.activeTab = id;
          this.$store.dispatch('setMenuTab', '');
        }
      },
      refreshPubNub: function () {
        this.$store.dispatch("refreshPubNub");
      },
      switchApplication() {
        const appUrl = process.env.URL_PANDO_INBOX
        if (window.isElectron) {
          let remote = window.Electron.remote
          let win = remote.getCurrentWindow()          
          win.loadURL(appUrl)
        } else {
          window.location.href = appUrl
        }
      },
      getMainNavMenuIcon(menuName, iconName) {
        let iconPath = "static/assets/img/MainNavIcons/icon-" + iconName;
        // if (this.category && (this.category.toLowerCase() == menuName.toLowerCase() || (menuName == "Inbox" && this.category
        //     .indexOf(menuName) == 0)))
        //   iconPath = iconPath + "-white.svg";
        // else
          iconPath = iconPath + "-blue.svg";

        return iconPath;
      },
      isActive: function (menuName) {
        try {
          if (!menuName || !menuName.trim() || !this.category || !this.category.trim())
            return false;

          menuName = menuName.toLowerCase();
          let currentCategory = this.category.toLowerCase();

          if (menuName === 'inbox: unread')
            return currentCategory === 'inbox' && this.unread;
          else if (currentCategory === menuName)
            return true;
          else if (currentCategory.indexOf(menuName) === 0) {
            if (menuName === 'inbox')
              return true;

            //return '': category && category.indexOf('Inbox') < 0, 'active': category && category.indexOf('Inbox') == 0
          }
        } catch (err) {
          console.log(err);
        }
        return false;
      },
      setMenuSelection: function(menu){
        let vm = this;
        if(menu === "asset-mgmt"){
          // Set the panel to 2 pain
          vm.$store.dispatch("setPanelView", "2");
          // Reset the override of the selected component
          vm.$store.dispatch("setMenuSelected", "AssetTypeList");
          vm.$store.dispatch("setTypeSelected", "AssetItemList")
          vm.$store.dispatch('setKey', 'Assets');
        }
        else if(menu === "doc-mgmt"){
          // Set the panel to 2 pain
          vm.$store.dispatch("setPanelView", "2");
          // Reset the override of the selected component
          vm.$store.dispatch("setMenuSelected", "DocumentTypeList");
          vm.$store.dispatch("setTypeSelected", "DocumentItemList");
          vm.$store.dispatch('setKey', 'Documents');
        }
        else if(menu === "list-mgmt"){
          // Set the panel to 2 pain
          vm.$store.dispatch("setPanelView", "2");
          // Reset the override of the selected component
          vm.$store.dispatch("setMenuSelected", "ChecklistTypeList");
          vm.$store.dispatch("setTypeSelected", "ChecklistItemList");
          vm.$store.dispatch('setKey', 'Checklists');
        }
        else if(menu === "task-mgmt"){
            vm.$store.dispatch("setMenuSelected", "TaskSelector");
            vm.$store.dispatch("setPanelView", "1")
        }
        else if(menu === "dashboard"){
            vm.$store.dispatch("setMenuSelected", "Dashboard");
            vm.$store.dispatch("setPanelView", "1");
            vm.$store.dispatch('setPillSelected', '');
            vm.$store.dispatch('setTabSelected', 'task-dashboard');
        }
        else if(menu === "current-employees"){
            vm.$store.dispatch("setMenuSelected", "Dashboard");
            vm.$store.dispatch("setPanelView", "1");
            vm.$store.dispatch('setPillSelected', 'current-employees');
            vm.$store.dispatch('setTabSelected', 'task-dashboard');
        }
        else if(menu === "new-hires"){
            vm.$store.dispatch("setMenuSelected", "Dashboard");
            vm.$store.dispatch("setPanelView", "1");
            vm.$store.dispatch('setPillSelected', 'new-hires');
            vm.$store.dispatch('setTabSelected', 'task-dashboard');
        }
        else if(menu === 'terminated'){
          //do the thing
        }
        else if(menu === "assets"){
            vm.$store.dispatch("setMenuSelected", "Dashboard");
            vm.$store.dispatch("setPanelView", "1");
            vm.$store.dispatch('setPillSelected', '');
            vm.$store.dispatch('setTabSelected', 'asset-dashboard');
        }
        else if(menu === "documents"){
            vm.$store.dispatch("setMenuSelected", "Dashboard");
            vm.$store.dispatch("setPanelView", "1");
            vm.$store.dispatch('setPillSelected', '');
            vm.$store.dispatch('setTabSelected', 'document-dashboard');
        }
        else{
          alert("Menu selection coming soon to a theater near you!");
        }
      },
    }
  }

</script>

<style lang='scss' scoped>
@import '../../../styles/_navigationmenu.scss';

.is-not-visible{
  overflow: hidden;
  height: 0px;
  transition: $Transition-speed;
}
.dashboard-subcategories{
  height: 125px;
  // height: 155px; this size is for when document dashboard is on the side nav
  transition: $Transition-speed;
}
.task-builder-subcategories{
  transition: $Transition-speed;
  height: 45px;
}
</style>

