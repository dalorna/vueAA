<template>
    <div class="numberContainer">
        <div class="numberInnerContainer">
            <span style="font-weight: 500;">Number Control Options</span>
            <div class="row col-space">
                <div class="col-md-12">
                    <label for="minVal">Min Value:</label>
                    <input id="minVal" name="Minimum Value" v-validate="'required'" :value="numberOptions['minVal']" title="Whole Numbers Only" onkeypress="return event.charCode >= 48 && event.charCode <= 57" step="1" pattern="[0-9]" type="number" class="numberInputWidth controlRadius marginMinLeft" v-on:input="updateNumber($event)"/>
                </div>
                <div class="col-md-12">
                    <span class="error">{{ errors.first('Minimum Value') }}</span>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label for="maxVal">Max Value:</label>
                    <input id="maxVal" name="Maximum Value" v-validate="'required'" :value="numberOptions['maxVal']" title="Whole Numbers Only" onkeypress="return event.charCode >= 48 && event.charCode <= 57" step="1" pattern="[0-9]" type="number" class="numberInputWidth controlRadius marginMaxLeft" v-on:input="updateNumber($event)"/>
                </div>
                <div class="col-md-12">
                    <span class="error">{{ errors.first('Maximum Value') }}</span>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label for="decimalVal">Number of decimal Value:</label>
                    <input id="decimalVal" name="Decimal Value" v-validate="'required'" :value="numberOptions['decimalVal']" title="Whole Numbers Only" onkeypress="return event.charCode >= 48 && event.charCode <= 57" step="1" pattern="[0-9]" type="number" class="numberInputWidth controlRadius" v-on:input="updateNumber($event)"/>
                </div>
                <div class="col-md-12">
                    <span class="error">{{ errors.first('Decimal Value') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce';

  export default {
    name: 'NumberControl',
    props: ['index', 'metadata'],
    data() {
      return {
        numberOptions: {}
      }
    },
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj});
        this.$emit('addErrorEvent', this.$validator.errors.items.length);
      },
      updateNumber: debounce(
        function (e) {
          this.numberOptions[e.target.id] = e.target.value;
          this.updateMetaData(this.numberOptions);
        }, 500
      )
    },
    created: function () {
      if(!this.metadata.hasOwnProperty('maxVal')){
        this.metadata['maxVal'] = 1024;
        this.updateMetaData(this.metadata);
      }
      if(!this.metadata.hasOwnProperty('minVal')){
        this.metadata['minVal'] = 1;
        this.updateMetaData(this.metadata);
      }
      if(!this.metadata.hasOwnProperty('decimalVal')){
        this.metadata['decimalVal'] = 2;
        this.updateMetaData(this.metadata);
      }
      for (let prop in this.metadata) {
        if (this.metadata.hasOwnProperty(prop) && prop !== 'uiControl') {
          this.numberOptions[prop] = this.metadata[prop];
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
    @import '../../../styles/colors';
    .numberContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .numberInnerContainer {
        padding: 5px 5px 10px 5px;
    }
    .controlRadius {
        border-radius: 5px;
    }
    .numberInputWidth {
        width: 75px;
    }
    .labelTopMargin {
        margin-top: 7px;
    }
    .marginMinLeft{
        margin-left: 94px;
    }
    .marginMaxLeft{
        margin-left: 91px;
    }
</style>
