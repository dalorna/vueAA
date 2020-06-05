<template>
    <div>
        <div class="form-group row">
            <label for="inputEmail" class="col-sm-3 col-form-label">Email</label>
            <div class="col-sm-9">
                <input type="email" id="inputEmail" class="form-control" name="Email Address" v-model="emailAddress" :disabled="!status" :class="{disabled : !status}"
                       v-validate="'required|email'" v-on:input="onInput($event)" placeholder="Email">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="error">{{ errors.first('Email Address') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import {debounce} from 'debounce'

  export default {
    name: 'EmailAddressPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        emailAddress: ''
      }
    },
    methods: {
      onInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let emailData = {Email: JSON.stringify({emailAddress: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: emailData, isValid: result});
        });
      }, 250)
    },
    created: function () {
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['Email']});
      this.emailAddress = this.data && this.data['Email'] ? JSON.parse(this.data['Email']).emailAddress : '';
    }
  }
</script>

<style scoped>

</style>
