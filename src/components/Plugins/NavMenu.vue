<template>
  <!-- <v-icon class="mr-1 primary--text" v-bind:html='{"chevron_left": !root, "menu": root}' id='nav-menu' title='Back' @click='doNav()'>chevron_left</v-icon> -->
  <i class="mr-1 text-primary fa fa-chevron-left" v-bind:html='{"chevron_left": !root, "menu": root}' id='nav-menu' title='Back'
    @click='doNav()'></i>
</template>

<script>
  import router from "../../router";
  export default {
    name: "navMenu",
    computed: {
      root: () => {
        return (
          router.history.current.name == "inbox" ||
          router.history.current.name == "plugin"
        );
      }
    },
    methods: {
      doNav: () => {
        if (router.history.current.name == "inbox" || router.history.current.name == "plugin") {
          router.push({
            name: "plugin.pluginNav"
          });
        } else {
          router.go(-1);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  #nav-menu {
    position: relative;
    display: inline-block;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
</style>