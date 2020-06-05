<template>
  <div>
    <div class="card hr-dashboard">
      <div class="hr-dash-header">
        <div class="row filter-button-titles">
          <div class="col">
            <div class="row">
              <div class="col-4 card-title-md">Filter Tasks:</div>
              <div class="col-2 small-text-totals">Total: {{ DashboardTotals.tasksCount }}</div>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <div class="card-title-md col-3">Employees:</div>
              <div class="col-2 small-text-totals">Total: {{ DashboardTotals.employeesTotalCount }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 btn-group">
            <button id="pill-unclaimed" class="btn orangeBackground filter-button" disabled v-on:click="(isUnclaimed = !isUnclaimed) + searchFilter()">
              <div>{{ DashboardTotals.unclaimedTasksCount }}</div>
              <div class="small-text text-capitalize">Unclaimed</div>
            </button>
            <button id="pill-new" class="btn limeBackground filter-button" disabled v-on:click="(isNew = !isNew) + searchFilter()">
              <div>{{ DashboardTotals.newTaskCount }}</div>
              <div class="small-text text-capitalize">New</div>
            </button>
            <button id="pill-inprogress" class="btn lakeBackground filter-button" disabled v-on:click="(isInProgress = !isInProgress) + searchFilter()">
              <div>{{ DashboardTotals.inProgressCount }}</div>
              <div class="small-text text-capitalize">In Progress</div>
            </button>
            <button id="pill-overdue" class="btn appleBackground filter-button" disabled v-on:click="(isOverdue = !isOverdue) + searchFilter()">
              <div>{{ DashboardTotals.overdueTasksCount }}</div>
              <div class="small-text text-capitalize">Overdue</div>
            </button>
            <button id="pill-completed" class="btn platinumBackground filter-button" disabled v-on:click="(isCompleted = !isCompleted) + searchFilter()">
              <div>{{ DashboardTotals.completedTasksCount }}</div>
              <div class="small-text text-capitalize">Completed</div>
            </button>
          </div>
          <div class="col-5 btn-group">
            <button id="pill-newhire" class="btn lakeBackground filter-button" disabled v-on:click="(isNewHires = !isNewHires) + searchFilter()">
              <div>{{ DashboardTotals.newHiresCount }}</div>
              <div class="small-text text-capitalize">New Hires</div>
            </button>
            <button id="pill-employee" class="btn oceanBackground filter-button" disabled v-on:click="(isEmployees = !isEmployees) + searchFilter()">
              <div>{{ DashboardTotals.currentEmployeesCount }}</div>
              <div class="small-text text-capitalize">Employees</div>
            </button>
            <button id="pill-inactive" class="btn platinumBackground filter-button" disabled v-on:click="(isInactiveEmployees = !isInactiveEmployees) + searchFilter()">
              <div>{{ DashboardTotals.inActiveEmployeesCount }}</div>
              <div class="small-text text-capitalize">Inactive</div>
            </button>
          </div>
        </div>
      </div>
      <div class="dashboard-table">
        <div class="dash-table-header">
          <div class="row">
            <div class="col-2 dash-table-title">
              Employees
            </div>
            <div class="col-8">
              <div class="row dash-table-buttons">
                <button id="pill-filter-inprogress" v-show="isInProgress" class="btn btn-sm text-capitalize small-text lakeBackground"
                  v-on:click="(isInProgress = !isInProgress) + searchFilter()">In Progress
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-overdue" v-show="isOverdue" class="btn btn-sm text-capitalize small-text appleBackground"
                  v-on:click="(isOverdue = !isOverdue) + searchFilter()">Overdue
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-new" v-show="isNew" class="btn btn-sm text-capitalize small-text limeBackground"
                  v-on:click="(isNew = !isNew) + searchFilter()">New
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-completed" v-show="isCompleted" class="btn btn-sm text-capitalize small-text platinumBackground"
                  v-on:click="(isCompleted = !isCompleted) + searchFilter()">Completed
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-unclaimed" v-show="isUnclaimed" class="btn btn-sm text-capitalize small-text orangeBackground"
                  v-on:click="(isUnclaimed = !isUnclaimed) + searchFilter()">Unclaimed
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-newhire" v-show="isNewHires" class="btn btn-sm text-capitalize small-text lakeBackground"
                  v-on:click="(isNewHires = !isNewHires) + searchFilter()">New Hires
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-employee" v-show="isEmployees" class="btn btn-sm text-capitalize small-text oceanBackground"
                  v-on:click="(isEmployees = !isEmployees) + searchFilter()">Employees
                  <i class="fa fa-times"></i>
                </button>
                <button id="pill-filter-inactive-employees" v-show="isInactiveEmployees" class="btn btn-sm text-capitalize small-text platinumBackground"
                  v-on:click="(isInactiveEmployees = !isInactiveEmployees) + searchFilter()">Inactive
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
            <div class="col-2 dash-table-search">
              <div class="input-group mb-3">
                <input id="task-dashboard-search" type="search" class="input-group form-control form-control-sm" disabled
                    placeholder="Search" aria-label="Search" v-model="searchText" v-on:keyup="searchFilter()"
                    v-on:keyup.esc="clearSearch()">
                <div class="input-group-append" v-if="searchText.length > 0">
                  <button class="btn btn-sm"><img class="clear-search" v-on:click="clearSearch()" src="https://assets.autoalert.com/img/autoalert-icons/icon-close-or-remove-vanilla.svg"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-2 table-header-text dash-table-col-titles">
          <div class="col table-color-code"></div>
          <div class="col colLeftAlign">Name</div>
          <div class="col colLeftAlign">Title</div>
          <div class="col colLeftAlign">Location</div>
          <div class="col" align="center">Unclaimed Tasks</div>
          <div class="col" align="center">New Tasks</div>
          <div class="col" align="center">Tasks In Progress</div>
          <div class="col" align="center">Overdue Tasks</div>
          <div class="col" align="center">Completed Tasks</div>
          <div class="col-1"></div>
          <div class="col-1"></div>
        </div>
        <div v-if="noResults" class="errorMessage">No results</div>
        <div class="scroll" id="task-dashboard-scroll">
          <div v-for="(employee) in filteredList" v-bind:key="employee.id" v-show="!noResults || !errorLoading" class="tableBorder"
            v-on:click="toggleCaret(employee)">
            <div class="" v-b-toggle="'task-accordion-' + employee.id" v-bind:id="'task-dash-employee-' + employee.id + '-row'">
              <div class="row table-data">
                <div class="col table-color-code-column" v-bind:class="employeeColorCode(employee)" v-bind:id="'color-code-' + employee.id"></div>
                <div class="col tableEntry" v-bind:class="employeeBlueName(employee)">{{employee.name}}</div>
                <div class="col">{{employee.title}}</div>
                <div class="col">{{employee.location}}</div>


                <div id="sort-unclaimed" class="col font-weight-bold" v-bind:class="employee.unclaimedTasks > 0 ? 'orange' : 'platinum'">
                  <div v-on:click="(isUnclaimed = !isUnclaimed) + searchFilter()" class="click-to-filter-numbers cursor-pointer col-center-align">{{employee.unclaimedTasks}}</div>
                </div>

                <div id="sort-new" class="col font-weight-bold" v-bind:class="employee.newTasks > 0 ? 'lime' : 'platinum'">
                  <div v-on:click="(isNew = !isNew) + searchFilter()" class="click-to-filter-numbers cursor-pointer col-center-align">{{employee.newTasks}}</div>
                </div>

                <div id="sort-inprogress" class="col font-weight-bold" v-bind:class="employee.tasksinProgress > 0 ? 'ocean' : 'platinum'">
                  <div v-on:click="(isInProgress = !isInProgress) + searchFilter()" class="click-to-filter-numbers cursor-pointer col-center-align">{{employee.tasksinProgress}}</div>
                </div>

                <div id="sort-overdue" class="col font-weight-bold" v-bind:class="employee.overdueTasks > 0 ? 'apple' : 'platinum'">
                  <div v-on:click="(isOverdue = !isOverdue) + searchFilter()" class="click-to-filter-numbers cursor-pointer col-center-align">{{employee.overdueTasks}}</div>
                </div>

                <div id="sort-completed" class="col platinum font-weight-bold">
                  <div v-on:click="(isCompleted = !isCompleted) + searchFilter()" class="click-to-filter-numbers cursor-pointer col-center-align">{{employee.completedTasks}}</div>
                </div>

                <div class="col-1 col-center-align">

                  <!-- START ELLIPSIS MENU -->
                   <!-- v-if="HrScopeInView.level === 'Store'" -->
                  <div id="task-dashboard-ellipsis" class="thread-action dropdown" title="Show options" v-on:blur="toggleEllipsisMenu(employee.id, true)"
                    v-on:click="toggleEllipsisMenu(employee.id, false)" tabindex="1">
                    <img class="ellipsis-icon thread-action-icon cursor-pointer" src="../../../static/assets/img/SVGIcons/icon-ellipsis-blue.svg">
                    <div :id="'menu_' + employee.id" class="dropdown-content hidden employee-ellipsis-options">
                      <ul class="thread-dropdown-options">
                        <li class="thread-dropdown-option" v-on:click="terminateEmployee(employee)">
                          <div class="thread-dropdown-option-icon-wrapper">
                          </div>
                          <div class="thread-dropdown-option-text">
                            {{'Terminate: ' + employee.name}}
                          </div>
                        </li>
                        <li class="thread-dropdown-option" v-on:click="AdHocAddTask(employee)">
                          <div class="thread-dropdown-option-icon-wrapper">
                          </div>
                          <div class="thread-dropdown-option-text">
                            Ad Hoc Add Task
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- END ELLIPSIS MENU -->

                </div>
                <div class="col-1 col-center-align">
                  <img class="caret-toggle" src="https://assets.autoalert.com/img/autoalert-icons/icon-chevron-right-charcoal.svg"
                    v-bind:id="'caret_down_' + employee.id">
                  <img class="caret-toggle hidden" src="https://assets.autoalert.com/img/autoalert-icons/icon-chevron-down-charcoal.svg"
                    v-bind:id="'caret_up_' + employee.id">
                </div>
              </div>
            </div>
            <b-collapse v-bind:id="'task-accordion-' + employee.id" v-if="employee.tasks.length !== 0" class="accordion-background">
              <div class="row">
                <div class="col-1"></div>
                <div class="col-10">
                  <!-- START 2 TASKS ROW -->
                  <div class="row mb-4">

                    <div v-if="filteredTasks.length == 0" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2" v-for="task in employee.tasks" v-bind:key="task.id">
                      <div class="card hr-dashboard-task" v-bind:class="{
                          'unclaimed' : !task.overDue && task.status === 1,
                          'new' : !task.overDue && task.status === 2,
                          'in-progress' : !task.overDue  && task.status === 3,
                          'overdue' : task.overDue,
                          'complete' : task.status === 5 || task.status === 6 || task.status === 7 }">
                        <!-- START SINGLE TASK ROW -->
                        <div class="row">
                          <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 dashboard-task-name-description">
                            <span class="dasboard-task-name">{{ task.name }}</span>
                            <span class="dashboard-task-description task-description-overflow">{{ task.description }}</span>
                          </div>
                          <div class="col-xl-7 col-lg-7 col-md-7 col-sm-7 dashboard-task-due-owner">
                            <span class="dashboard-task-due" v-if="task.dueDate">Due: {{ formatTimeStamp(task.dueDate) }}</span>
                            <span id="task-dash-message-task-owner" class="dashboard-task-owner" v-on:click="messageOwner(task)">
                              <a href="#">
                                <img src="../../../static/assets/img/SVGIcons/icon-message-lake.svg">{{ task.claimUser.name }}</a>
                            </span>
                            <span class="dashboard-task-actions">
                              <a id="reassign-task" href="#" v-on:click="reassignTask(task)" v-if="(task.status === 2 || task.status === 3 || task.status === 4)">
                                <img src="../../../static/assets/img/SVGIcons/icon-reassign-lake.svg">Re-Assign</a>

                              <a id="claim-task" href="#" v-if="(task.status === 1 || task.status === 4)" v-on:click="claimTask(task)">
                                <img src="../../../static/assets/img/SVGIcons/icon-claim-lake.svg">Assign</a>

                              <a id="complete-task" href="#" class="lime" v-if="task.status !== 5 && task.status !== 6 && task.status !== 7 && (task.status === 2 || task.status === 3 || task.status === 4)"
                                v-on:click="completeTask(task)">
                                <img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">Start</a>

                              <a id="cancel-task" href="#" class="apple" v-on:click="cancelTask(task)" v-if="task.status !== 5 && task.status !== 6 && task.status !== 7">
                                <img src="../../../static/assets/img/SVGIcons/icon-cancel-apple.svg">Cancel</a>

                              <a id="view-task" href="#" class="lime" v-if="task.status === 5 || task.status === 6 || task.status === 7"
                                v-on:click="viewTask(task)"><img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">View</a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredTasks.length > 0">
                <div class="row">
                  <div class="col-1"></div>
                  <div class="col-10">
                    <!-- START 2 TASKS ROW -->
                    <div class="row mb-4">
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2" v-for="task in employee.tasks" v-bind:key="task.id"
                        v-if="filteredTasks.includes(task.name) || filteredTasks.includes(task.status) || (isOverdue && task.overDue === true)">
                        <div class="card hr-dashboard-task" v-bind:class="{
                            'unclaimed' : !task.overDue && task.status === 1,
                            'new' : !task.overDue && task.status === 2,
                            'in-progress' : !task.overDue  && task.status === 3,
                            'overdue' : task.overDue,
                            'complete' : task.status === 5 || task.status === 6 || task.status === 7 }">
                          <!-- START SINGLE TASK ROW -->
                          <div class="row">
                            <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 dashboard-task-name-description">
                              <span class="dasboard-task-name">{{ task.name }}</span>
                              <span class="dashboard-task-description task-description-overflow">{{ task.description }}</span>
                            </div>
                            <div class="col-xl-7 col-lg-7 col-md-7 col-sm-7 dashboard-task-due-owner">
                              <span class="dashboard-task-due" v-if="task.dueDate">Due: {{ formatTimeStamp(task.dueDate)
                                }}</span>
                              <span id="message-task-owner-filter" class="dashboard-task-owner" v-on:click="messageOwner(task)">
                                <a href="#">
                                  <img src="../../../static/assets/img/SVGIcons/icon-message-lake.svg">{{
                                  task.claimUserName }}</a>
                              </span>
                              <span class="dashboard-task-actions">
                                <a id="reassign-task-filter" href="#" v-on:click="reassignTask(task)" v-if="(task.status === 2 || task.status === 4)">
                                  <img src="../../../static/assets/img/SVGIcons/icon-reassign-lake.svg">Re-Assign</a>

                                <a id="claim-task-filter" href="#" v-if="(task.status === 1)" v-on:click="claimTask(task)">
                                  <img src="../../../static/assets/img/SVGIcons/icon-claim-lake.svg">Assign</a>

                                <a id="complete-task-filter" href="#" class="lime" v-if="task.status !== 5 && task.status !== 6 && task.status !== 7 && (task.status === 2 || task.status === 3 || task.status === 4)"
                                  v-on:click="completeTask(task)">
                                  <img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">Start</a>

                                <a id="cancel-task-filter" href="#" class="apple" v-on:click="cancelTask(task)" v-if="task.status !== 5 && task.status !== 6 && task.status !== 7">
                                  <img src="../../../static/assets/img/SVGIcons/icon-cancel-apple.svg">Cancel</a>

                                <a id="view-task-filter" href="#" class="lime" v-if="task.status === 5 || task.status === 6 || task.status === 7"
                                  v-on:click="viewTask(task)"><img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">View</a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-1"></div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>


    <div id="dashboard-base-modal" v-if="isLoading">
      <transition class="modal">
        <div class="dashboard-modal-mask">
          <div class="dashboard-modal-wrapper">
            <div class="dashboard-modal-container">
              <div class="dashboard-loading-indicator">
                <div class="dashboard-loading-container">
                  <div class="dashboard-loading-text">
                      <i class="fa fa-spinner fa-spin"></i>&nbsp;Loading...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/lib/utilities/eventBus.js';
  import enums from '../../utilities/enums';
  import moment from 'moment';
  import {
    SnotifyPosition
  } from 'vue-snotify';

  import {
    mapGetters
  } from 'vuex';

  export default {
    name: 'dashboard',
    components: {},
    data() {
      return {
        isNew: false,
        isInProgress: false,
        isOverdue: false,
        isCompleted: false,
        isUnclaimed: false,
        isNewHires: false,
        isEmployees: false,
        isInactiveEmployees: false,
        filteredList: [],
        filteredTasks: [],
        searchList: [],
        searchText: '',
        noResults: false,
        errorLoading: false,
        isLoading: true,
      }
    },
    computed: {
      ...mapGetters([
        'EmployeeTaskList',
        'DashboardTotals',
        'pillSelected',
        'HrScopeInView',
        'EmployeeAssetList'
      ]),
    },
    watch: {
      EmployeeTaskList: function () {
        this.selectPill();
        this.searchFilter();

        document.getElementById('pill-inprogress').disabled = false;
        document.getElementById('pill-overdue').disabled = false;
        document.getElementById('pill-completed').disabled = false;
        document.getElementById('pill-new').disabled = false;
        document.getElementById('pill-unclaimed').disabled = false;
        document.getElementById('pill-newhire').disabled = false;
        document.getElementById('pill-employee').disabled = false;
        document.getElementById('pill-inactive').disabled = false;
        document.getElementById('task-dashboard-search').disabled = false;
      },
      pillSelected: function () {
        this.selectPill();
        this.searchFilter();
      },
      HrScopeInView: function () {
        this.loadEmployees();
      }
    },
    created: function () {
      if(this.HrScopeInView.accountPlatformId){
        this.loadEmployees();
      }
      this.selectPill();
    },
    methods: {
      loadEmployees(){
        let vm = this;
        vm.isLoading = true;
          setTimeout(() => {
            // vm.$store.dispatch('getEmployeeAssetList');
            vm.$store.dispatch('getDashboardTotals');
            vm.$store.dispatch('getEmployeeTaskList').then((r) => {
            vm.isLoading = false;  
              if(!r){
                vm.$snotify.error('Error loading employees', {
                  timeout: 2000,
                  showProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
            });
          }, 1500);
        },
      employeeBlueName(employee) {
        if (employee.tasks.length > 0) {
          if(employee.unclaimedTasks > 0 || employee.newTasks > 0 || employee.tasksinProgress > 0 || employee.overdueTasks > 0){
            return 'blue-name'
          }
        }
      },
      selectPill() {
        if (this.pillSelected === 'new-hires') {
          this.isNewHires = true;
          this.isEmployees = false;
        } else if (this.pillSelected === 'current-employees') {
          this.isEmployees = true;
          this.isNewHires = false;
        } else if (this.pillSelected === 'dashboard') {
          this.isEmployees = false;
          this.isNewHires = false;
        } else {
          this.isEmployees = false;
          this.isNewHires = false;
        }
      },
      toggleCaret(employee) {
        let down = document.getElementById('caret_down_' + employee.id);
        let up = document.getElementById('caret_up_' + employee.id);

        if (employee.tasks.length !== 0) {
          if (up.classList.contains('hidden')) {
            up.classList.remove('hidden');
            down.classList.add('hidden');
          } else {
            down.classList.remove('hidden');
            up.classList.add('hidden')
          }
        }
      },
      employeeColorCode(employee) {
        if (employee.overdueTasks > 0) {
          return 'appleBackground';
        }
        else if (employee.unclaimedTasks > 0) {
          return 'orangeBackground';
        }
        else if (employee.newTasks > 0) {
          return 'limeBackground';
        }
        else if (employee.tasksinProgress > 0) {
          return 'lakeBackground';
        }
        else if (employee.completedTasks > 0) {
          return 'platinumBackground';
        }
        else {
          return 'platinumBackground';
        }
      },
      toggleEllipsisMenu(id, onblur) {
        let div = document.getElementById('menu_' + id);

        if (onblur) {
          div.classList.add('hidden');
        } else if (!onblur) {
          if (div.classList.contains('hidden')) {
            div.classList.remove('hidden');
          } else {
            div.classList.add('hidden');
          }
        }
      },
      formatTimeStamp: function (dateTime) {
        let returnDatetime = moment(dateTime);
        if (returnDatetime.isValid()) return returnDatetime.format('MM/DD/YY hh:mm A');
      },
      messageOwner(task) {
        //TODO: Figure out what we are doing with this
        alert('This function has not been implemented yet.');
      },
      cancelTask(task) {
        let vm = this;
        const yesAction = (toast) => {
          if (!toast.value.match('snotify')) {
            vm.$store.dispatch('hrStatusChange', {task: task, user: [this.$store.getters.User], status: 7}).then((r) => {
              if (r) {
                vm.$snotify.success('Successfully cancelled task.', {
                  timeout: 2000,
                  showProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              } else {
                vm.$snotify.error('Error cancelling task.', {
                  timeout: 2000,
                  showProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
            })
            toast.valid = false;
            vm.$snotify.remove(toast.id); 
            return false;
          }
        }
        const noAction = (toast) => {
          vm.$snotify.remove(toast.id);
        }

        vm.$snotify.prompt('Once you cancel this task you cannot reopen it.', 'Are you sure?', {
          buttons: [{
              text: 'Yes',
              action: yesAction,
              bold: true
            },
            {
              text: 'No',
              action: noAction
            },
          ],
          placeholder: ''
        });
      },
      reassignTask(task) {
        this.$store.dispatch('openModal', 'ReassignModal');
        this.$store.dispatch('setTask', task);
      },
      claimTask(task) {
        this.$store.dispatch('openModal', 'ReassignModal');
        this.$store.dispatch('setTask', task);
        // Not sure we are you using this anymore
        // claimTask doesn't exist
        // let vm = this;
        // vm.$store.dispatch('claimTask', task).then((r) => {
        //   if (r) {
        //     vm.$snotify.success('Sucessfully claimed task.', {
        //       timeout: 2000,
        //       showProgressBar: false,
        //       closeOnClick: false,
        //       pauseOnHover: true,
        //       position: SnotifyPosition.rightTop
        //     });
        //   } else {
        //     vm.$snotify.error('Error claiming task.', {
        //       timeout: 2000,
        //       showProgressBar: false,
        //       closeOnClick: false,
        //       pauseOnHover: true,
        //       position: SnotifyPosition.rightTop
        //     });
        //   }
        // })
      },
      viewTask(task) {
        // this.$store.dispatch('setTask', task);
        // this.$store.dispatch('getTaskInstance', task);

        this.$store.dispatch('getTaskData', task.id);
        this.$store.dispatch('setDetailsView', 'HrFormTaker');
        this.$store.dispatch("setOverlappingPane", true);
      },
      completeTask(task) {
        if (task.status !== 3) {
          this.$store.dispatch('hrStatusChange', {task: task, user: [{id: task.claimUser.id, name: task.claimUser.name}], status: 3}).then((success) => {
            if(!success){
              vm.$snotify.error('The status failed to change', 'Status Error', {
                showProgressBar: false,
                closeOnClick: false,
                timeout: 2500,
                pauseOnHover: true,
                position: SnotifyPosition.rightTop,
              });
            }
          })
        }
        // this.$store.dispatch('setFormTakerIsLoading', true);
        this.$store.dispatch('getTaskData', task.id);
        this.$store.dispatch("setDetailsView", 'HrFormTaker');
        this.$store.dispatch('setOverlappingPane', true);
      },
      clearSearch() {
        this.searchText = '';
        this.searchFilter();
      },
      searchFilter() {
        var vm = this;
        vm.filteredList = [];
        vm.filteredTasks = [];
        vm.searchList = [];

        //if no filters are selected and theres no search text then display the employees that vue has already loaded
        if (!vm.isInProgress && !vm.isOverdue && !vm.isCompleted && !vm.isUnclaimed && !vm.isNew &&
          !vm.isNewHires && !vm.isEmployees && !vm.isInactiveEmployees &&
          (vm.searchText.length < 3)) {
            vm.filteredList = vm.EmployeeTaskList;
        }
        //first filter for pills OR search text (not both) (filter buttons are addative, then the search text is to narrow down the filter buttons further)
        else if (vm.isInProgress || vm.isNew  || vm.isOverdue || vm.isCompleted || vm.isUnclaimed || vm.isNewHires || vm.isEmployees ||
          vm.isInactiveEmployees ||
          vm.searchText.length >= 3) {
          vm.EmployeeTaskList.forEach(function (value, key) {
            if ((vm.isInProgress && value.tasksinProgress !== 0) ||
              (vm.isNew && value.newTasks !== 0) ||
              (vm.isOverdue && value.overdueTasks !== 0) ||
              (vm.isCompleted && value.completedTasks !== 0) ||
              (vm.isUnclaimed && value.unclaimedTasks !== 0) ||
              (vm.isNewHires && value.employeeStatus === enums.EmployeeStatus.NewHire) ||
              (vm.isInactiveEmployees && value.employeeStatus === enums.EmployeeStatus.Employee) ||
              (vm.isEmployees && value.employeeStatus === enums.EmployeeStatus.InActive)
            ) {
              vm.filteredList.push(JSON.parse(JSON.stringify(value)));
              if (vm.isUnclaimed && !vm.filteredTasks.includes(enums.TaskStatus.Unclaimed)) {
                vm.filteredTasks.push(enums.TaskStatus.Unclaimed);
              }
              if (vm.isNew && !vm.filteredTasks.includes(enums.TaskStatus.New)) {
                vm.filteredTasks.push(enums.TaskStatus.New);
              }
              if (vm.isInProgress && !vm.filteredTasks.includes(enums.TaskStatus.InProgress)) {
                vm.filteredTasks.push(enums.TaskStatus.InProgress);
              }
              if (vm.isOverdue && !vm.filteredTasks.includes(enums.TaskStatus.Overdue)) {
                vm.filteredTasks.push(enums.TaskStatus.Overdue);
              }
              if (vm.isCompleted) {
                if (!vm.filteredTasks.includes(enums.TaskStatus.Cancelled)) {
                  vm.filteredTasks.push(enums.TaskStatus.Cancelled);
                }
                if (!vm.filteredTasks.includes(enums.TaskStatus.Completed)) {
                  vm.filteredTasks.push(enums.TaskStatus.Completed);
                }
                if (!vm.filteredTasks.includes(enums.TaskStatus.Deleted)) {
                  vm.filteredTasks.push(enums.TaskStatus.Deleted);
                }
              }
            } else if (vm.searchText && (!vm.isInProgress && !vm.isOverdue && !vm.isCompleted && !vm.isNew &&
                !vm.isUnclaimed && !vm.isNewHires && !vm.isEmployees && !vm.isInactiveEmployees)) {

              if (value.name.toLowerCase().includes(vm.searchText.toLowerCase())) {
                vm.filteredList.push(JSON.parse(JSON.stringify(value)));
              } 
              else if (value.title && (value.title.toLowerCase().includes(vm.searchText.toLowerCase()))) {
                vm.filteredList.push(JSON.parse(JSON.stringify(value)));
              } 
              else if (value.location && (value.location.toLowerCase().includes(vm.searchText.toLowerCase()))) {
                vm.filteredList.push(JSON.parse(JSON.stringify(value)));
              }
              for (let x = 0; x < value.tasks.length; x++) {
                if (value.tasks[x].name.toLowerCase().includes(vm.searchText.toLowerCase()) && (vm.filteredList.findIndex(x => x.id === value.id) === -1)) {
                  vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                  if (!vm.filteredTasks.includes(value.tasks[x].name)) {
                    vm.filteredTasks.push(value.tasks[x].name);
                  }
                  break;
                }
              }
            }
          });
          //if theres search text and a filter button is selected, narrow the search down more
          if (vm.searchText.length >= 3 && (vm.isInProgress || vm.isOverdue ||
              vm.isCompleted || vm.isUnclaimed || vm.isNewHires || vm.isEmployees || vm.isInactiveEmployees)) {
            vm.filteredList.forEach(function (value, key) {
              if (value.name.toLowerCase().includes(vm.searchText.toLowerCase())) {
                vm.searchList.push(value);
              } 
              else if (value.title && (value.title.toLowerCase().includes(vm.searchText.toLowerCase()))) {
                vm.searchList.push(value);
              } 
              else if (value.location && (value.location.toLowerCase().includes(vm.searchText.toLowerCase()))) {
                vm.searchList.push(value);
              }
              for (let x = 0; x < value.tasks.length; x++) {
                if (value.tasks[x].name.toLowerCase().includes(vm.searchText.toLowerCase()) && (vm.filteredList.findIndex(x => x.id === value.id) === -1)) {
                  if (!vm.filteredTasks.includes(value.tasks[x].name)) {
                    vm.filteredTasks.push(value.tasks[x].name);
                  }
                  break;
                }
              }
            });
            vm.filteredList = vm.searchList;
          }
        }
        if (vm.filteredList && vm.filteredList.length === 0 && vm.EmployeeTaskList.length > 0) {
          vm.noResults = true;
        } else if (vm.filteredList.length !== 0) {
          vm.noResults = false;
        }
      },
      terminateEmployee(employee) {
        this.toggleEllipsisMenu(employee.id, true);
        this.$store.dispatch('clearEmployees');
        this.$store.dispatch('addEmployee', employee);
        this.$store.dispatch('setEndOfChecklist', {
          employee: employee,
          isAdHoc: false,
          isTerminating: true
        });
        this.$store.dispatch('setMenuTab', 'assign-hr-checklist');
        this.$store.dispatch('setMenuCategory', 'none');

        this.$store.dispatch("setMenuSelected", "TaskSelector");
        this.$store.dispatch("setPanelView", "1")
      },
      AdHocAddTask(employee) {
        let vm = this;
        vm.toggleEllipsisMenu(employee.id, true);
        vm.$store.dispatch('clearEmployees');
        vm.$store.dispatch('addEmployee', employee).then(() => {
          vm.$store.dispatch('setEndOfChecklist', {
            employee: employee,
            isAdHoc: true,
            isTerminating: false
          });
          vm.$store.dispatch('openModal', 'AdHocTask');
        });
      }
    },
  }
</script>

<style lang='scss' scoped>
  @import '../../../styles/dashboard.scss';

</style>
