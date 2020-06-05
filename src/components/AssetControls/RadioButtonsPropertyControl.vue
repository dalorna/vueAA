<template>
    <div class="form-group row">
        <div class="col-md-1">
        </div>
        <div class="col-md-11">
            <fieldset>
                <template v-for="radio in radioButtons">
                    <div class="form-check">
                        <label class="form-check-label" :for="radio.id">
                            <input class="form-check-input" type="radio" :id="radio.id" name="radioGroup"
                                   :value="radio.id" @change="onInput" :disabled="!status" :class="{disabled : !status}"
                                   :checked="radio.checked">
                            {{radio.display}}
                        </label>
                    </div>
                </template>
            </fieldset>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'RadioButtonsPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],
    data() {
      return {
        selectedRadio: '',
        radioButtons: []
      }
    },
    methods: {
      onInput(event) {
        let selection = {Radio: JSON.stringify({selectedRadio: event.target.value})};
        this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: selection, isValid: true});
      }
    },
    created: function () {
      this.selectedRadio = this.data && this.data['Radio'] ? JSON.parse(this.data['Radio']).selectedRadio : '';
      this.$emit('updateData', {
        index: this.index,
        assetIndex: this.assetIndex,
        data: this.data,
        isValid: !!this.selectedRadio
      });

      for (let prop in this.metadata) {
        if (this.metadata.hasOwnProperty(prop) && prop.includes('option_')) {
          this.radioButtons.push({
            id: prop,
            display: this.metadata[prop],
            checked: prop === this.selectedRadio
          });
        }
      }
    }
  }
</script>

<style scoped>
    input {
        margin-top: 4px;
    }
</style>
