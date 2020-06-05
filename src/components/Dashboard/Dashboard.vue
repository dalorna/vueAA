<template>
  <div class="hr-dash-global">
       
    <ul class="nav nav-pills" role="tablist">
      <li id="task-dashboard-tab" class="nav-item" v-on:click="switchDashboards('task-dashboard')">
          <span class="nav-link cursorPointer" v-bind:class="[taskActive ? 'navlink-active' : '']" data-toggle="tab">HR Dashboard</span>
      </li>
      <li id="asset-dashboard-tab" class="nav-item" data-toggle="tab" v-on:click="switchDashboards('asset-dashboard')">
          <span class="nav-link cursorPointer" v-bind:class="[assetActive ? 'navlink-active' : '']" data-toggle="tab">Asset Dashboard</span>
      </li>
      <!-- <li id="document-dashboard-tab" class="nav-item" v-on:click="switchDashboards('document-dashboard')">
          <span class="nav-link cursorPointer" v-bind:class="[documentActive ? 'navlink-active' : '']" data-toggle="tab">Document Dashboard</span>
      </li> -->
    </ul>
    <keep-alive>
      <component v-bind:is="tabSelected"></component>
    </keep-alive>
  </div>
</template>

<script>
import TaskDashboard from "../../components/Dashboard/TaskDashboard.vue"
import AssetDashboard from "../../components/Dashboard/AssetDashboard.vue"
import DocumentDashboard from "../../components/Dashboard/DocumentDashboard.vue"
    import {
        mapGetters
    } from 'vuex';

export default {
    components: {
        TaskDashboard,
        AssetDashboard,
        DocumentDashboard,
    },
    computed: {
        ...mapGetters(['tabSelected', 'HrStores'])
    },
    data() {
        return{
            assetActive: false,
            taskActive: true,
            documentActive: false,
        }
    },
    watch: {
        tabSelected: function(){
            this.switchDashboards(this.tabSelected);
        }
    },
    created: function(){
        this.switchDashboards(this.tabSelected);
    },
    methods:{
        switchDashboards: function(board){
            if(board === 'task-dashboard'){
                this.$store.dispatch('setTabSelected', 'task-dashboard');
                this.assetActive = false;
                this.taskActive = true;
                this.documentActive = false;
            }
            else if(board === 'asset-dashboard'){
                this.$store.dispatch('setTabSelected', 'asset-dashboard');
                this.assetActive = true;
                this.taskActive = false;
                this.documentActive = false;
            }
            else if(board === 'document-dashboard'){
                this.$store.dispatch('setTabSelected', 'document-dashboard');
                this.assetActive = false;
                this.taskActive = false;
                this.documentActive = true;
            }
        }
    } 
}
</script>

<style>
    @import '../../../styles/dashboard.scss';

    .hr-dash-global{
        background-color: #E7E7E7;
        -webkit-font-smoothing: antialiased !important;
    }
    .nav-pills{
        /* background-color: #f2f2f2; */
        margin-right: 5px;
        font-size: 16px;
        font-weight: 500;
        /* margin: -10px !important;
        padding: 10px !important;
        border: -10px !important; */
    }
    .nav{
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }
    .nav-item{
        display: list-item;
        text-align: -webkit-match-parent;
        cursor: pointer;
        
    }
    .navlink-active{
        background: linear-gradient(to right, #172751 1%,#1f8bd5 100%);
        color: white !important;
    }
 


    /* .nav.nav-tabs .nav-link,
    .nav.nav-pills .nav-link {
        color: #292b2c;
    }

    .nav-tabs {
        border-bottom: 1px solid #e5e9ec;
    }

    .nav-tabs .nav-item.show .nav-link,
    .nav-tabs .nav-link.active {
        border-color: #e5e9ec #e5e9ec #fff;
    }

    .nav.nav-tabs .nav-link.disabled {
        color: #bab8c3;
    }

    .nav.nav-pills .nav-link.active,
    .nav.nav-pills.nav-pills-primary .nav-link.active,
    .nav.nav-pills.nav-pills-success .nav-link.active,
    .nav.nav-pills.nav-pills-info .nav-link.active,
    .nav.nav-pills.nav-pills-danger .nav-link.active,
    .nav.nav-pills.nav-pills-inverse .nav-link.active,
    .nav.nav-pills.nav-pills-warning .nav-link.active {
        color: #fff;
    } */

</style>
