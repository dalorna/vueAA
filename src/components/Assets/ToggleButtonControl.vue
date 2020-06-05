<template>
    <div class="toggleContainer">
        <div class="toggleInnerContainer">
            <span style="font-weight: 500;">Toggle Control Options</span>
            <div class="row col-space">
                <div class="col-md-12">
                    <label for="onVal">Toggle On Value:</label>
                    <input id="onVal" name="On Value" v-validate="'required|min:3|max:128'" v-model="toggleOptions['onVal']" title="On Value Text" type="text" class="textInputWidth controlRadius marginMinLeft" v-on:input="updateText($event)"/>
                    <span class="error">{{ errors.first('On Value') }}</span>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label for="offVal">Toggle Off Value:</label>
                    <input id="offVal" name="Off Value" v-validate="'required|min:3|max:128'" v-model="toggleOptions['offVal']" title="Off Value Text" type="text" class="textInputWidth controlRadius marginMaxLeft" v-on:input="updateText($event)"/>
                    <span class="error">{{ errors.first('Off Value') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { debounce } from 'debounce'

  export default {
    name: 'ToggleButtonControl',
    props: ['index', 'metadata'],
    data() {
      return {
        toggleOptions: {}
      }
    },
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj});
        this.$emit('addErrorEvent', this.$validator.errors.items.length);
      },
      updateText: debounce(
        function (e) {
          this.toggleOptions[e.target.id] = e.target.value;
          this.updateMetaData(this.toggleOptions);
        }, 500
      )
    },
    created: function () {
      for (let prop in this.metadata) {
        if (this.metadata.hasOwnProperty(prop) && prop !== 'uiControl') {
          this.toggleOptions[prop] = this.metadata[prop];
        }
      }
    },
    mounted: function () {
      let vm = this;
      vm.$validator.validate().then((result) => {
        if(!result){
          vm.$emit('addErrorEvent', this.$validator.errors.items.length);
        }
      });
    }
  }
</script>

<style lang='scss' scoped>
    @import '../../../styles/colors';

    .toggleContainer {
        border-radius: 5px;
        border: 1px solid #E7E7E7;
        margin: 10px 0 0 0;
    }
    .toggleInnerContainer {
        padding: 5px 5px 10px 5px;
    }
    .controlRadius {
        border-radius: 5px;
    }
    .textInputWidth {
        width: 175px;
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

