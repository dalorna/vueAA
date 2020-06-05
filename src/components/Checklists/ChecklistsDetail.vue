<template>
    <div class="card checklist-detail">
        <div class="card-header">
            <div class="card-title">
                <b>{{addeditText}}:</b> <span class="checklist-title">{{ taskItem.name }}</span>
                <div class="float-right marigin5right">
                    <img class="close-button" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="closeDetails()" />
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <div></div>
            <span class="category-title">Tasks: </span>
            <div class="row">
                <div class="col-md-12">
                    <label for="taskNameInput" class="category-selection top-padding">Task name:</label>
                    <input id="taskNameInput" name="Task Name" v-validate="'required|min:3|max:128'" class="form-control category-selection" type="text" v-model="taskItem.name"/>
                    <span class="error">{{ errors.first('Task Name') }}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <label for="inputNumberTimeFrame" class="category-selection left100 top-padding">Completion Time Frame:</label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <input id="inputNumberTimeFrame" name="Time Frame" min="1" v-validate="'required|min:1|max_value:365'" class="category-selection form-control" type="number" v-model="timeValue"/>
                </div>
                <div class="col-md-4">
                    <select class="category-selection form-control" v-model="timeType">
                        <option v-for="t in timeGroups" :value="t" :key="t" :id="'timeType-' + t">{{t}}</option>
                    </select>
                </div>
            </div>
            <div class="error">{{ errors.first('Time Frame') }}</div>
            <div class="row">
                <div class="col-md-12">
                    <label for="taskItemTextArea" class="category-selection top-padding">Description:</label>
                    <textarea id="taskItemTextArea" name="Task Description" v-validate="'max:512'" class="category-selection form-control" v-model="taskItem.description"></textarea>
                    <div class="error">{{ errors.first('Task Description') }}</div>                    
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-md-12">
                    <label for="taskItemTypeSelect" class="category-selection">Type</label>
                    <select id="taskItemTypeSelect" class="category-selection form-control" v-model="taskItem.type">
                        <option v-for="t in templateTypes" :value="t.key" :key="t.name">{{t.name}}</option>
                    </select>
                </div>
            </div> -->
        </div>
        <div v-if="addeditText === 'Edit'" class="content category-title">
            Assets: 
            <div class="col-1 float-right margin24right">
                <img class="add-new-button" height="30" width="30" src="static/assets/img/SVGIcons/icon-plus-blue.svg" v-on:click="addAsset()" />
            </div>
        </div>        
        <div v-if="addeditText === 'Edit'" class="panel-action-bar bb-1 content">
            <div class="content">
                  <div v-for="asset in correctAssetVersions" v-bind:key="asset.id" class="row pb-1">
                        <div class="col">
                        <select disabled class="form-control category-selection">
                          <option>{{asset.name}}</option>
                        </select>
                        </div>
                        <div class="col-1">
                            <i class="float-right" >
                                <img class="close-button margin1" src="static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="removeOldAsset(asset.versionId)" />
                            </i>
                        </div>
                </div>  
                <div v-for="(c, i) in assetsSelected" v-bind:key="c + '_' + i">
                    <div class="row pb-1">
                        <div class="col">
                        <select :id="'Assets_' + i" :name="'Assets_' + i" class="form-control category-selection" @change="selectChange($event, i)" v-validate="{not_in: getExList('Assets_' + i)}" v-model="assetsSelected[i]">
                          <option v-for="(k, index) in AssetsFromAssets" :value="k.id" v-bind:key="index">{{k.name}}</option>
                        </select>
                            <div>
                                <span class="error errorMargin">{{errors.first('Assets_' + i)}}</span>
                            </div>
                        </div>
                        <div class="col-1">
                            <i class="float-right" >
                                <img class="close-button margin1" src="static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="removeAsset(assetsSelected[i])" />
                            </i>
                        </div>
                    </div>
                </div>    
            </div>        
        </div>        
        <div v-if="addeditText === 'Edit'" class="category-title content">
            Assignees:
        </div>
        <div v-if="addeditText === 'Edit'" class="panel-action-bar bb-1 content">
            <div class="content">
                <employee-select class="remove-padding" :doNotShowTitle="true" :userIdSelected="userIdSelected" @selectUserEvent="addAssignee" @removeUserEvent="removeAssignee" ></employee-select>
            </div>        
        </div>
        <div class="panel-action-bar bb-1 content">
            <button v-if="addeditText === 'Edit'" type="button" class="btn btn-outline" v-on:click="deleteItem()">Delete</button>
            <button type="button" class="save-button btn float-right" v-on:click="save($event)">Save</button>&nbsp;
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from "vuex";
import { SnotifyPosition} from 'vue-snotify';
import EmployeeSelect from '../shared/EmployeeSelect'


