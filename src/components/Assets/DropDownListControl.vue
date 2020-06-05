<template>
    <div class="ddlContainer">
        <div class="ddlInnerContainer">
            <span style="font-weight: 500;" >Drop Down Options</span>
            <div v-for="box in ddlOptions">
                <input type="text" :id="box.id" v-on:input="updateOptionText($event, box.id)" :value="box.val" />
                <img class="col-2 delete-asset-button" v-on:click="removeDDLOption(box.id)"
                     src="https://assets.autoalert.com/img/autoalert-icons/icon-close-or-remove-lake.svg"/>
            </div>
            <div align="right" class="panel-action-bar bb-1 content add-property" v-on:click="addDropDownOption()">
                <img class="add-property-button" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-lake.svg">
                <span class="add-property-text">Add Selection</span>
            </div>
        </div>
    </div>
</template>

<script>
  import { debounce } from 'debounce'
  export default {
    name: 'DropDownListControl',
    props: ['index', 'metadata'],
    data() {
      return {
        ddlOptions: [],
        ddlObject: {}
      }
    },
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj});
      },
      addDropDownOption(){
        this.ddlOptions = [];
        for(let prop in this.ddlObject){
          if(this.ddlObject.hasOwnProperty(prop) && prop.includes('option_')){
            this.ddlOptions.push({id: prop, val: this.ddlObject[prop]});
          }
        }

        let numIndex = this.ddlOptions.length > 0 ? Math.max.apply(null, this.ddlOptions.map(m => parseInt(m.id.substring(7, m.id.length)))) + 1 : 0;
        let option = 'option_' + numIndex;

        this.ddlOptions.push({id: option , val: ''});
      },
      removeDDLOption(id){
        this.ddlOptions = [];
        delete this.ddlObject[id];
        for(let prop in this.ddlObject){
          if(this.ddlObject.hasOwnProperty(prop)&& prop.includes('option_')){
            this.ddlOptions.push({id: prop, val: this.ddlObject[prop]});
          }
        }
        this.updateMetaData(this.ddlObject);
      },
      updateOptionText: debounce(
        function (e, i) {
            this.ddlObject[i] = e.target.value;
            this.updateMetaData(this.ddlObject);
        }, 500)
    },
    created: function () {
      for(let prop in this.metadata){
        if(this.metadata.hasOwnProperty(prop) && prop !== 'uiControl'){
          this.ddlObject[prop] = this.metadata[prop];
          if(this.metadata.hasOwnProperty(prop) && prop.includes('option_')){
            this.ddlOptions.push({id: prop , val: this.metadata[prop]});
          }
        }
      }
    }
  }
</script>

<style lang='scss'  scoped>
    @import '../../../styles/colors';
    .ddlContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .ddlInnerContainer {
        padding: 5px 5px 10px 5px;
    }
    .add-property-button {
        max-width: 20px;
    }
    .add-property-text {
        color: $lake;
        font-size: 14px;
    }
    .add-property {
        width: 100%;
        padding-bottom: 30px;
    }
    .panel-action-bar {
        min-height: 44px;
        vertical-align: middle;
        color: $charcoal;
        padding:5px;
    }
    .bb-1 {
        border-bottom: 1px solid $gray-lt;
    }
    .delete-asset-button {
        max-height: 20px;
    }
</style>
