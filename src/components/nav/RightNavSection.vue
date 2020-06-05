<template>
    <div id="rightNavSection">
        <component v-bind:is="detailsView"></component>
    </div>
</template>

<script>

  import {
    mapGetters
  } from 'vuex';

import AssetsDetail from "../../components/Assets/AssetsDetail";
import DocumentsDetail from "../../components/Documents/DocumentsDetail";
import ChecklistsDetail from "../../components/Checklists/ChecklistsDetail";
import HrFormTaker from '../../components/Dashboard/HrFormTaker.vue';
import AddTask from "../Task/AddTask";
import AssetView from "../Dashboard/AssetView.vue"
import ClassificationDetail from "../shared/ClassificationDetail.vue";

export default {
    name: 'rightNavSection',
    computed: {
      ...mapGetters(['detailsView'])
    },
    components: {
        AssetsDetail,
        DocumentsDetail,
        ChecklistsDetail,
        AddTask,
        HrFormTaker,
        AssetView,
        ClassificationDetail,
    }
}
</script>

<style lang="scss" scoped>

#rightNavSection {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

</style>
