<template>
    <div class="radioContainer">
        <div class="radioInnerContainer">
            <span style="font-weight: 500;" >Radio Button Group Options</span>
            <div v-for="box in radioOptions">
                <input type="text" :id="box.id" v-on:input="updateRadioButtonText($event, box.id)" :value="box.val" />
                <img class="col-2 delete-asset-button" v-on:click="removeRadioOption(box.id)"
                     src="https://assets.autoalert.com/img/autoalert-icons/icon-close-or-remove-lake.svg"/>
            </div>
            <div align="right" class="panel-action-bar bb-1 content add-property" v-on:click="addRadioOption()">
                <img class="add-property-button" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-lake.svg">
                <span class="add-property-text">Add Selection</span>
            </div>
        </div>
    </div>
</template>

<script>
  import { debounce } from 'debounce'
  export default {
    name: 'RadioButtonsControl',
    props: ['index', 'metadata'],
    data() {
      return {
        radioOptions: [],
        radioObject: {}
      }
    },
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj});
      },
      addRadioOption(){
        this.radioOptions = [];
        for(let prop in this.radioObject){
          if(this.radioObject.hasOwnProperty(prop) && prop.includes('option_')){
            this.radioOptions.push({id: prop, val: this.radioObject[prop]});
          }
        }

        let numIndex = this.radioOptions.length > 0 ? Math.max.apply(null, this.radioOptions.map(m => parseInt(m.id.substring(7, m.id.length)))) + 1 : 0;
        let option = 'option_' + numIndex;

        this.radioOptions.push({id: option , val: ''});
      },
      removeRadioOption(id){
        this.radioOptions = [];
        delete this.radioObject[id];
        for(let prop in this.radioObject){
          if(this.radioObject.hasOwnProperty(prop) && prop.includes('option_')){
            this.radioOptions.push({id: prop, val: this.radioObject[prop]});
          }
        }
        this.updateMetaData(this.radioObject);
      },
      updateRadioButtonText: debounce(
        function (e, i) {
            this.radioObject[i] = e.target.value;
            this.updateMetaData(this.radioObject);
        }, 500)
    },
    created: function () {
      for(let prop in this.metadata){
        if(this.metadata.hasOwnProperty(prop) && prop !== 'uiControl'){
          this.radioObject[prop] = this.metadata[prop];
          if(this.metadata.hasOwnProperty(prop) && prop.includes('option_')){
            this.radioOptions.push({id: prop , val: this.metadata[prop]});
          }
        }
      }
    }
  }
</script>

<style lang='scss'  scoped>
    @import '../../../styles/colors';
    .radioContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .radioInnerContainer {
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
