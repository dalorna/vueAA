<template>
  <div id="main-nav" v-bind:class="{'side-nav-collapsed': sideNavCollapsed}">
    <!-- USER INFO IS NOW IN GLOBAL FRAME COMPONENT -->
    <!-- <user-info :user='user' :side-nav-collapsed="sideNavCollapsed" :is-plugin-view="false"/> -->
    <side-nav :side-nav-collapsed='sideNavCollapsed'/>
  </div>
</template>

<script>
  import SideNav from './SideNav.vue'
  import UserInfo from '../Users/UserInfo.vue'

  export default {
    name: "mainNav",
    components: {
      SideNav,
      UserInfo
    },
    props: [
      'sideNavCollapsed',
      'user'
    ],
    computed: {
    },
    data: function (){
      return {
        collapseSideNav: true
      }
    },
    methods: {
    }
  };
</script>

<style lang="scss" scoped>

  $activeColor: #e7e7e7; //lighten((@Color-blue-lt), 45%);
  #main-nav {
    width: $Main-side-nav-width;
    height: 100%;
    padding: 0;
    background-color: $white;
    transition: $Transition-speed;

    &.side-nav-collapsed {
      width: $Main-side-nav-minimized-width;
    }

    &.is-plugin-view {
      width: $Plugin-width;
    }
  }
</style>