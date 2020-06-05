<template>
    <!--<div>-->
    <!--just a place holder-->
    <!--<span>US Address Control</span>-->
    <!--</div>-->
</template>

<script>
  export default {
    name: 'AddressControl',
    props: ['index', 'metadata'],
    methods: {
      updateMetaData(obj) {
        this.$emit('updateMetaDataEvent', {index: this.index, metadata: obj})
      }
    },
    created: function () {
    }
  }
</script>

<style scoped>

</style>
