<template>
    <div class="numberContainer">
        <div class="numberInnerContainer">
            <span style="font-weight: 500;">Long Answer Control Options</span>

            <div class="row col-space">
                <div class="col-md-12">
                    <label for="maxVal">Max Text Length:</label>
                    <input id="maxVal" v-validate="'required'" v-model="numberOptions['maxVal']" title="Whole Numbers Only"
                           onkeypress="return event.charCode >= 48 && event.charCode <= 57" step="10" pattern="[0-9]" type="number"
                           class="numberInputWidth controlRadius marginMaxLeft" v-on:input="updateNumber($event)" name="Max Value" />
                </div>
                <div class="col-md-12">
                    <span class="error">{{ errors.first('Max Value') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce';
  export default {
    name: 'LongAnswerControl',
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
