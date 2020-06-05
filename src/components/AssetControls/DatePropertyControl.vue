<template>
    <div>
        <div class="form-group row">
            <label for="inputDate" class="col-sm-3 col-form-label">Date</label>
            <div class="col-sm-9">
                <input type="date" id="inputDate" class="form-control" name="Date" v-model="date" :disabled="!status"
                       :class="{disabled : !status}"
                       v-validate="'date_format:YYYY-MM-DD, required'" @change="onInput($event)" placeholder="Date">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="error">{{ errors.first('Date') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce'

  export default {
    name: 'DatePropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        date: ''
      }
    },
    methods: {
      onInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let dataData = {Date: JSON.stringify({date: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: dataData, isValid: !!event.target.value && result});
        });
      }, 250)
    },
    created: function () {
      this.date = this.data && this.data['Date'] ? JSON.parse(this.data['Date']).date : '';
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['Date'] });
    }
  }
</script>

<style scoped>

</style>