export default {
  name: 'listsdetail',
  computed: {
    ...mapGetters([
      'User',
      'ChecklistsType',
      'Task',
      'AssetsFromAssets',
      'Assignees',
      'Groups',
      'AssigneeEmployees',
      'appUsers',
      'ExcludedObjectList',
      'correctAssetVersions'
    ])
  },
  data() {
    return {
      addeditText: '',
      taskItem: { name: '' },
      categories: ['user', 'group'],
      timeGroups: ['Hour(s)', 'Day(s)'],
      templateTypes: [{key:1, name: 'Task'}, {key:2, name: 'List'}, {key:3, name: 'Reclaimable'}],
      timeType: 'Day(s)',
      timeValue: 1,
      currentDatetime: moment().format('YYYY-MM-DD hh:mm A'),
      userIdSelected: [],
      originalAssetResourceDTOs: [],
      otherResources: [],
      assetIndex: 0,
      assetsSelected: []
      };
  },
  watch: {
    Task: {
      handler(task) {
        this.taskItem = { name: '' };
        this.otherResources = [];
        this.originalAssetResourceDTOs = [];
        this.userIdSelected = [];
        if (task && task.id !== this.taskItem.id) {
          this.initTaskItem();
          this.setResourceControls();
        }
      }
    }
  },
  methods: {
    removeOldAsset(id){
      let index = this.correctAssetVersions.findIndex(x => x.versionId === id);
      this.correctAssetVersions.splice(index, 1);
    },
    deleteItem: function(){
      this.$store.dispatch('setDeleteType', 'item');
      this.$store.dispatch('openModal', 'DeleteWarningModal');
    },
    save: function(event) {
      event.preventDefault();
      let vm = this;
      vm.$validator.validate().then(result => {
        if (result) {
          event.target.disabled = true;
          vm.taskItem.assets = [];
          vm.taskItem.assets = vm.assetsSelected.slice();
          vm.setCompletionTimeFrame();

          vm.$store.dispatch("saveTemplate", {task: vm.taskItem, checklistId: vm.ChecklistsType.id}).then((r) => {
            if(r.success){
              vm.$snotify.success('The Task has been saved.', 'Save Successful', {
                showProgressBar: false,
                closeOnClick: true,
                timeout: 2500,
                pauseOnHover: true,
                position: SnotifyPosition.rightTop
              });
              // vm.ChecklistsType.id = r.data;
              vm.$store.dispatch('getChecklists', vm.ChecklistsType.id);
              vm.taskItem.id = r.data.id;
              vm.closeDetails();
            } else {
              vm.$snotify.error('The Task failed to save!', 'Save Error', {
                showProgressBar: false,
                closeOnClick: false,
                timeout: 2500,
                pauseOnHover: true,
                position: SnotifyPosition.rightTop,
              });
            }
          });
        } else {
          this.$snotify.error('The Task did not meet \r\nthe requirements to save!', 'Save Error', {
            showProgressBar: false,
            closeOnClick: false,
            timeout: 2500,
            pauseOnHover: true,
            position: SnotifyPosition.rightTop,
          });
        }
      });
    },
    initTaskItem: function() {
      if (this.Task.id === undefined || this.Task.id === 0) {
        this.addeditText = "Add";
        this.taskItem = {
          id: "00000000-0000-0000-0000-000000000000",
          description: "",
          name: "",
          completionInterval: 3600,
          assets: [],
          assignees: [],
          status: 1
        };
      } else {
        this.addeditText = "Edit";
        this.convertTime();
        this.taskItem = {
          id: this.Task.id,
          description: this.Task.description === undefined ? "" : this.Task.description,
          name: this.Task.name,
          completionInterval: this.Task.completionInterval,
          assets: this.Task.assets || [],
          assignees: this.Task.assignees || [],
          status: this.Task.status
        };
        // this.assetIndex = this.Task.assets.length || 0;
        this.assetsSelected = this.Task.assets ? this.Task.assets.slice() : [];
      }
    },
    closeDetails: function() {
      var vm = this;
      // vm.$store.dispatch("setChecklists", '');
      vm.$store.dispatch("setDetailsView", "");
      this.addeditText = "Edit";
    },
    selectChange(e, i) {
      const index = this.ExcludedObjectList.findIndex(f => f.value === e.target.value);
      if(index < 0){
        this.$store.dispatch('pushExcludedObjectList', {id: e.target.id, value: e.target.value})
      }

      this.assetsSelected.splice(i, 1);
      this.assetsSelected.splice(i, 0, e.target.value)
    },
    getExList(id){
      const control = document.getElementById(id);
      let exlist = [];

      if(control){
        const selectedValue = control.value;
        let excludedObjectList = this.ExcludedObjectList.slice(0, this.ExcludedObjectList.length);
        let index = excludedObjectList.findIndex(f => f.id === id && f.value === selectedValue);
        if(index >= 0){
          excludedObjectList.splice(index, 1);
        }
        exlist = excludedObjectList.map(m => m.value);
      }
      return exlist;
    },
    addAsset() {
      this.assetsSelected.push({});
    },
    removeAsset(value) {
      let index = this.assetsSelected.findIndex(f => f === value);
      if (index > -1) {
         this.assetsSelected.splice(index, 1);
      }
      // because we are changing the resources list, we need to reorganize the exclusion list
      this.$store.dispatch('clearExcludedObjectList');
      let assets = this.assetsSelected.slice();
      this.createExcludedList(assets);
    },
    addAssignee(employee) {
      this.$store.dispatch('addAssigneeEmployee', employee);
      let assigneeSelected = this.Assignees.find(f => f.key === employee.Id);
      this.taskItem.assignees = this.taskItem.assignees || [];
      if(assigneeSelected){
        this.taskItem.assignees.push(assigneeSelected.id);
      } else {
        this.$store.dispatch('addErrorFromAPI', "The selected Assignee hasn't\r\n synced with the store yet")
      }
    },
    removeAssignee(employee) {
      this.$store.dispatch('removeAssigneeEmployee', employee);
      let assigneeSelected = this.Assignees.find(f => f.key === employee.Id);

      let index = this.taskItem.assignees.findIndex(f => f === assigneeSelected.id);

      if (index > -1) {
        this.taskItem.assignees.splice(index, 1);
      }
    },
    setCompletionTimeFrame(){
      if(this.timeValue > 0){
        const secondMultiplier = this.timeType === "Day(s)" ? 1440 : 60;
        this.taskItem.completionInterval = this.timeValue * secondMultiplier;
      }
    },
    convertTime(){
      let hours = this.Task.completionInterval / 60;
      if(hours % 24 === 0){
        this.timeType = 'Day(s)';
        this.timeValue = hours / 24;
      } else{
        this.timeType = 'Hour(s)';
        this.timeValue = hours;
      }
      document.getElementById('timeType-' + this.timeType).selected = true;
    },
    createExcludedList(assets){ //TODO: Used to create a new list when assets are added
      for(let i = 0; i < assets.length; i++) {
        if(assets[i].linkType === 5){
          this.$store.dispatch('pushExcludedObjectList', {id: 'Assets_' + i, value: assets[i]})
        }
      }
    },
    setResourceControls(){
      let assets = this.taskItem.assets ? this.taskItem.assets.slice() : [];
      this.createExcludedList(assets);
      this.$store.dispatch('clearAssigneeEmployees');
      this.userIdSelected = this.Assignees.filter(f => this.taskItem.assignees.includes(f.id)).map(m => m.key);
    }
  },
  created: function() {

  },
  mounted: function() {
    this.initTaskItem();
    this.setResourceControls();
  },
  components: { EmployeeSelect }
};
</script>

