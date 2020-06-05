<template>
    <div class="form-group">
        <div class="row">
            <div class="col-sm-12">
                <label for="inputStreet">Street Address</label>
                <input type="text" v-validate="'required'" id="inputStreet" name="Street Address" class="form-control"
                       v-model="streetAddress" v-on:input="onStreetInput($event)"
                       :disabled="!status" :class="{disabled : !status}">
            </div>
            <div class="col-md-12">
                <span class="error">{{ errors.first('Street Address') }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <label for="inputLineTwo">Address Line 2</label>
                <input type="text" id="inputLineTwo" name="Address Line 2" class="form-control" v-model="addressLineTwo"
                       v-on:input="onLineTwoInput($event)"
                       :disabled="!status" :class="{disabled : !status}">
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <label for="inputCity">City</label>
                <input type="text" id="inputCity" name="City" class="form-control" v-model="city"
                       v-on:input="onCityInput($event)" v-validate="'required'"
                       :disabled="!status" :class="{disabled : !status}">
            </div>
            <div class="col-md-12">
                <span class="error">{{ errors.first('City') }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <label for="inputState">State</label>
                <select name="State" id="inputState" class="form-control" v-validate="'required'"
                        v-model="state" v-on:input="onStateInput($event)"
                        :disabled="!status" :class="{disabled : !status}">
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
            </div>
            <div class="col-sm-6">
                <label for="inputZip">Zip Code</label>
                <input type="text" id="inputZip" name="Zip Code" class="form-control" v-model="zipCode"
                       v-on:input="onZipInput($event)" v-validate="'required|min:5'" onkeydown="return ( event.ctrlKey || event.altKey || (47 < event.keyCode && event.keyCode < 58 && event.shiftKey === false) || (95 < event.keyCode && event.keyCode < 106) || (event.keyCode === 8) || (event.keyCode === 9) || (event.keyCode > 34 && event.keyCode < 40) || (event.keyCode === 46))"
                       :disabled="!status" :class="{disabled : !status}" pattern="(\d{5}([\-]\d{4})?)" placeholder="Zip Code" >
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <span class="error">{{ errors.first('State') }}</span>
            </div>

            <div class="col-md-6">
                <span class="error">{{ errors.first('Zip Code') }}</span>
            </div>
        </div>

    </div>
</template>

<script>
  import {debounce} from 'debounce'

  export default {
    name: 'AddressPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        streetAddress: '',
        addressLineTwo: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    methods: {
      onStreetInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let addressData = {Address: JSON.stringify({
              streetAddress: event.target.value,
              addressLineTwo: this.addressLineTwo,
              city: this.city,
              state: this.state,
              zipCode: this.zipCode
            })};
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: addressData,
            isValid: result
          });
        });
      }, 250),
      onLineTwoInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let addressData ={Address:  JSON.stringify({
              streetAddress: this.streetAddress,
              addressLineTwo: event.target.value,
              city: this.city,
              state: this.state,
              zipCode: this.zipCode
            })};
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: addressData,
            isValid: result
          });
        });
      }, 250),
      onCityInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let addressData = {Address: JSON.stringify({
              streetAddress: this.streetAddress,
              addressLineTwo: this.addressLineTwo,
              city: event.target.value,
              state: this.state,
              zipCode: this.zipCode
            })};
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: addressData,
            isValid: result
          });
        });
      }, 250),
      onStateInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let addressData = {Address: JSON.stringify({
              streetAddress: this.streetAddress,
              addressLineTwo: this.addressLineTwo,
              city: this.city,
              state: event.target.value,
              zipCode: this.zipCode
            })};
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: addressData,
            isValid: result
          });
        });
      }, 250),
      onZipInput: debounce(function (event) {
        this.$validator.validate().then(result => {

          event.target.value = event.target.value.replace(/[^0-9]/g, '')
            .replace(/(\d{5})(\d{4})/, '$1-$2').substring(0, 10);
          let addressData = {Address:  JSON.stringify({
              streetAddress: this.streetAddress,
              addressLineTwo: this.addressLineTwo,
              city: this.city,
              state: this.state,
              zipCode: event.target.value
            })};
          this.$emit('updateData', {
            index: this.index,
            assetIndex: this.assetIndex,
            data: addressData,
            isValid: result
          });
        });
      }, 50)
    },
    created: function () {
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['Address'] });
      this.streetAddress = this.data && this.data['Address'] ? JSON.parse(this.data['Address']).streetAddress : '';
      this.addressLineTwo = this.data && this.data['Address']  ? JSON.parse(this.data['Address']).addressLineTwo : '';
      this.city = this.data && this.data['Address']  ? JSON.parse(this.data['Address']).city : '';
      this.state = this.data && this.data['Address']  ? JSON.parse(this.data['Address']).state : '';
      this.zipCode = this.data && this.data['Address']  ? JSON.parse(this.data['Address']).zipCode : '';
    }
  }
</script>

<style scoped>
    label{
        margin-bottom: 0px;
        margin-top: 5px;
    }
</style>
