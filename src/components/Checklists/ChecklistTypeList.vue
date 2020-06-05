<template>
    <div>
        <div class="card-header">
            <div class="card-title">
                <div>Checklists</div>
                <div class="float-right">
                    <img class="add-new-button" src="static/assets/img/SVGIcons/icon-plus-blue.svg" v-on:click="addTypeChange()" />
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1">
            <div class="input-icon-right search-bar">
                <input class="form-control filter-groups-control" type="text" placeholder="Search" v-model="searchInput" />
                <i class="cursor-pointer fa fa-search"></i>
            </div>
        </div>
        <div class="panel-action-bar bb-1" v-if="ChecklistsTypes != undefined && ChecklistsTypes.length == 0">
            <span>There are currently no checklist categories setup.</span>
        </div>
        <div class="overflow">
            <div class="cursor-pointer panel-action-bar bb-1 link" v-for="k in DisplayTypeList" :id="k.id" v-bind:key="k.id" v-on:click="selectType(k.id)" v-bind:class="ChecklistsType !== undefined && k.id === ChecklistsType.id ? 'highlight' : ''">
                <span>{{k.name}}</span>
            </div>
        </div>

        <div id="taskbuilder-base-modal" v-if="showModal">
            <transition class="modal">
                <div class="taskbuilder-modal-mask">
                    <div class="taskbuilder-modal-wrapper">
                        <div class="taskbuilder-modal-container">
                            <div class="taskbuilder-loading-indicator">
                                <div class="taskbuilder-loading-container">
                                    <div class="taskbuilder-loading-text">
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

  import { mapGetters } from 'vuex';
  import { SnotifyPosition} from 'vue-snotify';
  import { debounce } from 'debounce'

  export default {
    name: 'ChecklistsTypesList',
    // props: [
    //   'typeList'
    // ],
    computed: {
      ...mapGetters([
      'ChecklistsTypes',
      'ChecklistsType',
      'Checklists',
      'ChecklistsItem',
      'HrScopeInView',
      'showModal'])
    },
    watch:{
      HrScopeInView: function () {
        this.$store.dispatch('showModal', true);
        this.$store.dispatch('setChecklistsType', '');
        this.loadTypes();
      },
      searchInput: debounce(function (val) {
        const vm = this;
        vm.typeFilter = val;
        vm.DisplayTypeList = vm.ChecklistsTypes.filter(function (classification) {
          if(vm.typeFilter){
            return classification.name.toUpperCase().includes(vm.typeFilter.toUpperCase());
          }
          return true;
        });

        if(vm.DisplayTypeList.length > 0) {
          vm.selectType(vm.DisplayTypeList[0].id);
        } else {
          vm.$store.dispatch('setChecklistsType', '');
        }
      }, 100),
    },
    data() {
      return {
        DisplayTypeList: [],
        searchInput: '',
        typeFilter: '',
      }
    },
    created: function () {
      this.loadTypes();
    },
    destroyed : function () {
      this.DisplayTypeList = [];
      this.$store.dispatch('setChecklists', null);
    },
    methods: {
      loadTypes(){
        const vm = this;
        vm.$store.dispatch('showModal', true);
        vm.$store.dispatch('getChecklistsTypes').then(() => {
          vm.$store.dispatch('showModal', false);
          vm.DisplayTypeList = vm.ChecklistsTypes;
        });
        this.searchInput = '';
       },
      addTypeChange(){
        this.$store.dispatch('setClassificationDetailType', 'Add');
        this.$store.dispatch('setDetailsView', 'ClassificationDetail');
      },
      selectType(id){
        const vm = this;
        if(vm.ChecklistsItem.id !== id){
            vm.$store.dispatch('showModal', true);
            vm.$store.dispatch('setChecklistsType', id);
            vm.$store.dispatch('setTaskItem', '');
        }
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import '../../../styles/loadingindicator.scss';
    .overflow{
        overflow-y: auto;
        overflow-x: hidden;
        height: 70vh;
        // height: calc(100vh - 60px - 30px - 50px);
        // max-height:calc(100vh - 60px - 30px - 50px);
    }

    .panel-action-bar{
        padding: 10px 2px 10px 2px;
    }
    .add-new-button {
        width: 30px;
        height: 30px;

        vertical-align: text-top;
        cursor: pointer;
        position: absolute;
        right: 10px;
    }

    .thread-action-icon {
        height: 30px;
        max-width: 20px;
    }

    .content {
        font-size: 10pt;
        padding: 5px 0px 0px 0px;
    }

    .content label {
        padding: 0px;
        margin: 0;
        display: block;
        font-weight: bold;
    }

    .dropdown-content {
        position: absolute;
        top: 30px;
        right: 5px;
        background-color: #f9f9f9;
        // min-width: 180px;
        min-width: 70px;
        border-radius: 10px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    /* Links inside the dropdown */

    .dropdown-content ul {
        padding: 0px;
        margin: 0px;
    }

    .dropdown-content li {
        color: black;
        text-decoration: none;
        display: block;
        text-align: left;
        line-height: 20px;
        padding: 10px;
        font-weight: 400;
        font-size: 13px;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;

        &:last-child {
            border-bottom-width: 0px;
        }
    }

    .link{
        font-size: 12pt;
        color: #1F8BD5;
        padding-left: 10px;
    }

    .highlight{
        background-color: #efefef;
    }
    .search-bar{
        padding-left: 5px;
        padding-right: 5px;
    }
    .ellipsis-button{
        display: inline-block;
    }
</style>
