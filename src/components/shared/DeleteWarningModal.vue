<template>
    <div class="prompt-modal">
        <div class="float-right">
            <img id="delete-warning-modal-close-button" class="close-btn" title="Close" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="close()" />
        </div>
        <div class="prompt-text">
            <div class="prompt-title">
                WARNING:
            </div>
            <div class="prompt-body" v-if="deleteType == 'classification'">
                You are about to delete the <br>{{ type.name }} Category.
            </div>
            <div class="prompt-body" v-if="deleteType == 'item'">
                You are about to delete <br>{{ item.name }}.
            </div>
        </div>
        <div class="base-prompt-button">
            <!-- <button class="btn btn-outline prompt-button" v-on:click="close()">CANCEL</button> -->
            <button id="delete-warning-modal-delete-button" class="btn btn-primary prompt-button" v-on:click="confirmDelete()">DELETE</button>
        </div>
    </div>
</template>

<script>
import {
    mapGetters
  } from 'vuex';

export default {
    name: 'DeleteWarningModal',
    computed:{
        ...mapGetters(['deleteType', 'Key', 'DocumentsType', 'DocumentsTypesList', 'DocumentsItem', 'AssetsType', 'AssetsTypesList', 'AssetsItem', 'ChecklistsType', 'ChecklistsTypes', 'ChecklistsItem', 'Task'])
    },    
    data() {
      return {
        type: {},
        typeslist: [],
        item: {},
      };
    },
    created: function(){
        let vm = this;
        if(vm.Key === 'Documents'){
          vm.type = vm.DocumentsType;
          vm.typeslist = vm.DocumentsTypesList;
          vm.item = vm.DocumentsItem;
        }
        else if(vm.Key === 'Assets'){
          vm.type = vm.AssetsType;
          vm.typeslist = vm.AssetsTypesList;
          vm.item = vm.AssetsItem;
        }
        else if(vm.Key === 'Checklists'){
          vm.type = vm.ChecklistsType;
          vm.typeslist = vm.ChecklistsTypes;
          vm.item = vm.Task;
        }
    },
    methods:{
        confirmDelete(){
            let vm = this;
            if(vm.deleteType === 'classification'){
              vm.$store.dispatch('Remove' + vm.Key + 'Classification', vm.type).then(() => {
                if(vm.typeslist.length > 0){
                  vm.$store.dispatch('set' + vm.Key + 'Type', vm.typeslist[0].id);
                }
              });
            }
            else if(this.deleteType === 'item'){
              vm.$store.dispatch('delete' + vm.Key + 'Item', vm.item).then(() => {
                    if(vm.Key !== 'Checklists'){
                      vm.$store.dispatch('set' + vm.Key + 'Item', '');
                    }
                vm.$store.dispatch("setDetailsView", '');
                });
            }
            this.close();
        },
        close(){
            this.$store.dispatch('closeModal')
        }
    }
}
</script>

<style>
    .modal-container {
        width: 90%;
        max-width: 390px;
        margin: 0px auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
    }
    .prompt-modal{
        padding: 10px;
        -webkit-font-smoothing: antialiased !important;
        text-align: center;
        font-family: Roboto;
    }
    .close-btn{
        width: 20px;
    }
    .prompt-text{
        padding: 25px;
    }
    .prompt-title{
        font-weight: 425;
        padding-bottom: 3px;
        color: #ed2124;
    }
    .prompt-body{
        color: #1F8BD5;
    }
    .prompt-button{
        min-width: 80px;
        min-height: 34px;
    }
    .btn-outline{
        border: 1px solid #1f8bd5;
    }
    .base-prompt-button{
        width: 100%;
        text-align: center;
        padding-bottom: 15px;
    }
</style>
