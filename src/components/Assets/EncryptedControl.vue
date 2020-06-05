<template>
    <!--<div>-->
    <!--just a place holder-->
    <!--<span>EncryptedControl</span>-->
    <!--</div>-->
</template>

<script>
  export default {
    name: 'EncryptedControl',
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
