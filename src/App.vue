<template>
  <router-view v-if='!loading'></router-view>
</template>

<script>
  import {webAuth} from '../src/auth/index'
  import {aaPubnub} from '../src/lib/pubnub/index'
  import {subscriber, listener} from '../src/lib/pubnub/pubnubListeners'
  
  export default {
    name: 'app',
    data() {
      return {
        pnInstance: null,
        loading: true
      }
    },
    created() {
      let vm = this;
      webAuth.login().then(function (response) {
        let oidcUser = response;
        vm.$http.get('/message/vendor').then(function (response) {
          let vendorInfo = response.data.Data;
          vm.pnInstance = new aaPubnub(vendorInfo, oidcUser.ES_StaffID);
          vm.pnInstance.pubnub.addListener(listener(vendorInfo));
          vm.pnInstance.pubnub.subscribe(subscriber(vendorInfo));
          vm.$http.get('/account/currentUser').then(function (resp) {
            vm.$store.dispatch('setCurrentUser',  resp.data.Data).then(() => {
              vm.$store.dispatch('getReferenceContext').then(() => {
                vm.$store.dispatch('setStoreAccess',  resp.data.Data).then(() => {
                  vm.$store.dispatch('getAllUsers');
                  vm.loading = false;
                });
              })
            })
          })
        })
      })
    }
  }

</script>

<style lang='scss'>
 @import '../styles/main.scss';
 @import '../styles/variables.scss';

</style>
