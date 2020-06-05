<template>
    <!--just a place holder-->
    <!--<div class="phoneContainer">-->
        <!--<div class="phoneInnerContainer">-->
            <!--<span style="font-weight: 500;">Phone Options</span>-->
            <!--<div class="row col-space">-->
                <!--<div class="col-md-3">-->
                    <!--<label class="form-check" style="margin-top: 7px">-->
                        <!--<input class="form-check-input" v-bind:checked="maskedSelection" style="margin-top: .25rem;" name="" type="checkbox" id="isMasked"-->
                               <!--@change="onMaskChange($event)">-->
                        <!--<span class="custom-control-description">Masked</span>-->
                    <!--</label>-->
                <!--</div>-->
                <!--<div class="col-md-9" style="display: block">-->
                    <!--<label class="form-check" style="display: inline-block;margin-top: 5px;"  for="countrySelect">Select Country</label>-->
                    <!--<select v-bind:value="countrySelection" @change="onCountryChange($event)" id="countrySelect" class="custom-select" style="display: inline-block; width: 150px;">-->
                        <!--<option value="US">US</option>-->
                        <!--<option value="Canada">Canada</option>-->
                    <!--</select>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
</template>

<script>
  export default {
    name: 'PhoneNumberUSControl',
    props: ['index', 'metadata'],
    data() {
      return {
        countrySelection: 'US',
        maskedSelection: false
      }
    },
    methods: {
      updateMetaData() {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: { countrySelection: this.countrySelection, maskedSelection: this.maskedSelection}})
      },
      onMaskChange(e) {
        this.maskedSelection = e.target.value;
        this.updateMetaData();
      },
      onCountryChange(e){
        this.countrySelection = e.target.value;
        this.updateMetaData();
      }
    },
    created: function () {
      // this.countrySelection = this.metadata ? this.metadata['countrySelection'] || this.countrySelection: this.countrySelection;
      // this.maskedSelection  = this.metadata ? this.metadata['maskedSelection'] || this.maskedSelection: this.maskedSelection;
      // this.updateMetaData();
    }
  }
</script>

<style lang='scss' scoped>
    .phoneContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .phoneInnerContainer {
        padding: 5px 5px 10px 5px;
    }
</style>
