<template>
<!--just a place holder-->
</template>

<script>
  export default {
    name: 'EmailAddressControl',
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
