<template>
    <div>
        <div class="form-group row">
            <div class="col-md-12">
                <textarea id="inputText" class="form-control" v-validate="{required: true, max:maxLength}" name="Answer" v-model="longAnswer" v-on:input="onInput($event)" :disabled="!status" :class="{disabled : !status}" ></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="error">{{ errors.first('Answer') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce'

  export default {
    name: 'LongAnswerPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        longAnswer: '',
        maxLength: 128
      }
    },
    methods: {
      onInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let longAnswer = {LongAnswer: JSON.stringify({longAnswer: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: longAnswer, isValid: result});
        });
      }, 250)
    },
    created: function () {
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['LongAnswer']});
      this.longAnswer = this.data && this.data['LongAnswer'] ? JSON.parse(this.data['LongAnswer']).longAnswer : '';
      this.maxLength = this.metadata.maxVal;
    }
  }
</script>

<style scoped>

</style>
