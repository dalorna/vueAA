<template>
    <div>
        <div class="card hr-dashboard">
            <div class="hr-dash-header">
                <div class="row filter-button-titles">
                    <div class="col">
                        <div class="row">
                            <div class="col-4 card-title-md">Filter Assets:</div>
                            <div class="col-2 small-text-totals">Total: {{ DashboardTotals.assetsTotal }}</div>
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
                        <button id="pill-asset-active" class="btn limeBackground filter-button" disabled v-on:click="(isActive = !isActive) + searchFilter()">
                            <div>{{ DashboardTotals.assetsActive }}</div>
                            <div class="small-text text-capitalize">Active</div>
                        </button>
                        <button id="pill-asset-inactive" class="btn platinumBackground filter-button" disabled v-on:click="(isInactive = !isInactive) + searchFilter()">
                            <div>{{ DashboardTotals.assetsInactive }}</div>
                            <div class="small-text text-capitalize">Inactive</div>
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
                            <div>{{ DashboardTotals.inActiveEmployeesCount }}</div>                                                                                                                                                <!-- TODO: HARD CODED NUMBER-->
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
                                <button id="pill-filter-active" v-show="isActive" class="btn btn-sm text-capitalize small-text limeBackground" v-on:click="(isActive = !isActive) + searchFilter()">Active
                                    <i class="fa fa-times"></i>
                                </button>
                                <button id="pill-filter-inactive" v-show="isInactive" class="btn btn-sm text-capitalize small-text platinumBackground" v-on:click="(isInactive = !isInactive) + searchFilter()">Inactive
                                    <i class="fa fa-times"></i>
                                </button>
                                <button id="pill-filter-newhire" v-show="isNewHires" class="btn btn-sm text-capitalize small-text lakeBackground" v-on:click="(isNewHires = !isNewHires) + searchFilter()">New Hires
                                    <i class="fa fa-times"></i>
                                </button>
                                <button id="pill-filter-employee" v-show="isEmployees" class="btn btn-sm text-capitalize small-text oceanBackground" v-on:click="(isEmployees = !isEmployees) + searchFilter()">Employees
                                    <i class="fa fa-times"></i>
                                </button>
                                <button id="pill-filter-inactive-employees" v-show="isInactiveEmployees" class="btn btn-sm text-capitalize small-text platinumBackground" v-on:click="(isInactiveEmployees = !isInactiveEmployees) + searchFilter()">Inactive
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-2 dash-table-search">
                            <div class="input-group mb-3">
                            <input id="asset-dashboard-search" type="search" class="input-group form-control form-control-sm" disabled
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
                        <div class="col" align="center">Active</div>
                        <div class="col" align="center">Inactive</div>
                        <!-- v-if="HrScopeInView.level === 'Store'" -->
                        <div class="col-1"></div>
                        <div class="col-1"></div>
                    </div>
                    <div v-show="noResults" class="errorMessage">No results</div>
                    <div class="scroll" id="asset-dashboard-scroll">
                        <div v-for="employee in filteredList" v-bind:key="employee.id" v-show="!noResults" class="tableBorder" v-on:click="toggleCaret(employee)">
                            <div class="" v-b-toggle="'asset-accordion-' + employee.id" v-bind:id="'asset-dash-employee-' + employee.id + '-row'">
                                <div class="row table-data">
                                    <div class="col table-color-code-column" v-bind:class="employeeColorCode(employee)"></div>
                                    <div class="col tableEntry" v-bind:class="employeeBlueName(employee)">{{employee.name}}</div>
                                    <div class="col">{{employee.title}}</div>
                                    <div class="col">{{employee.location}}</div>
                                    <div id="asset-sort-active" class="col font-weight-bold" v-bind:class="employee.assetsActive > 0 ? 'lime' : 'platinum'">
                                        <div class="click-to-filter-numbers col-center-align cursor-pointer" v-on:click="(isActive = !isActive) + searchFilter()">{{ employee.assetsActive }}</div>
                                    </div>

                                    <div id="asset-sort-inactive" class="col font-weight-bold platinum">
                                        <div class="click-to-filter-numbers col-center-align cursor-pointer" v-on:click="(isInactive = !isInactive) + searchFilter()">{{ employee.assetsInactive }}</div>
                                    </div>

                                     <!-- v-if="HrScopeInView.level === 'Store'" -->
                                    <div class="col-1 col-center-align">

                                        <!-- START ELLIPSIS MENU -->
                                        <div id="task-dashboard-ellipsis" class="thread-action dropdown" title="Show options" v-on:blur="toggleEllipsisMenu(employee.id, true)"
                                        v-on:click="toggleEllipsisMenu(employee.id, false)" tabindex="1">
                                        <img class="ellipsis-icon thread-action-icon cursor-pointer" src="../../../static/assets/img/SVGIcons/icon-ellipsis-blue.svg">
                                        <div :id="'menu_' + employee.id" class="dropdown-content hidden employee-ellipsis-options">
                                            <ul class="thread-dropdown-options">
                                            <li class="thread-dropdown-option" v-on:click="terminateEmployee(employee)">
                                                <div class="thread-dropdown-option-icon-wrapper">
                                                </div>
                                                <div class="thread-dropdown-option-text">
                                                Terminate
                                                </div>
                                            </li>
                                            <!-- <li class="thread-dropdown-option" v-on:click="AdHocAddTask(employee)">
                                                <div class="thread-dropdown-option-icon-wrapper">
                                                </div>
                                                <div class="thread-dropdown-option-text">
                                                Ad Hoc Add Task
                                                </div>
                                            </li> -->
                                            </ul>
                                        </div>
                                        </div>
                                        <!-- END ELLIPSIS MENU -->

                                    </div>
                                    <div class="col-1 col-center-align">
                                    <div class="col-1 col-center-align">
                                    <img class="caret-toggle" src="https://assets.autoalert.com/img/autoalert-icons/icon-chevron-right-charcoal.svg" v-bind:id="'caret_down_' + employee.id">
                                    <img class="caret-toggle hidden" src="https://assets.autoalert.com/img/autoalert-icons/icon-chevron-down-charcoal.svg" v-bind:id="'caret_up_' + employee.id">
                                    </div>
                                    </div>
                                </div>
                            </div>
                                <b-collapse v-bind:id="'asset-accordion-' + employee.id" v-if="employee.assets.length !== 0"  class="accordion-background">
                                    <!-- NOT FILTERED ASSETS -->
                                    <div class="row">
                                        <div class="col-1"></div>
                                        <div class="col-10">
                                            <!-- start 2 task row -->
                                            <div class="row mb-4">
                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2" v-for="asset in employee.assets" v-bind:key="asset.id" v-if="filteredAssets.length === 0">
                                                        <div class="card hr-dashboard-task active">
                                                        <!-- start inside single task row -->
                                                        <div class="row">
                                                            <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 dashboard-task-name-description">
                                                                <span class="dasboard-task-name" v-if="asset">{{ asset.name }}</span>
                                                                <span class="dashboard-task-description task-description-overflow" v-if="asset.description">{{ asset.description }}</span>
                                                            </div>
                                                        <div class="col-xl-7 col-lg-7 col-md-7 col-sm-7 dashboard-task-due-owner">
                                                            <span class="dashboard-task-actions">
                                                                <a id="view-asset1" href="#" v-on:click="openView(asset)">
                                                                <img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">View</a>
                                                            </span>
                                                            
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-1"></div>
                                    </div>

                                    <!-- FILTERED ASSETS -->
                                <div v-if="filteredAssets.length > 0">
                                    <div class="row">
                                        <div class="col-1"></div>
                                        <div class="col-10">
                                            <!-- start 2 task row -->
                                            <div class="row mb-4">
                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2" v-for="asset in employee.assets" v-bind:key="asset.id" v-if="filteredAssets.includes(asset.template.name) || filteredAssets.includes(asset.asset.kind)">
                                                        <div class="card hr-dashboard-task active">
                                                        <!-- start inside single task row -->
                                                        <div class="row">
                                                            <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 dashboard-task-name-description">
                                                                <span class="dasboard-task-name" v-if="asset">{{ asset.name }}</span>
                                                                <span class="dashboard-task-description task-description-overflow" v-if="asset.description">{{ asset.description }}</span>
                                                            </div>
                                                        <div class="col-xl-7 col-lg-7 col-md-7 col-sm-7 dashboard-task-due-owner">
                                                            <span class="dashboard-task-actions">
                                                                <a id="view-asset" href="#" v-on:click="openView(asset)">
                                                                <img src="../../../static/assets/img/SVGIcons/icon-check-lime.svg">View</a>
                                                            </span>
                                                            
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-1"></div>
                                    </div>
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
    import enums from '../../utilities/enums';
    import moment from 'moment';
    import {
        mapGetters
    } from 'vuex';
      import {
    SnotifyPosition
  } from 'vue-snotify';

    export default {
        name: 'dashboard',
        components: {
        },
        data() {
            return {
                isActive: false,
                isInactive: false,
                isNewHires: false,
                isEmployees: false,
                isInactiveEmployees: false,
                filteredList: [],
                filteredAssets: [],
                searchList: [],
                searchText: '',
                noResults: false,
                isLoading: true,
            }
        },
        computed: {
            ...mapGetters([
            'EmployeeAssetList', 
            'DashboardTotals',
            'pillSelected',
            'HrScopeInView']),
        },
        watch: {
            EmployeeAssetList: function(){
                this.selectPill();
                this.searchFilter(); 

                document.getElementById('pill-asset-active').disabled = false;
                document.getElementById('pill-asset-inactive').disabled = false;
                document.getElementById('pill-newhire').disabled = false;
                document.getElementById('pill-employee').disabled = false;
                document.getElementById('pill-inactive').disabled = false;
                document.getElementById('asset-dashboard-search').disabled = false;
            },
            pillSelected: function(){
                this.selectPill();
                this.searchFilter();
            },
            HrScopeInView: function () {
                this.isLoading = true;
                this.loadEmployees();
            }
        },
        created: function(){
            this.selectPill();
            this.loadEmployees();            
        },

        methods: {
            toggleEllipsisMenu(id, onblur) {
                let div = document.getElementById('menu_' + id);

                if (onblur) {
                div.classList.add('hidden');
                } 
                else if (!onblur) {
                    if (div.classList.contains('hidden')) {
                        div.classList.remove('hidden');
                    } 
                    else {
                        div.classList.add('hidden');
                    }
                }
            },
            terminateEmployee(employee) {
            // let employeeAssets = this.EmployeeAssetList.find(x => x.id === employee.id);
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
            loadEmployees(){
                let vm = this;
                vm.isLoading = true;
                setTimeout(() => {
                    vm.$store.dispatch('getDashboardTotals');
                    vm.$store.dispatch('getEmployeeAssetList').then((r) => {
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
                if (employee.assets.length > 0 && employee.assetsActive > 0) {
                    return 'blue-name'
                }
            },
            selectPill(){
                if(this.pillSelected === 'new-hires'){
                    this.isNewHires = true;
                    this.isEmployees = false;     
                }
                else if(this.pillSelected === 'current-employees'){
                    this.isEmployees = true;
                    this.isNewHires = false;  
                }
                else if(this.pillSelected === 'dashboard'){
                    this.isEmployees = false;
                    this.isNewHires = false;  
                }
                else{
                    this.isEmployees = false;
                    this.isNewHires = false;  
                }
            },
            toggleCaret(employee){
                let down = document.getElementById('caret_down_' + employee.id);
                let up = document.getElementById('caret_up_' + employee.id);

                if(employee.assets.length != 0){
                    if(up.classList.contains('hidden')){
                        up.classList.remove('hidden');
                        down.classList.add('hidden');
                    }
                    else{
                        down.classList.remove('hidden');
                        up.classList.add('hidden')
                    }
                }
            },
            employeeColorCode(employee){
                if(employee.assetsActive > 0){
                    return 'limeBackground';
                }
                else{
                    return 'platinumBackground'; 
                }
            },
            openView(asset){
                this.$store.dispatch('setAsset', asset);
                this.$store.dispatch("setDetailsView", 'AssetView');
                this.$store.dispatch('setOverlappingPane', true);
            },
            // moment: function () {
            //     return moment();
            // },
            clearSearch() {
                this.searchText = '';
                this.searchFilter();
            },
            searchFilter() {
                var vm = this;
                vm.filteredList = [];
                vm.searchList = [];
                vm.filteredAssets = [];

                if (!vm.isActive && !vm.isInactive &&! vm.isNewHires &&  !vm.isEmployees && !vm.isInactiveEmployees && (vm.searchText.length < 3)) {
                    vm.filteredList = vm.EmployeeAssetList;                 
                }
                else if (vm.isActive || vm.isInactive || vm.isNewHires || vm.isEmployees || vm.isInactiveEmployees || vm.searchText.length >= 3){
                    vm.EmployeeAssetList.forEach(function (value, key) {
                        if ((vm.isActive && value.assetsActive != 0) ||
                            (vm.isInactive && value.assetsInactive != 0) ||
                            (vm.isNewHires && value.employeeStatus === enums.EmployeeStatus.NewHire) ||
                            (vm.isInactiveEmployees && value.employeeStatus === enums.EmployeeStatus.Employee) ||
                            (vm.isEmployees && value.employeeStatus === enums.EmployeeStatus.InActive)
                        ) 
                        {
                            vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                        }            
                        else{
                            if (vm.searchText && (!vm.isActive && !vm.isInactive && !vm.isNewHires && !vm.isEmployees && !vm.isInactiveEmployees)){
                                if (value.name.toLowerCase().includes(vm.searchText.toLowerCase())) {
                                    vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                                }
                                else if(value.title && (value.title.toLowerCase().includes(vm.searchText.toLowerCase()))){
                                    vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                                }
                                else if(value.location && (value.location.toLowerCase().includes(vm.searchText.toLowerCase()))){
                                    vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                                }
                                for(let x=0; x< value.assets.length; x++){
                                    if (value.assets[x].template.name.toLowerCase().includes(vm.searchText.toLowerCase()) && (vm.filteredList.findIndex(x => x.id === value.id) === -1)) {
                                        vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                                        if(!vm.filteredAssets.includes(value.assets[x].template.name)){
                                            vm.filteredAssets.push(value.assets[x].template.name);
                                        }
                                        break;
                                    }
                                }
                            }   
                        }
                    });
                }
                
                if (vm.searchText.length >= 3 && (vm.isActive || vm.isInactive || vm.isNewHires || vm.isEmployees || vm.isInactiveEmployees)) {
                        vm.filteredList.forEach(function (value, key) {
                            if (value.name.toLowerCase().includes(vm.searchText.toLowerCase())) {
                                vm.searchList.push(value);
                            }
                            else if(value.title && (value.title.toLowerCase().includes(vm.searchText.toLowerCase()))){
                                vm.searchList.push(value);
                            }
                            else if(value.location && (value.location.toLowerCase().includes(vm.searchText.toLowerCase()))){
                                vm.searchList.push(value);
                            }
                            for(let x=0; x< value.assets.length; x++){
                                if (value.assets[x].template.name.toLowerCase().includes(vm.searchText.toLowerCase()) && (vm.filteredList.findIndex(x => x.id === value.id) === -1)) {
                                    vm.filteredList.push(JSON.parse(JSON.stringify(value)));
                                    if(!vm.filteredAssets.includes(value.assets[x].template.name)){
                                        vm.filteredAssets.push(value.assets[x].template.name);
                                    }
                                    break;
                            }
                        }
                    });
                    vm.filteredList = vm.searchList;
                }
                if (!vm.filteredList && vm.filteredList.length === 0 && vm.EmployeeAssetList.length > 0) {
                    vm.noResults = true;
                } else if (vm.filteredList && vm.filteredList.length != 0) {
                    vm.noResults = false;
                }
            }
        },
    }
    
</script>

<style lang='scss' scoped>
    @import '../../../styles/dashboard.scss';
</style>
