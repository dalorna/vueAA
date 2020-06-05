<template>
    <div>
        <img src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" class="float-right close-button" v-on:click="close()">
        <div>{{ SelectedDocument.name }}</div>
        <div>{{ SelectedDocument.description }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed:{
        ...mapGetters(['Document'])
    },
    data: function(){
        return{
        }
    },
    created: function(){
    },
    methods:{
        close: function(){
            this.$store.dispatch("setDetailsView", '');
            this.$store.dispatch("setOverlappingPane", true);
        }
    }
}
</script>

<style>

</style>
