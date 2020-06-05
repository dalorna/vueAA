<template>
    <div class="prompt-modal">
        <div class="float-right">
            <img class="close-btn" title="Close" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg"
                 v-on:click="close()"/>
        </div>
        <div class="prompt-text">
            Ad Hoc Task Selector
        </div>
        <div class="prompt-content">
            <ul>
                <li v-for="task in tasksToSelect" v-bind:key="task.id">
                    <div class="card hr-start-process cursor-pointer" v-on:click="taskClick(task.id)">
                        <div class="hr-start-process-draggable">
                            <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg" />
                        </div>
                        <div class="hr-start-process-new">
                            <div class="row">
                                <a href="#">
                                    <img src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg" />
                                    New Task
                                </a>
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
                            <div class="pull-right select-task" v-bind:class="{'fa fa-check-square font-blue' : task.selected, 'fa fa-square-o' : !task.selected}"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="main-prompt-button">
            <button class="btn btn-primary prompt-button" v-bind:class="{disabled : noTaskSelected()}" :disabled="noTaskSelected()" v-on:click="addAdHocTask()">OK</button>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import { secondsToString } from '../../utilities/custom';

  export default {
    name: "AdHocTask",
    computed: {
      ...mapGetters(['EmployeesSelected', 'TasksSelected', 'TotalTasks', 'Checklists'])
    },
    data() {
      return {
        tasksToSelect: []
      }
    },
    methods: {
      close() {
        this.$store.dispatch('closeModal')
      },
      addAdHocTask() {
        this.processTaskSelected();
        this.$store.dispatch('setMenuTab', 'assign-hr-checklist');
        this.$store.dispatch('setMenuCategory', 'none');
        this.$store.dispatch('closeModal');
        this.$store.dispatch("setMenuSelected", "TaskSelector");
        this.$store.dispatch("setPanelView", "1");
      },
      processTaskSelected(){
        let vm = this;
        return new Promise((resolve, reject) => {
          try{
            resolve(vm.tasksToSelect.forEach(async(eTask) => { if (eTask.selected) {return this.$store.dispatch('addTask', eTask);}}));
          } catch (e) {
            reject(e);
          }
        })
      },
      taskClick(taskId) {
        let index = this.tasksToSelect.findIndex(f => f.id === taskId);
        let sel = this.tasksToSelect[index].selected;
        let task = this.tasksToSelect.splice(index, 1)[0];
        task['selected'] = !sel;
        this.tasksToSelect.splice(index, 0, task);
      },
      loadData() {
        let vm = this;
        this.$store.dispatch('getAllChecklists').then((r) => {
          console.log('res', r);
          vm.processData();
        });
      },
      processData() {
        for (let i = 0; i < this.Checklists.length; i++) {
          if(this.Checklists[i].tasks){
            for (let j = 0; j < this.Checklists[i].tasks.length; j++) {
              let task = this.Checklists[i].tasks[j];
              task['selected'] = false;
              this.tasksToSelect.push(task);
            }
          }
        }
      },
      secToStr(seconds) {
        return secondsToString(seconds);
      },
      noTaskSelected(){
        return this.tasksToSelect.map(m => m.selected).every(i => !i);
      }
    },
    created: function () {
        this.loadData();
      }
  }
</script>

<style lang="scss" scoped>
    .prompt-modal {
        padding: 10px;
        transition: all 0.3s ease;
        -webkit-font-smoothing: antialiased !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        font-family: Roboto;
        border-radius: 10px;
        background-color: #ffffff;
        max-width: 600px;
        width: 60%;
        margin: auto;
        height: 100%;
    }

    ul{
        margin-left: -35px;
        margin-right: 5px;
    }

    .close-btn {
        width: 20px;
    }

    .prompt-text {
        padding: 25px;
        color: #1F8BD5;
        text-align: center;
    }

    .prompt-button {
        min-width: 70px;
        min-height: 34px;
    }

    .main-prompt-button {
        width: 100%;
        text-align: center;
        padding-top: 5px;
    }

    .prompt-content {
        height: 35vh;
        /*background-color: #333333;*/
        overflow-y: scroll;
    }

    /*Being Task Styles*/
    li {
        list-style-type: none;
        margin-top: 5px;
    }

    li:hover {
        background: #7a8084;
        cursor: pointer;
    }

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

    .select-task{
        margin: 12px 5px; 
        font-size: 18px;
    }
    /* End Task Styles */


</style>
