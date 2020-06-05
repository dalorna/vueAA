<template>
    <div class="prompt-modal">
        <div class="float-right">
            <img id="delete-requirement-modal-close-button" class="close-btn" title="Close" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="close()" />
        </div>
        <div class="prompt-text">
            You must remove all documents/assets in this checklist before it can be deleted.
        </div>
        <div class="main-prompt-button">
            <button id="delete-requirement-modal-ok-button" class="btn btn-primary prompt-button" v-on:click="close()">OK</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'DeleteRequirementModal',
    methods:{
        close(){
            this.$store.dispatch('closeModal')
        }
    }
}
</script>

<style>
    .modal-container {
        width: 90%;
        max-width: 390px;
        margin: 0px auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
    }
    .prompt-modal{
        padding: 10px;
        -webkit-font-smoothing: antialiased !important;
        font-family: Roboto;
    }

    .close-btn{
        width: 20px;
    }
    .prompt-text{
        padding: 25px;
        color: #1F8BD5;
        text-align: center;
    }
    .prompt-button{
        min-width: 70px;
        min-height: 34px;
    }
    .main-prompt-button{
        width: 100%;
        text-align: center;
        padding-bottom: 15px;
    }
</style>