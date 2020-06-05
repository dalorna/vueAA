<template>
    <div id="taskContentWrapper" class="taskContentCenter taskContentCenterHeight">
        <div>
            <div style="display: block; float: left; clear: both;">
                <p class="pwidth center">Select a checklist or preconfigured grouping of tasks for employees to
                    complete. If necessary you can add additional tasks to an existing checklist.</p>
            </div> 
        </div>
        <div>
            <div>
                <label for="taskSelection" >Choose a HR Checklist</label>
                <div style="float: left;width: 55%;" >
                    <select id="taskSelection" class="form-control filter-groups-control" v-model="selectedCheckList"
                            v-on:change="selectCheckList">
                        <option v-for="option in TypeOptions" :disabled="option.disabled" v-bind:value="option.id" v-bind:key="option.name">
                            {{ option.name }}
                        </option>
                    </select>
                </div>
                <div class="icon-container float-left">
                    <img id="addTaskImg" class="icon-image" v-bind:class="{'cursor-pointer' : showAddTask}"
                                         v-bind:src="getMainNavMenuIcon('plus')" @click="addTaskImageClick"/>
                 </div>
                <div class="category float-left" style="margin-left: -8%" >
                    <div class="category-link category-nolink">
                        <div class="category-name" >
                            <span id="addTaskSpan" class="spanToIcon" v-bind:class="{'cursor-pointer' : showAddTask}" @click="addTaskImageClick">Add Additional Tasks</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="task-list-wrapper">
                <ul class="task-list">
                    <li class="category">
                        <div class="category-link category-nolink">
                            <div class="icon-container">
                                <img class="icon-image" v-bind:src="getMainNavMenuIcon('tasks')"/>
                            </div>
                            <div class="category-name">
                                <span class="spanToIcon">Tasks</span>
                            </div>
                        </div>
                        <div v-if="showTaskPane()">
                            <span style="margin-left: 50px; color: black;">{{noTaskMessage}}</span>
                        </div>
                        <div v-else>
                            <ul>
                                <li class="leftM25" v-for="task in taskShowing" v-bind:key="task.id">
                                    <div class="card hr-start-process" v-bind:class="{'process-new-task': task.showNew}">
                                        <div class="hr-start-process-draggable">
                                            <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg">
                                        </div>
                                        <div class="hr-start-process-new">
                                            <div class="row">
                                                <a href="#"><img
                                                        src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg">New
                                                    Task</a>
                                            </div>
                                        </div>
                                        <div class="hr-start-process-content">
                                            <div class="row">
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
                            <div id="additionalTasksDisplay" v-if="additionalTasks.length > 0" >
                                <div class="category-link category-nolink">
                                    <div class="additional-name">
                                        <span class="spanToIcon">Additional Tasks</span>
                                    </div>
                                </div>
                                <ul>
                                    <li class="leftM25" v-for="task in additionalTasks" @click="removeTask(task.id)"  v-bind:key="task.id">
                                        <div class="card hr-start-process" v-bind:class="{'process-new-task': task.showNew}">
                                            <div class="hr-start-process-draggable">
                                                <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg">
                                            </div>
                                            <div class="hr-start-process-new">
                                                <div class="row">
                                                    <a href="#"><img
                                                            src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg">New
                                                        Task</a>
                                                </div>
                                            </div>
                                            <div class="hr-start-process-content">
                                                <div class="row">
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
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {secondsToString} from '../../utilities/custom';

  export default {
    name: 'checklistselection',
    computed: {
      ...mapGetters(['Checklists', 'ChecklistsItem', 'ChecklistsTypes', 'TasksSelected', 'TypeOptions', 'AddTaskPaneShowing', 'HrScopeInView'])
    },
    watch: {
      AddTaskPaneShowing: {
        handler(val){
          let contentWrapper = document.getElementById('taskContentWrapper');
          if(val){
            contentWrapper.classList.remove('taskContentCenter', 'taskContentCenterShort');
            contentWrapper.classList.add('taskContentCenterShort');
          } else {
            contentWrapper.classList.remove('taskContentCenter', 'taskContentCenterShort');
            contentWrapper.classList.add('taskContentCenter');
          }
        }
      },
      TasksSelected: {
        handler(val, oldVal){
          this.addTasksFromTaskPane();
        }
      },
      HrScopeInView: function () {
        this.loadData();
        this.processData();
      }
    },
    data() {
      return {
        selectedCheckList: '0',
        showAddTask: false,
        taskShowing: [],
        taskAdded: [],
        checklistIdSelected: '0',
        noTaskMessage: 'No Tasks Currently Added.',
        additionalTasks: []
      };
    },
    methods: {
      showTaskPane() {
        if (this.selectedCheckList === '0') {
          this.noTaskMessage = 'No Tasks Currently Added.';
          return true;
        } else if (this.ChecklistsItem && (!this.ChecklistsItem.tasks || this.ChecklistsItem.tasks.length === 0)) {
          this.noTaskMessage = 'The Checklist has no associated Tasks.';
          return true;
        }

        return false;
      },
      getMainNavMenuIcon(iconName) {
        return 'static/assets/img/MainNavIcons/icon-' + iconName + '-blue.svg';
      },
      selectCheckList: function (e) {
        if(e.target.value === 0){
          this.$store.dispatch('clearTasks');
        }
        this.$store.dispatch('setDetailsView', '');
        this.setCheckList(e.target.value);
        this.addTasksFromTaskPane();
        this.$emit('selectPID', e.target.value);
      },
      addTasksFromTaskPane(){
        let vm = this;
        vm.additionalTasks = [];
        vm.additionalTasks = vm.TasksSelected.slice(0, vm.TasksSelected.length);

      },
      setCheckList(pid) {
        const vm = this;
        const index = vm.Checklists.findIndex(x => x.id === pid);

        const checklist = vm.Checklists.slice(index, index + 1);
        vm.checklistIdSelected = pid;
        if (checklist.length === 1) {
          vm.$store.dispatch('setChecklists', pid);
          vm.taskShowing = checklist[0].tasks ? checklist[0].tasks.slice(0, checklist[0].tasks.length) : [];
          this.showAddTask = checklist[0].tasks && checklist[0].tasks.length > 0;
        } else {
          this.showAddTask = false;
          this.$store.dispatch('setDetailsView', '');
        }
      },
      addTaskImageClick() {
        if (this.showAddTask) {
          this.$store.dispatch('setAddTaskPaneShowing', true);
          this.$store.dispatch('setDetailsView', 'AddTask');
        }
      },
      loadData() {
        const vm = this;
        vm.$store.dispatch('getAllChecklists');
        // vm.$store.dispatch('getTypeOptions');
        vm.$store.dispatch('getChecklistsTypes');
        vm.addTasksFromTaskPane();
      },
      processData() {
        if (this.ChecklistsItem && this.ChecklistsItem.id) {
          this.selectedCheckList = this.ChecklistsItem.id;
          this.setCheckList(this.selectedCheckList);
          this.showAddTask = true;
        } else {
          this.showAddTask = false;
        }
      },
      secToStr(seconds) {
        return secondsToString(seconds);
      },
      removeTask(id) {
        const t = this.TasksSelected.find(f => f.id === id);

        if(t) {
          this.$store.dispatch('removeTask', t);
          this.$store.dispatch('addTaskInView', t);
        //   const index = this.taskShowing.findIndex(f => f.id === t.id);
        //   this.taskShowing.splice(index, 1);
        }
      }
    },
    created: function () {
      this.loadData();
      this.processData();
    },
    mounted: function () {
    }
  };
