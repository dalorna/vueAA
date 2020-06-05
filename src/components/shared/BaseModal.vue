<template>
  <div id="base-modal">
    <transition class="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <component v-bind:is="Modal.modalTitle"></component>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import ReassignModal from "../Dashboard/ReassignModal.vue";
  import LoadingIndicator from '../shared/LoadingIndicator.vue';
  import DeleteWarningModal from '../shared/DeleteWarningModal.vue';
  import DeleteRequirementModal from '../shared/DeleteRequirementModal.vue';
  import AdHocTask from '../Task/AdHocTask';


  export default {
    name: "BaseModal",
    computed: {
      ...mapGetters(['Modal'])
    },
    components: {
      ReassignModal,
      LoadingIndicator,
      DeleteWarningModal,
      DeleteRequirementModal,
      AdHocTask,
    },
  }
</script>

<style lang="scss" scoped>
// you will need to put the mondal container class in your modal file to adjust the size
    // .modal-container {
    //   width: 90%;
    //   max-width: 850px;
    //   margin: 0px auto;
    //   background-color: #fff;
    //   border-radius: 10px;
    //   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    //   transition: all 0.3s ease;
    // }
  #base-modal {
    .modal-mask {
      position: fixed;
      z-index: 9998;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: table;
      transition: opacity 0.3s ease;
    }

    .modal-wrapper {
      display: table-cell;
      vertical-align: top;
      padding-top: 5vh;
    }
  }
</style>