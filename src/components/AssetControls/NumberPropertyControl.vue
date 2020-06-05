<template>
    <div class="form-group">
        <div class="row">
            <div class="col-md-4">
                <div class="minVal">
                    <label>Minimum Value</label>
                </div>
                <div class="minVal">
                    <span>{{minVal}}</span>
                </div>
            </div>
            <div class="col-sm-4" style="text-align: center;">
                <input type="number" class="form-input" v-model="numberAnswer" name="Number Input" style="margin-top: 10px"
                       v-validate="{min_value:minVal, max_value:maxVal}" v-bind:step="stepVal" v-bind:min="minVal" v-bind:max="maxVal"
                       @change="onInput($event)" :disabled="!status" :class="{disabled : !status}">
            </div>
            <div class="col-md-4">
                <div class="minVal">
                    <label>Maximum Value</label>
                </div>
                <div class="minVal">
                    <span>{{maxVal}}</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">

            </div>
            <div class="col-sm-4" style="text-align: center;">
                <label>Decimal Places:&nbsp;&nbsp;&nbsp;</label>
                <span>{{decimalVal}}</span>
            </div>
            <div class="col-md-4">

        </div>
        </div>
        <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-10">
                <span class="error">{{ errors.first('Number Input') }}</span>
            </div>
        </div>
        <div v-if="isNotANumber" class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-10">
                <span class="error">Please input a number</span>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce'

  export default {
    name: 'NumberPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        numberAnswer: 0,
        minVal: 0,
        maxVal: 0,
        decimalVal: 0,
        stepVal: 0,
        isNotANumber: false
      }
    },
    methods: {
      onInput: debounce(function (event) {
        this.isNotANumber = !(!!event.target.value);
        this.$validator.validate().then(result => {
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: {Number: JSON.stringify({numberAnswer: event.target.value})},
            isValid: !!event.target.value && result
          });
        })
      })
    },
    created: function () {
      this.numberAnswer = this.data && this.data['Number'] ? JSON.parse(this.data['Number']).numberAnswer : this.metadata.minVal;
      this.$emit('updateData', {
        index: this.index,
        assetIndex: this.assetIndex,
        data: JSON.stringify({numberAnswer: this.numberAnswer}),
        isValid: true
      });
      this.minVal = this.metadata.minVal;
      this.maxVal = this.metadata.maxVal;
      this.decimalVal = parseInt(this.metadata.decimalVal);

      if (this.decimalVal === 0) {
        this.stepVal = 1;
      } else {
        let zeros = '.';
        for (let i = 0; i < this.decimalVal - 1; i++) {
          zeros += '0';
        }
        zeros += '1';
        this.stepVal = parseFloat(zeros);
      }
    }
  }
</script>

<style scoped>
.minVal{
    float: left;
    clear: left;
    width: 100%;
    text-align: center;
}
</style>
