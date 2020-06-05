<template>
    <div class="card">
        <div class="card-header">
            <div class="card-title">
                <b>Add Task</b>
                <div class="float-right">
                    <img class="close-button" src="static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="closeDetails()" />
                </div>
            </div>
        </div>

        <div class="resHeight" style="overflow-x: hidden; margin-top: 15px; margin-right: 35px;">
            <ul>
                <li v-for="task in TaskInView"  >
                    <div class="card hr-start-process cursor-pointer" v-on:click="taskClick(task.id)">
                        <div class="hr-start-process-draggable">
                            <img src="http://aastyleguide.staging.wpengine.com/wp-content/themes/aastyleguide/assets/img/icon-draggable-platinum.svg"/>
                        </div>
                        <div class="hr-start-process-new">
                            <div class="row">
                                <a href="#"><img src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-vanilla.svg"/>New Task</a>
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
</template>

<script>
    import { mapGetters } from 'vuex';
    import { secondsToString } from '../../utilities/custom'

    export default {
        name: "AddTask",
        computed: {
            ...mapGetters(['User', 'Checklists', 'ChecklistsItem', 'TasksSelected', 'TaskInView']),
        },
        data() {
            return {
                taskToAdd: []
            }
        },
        methods: {
            closeDetails: function(){
                var vm = this;
                vm.$store.dispatch("setAsset", '');
                vm.$store.dispatch("setDetailsView", '');
                vm.$store.dispatch('setAddTaskPaneShowing', false);
            },
            taskClick(id) {
                var vm = this;
                let task = vm.TaskInView.find(f => f.id === id);
                vm.$store.dispatch('removeTaskInView', task);
                vm.$store.dispatch('addTask', task);

            },
            secToStr(seconds){
              return secondsToString(seconds);
            },
            loadData() {
                this.$store.dispatch('getAllChecklists');
                this.$store.dispatch('clearTaskInView');


            },
            processData: function(){
                let vm = this;
                for(let i = 0; i < vm.Checklists.length; i++){
                  if(vm.Checklists[i].id !== vm.ChecklistsItem.id) {
                    if(vm.Checklists[i].tasks){
                      for(let j = 0; j < vm.Checklists[i].tasks.length; j++){
                        let tid = vm.TasksSelected.findIndex(f => f.id === vm.Checklists[i].tasks[j].id);
                        if (tid < 0) {
                          vm.$store.dispatch('addTaskInView', vm.Checklists[i].tasks[j]);
                        }
                      }
                    }
                  }
                }
            }
        },
        created: function () {
            var vm = this;
            vm.loadData();
            vm.processData();
        }
    }
</script>

<style lang='scss' scoped>

    .resHeight {
        height: 78vh;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .close-button {
        width: 30px;
        height: 30px;
        vertical-align: text-top;
        margin-top: -5px;
        margin-left: 5px;
        cursor: pointer;
    }
    .content{
        padding: 10px;
    }
    .width50{
        width: 50%;
    }

    li {
        list-style-type: none;
        margin-top: 5px;
    }
    li:hover {
        background: #7a8084;
        cursor: pointer;
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
