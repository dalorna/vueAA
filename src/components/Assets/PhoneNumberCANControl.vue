<template>
    <div>
        <span>Phone Number Canada</span>
    </div>
</template>

<script>
  export default {
    name: 'PhoneNumberCANControl',
    props: ['index'],
    methods: {
      updateMetaData() {
        this.$emit('updateMetaDataEvent', user)
      }
    },
    created: function () {
    }
  }
</script>

<style scoped>

</style>
