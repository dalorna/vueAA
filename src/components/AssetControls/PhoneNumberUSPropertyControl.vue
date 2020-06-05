<template>
    <div>
        <div class="form-group row">
            <label for="inputPhone" class="col-sm-3 col-form-label">Phone</label>
            <div class="col-sm-9">
                <input type="text" id="inputPhone" class="form-control" :value="phone" v-on:input="onInput($event)" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :disabled="!status" :class="{disabled : !status}" >
            </div>
        </div>
    </div>
</template>

<script>
  import { debounce } from 'debounce'
  export default {
    name: 'PhoneNumberUSPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data (){
      return {
        phone: '',
        country: []
      }
    },
    methods: {
      onInput: debounce( function(event){
        event.target.value = event.target.value.replace(/[^0-9]/g, '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').substring(0, 14);
          let phoneData = {Phone: JSON.stringify({phone: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: phoneData, isValid: event.target.value.replace(/[^0-9]/g,"").length === 10});
      }, 250)
    },
    created: function () {
      let valid = this.data && this.data['Phone'] && JSON.parse(this.data['Phone']).phone.replace(/[^0-9]/g,"").length === 10;
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: valid});
      this.phone = this.data && this.data['Phone'] ? JSON.parse(this.data['Phone']).phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').substring(0, 14) : '';
    }
  }
</script>

<style lang="scss" scoped>

</style>
