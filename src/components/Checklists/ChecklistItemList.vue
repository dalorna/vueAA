<template>
   <div id="topGen">
        <div class="card-header">
            <div class="card-title">
                <div class="type-name">{{ChecklistsType.name}}</div>

                <div class="float-right">
                    <img id="addnewtemplatedetail" class="add-new-button" src="static/assets/img/SVGIcons/icon-plus-blue.svg" v-on:click="addItem()" />

                    <div class="thread-action dropdown ellipsis-button" title="Show options" v-on:click="toggleActionsMenu()" v-on:blur="showOptions = false"
                    tabindex="1">
                    <img class="thread-action-icon" src="../../../static/assets/img/SVGIcons/icon-ellipsis-blue.svg"/>
                        <div v-show="showOptions" class="dropdown-content edit-menu">
                            <ul class="thread-dropdown-options">
                            <li class="thread-dropdown-option" v-on:click='editClassification()'>
                                <div class="thread-dropdown-option-icon-wrapper">
                                </div>
                                <div class="thread-dropdown-option-text"> 
                                Edit
                                </div>
                            </li>
                            <li class="thread-dropdown-option" v-on:click="deleteClassification()">
                                <div class="thread-dropdown-option-icon-wrapper">
                                </div>
                                <div class="thread-dropdown-option-text">
                                Delete
                                </div>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       <div class="overflow" v-if="ChecklistsItem && ChecklistsItem.tasks && ChecklistsItem.tasks.length && ChecklistsItem.tasks.length > 0" >
            <div class="cursor-pointer panel-action-bar bb-1 link" v-for="k in ChecklistsItem.tasks" :id="k.id" v-bind:key="k.id" v-on:click="loadDetails(k.id)" v-bind:class="[selectedId !== '' && k.id === selectedId ? 'highlight' : '', {'hidden' : k.id === '00000000-0000-0000-0000-000000000000'}]"  >
                <span>{{k.name}}</span>
            </div>
       </div>
    </div>
</template>


<script>
import {
    mapGetters
  } from 'vuex';
  import VeeValidate from 'vee-validate';

export default {
    name: 'checklist',
    computed: {
      ...mapGetters([
          'ChecklistsType',
          'Checklists',
          'ChecklistsItem',
      ])
    },
    watch:{
        ChecklistsType: function () {
            this.$store.dispatch("setTaskItem", '');
            this.$store.dispatch("setDetailsView", '');
            this.loadItems();
      },
        Checklists: function (val, old) {
          if(val && old && val.length !== old.length){
            this.loadItems();
          }
        }
    },
    data() {
      return {
          showOptions: false,
          selectedId: ''
      }
    },
    methods: {
        editClassification(){
            this.$store.dispatch('setDetailsView', 'ClassificationDetail');
            this.$store.dispatch('setClassificationDetailType', 'Edit')
        },
        deleteClassification(){
            if(this.ChecklistsItem.tasks.length > 0){
                this.$store.dispatch('openModal', 'DeleteRequirementModal');
            }
            else{
                this.$store.dispatch('setDeleteType', 'classification');
                this.$store.dispatch('openModal', 'DeleteWarningModal');
            }
        },
        loadItems(){
          var vm = this;
          this.$store.dispatch('setDetailsView', '');
          this.$store.dispatch('getChecklists', vm.ChecklistsType.id);
        },
        loadDetails(id){
          this.selectedId = id;
            var vm = this;
            vm.$store.dispatch('clearExcludedObjectList');
            vm.$store.dispatch("setTaskItem", id);
            vm.$store.dispatch("setDetailsView", 'ChecklistsDetail');
        },
        addItem(){
          if(this.ChecklistsType) {
            let vm = this;
            vm.$store.dispatch("newChecklistsInstance");
            vm.$store.dispatch("setDetailsView",'ChecklistsDetail');
          }
        },
        toggleActionsMenu: function() {
            this.showOptions = !this.showOptions;
        },
    },
    created: function () {
        this.loadItems();
    },
    components: {
        VeeValidate,
    }
}
</script>

<style lang='scss' scoped>
    .hidden {
        display: none;
    }
    .overflow{
        overflow-y: scroll;
        overflow-x: hidden;
        height: calc(100vh - 60px - 30px - 115px);
        max-height:calc(100vh - 60px - 30px - 115px);
    }

    .panel-action-bar{
        padding: 10px 2px 10px 2px;
    }
    .add-new-button {
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    .thread-action-icon {
        width: auto;
        height: 30px;
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
    min-width: 180px;
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

  .description{
      padding: 10px;
  }

  .highlight{
      background-color: #efefef;
  }



.thread-actions {
          position: absolute;
          top: 7px;
          right: 0px;
          text-align: right;
          vertical-align: top;
          height: 30px;

          .thread-action {
            display: inline-block;
            cursor: pointer;
            height: 30px;

            i {
              padding: 0px 5px;
            }

            .thread-action-icon {
              height: 30px;
              width: auto;
              margin-left: 0px;
              display: inline-block;
              vertical-align: text-bottom;
            }

            &.dropdown {
              position: relative;

              .thread-dropdown-options {
                .thread-dropdown-option {
                  &.header {
                    background: $gray-lt;
                    padding: 2px 10px;
                    cursor: initial;
                  }

                  .thread-dropdown-option-icon-wrapper {
                    float: left;
                    width: 25px;
                    height: 25px;

                    .thread-dropdown-option-icon {
                      width: 25px;
                      height: 25px;
                    }
                  }

                  .notification-status-icon {
                    float: right;
                    font-size: 16px;
                    line-height: 22px;
                    color: $blue-lt;
                  }

                  .thread-dropdown-option-text {
                    margin-top: 2px; // color: @Color-primary;
                    padding-left: 30px;
                    min-width: 195px;
                    line-height: 20px;
                  }
                }
              }
            }
          }
        }
    .ellipsis-button{
        display: inline-block;
    }
    .name-input{
        width: 400px;
        margin-bottom: 6px;
    }
    .desc-input{
        width: 400px;
        height: 65px;
    }
    .outline-button{
        border: 1px solid #1f8bd5;
    }
    .edit-button{
        margin-top: 10px;
    }
    // .type-description{
    //     font-size: 12px; 
    //     font-weight: lighter;
    //     max-width: 600px;
    //     font-family: Roboto;
    // }
    // .type-name{
    //     font-size: 18px;
    //     font-weight: 200px;
    //     font-family: Roboto;
    //     max-width: 600px;
    // }
    .generic-list-header{
        margin-bottom: 0;
        // display:-webkit-inline-box
    }
    .edit-menu{
        border-radius: 10px;
    }
    .error-message{
        color: red;
        font-size: 11px;
    }
</style>
