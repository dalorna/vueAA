<template>
    <div class="checkContainer">
        <div class="checkInnerContainer">
            <span style="font-weight: 500;" >Checkboxes Group Options</span>
            <div class="col-md-12" v-for="box in checkboxOptions">
                <input type="text" :id="box.id" v-on:input="updateCheckboxText($event, box.id)" v-model="box.val" />
                <img class="col-2 delete-asset-button" v-on:click="removeCheckbox(box.id)"
                     src="https://assets.autoalert.com/img/autoalert-icons/icon-close-or-remove-lake.svg"/>
            </div>
            <div align="right" class="panel-action-bar bb-1 content add-property" v-on:click="addCheckbox()">
                <img class="add-property-button" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-lake.svg">
                <span class="add-property-text">Add Selection</span>
            </div>
        </div>
    </div>
</template>

<script>

  import { debounce } from 'debounce'

  export default {
    name: 'CheckboxesControl',
    props: ['index', 'metadata'],
    data() {
      return {
        checkboxOptions: [],
        checkboxObject: {}
      }
    },
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj});
      },
      addCheckbox(){
        this.checkboxOptions = [];
        for(let prop in this.checkboxObject){
          if(this.checkboxObject.hasOwnProperty(prop) && prop.includes('option_')){
            this.checkboxOptions.push({id: prop, val: this.checkboxObject[prop]});
          }
        }

        let numIndex = this.checkboxOptions.length > 0 ? Math.max.apply(null, this.checkboxOptions.map(m => parseInt(m.id.substring(7, m.id.length)))) + 1 : 0;
        let option = 'option_' + numIndex;

        this.checkboxOptions.push({id: option , val: ''});
      },
      removeCheckbox(id){
        this.checkboxOptions = [];
        delete this.checkboxObject[id];
        for(let prop in this.checkboxObject){
          if(this.checkboxObject.hasOwnProperty(prop) && prop.includes('option_')){
            this.checkboxOptions.push({id: prop, val: this.checkboxObject[prop]});
          }
        }
        this.updateMetaData(this.checkboxObject);
      },
      updateCheckboxText: debounce(
        function (e, i) {
            this.checkboxObject[i] = e.target.value;
            this.updateMetaData(this.checkboxObject);
        }, 500)
    },
    created: function () {
      for(let prop in this.metadata){
        if(this.metadata.hasOwnProperty(prop) && prop !== 'uiControl'){
          this.checkboxObject[prop] = this.metadata[prop];
        }
        if(this.metadata.hasOwnProperty(prop) && prop.includes('option_')){
          this.checkboxOptions.push({id: prop , val: this.metadata[prop]});
        }
      }
    }
  }
</script>

<style lang='scss'  scoped>
    @import '../../../styles/colors';
    .checkContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .checkInnerContainer {
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
