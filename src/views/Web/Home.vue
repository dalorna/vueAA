<template>
  <div>
    <div id="wrapper" class="top-nav-section">
      <div id="left">
        <button class='btn btn-gray-xlt mr-2 side-nav-toggler-btn' @click='toggleSideNav()'>
          <i class='fa fa-bars' />
        </button>
      </div>
      <!-- <div id="right">
        <span>Buttons?</span>
      </div> -->
      <div id="right" class="hr-title">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <!-- <span> HR Checklist</span> -->
          <div class="dealer-selector pull-right">
            <!-- <select class="form-control-sm" v-if="HrStores && HrStores.length > 1" v-model="HrSelectedDealer" v-on:change="UpdateDashboardForDealer()"> -->
            <select class="form-control-sm" id="accountSelect" v-if="HrStores && HrStores.length > 1" v-model="selectedAccountPlatformId" v-on:change="UpdateDashboardForDealer($event)">
              <option v-for="(dealer, i) in HrStores" v-bind:key="i" v-bind:value="dealer.accountPlatformId">
              {{dealer.name}}
              </option>
            </select>
          </div>
        </div>
      </div> 

    </div>

    <!-- BEGIN SINGLE PANEL CODE -->
    <div class="panel-container single-panel" v-if="panelView == '1P'">
      <div class="panel">
          <component v-bind:is="menuSelected"></component>
      </div>
    </div>
    <!-- END SINGLE PANEL CODE  -->

    <!-- BEGIN TWO PANELS CODE -->
    <div class="panel-container two-panel-3-7" v-if="panelView == '2P'">
      <div class="panel card card-shadow">
          <component v-bind:is="menuSelected"></component>
      </div>
      <div class="panel card card-shadow">
          <component v-bind:is="typeSelected"></component>
      </div>
    </div>
    <!-- END TWO PANELS CODE -->

    <!-- BEGIN MODAL CODE -->
      <div>
        <base-modal v-if="Modal.showing"></base-modal>
      </div>
    <!-- END MODAL CODE -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import TaskSelector from '../../components/Task/TaskSelector';
import TaskWizardSuccess from '../../components/Task/TaskWizardSuccess'
import Dashboard from '../../components/Dashboard/Dashboard.vue';
import BaseModal from '../../components/shared/BaseModal.vue';

import DocumentTypeList from '../../components/Documents/DocumentTypeList.vue';
import AssetTypeList from '../../components/Assets/AssetTypeList.vue';
import ChecklistTypeList from '../../components/Checklists/ChecklistTypeList.vue';

import DocumentItemList from '../../components/Documents/DocumentItemList.vue';
import AssetItemList from '../../components/Assets/AssetItemList.vue';
import ChecklistItemList from '../../components/Checklists/ChecklistItemList.vue';


// import GenericList from '../../components/Generics/GenericList';


