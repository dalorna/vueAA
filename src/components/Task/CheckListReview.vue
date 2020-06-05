<template>
    <div class="taskContentCenter">
        <div class="taskContent">
            <div id="pplCount" class="leftClear width100">
                <label class="float-left leftClear category-name">People</label>
                <span class="float-right">&nbsp;&nbsp;&nbsp;&nbsp;Selected</span>
                <label class="float-right">{{peopleCount}}</label>
            </div>
            <div class="selected-list-container leftClear bottomHeight">
                <div v-for="user of employeesAssigned" v-bind:key="user.Id" class="selected-item">
                    <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'30px'" v-bind:height="'30px'"
                            class="selected-item-avatar"></avatar>
                    <div class="selected-item-title">{{user.Name}}</div>
                </div>
            </div>
            <div class="hr"></div>
            <div id="taskIcon" class="leftClear float-left width100 padding5Bottom">
                <div class="icon-container float-left">
                    <img class="icon-image" src="../../../static/assets/img/MainNavIcons/icon-tasks-blue.svg"/>
                </div>
                <div class="float-left">
                    <label class="category-name marginTask">Tasks</label>
                </div>
            </div>
            <div id="taskCount" class="leftClear width100">
                <label class="float-left leftClear sub-category-name">{{checkListName}}</label>
                <label class="float-right">&nbsp;&nbsp;&nbsp;&nbsp;Tasks</label>
                <label class="float-right">{{taskCount}}</label>
            </div>
            <div class="hr"></div>
            <div class="leftClear topHeight">
                <ul>
                    <li v-for="task in totalTasksFromEverywhere">
                        <div class="card hr-start-process">
                            <div class="hr-start-process-draggable">
                                <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg"/>
                            </div>
                            <div class="hr-start-process-new">
                                <div class="row">
                                    <a href="#"><img
                                            src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg"/>New
                                        Task</a>
                                </div>
                            </div>
                            <div class="hr-start-process-content">
                                <div class="row minMaxWidth">
                                    <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                                        <span class="task-name">{{task.name}}</span>
                                        <span class="task-description">{{task.description}}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                        <span class="task-due-time">{{secToStr(task.completionInterval)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="hr-start-process-menu">
                                <img src="https://assets.autoalert.com/img/autoalert-icons/icon-ellipses-vertical-lake.svg">
                            </div>
                        </div>
                    </li>
                </ul>
                <div id="additionalTaskSelectedDisplay" v-if="TaskInstancesFromAddTask.length > 0">
                    <div class="category-link category-nolink">
                        <div class="additional-name">
                            <span class="spanToIcon">Additional Tasks</span>
                        </div>
                    </div>
                    <ul>
                        <li v-for="task in TaskInstancesFromAddTask">
                            <div class="card hr-start-process">
                                <div class="hr-start-process-draggable">
                                    <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg"/>
                                </div>
                                <div class="hr-start-process-new">
                                    <div class="row">
                                        <a href="#"><img
                                                src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg"/>New
                                            Task</a>
                                    </div>
                                </div>
                                <div class="hr-start-process-content">
                                    <div class="row minMaxWidth">
                                        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                                            <span class="task-name">{{task.name}}</span>
                                            <span class="task-description">{{task.description}}</span>
                                        </div>
                                        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                            <span class="task-due-time">{{secToStr(task.completionInterval)}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="hr-start-process-menu">
                                    <img src="https://assets.autoalert.com/img/autoalert-icons/icon-ellipses-vertical-lake.svg">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {ChecklistTask, Asset, Template, ResourceAssetDTO, TemplateProperty} from '../../store/ManagementAPI';
  import {secondsToString} from '../../utilities/custom';
  import Avatar from '../../components/shared/Avatar.vue';

  export default {
    name: 'checklistreview',
    components: {Avatar},
    computed: {
      ...mapGetters(['ChecklistsItem', 'EmployeesSelected', 'TasksSelected', 'TotalTasks',
        'EndOfChecklist', 'TaskInstancesFromAddTask', 'CheckListTaskHolder', 'appUsers',
        'HrScopeInView', 'EmployeeAssetList'])
    },
    data() {
      return {
        employeesAssigned: [],
        taskCount: 0,
        checkListName: '',
        peopleCount: 0,
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        totalTasksFromEverywhere: []
      };
    },
    watch: {
      TaskInstancesFromAddTask: {
        handler(val, old){
        }
      }
    },
    methods: {
      secToStr(seconds) {
        return secondsToString(seconds);
      },
      reviewNormalChecklist(){
        this.checkListName = this.ChecklistsItem.name;
        this.$store.dispatch('addTotalTask', this.ChecklistsItem.tasks);
        this.$store.dispatch('addTotalTask', this.TasksSelected);
        this.$store.dispatch('setTaskInstancesFromAddTask', this.TasksSelected);
        this.totalTasksFromEverywhere =  this.ChecklistsItem.tasks.slice();

        this.taskCount = this.TotalTasks.length;
        this.employeesAssigned = this.EmployeesSelected;
      },
      reviewAdHocChecklist(){
        this.$store.dispatch('openModal', 'LoadingIndicator');
        const vm = this;
        vm.checkListName = 'Ad Hoc List';
        vm.$store.dispatch('addTotalTask', this.TasksSelected);
        vm.taskCount = this.TotalTasks.length;
        this.$store.dispatch('setTaskInstancesFromAddTask', this.TasksSelected.slice()).then(() => {
          vm.employeesAssigned.push(this.appUsers.find(u => u.Id === vm.EmployeesSelected[0].key));
          vm.$store.dispatch('clearChecklistSetup');
          vm.$store.dispatch('clearEmployees');
          vm.$store.dispatch('addEmployee', vm.employeesAssigned[0]);
          vm.$store.dispatch('closeModal');
        });
      },
      reviewTerminationChecklist(){
        const vm = this;
        vm.$store.dispatch('openModal', 'LoadingIndicator');
        vm.checkListName = 'Reclaim Employee Assets';
        vm.employeesAssigned.push(this.appUsers.find(u => u.Id === vm.EmployeesSelected[0].key));
        vm.$store.dispatch('getTasksForTerminatedUser', vm.EmployeesSelected[0].id).then((r) => {
          if(r.success){
            vm.$store.dispatch('setTaskInstancesFromAddTask', r.data.tasks);
            vm.$store.dispatch('clearChecklistSetup');
            vm.$store.dispatch('clearEmployees');
            vm.$store.dispatch('addEmployee', vm.employeesAssigned[0]);
            vm.$store.dispatch('closeModal');
          } else {
                // TODO: SNotify fail
          }
        });
      }
    },
    created: function () {
      this.$store.dispatch('clearTotalTasks');
      this.$store.dispatch('clearTaskInstancesFromAddTask');
      this.$store.dispatch('clearCheckListTaskHolder');

      if (this.EndOfChecklist.isStep2 && this.EndOfChecklist.isTerminating) {
        this.reviewTerminationChecklist();
      }
      else if (this.EndOfChecklist.isStep2 && this.EndOfChecklist.isAdHoc) {
        this.reviewAdHocChecklist();
      }
      else {
        this.reviewNormalChecklist();
      }
      this.peopleCount = this.employeesAssigned.length;
    }
  };
</script>

<style lang='scss' scoped>
    @import '../../../styles/_colors.scss';
    .topHeight {
        height: 34vh;
        /*overflow-x: hidden;*/
        /*overflow-y: scroll;*/
    }
    .bottomHeight {
        height: 25vh;
        overflow-x: hidden;
        overflow-y: scroll;
        width: 100%;
    }
    .additional-name {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        padding: 10px 0 8px 0;
        margin: 0 44px;
        color: black !important;
    }
    .center {
        text-align: center;
    }
    .taskContentCenter {
        width: 60%;
        margin: auto;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .taskContent {
        display: block;
        /*background-color: red;*/
    }
    .hr {
        height: 1px;
        width: 100%;
        border-bottom: solid 1px #bdc0c2;
        margin-top: 5px;
        margin-bottom: 5px;
        float: left;
        clear: both;
    }
    .leftClear {
        float: left;
        clear: both;
    }
    li {
        list-style-type: none;
    }
    .minMaxWidth{
        min-width: 500px;
        max-width: 500px;
    }
    #employeeSelect {
        .list li {
            border-bottom: 1px solid #ccc;
            display: table;
            border-collapse: collapse;
            width: 100%;
        }
        .inner {
            display: table-row;
            overflow: hidden;
        }
        .li-img {
            display: table-cell;
            vertical-align: middle;
            width: 45px;
            padding-right: 1em;
        }
        .li-img img {
            display: table-cell;
            height: 45px;
        }
        .li-text {
            display: table-cell;
            vertical-align: middle;
        }
        .li-head {
            margin: 0;
        }
        .li-sub {
            margin: 0;
        }
        ul {
            width: 100%;
            overflow: auto;
        }
    }

    .width100{
        width: 100%;
    }
    /* HR Components */
    .card.hr-start-process {
        border: 1px solid #e7e7e7;
        height: 60px;
        display: block;
        overflow: hidden;
    }
    .card.hr-start-process .hr-start-process-draggable {
        height: 60px;
        width: 20px;
        background-color: #e7e7e7;
        float: left;
        position: relative;
        cursor: move;
        z-index: 2;
    }
    .card.hr-start-process .hr-start-process-draggable img {
        height: 25px;
        margin: 17px 0 0 6px;
        position: relative;
        cursor: move;
    }
    .card.hr-start-process .hr-start-process-new {
        display: none;
    }
    .card.hr-start-process .hr-start-process-content {
        width: calc(100% - 40px);
        float: left;
        height: 100%;
        display: block;
        position: relative;
    }
    .card.hr-start-process .hr-start-process-content span.task-name {
        font-weight: 500;
        font-size: 14px;
        display: block;
        padding-left: 10px;
        padding-top: 5px;
        color: #444b4f;
    }
    .card.hr-start-process .hr-start-process-content span.task-description {
        font-weight: 400;
        font-size: 12px;
        display: block;
        padding-left: 10px;
        color: #444b4f;
    }
    .card.hr-start-process .hr-start-process-content span.task-due-time {
        font-size: 14px;
        font-weight: 400;
        display: block;
        text-align: right;
        padding-top: 5px;
        padding-right: 10px;
        color: #7a8084;
    }
    .card.hr-start-process .hr-start-process-menu {
        height: 60px;
        width: 20px;
        float: right;
        position: relative;
    }
    .card.hr-start-process .hr-start-process-menu img {
        height: 20px;
        margin: 8px 0 0 0;
    }
    .card.hr-start-process.process-new-task .hr-start-process-menu {
        display: none;
    }
    .card.hr-start-process.process-new-task .hr-start-process-content {
        display: none;
    }
    .card.hr-start-process.process-new-task .hr-start-process-new {
        display: block;
        background-color: #1f8bd5;
        width: calc(100% - 20px);
        height: 100%;
        margin-left: 20px;
    }
    .card.hr-start-process.process-new-task .hr-start-process-new a {
        color: #fff;
        display: inline-block;
        width: 100%;
        padding: 17px;
        margin-left: 15px;
    }
    .card.hr-start-process.process-new-task .hr-start-process-new a > img {
        height: 20px;
        margin-right: 10px;
        margin-top: -2px;
    }
    /* End HR Components */

    .selected-list-container {
        border: 1px solid #d5d5d5;
        border-radius: 5px;
        padding: 4px;
        max-height: 135px;
        overflow-x: hidden;
        overflow-y: auto;
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
    .icon-container {
        top: 0;
        left: 0;
        font-size: 20px;
        line-height: 20px;
        width: 44px;
        height: 40px;
        padding: 5px 6px;
        overflow: hidden;
        text-align: center;

        .icon-image {
            width: 30px;
            height: 30px;
            display: inline-block;
            vertical-align: text-top;
        }
    }
    .category-name {
        font-weight: Bold;
        letter-spacing: 0.03em;
        color: $blue-lt;
        font-size: 16px;
        line-height: 22px;
    }
    .sub-category-name {
        font-weight: Bold;
        letter-spacing: 0.03em;
        color: black;
        font-size: 16px;
        line-height: 22px;
    }
    .marginTask {
        margin-top: 10px;
        margin-left: 10px;
    }
    .padding5Bottom{
        padding-bottom: 5px;
    }

</style>