</script>

<style lang='scss' scoped>
    $activeColor: #e7e7e7; //lighten((@Color-blue-lt), 45%);
    @import '../../../styles/_colors.scss';
    .center {
        text-align: center;
    }
    .taskContentCenter {
        width: 60%;
        min-width: 800px;
        margin: 0 auto;
    }
    .taskContentCenterShort {
        width: 80%;
        min-width: 800px;
        margin: auto;
    }
    .taskContentCenterHeight {
        overflow: auto;
        height: 63vh;
    }
    .taskContent {
        display: block;
        /*background-color: red;*/
    }
    .pwidth {
        width: 100%;
        text-align: center;
    }
    label, select {
        display: block;
        float: left;
        clear: both;
        width: 100%;
    }
    label {
        text-align: left;
    }
    li {
        list-style-type: none;
        //margin-left: -20px;
    }
    .leftM25{
        margin-left: -25px;
    }
    .bottomHeight {
        height: 22vh;
        overflow-x: hidden;
        overflow-y: scroll;

        li:hover {
            background: #7a8084;
            cursor: pointer;
        }
    }
    #task-list-wrapper {
        //height: 100%; //calc(~ "100% - 59px - 42px");
        /*overflow-x: hidden;*/
        /*overflow-y: auto;*/
        position: relative;
        padding-bottom: 20px;
        padding-top: 15px;
        display: block;
        clear: both;

        .task-list {
            list-style-type: none;
            margin: 0;
            padding: 0;
            //height: 47vh;
            overflow: inherit;
        }
    }
    .category {
        font-weight: 400;
        position: relative;
        letter-spacing: 0.03em;
        cursor: pointer;
        padding: 0 0;
        vertical-align: top;
        //color: $gray-dk; // border-bottom: 0px solid white;
        color: $blue-lt;

        .category-link {
            cursor: pointer;
            position: relative;
            height: 40px;
            margin-right: 40px;

            .icon-container {
                position: absolute;
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
                    height: 30px; // background: red;
                    display: inline-block;
                    vertical-align: text-top;
                }
            }

            .category-name {
                font-size: 16px;
                line-height: 22px;
                padding: 10px 0px 8px 0px;
                margin: 0px 44px;
            }
        }

        .category-nolink {
            cursor: auto;
        }

        .inbox-sub-category {
            padding: 5px 0px 5px 44px;
            color: $gray-dk;
            font-weight: 400;
            font-size: 13px;

            i {
                color: #909090;
                font-size: 14px;
                width: 18px;
                &.fa-star {
                    color: $gold;
                }
            }

            &.active {
                background: $activeColor;
            }

            &.has-unread {
                font-weight: 500;
            }
        }
    }
    .bold-title {
        text-transform: uppercase;
        font-weight: bold;
    }
    .reg-title {
        text-transform: uppercase;
    }
    .spanToIcon {
        float: left;
        margin-left: 25px;
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
    .additional-name {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        padding: 10px 0 8px 0;
        margin: 0 44px;
        color: black !important;
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

</style>
