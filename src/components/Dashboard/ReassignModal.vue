<template>
    <div>
        <img id="reassign-modal-close-button" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" class="float-right modal-close-btn" v-on:click="closeModal()">
      <div class="section-header">
        <div class="modal-title">
          <div class="reassign-title">Reassign</div>
        </div>
      </div>
      <div class="section-body">
        <div class="search-bar">
          <input id="reassign-modal-search" type="search" class="form-control form-control-sm reassign-search-bar" placeholder="Search" v-on:keyup="search()" v-model="searchText">
        </div>
        <div class="scroll employee-selection">
          <table :id="'reassign-modal-employee' + claimant.id" v-for="claimant of filteredList" v-bind:key="claimant.id">
              <tr class="employee-row" v-on:click="toggleStepAssignUserSelection(claimant)">
                <td class="employee-row-td">
                  <avatar v-bind:type="'claimant'" v-bind:member="claimant" v-bind:width="'40px'" v-bind:height="'40px'" v-bind:rounded='true'></avatar>
                </td>
                <td class="employee-checkbox">
                  <i class="pull-right checkbox-img" v-bind:class="{'fa fa-check-square font-blue' : claimant.Selected, 'fa fa-square-o' : !claimant.Selected}"></i>
                    <!-- <input type="checkbox" class="pull-right"> -->
                  <div>{{claimant.name}}</div>
                  <div>
                    <!-- <small v-html="formatClaimantInfo(claimant)"></small> -->
                  </div>
                </td>
              </tr>
          </table>
          </div>
      </div>
      <div class="section-footer">
        <small class="float-left error-msg" v-show="usersSelected.length > 1">You can only select one user.</small>
        <div class="section-footer-actions-container">
          <button id="reassign-modal-assign-button" class="btn primary--text" type="button" v-on:click="assign()">Assign</button>
          <button id="reassign-modal-cancel-button" class="btn primary--text" type="button" v-on:click="closeModal()">Cancel</button>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SnotifyPosition} from 'vue-snotify';
import Avatar from '../../components/shared/Avatar.vue';

export default {
    name: "ReassignModal",
    computed: {
        ...mapGetters(['Processes', 'GroupMembers', 'EmployeeTaskList', 'Reassign'])
    },
    components: {
      Avatar
    },
    data() {
        return {
            usersSelected: [],
            noUsersSelected: false,
            exceedUsersSelected: false,
            searchText: '',
            filteredList: [],
        }
    },
    created: function () {
        // this.$store.dispatch('getGroupMemebers', this.Processes.Task);
        // console.log(this.GroupMembers)
        this.search()
    },
    methods:{
      search: function(){
        var vm = this;
        vm.filteredList = [];

        if(vm.searchText.length >= 3){       
          vm.EmployeeTaskList.forEach(function (value, key){
            if (!(value.name.toLowerCase().search(vm.searchText.toLowerCase()) === -1)) {
                vm.filteredList.push(JSON.parse(JSON.stringify(value)));
            }            
          })
        }
        else{
          vm.filteredList = JSON.parse(JSON.stringify(vm.EmployeeTaskList));
        }
      },
      assign: function(){
        //can only be one user
        let vm = this;
        this.$store.dispatch('hrStatusChange', {task: this.Processes.Task, user: this.usersSelected, status: 2}).then((success) => {
          if(!success){
            vm.$snotify.error('The status failed to change', 'Status Error', {
              showProgressBar: false,
              closeOnClick: false,
              timeout: 2500,
              pauseOnHover: true,
              position: SnotifyPosition.rightTop,
            });
          }
          this.$store.dispatch('clearReassignModalData');
          this.closeModal();
        })
      },
      closeModal: function(){
          // this.$store.dispatch("setAssets", ''); ????
          this.$store.dispatch('closeModal');
          this.$store.dispatch('clearReassignModalData');
      },
      toggleStepAssignUserSelection: function (user) {
        if(this.usersSelected.includes(user)){
          let index = this.usersSelected.findIndex(f => f.id === user.id);
          this.usersSelected.splice(index, 1);
            user.Selected = false;
        }
        else{
          this.usersSelected.push(user);
          user.Selected = true;
        }
        if(this.usersSelected.length > 1){
          document.getElementById('reassign-modal-assign-button').classList.add('disabled');
        }
        else{
          document.getElementById('reassign-modal-assign-button').classList.remove('disabled');
        }
      },
    }
    
}
</script>

<style>
  .modal-container {
    width: 90%;
    max-width: 850px;
    max-height: 600px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    /* padding: 10px; */
  }
  .scroll{
    overflow: auto;
  }
      .modal-close-btn {
        float: right;
        width: 25px;
        height: 25px;
        margin-right: 18px;
        margin-top: 15px;
        cursor: pointer;
      }

      .modal-title {
        font-size: 20px;
        /* color: $blue-lt; */
        color: #1F8BD5;
        padding: 15px;

        /* .modal-icon {
          width: 30px;
          height: 30px;
          margin-right: 5px;
          display: inline-block;
          vertical-align: bottom;
        } */
      }

      .modal-subtitle {
        font-size: 14px;
      }

      .section-body {
        padding: 15px;
        max-height: 460px;
        overflow-x: hidden;
        border-top: 1px solid #E7E7E7;

        /* .step-claimants {
          height: 350px;
          overflow-x: hidden;
          overflow-y: auto;
          padding-right: 0px;
          border: 1px solid #d5d5d5;
        } */
      }

      .section-footer {
        padding: 15px;
        border-top: 1px solid #E7E7E7;
        text-align: right;

       /* .section-footer-actions-container {
          min-width: 200px;
          display: inline-block;
          text-align: right;
        } */
      
    }

    .label-left {
      text-align: left;
    }

    .employee-selection{
      border: 1px solid #e7e7e7
    }
    .reassign-search-bar{
      margin-right: 20px;
      margin-left: 20px;
      margin-bottom: 15px;
      padding: 5px;
      max-width: 200px;
    }
    .search-bar{
      border-bottom: 1px solid #E7E7E7; 
      margin-bottom: 20px;
      margin-left: -20px;
      margin-right: -20px;
    }

    .employee-row{
      border-bottom: 1px 
      solid #d5d5d5; 
      cursor: pointer;
    }

    .employee-row-td{
      padding: 5px;
    }
    .employee-checkbox{
      width: 100%; 
      padding: 5px;
    }
    .checkbox-img{
      margin: 12px 5px;
      font-size: 18px;
    }
    .error-msg{
      color: red;
    }
</style>
