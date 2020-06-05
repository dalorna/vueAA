<template>
    <div class="form-group">
        <div class="row">
            <div class="col-md-2">
                <label>{{minVal}}</label>
            </div>
            <div class="col-md-8 slideContainer">
                <input id="inputRange" @change="onInput" type="range" :min="minVal" class="slider" :max="maxVal" :value="numberAnswer" step="1" :disabled="!status" :class="{disabled : !status}">
            </div>
            <div class="col-md-2">
                <label>{{maxVal}}</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-8 slideContainer">
                <div style="margin: auto;">
                    <div style="float: left"><label>Value:</label></div>
                    <div style="float: left;margin-left: 10px;"><span>{{numberAnswer}}</span></div>
                </div>
            </div>
            <div class="col-md-2">
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'NumberRangePropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        numberAnswer: 0,
        minVal: 0,
        maxVal: 0
      }
    },
    methods: {
      onInput(event) {
        this.numberAnswer = event.target.value;
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex,  data: {Range: JSON.stringify({numberAnswer: event.target.value})},  isValid: true });
      }
    },
    created: function () {
      this.numberAnswer = this.data && this.data['Range'] ? JSON.parse(this.data['Range']).numberAnswer : this.metadata.minVal;
      this.$emit('updateData', {
        index: this.index,
        assetIndex: this.assetIndex,
        data: this.data,
        isValid: true
      });
      this.minVal = this.metadata.minVal;
      this.maxVal = this.metadata.maxVal;
    }
  }
</script>

<style lang='scss' scoped>
    @import '../../../styles/colors';

    .slideContainer {
        width: 100%;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 25px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider:hover {
        opacity: 1;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background: $lake;
        cursor: pointer;
    }
    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: $lake;
        cursor: pointer;
    }
</style>
