<template>
    <div>
        <div class="form-group row">
            <div class="col-md-12">
                <input v-if="isAuthorized" type="text" id="inputText" class="form-control" v-validate="{required: true}" name="Answer"
                       v-model="longAnswer" v-on:input="onInput($event)"
                       :disabled="!status" :class="{disabled : !status}" />
                <input v-else-if="!isAuthorized" disabled type="text" class="form-control" placeholder="•••••••••••••••"/>
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
  import {debounce} from 'debounce';
  import {mapGetters} from 'vuex';
  export default {
    name: 'EncryptedPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    computed: {
      ...mapGetters([
      'isAuthorized', 
      ])
    },
    data() {
      return {
        longAnswer: ''
      }
    },
    methods: {
      onInput: debounce(function (event) {
        this.$validator.validate().then(result => {
          let longAnswer = {Encrypt: JSON.stringify({longAnswer: event.target.value})};
          this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: longAnswer, isValid: result});
        });
      }, 250)
    },
    created: function () {
      this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: this.data, isValid: !!this.data && this.data['Encrypt']});
      this.longAnswer = this.data && this.data['Encrypt'] ? JSON.parse(this.data['Encrypt']).longAnswer : '';
    }
  }
</script>

<style scoped>

</style>
