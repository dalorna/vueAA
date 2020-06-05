<template>
    <div>
        <div class="form-group row">
            <label for="inputBeginDate" class="col-sm-3 col-form-label">Begin Date</label>
            <div class="col-sm-9">
                <input type="date" id="inputBeginDate" class="form-control" name="Begin Date" v-model="beginDate" :disabled="!status"
                       :class="{disabled : !status}"
                       v-validate="'date_format:YYYY-MM-DD, required'" @change="onBeginDateInput" placeholder="Date">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="error">{{ errors.first('Begin Date') }}</span>
            </div>
        </div>


        <div class="form-group row">
            <label for="inputEndDate" class="col-sm-3 col-form-label">End Date</label>
            <div class="col-sm-9">
                <input type="date" id="inputEndDate" class="form-control" name="End Date" v-model="endDate" :disabled="!status"
                       :class="{disabled : !status}"
                       v-validate="'date_format:YYYY-MM-DD, required'" @change="onEndDateInput" placeholder="Date">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <span class="error">{{ errors.first('End Date') }}</span>
            </div>
        </div>
        <div v-if="endDateError" class="row">
            <div class="col-md-12">
                <span class="error">End Date cannot be before Begin Date</span>
            </div>
        </div>
    </div>
</template>

<script>
  import { debounce } from 'debounce'
  import { dates } from '../../utilities/custom'



  export default {
    name: 'DateRangePropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        beginDate: {},
        endDate: {},
        endDateError: false
      }
    },
    methods: {
      onBeginDateInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let validDates = false;
          this.endDateError = false;
          if(this.dateCheck(this.beginDate) && this.dateCheck(this.endDate)){
             if(this.dateCompare(this.beginDate, this.endDate)){
               validDates = true;
             } else {
               this.endDateError = true;
             }
          }
          let dataData = {Dates: JSON.stringify({beginDate: event.target.value, endDate: this.endDate})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: dataData, isValid: validDates && result});
        });
      }, 250),
      onEndDateInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let validDates = false;
          this.endDateError = false;
          if(this.dateCheck(this.beginDate) && this.dateCheck(this.endDate)){
            if(this.dateCompare(this.beginDate, this.endDate)){
              validDates = true;
            } else {
              this.endDateError = true;
            }
          }
          let dataData = {Dates: JSON.stringify({beginDate: this.beginDate, endDate: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: dataData, isValid: validDates && result});
        });
      }, 250),
      dateCompare(beginDate, EndDate){

        let comp = dates.compare(beginDate, EndDate);

        if(comp === 1){
          return false;
        } else if(comp === 0){
          return false;
        } else if(isNaN(comp)){
          return false;
        }
        return true;
      },
      dateCheck(date){
        return !isNaN(dates.convert(date));
      }
    },
    created: function () {
      this.beginDate = this.data && this.data['Dates'] ? JSON.parse(this.data['Dates']).beginDate : '';
      this.endDate = this.data && this.data['Dates']  ? JSON.parse(this.data['Dates']).endDate : '';
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['Dates']});
    }
  }
</script>

<style scoped>

</style>