export default {
  name: 'home',
    components: {
    TaskSelector,
    Dashboard,
    BaseModal,
    TaskWizardSuccess,
    DocumentTypeList,
    AssetTypeList,
    ChecklistTypeList,
    DocumentItemList,
    AssetItemList,
    ChecklistItemList,
  },
  computed: {
    ...mapGetters([
      'authToken',
      'User',
      'sideNavCollapsed',
      'menuSelected',
      'typeSelected',
      'panelView',
      'Key',
      'Type',
      'Modal',
      'HrStores',
      'hasHrGlobalAccess',
      'hasHrAccountAccess',
      'hasHrChecklistAccess',
      'HrScopeInView',
      'hrStep'
    ])
  },
  watch: {
    menuSelected: {
      handler(val){

        let options = document.getElementsByTagName('option');
        let select = document.getElementById('accountSelect');
        let selectedOption = select.options[select.selectedIndex].value;
        const nonGlobal = ['dashboard', 'current-employees', 'new-hires', 'assets', 'taskselector'];

        if(this.hasHrGlobalAccess){
          let gIndex = this.HrStores.findIndex(f => f.level === 'Global');
          if(nonGlobal.includes(val.toLowerCase())){
            if(gIndex >= 0){
              this.$store.dispatch('removeGlobalHrStore').then(() => {
                if(selectedOption === '-999'){
                  select.value = select.options[0].value;
                } else {
                  select.value = selectedOption;
                }
              });
            }
          } else {
            if(gIndex < 0){
              this.$store.dispatch('addGlobalHrStore').then(() => {
                select.value = selectedOption;
              });
            }
          }
        }

        if(val === 'TaskSelector'){
          let optionAccount = this.HrStores.find(f => f.level === 'Account');
          if(optionAccount){
            options = Array.from(options);
            let option = options.find(f => f.value === optionAccount.AccountPlatformID.toString());
            option.disabled = true;
          }
        } else {
          this.$store.dispatch('setHrStep', '-1');
          options = Array.from(options);
          options.forEach(e => e.disabled = false);
        }
      }
    },
    // hrStep: {
    //   handler(val) {
    //     if(this.menuSelected === 'TaskSelector'){
    //       if(val === '0'){
    //         let optionAccount = this.HrStores.find(f => f.level === 'Account');
    //         if(optionAccount){
    //           let options = document.getElementsByTagName('option');
    //           options = Array.from(options);
    //           options.forEach(e => {
    //               e.disabled = e.value === optionAccount.AccountPlatformID.toString();
    //           });
    //         }
    //       } else if (val === '1' || val === '2'){
    //         let options = document.getElementsByTagName('option');
    //         options = Array.from(options);
    //         options.forEach(e => {
    //           e.disabled = e.value !== this.HrScopeInView.AccountPlatformID.toString();
    //         });
    //       }
    //     } else {
    //       let options = document.getElementsByTagName('option');
    //       options = Array.from(options);
    //       options.forEach(e => {
    //         e.disabled = false;
    //       });
    //     }
    //   }
    // },
    HrScopeInView: {
      handler(val, old){
        this.selectedAccountPlatformId = val.accountPlatformId;
      }
    }
  },
  data() {
    return {
      showAdmin: true,
      showSetup: false,
      selectedAccountPlatformId: 0
    };
  },
  methods: {
    toggleSideNav() {
      this.$store.dispatch('toggleSideNav', !this.sideNavCollapsed);
    },
    UpdateDashboardForDealer(e){
      let context = this;
      setTimeout(() => {
        // let access = context.HrStores.find(f => f.AccountPlatformID.toString() === e.target.value);
        let access = context.HrStores.find(f => f.accountPlatformId.toString() === e.target.value);
        context.$store.dispatch('setSelectedScopeInView', access);
      }, 50);
    },
    hasPermission() {
      let permissionFound = false;

      if (this.User && this.User.Permissions) {
        this.User.Permissions.forEach(perm => {
          if (perm === 'pando.hr.user') {
            permissionFound = true;
          }
        });
      }
      return permissionFound;
    }
    // apiCall() {
    //   let vm = this;
    //   vm.loading = true;
    //   CustomerAPIClient.getCustomerDemographics().then(function (data) {
    //     vm.data = data;
    //     vm.loading = false;
    //   })
    // }
  },
  created() {
    console.log('hrScope in view', this.HrScopeInView);
    this.selectedAccountPlatformId = this.HrScopeInView.accountPlatformId;
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@import '../../../styles/_panels.scss';

.top-nav-section {
  padding: 10px;

  .side-nav-toggler-btn {
    font-size: 25px;
    padding: 8px 14px 7px;
    outline: none;
    border-width: 0px;
    background: transparent;

    &:hover {
      background: lighten($platinum, 10%);
    }

    &:active,
    &:focus {
      outline: none;
      border-width: 0px;
    }
  }
}

.panel-level-tabs {
  background: $gray-xlt;
  .nav-item {
    border-radius: $Border-radius;
    .nav-link {
      border-radius: $Border-radius $Border-radius 0 0;
      background: $gray-lt;
      margin-right: 2px;
      &.active {
        background: $white;
      }
    }
  }
}

table#customer-list {
  tr {
    td:first-child {
      border-left: 5px solid $white;
    }
    &.new-sales {
      td:first-child {
        border-left: 5px solid $blue-lt;
      }
    }
    &.used-sales {
      td:first-child {
        border-left: 5px solid $orange;
      }
    }
  }
}

.cust-name {
  vertical-align: middle;
}

.content-row-timestamp {
  width: 55px;
  text-align: right;
  font-size: 11px;
  line-height: 15px;
  height: 15px;
  margin-top: 4px;
}

.sticky-top {
  background: $white;
  box-shadow: 1px 1px 0px $gray-lt;
  top: -1px;
}

#wrapper {
  display: flex;
}

#left {
  flex: 0 0 65%;
}

#right {
  flex: 1;
  text-align: right;
  padding: 5px 5px 0px 0px;
}

.sectionHeader {
  padding-top: 10px;
  vertical-align: bottom;
  font-weight: bold;
  font-size: 18pt;
}

/* HR Pages */
  .hr-title {
    border-bottom: 1px solid #e7e7e7;
    padding: 5px 0;
  }

  .dealer-selector {
    // float:right;
    margin:5px;
  }
/* HR Pages */
  </style>
