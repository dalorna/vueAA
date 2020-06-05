<template>
  <div id="main-content" v-bind:class="{'is-plugin-view' : IsPluginView}">
    <div class="content-nav">
      <h4 class="content-title">
        <!-- <nav-menu v-if='IsPluginView'></nav-menu> -->
        Set Availablity
      </h4>
    </div>
    <form>
      <div v-if="CallInProgress" style="margin-bottom: 20px;">
        <i class="fa fa-spinner fa-spin"></i>&nbsp;Loading..
      </div>
      <div class='avail-select'>
        <select v-model='availability' class="form-control">
          <option v-for='(value,key) in genericAvailablityReasons' :value='value' v-bind:key="key">{{key == 'NotAvailable' ? 'Not Available' : key}}</option>
        </select>
      </div>
      <div v-if="availability == 20">
        <ul class="list-unstyled">
          <li v-for="reason in availabilityReasons.BusyReasons" v-bind:key="reason.id">
            <input type='radio' :id="reason.Id" v-model="specificReason" :value='reason'>
            <label :for="reason.Id">{{reason.Text}}</label>
          </li>
        </ul>
      </div>
      <div v-if="availability == 100">
        <ul class="list-unstyled">
          <li v-for="reason in availabilityReasons.UnavailableReasons" v-bind:key="reason.id">
            <input type='radio' :id="reason.Id" v-model="specificReason" v-validate="'required'" :value='reason'>
            <label :for="reason.Id">{{reason.Text}}</label>
          </li>
        </ul>
      </div>
      <div v-if="specificReason">
        <div v-if='specificReason.IsNoteShown && availability != 10'>
          <label for="noteArea">Reason</label>
          <br>
          <textarea class="form-control" name="noteArea" v-model='reason' v-validate="specificReason.IsNoteRequired ? 'required' : ''"></textarea>
          <p class="text-danger" v-if="errors.has('noteArea')">
            A reason is required.
          </p>
        </div>

        <div v-if="availability == 20">
          <span>Busy for:
            <input name="time" v-validate="{ max_value: 120, min_value: 1, required: true, numeric: true}" max="120" min=1 style="width: 55px"
              class="control" type="number" v-model="time"> minutes [1-120] </span>
          <p class="text-danger" v-if="errors.has('time')">
            {{errors.first('time')}}
          </p>
        </div>
      </div>
    </form>
    <div class="button-bar">
      <button :disabled="errors.any() || (availability != 10 && (specificReason == null || time == null))" class="btn primary pull-right"
        @click="updateAvailability()">
        Update
      </button>
      <button class="cancel-button btn primary--text" @click="closeModal()">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import {
    UserAvailability
  } from "@/lib/utilities/enums";
  // import NavMenu from "../../components/Plugin/NavMenu";
  import store from "../../store";
  import router from "../../router";
  export default {
    name: "availability",
    components: {},
    computed: {
      ...mapGetters(["availabilityReasons", "User"])
    },
    data: function () {
      return {
        genericAvailablityReasons: UserAvailability,
        specificReason: null,
        CallInProgress: false,
        time: 15,
        reason: "",
        availability: 10,
        IsPluginView: false //Replace with a vuex property if PluginView support is needed
      };
    },
    mounted: function () {
      this.availability = this.User.Availability;
      this.$store.dispatch("getAvailabilityReasons");
      // this.$store.dispatch("getAvailability");

      // let vm = this;
      // vm.CallInProgress = true;
      // this.$store.dispatch("getAvailabilityReasons").then(function() {
      //   store.dispatch("getAvailability").then(function() {
      //     vm.CallInProgress = false;
      //   });
      // });
    },
    methods: {
      closeModal: function () {
        this.specificReason = null;
        // if (this.IsPluginView) router.go(-1);
        // else 
        this.$store.dispatch("toggleAvailModal", false);
      },
      updateAvailability: function () {
        if (this.availability != UserAvailability.Available) {
          if (this.time) {
            this.specificReason.time = this.time;
          }
          if (this.reason) {
            this.specificReason.reason = this.reason;
          }
        }
        this.CallInProgress = true;
        this.$store
          .dispatch("putAvailability", {
              Reason: this.specificReason,
              Availability: this.availability
          })
          .then((resp) => {
            this.CallInProgress = false;
            this.specificReason = null;
            // if (this.IsPluginView) router.go(-1);
            // else 
            this.$store.dispatch("toggleAvailModal", false);
          })
          .catch((err) => {
            console.log("Failed to update availability: ", err);
          });
      }
    }
  };

</script>

<style lang='scss' scoped>
  // @import "../../styles.less";
  #main-content {
    background-color: $white;
    text-align: left;
    transition: $Transition-speed;

    &.is-plugin-view {
      width: $Plugin-width;
      position: fixed; // left: @Main-nav-width;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 0px;
      height: 100%;
    }

    .content-nav {
      // position: fixed;
      height: $Content-nav-height;
      top: $Content-margin-top; // width: calc(@Main-sub-nav-width - 10px);
      padding: 10px;
      clear: both;
      border-bottom: 1px solid $gray-lt;
      border-left: 0px;

      i {
        margin: 0 0 0 15px;
      }
      .content-title {
        text-align: left;
        display: block;
        color: $primary;
      }
    }
    form {
      padding: 15px;
      div {
        margin-bottom: 10px;
      }
    }
    .button-bar {
      text-align: left;
      padding: 15px;
      border-top: 1px solid $gray-lt;
    }
  }

</style>
