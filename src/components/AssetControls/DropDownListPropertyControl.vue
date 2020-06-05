<template>
    <div class="form-group row">
        <div class="col-md-12">
            <select class="form-control" v-model="selectedAnswer" @change="onInput" :disabled="!status" :class="{disabled : !status}" >
                <option v-for="opt in options" :disabled="opt.disabled" :selected="opt.selected" :value="opt.value"  >{{opt.display}}</option>
            </select>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'DropDownListPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        selectedAnswer: '',
        options: []
      }
    },
    methods: {
      onInput(event) {
        let selection = {DDL: JSON.stringify({selectedAnswer: event.target.value})};
        this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: selection, isValid: true});
      }
    },
    created: function () {
      this.selectedAnswer = this.data && this.data['DDL'] ? JSON.parse(this.data['DDL']).selectedAnswer : 'default';
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: this.selectedAnswer !== 'default' });

      if(this.selectedAnswer === 'default'){
        this.options.push({value: 'default', display: 'Select A Option', disabled: true, selected: true});
      }

      for(let prop in this.metadata){
        if(this.metadata.hasOwnProperty(prop) && prop.includes('option_')){
          this.options.push({value: prop, display: this.metadata[prop], disabled: false, selected: this.metadata[prop] === this.selectedAnswer});
        }
      }
    }
  }
</script>

<style scoped>

</style>
