<template>
    <div class="form-group row">
        <div class="col-md-1">
        </div>
        <div class="col-md-11">
            <fieldset>
                <template v-for="box in checkBoxes">
                    <div class="form-check">
                        <label class="form-check-label" :for="box.id">
                            <input class="form-check-input" type="checkbox" :id="box.id" name="radioGroup" @change="onInput" :checked="box.checked" :disabled="!status" :class="{disabled : !status}" >
                            {{box.display}}
                        </label>
                    </div>
                </template>
            </fieldset>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'CheckboxesPropertyControl',
    props: ['assetIndex', 'index', 'metadata', 'status', 'data'],    data() {
      return {
        checkBoxes: [],
        selectedCheckboxes: {}
      }
    },
    methods: {
      onInput(event) {
        this.selectedCheckboxes[event.target.id] = event.target.checked;
        let selection = {Boxes: JSON.stringify(this.selectedCheckboxes)};
        this.$emit('updateData', {index: this.index, assetIndex: this.assetIndex, data: selection, isValid: true});
      }
    },
    created: function () {
      this.selectedCheckboxes = this.data && this.data['Boxes'] ? JSON.parse(this.data['Boxes']) : {};
      this.$emit('updateData', {
        index: this.index,
        assetIndex: this.assetIndex,
        data: this.data,
        isValid: true
      });

      for (let prop in this.metadata) {
        if (this.metadata.hasOwnProperty(prop) && prop.includes('option_')) {
          let check = this.selectedCheckboxes.hasOwnProperty(prop);
          let checked = check ? this.selectedCheckboxes[prop] : false;
          this.checkBoxes.push({
            id: prop,
            display: this.metadata[prop],
            checked: checked
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