<style lang='scss' scoped>
    .add-new-button {
  cursor: pointer;
}
    .close-button {
  width: 30px;
  height: 30px;

  vertical-align: text-top;
  margin-top: -5px;
  margin-left: 5px;
  cursor: pointer;
}
    .content {
  padding: 15px;
}
    .width50 {
  width: 50%;
}
    .section-header {
  padding: 10px;
  font-size: 1.5rem;
  font-weight: bold;
}
    .selector {
  vertical-align: middle;
}
    .lbl-checkbox {
  margin-left: 5px;
}
    .checklist-title{
      font-weight: lighter;
      font-size: 16px;
}
    .category-selection{
      font-size: 13px;
      // font-weight: 500px;
      font-family: Roboto;
  }
    .category-title{
      font-size: 16px;
      font-weight: bolder;
      font-family: Roboto;
  }
    .btn-outline{
        border: 1px solid #1f8bd5;
    }
    .margin1 {
        margin-top: 1px;
    }
    .margin24right{
        margin-right: 24px;
    }
    .marigin5right{
        margin-right: 5px;
    }
    .left100 {
        width: 100%;
        float: left;
    }
    .marginInput {
        margin: 0 15px 0 15px;
    }
    .inputNumberControl {
        width: 15%;
        margin-left: 15px;
    }
    .inputTimeSelect {
        width: 40%;
        margin-left: 15px;
    }
    .remove-padding{
      margin-top: -30px;
    }
    .top-padding{
      padding-top: 20px;
    }
    .checklist-detail{
      overflow-x:hidden;
    }
</style>

