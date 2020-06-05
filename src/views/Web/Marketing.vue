<template>
  
<div class="splashScreen">
    
  <div class="landing-wrapper">
      <div class="row landing-header">
        <div class="col-sm-6 col-md-5 col-lg-5">
          <img src="static/assets/img/Marketing/robot-noproduct.png">
        </div>
        <div class="col-sm-6 col-md-7 col-lg-7">
          <img src="static/assets/img/Marketing/header-pandohr.jpg" style="margin-top: 17px;">
        </div>
      </div>
      <div class="row landing-description">
        <img src="static/assets/img/Marketing/pandohr.png">
        <p>Rapidly onboard new employees according to group and role. Track all vendor credentials, building access and certifications. Start processes based on certifications and more.</p>
        <p>Get <span style="text-transform: uppercase; color: #172751">Pando</span><span style="text-transform: uppercase;">HR.</span></p>
        <p>Call: <a href="tel:8333019536">933.301.9536</a><span style="padding: 0 20px;">|</span>Email: <a href="mailto:clientcare@autoalert.com">ClientCare@AutoAlert.com</a></p>
      </div>
    </div>    
</div>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Marketing",
  computed: {
    ...mapGetters(["User"])
  },
  methods: {
    getCurrentSelectedStoresName: function() {
      let storesName = "";
      if(this.User && this.User.ViewSelectedStores && this.User.ViewSelectedStores.length > 0) {
        storesName = this.User.ViewSelectedStores[0].Name;
        if(this.User.ViewSelectedStores.length > 1) {
          if(this.User.ViewSelectedStores.length > 2)
            storesName += ", " + this.User.ViewSelectedStores[1].Name + ", ...";
          else
            storesName += " and " + this.User.ViewSelectedStores[1].Name;
        }
      }
      return storesName;
    }
  }
};
</script>

<style lang="scss" scoped>
.landing-wrapper {
  text-align: center;
}
.landing-header {
  border-bottom: 1px solid #e7e7e7;
}
.landing-description {
  padding-top: 50px;
  max-width: 800px;
  margin: 0 auto;

  .no-product-stores-note {
    font-size: 18px;
    font-weight: 300;
    padding-bottom: 20px;
  }
}
.landing-description p:nth-of-type(1) {
  max-width: 550px;
  margin: 0 auto;
  color: #444b4f;
  font-size: 20px;
  font-weight: 300;
  padding: 35px 0;
}
.landing-description p:nth-of-type(2) {
  color: #1f8bd5;
  font-size: 20px;
  font-weight: 400;
}
.landing-description p:nth-of-type(3) {
  color: #1f8bd5;
  font-size: 16px;
  padding: 30px 0;
  font-weight: 400;
}
.landing-description p:nth-of-type(3) > a,
.landing-description p:nth-of-type(3) > a:hover,
.landing-description p:nth-of-type(3) > a.focus,
.landing-description p:nth-of-type(3) > a.visited {
  color: #1f8bd5;
  text-decoration: none;
}
</style>
