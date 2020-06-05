<template>
    <div class="form-group row">
        <div class="col-sm-5 col-form-label col-form-label-sm divLabel">
            <label >{{offVal}}</label>
        </div>
        <div class="col-sm-2">
            <input class="tgl tgl-light"  id="cb1" v-bind:checked="toggleAnswer" type="checkbox" v-on:input="onInput($event)" :disabled="!status" :class="{disabled : !status}">
            <label class="tgl-btn" for="cb1"></label>
        </div>
        <div class="col-sm-5 col-form-label col-form-label-sm divLabel">
            <label>{{onVal}}</label>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ToggleButtonPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        toggleAnswer: false,
        onVal: '',
        offVal: ''
      }
    },
    methods: {
      onInput(event) {
        let toggle = {Toggle: JSON.stringify({toggleAnswer: event.target.checked})};
        this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: toggle, isValid: true});
      }
    },
    created: function () {
      this.toggleAnswer = this.data && this.data['Toggle'] ? JSON.parse(this.data['Toggle']).toggleAnswer : false;
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: true});
      this.onVal = this.metadata.onVal;
      this.offVal = this.metadata.offVal;
    }
  }
</script>

<style scoped>
    label{
        display: block;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
    .divLabel{
        text-align: center;
    }
</style>
