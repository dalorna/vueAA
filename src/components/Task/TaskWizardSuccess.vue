<template>
    <div>
        <div class="divSuccess">
            <div id="divStepOne" class="divStep divColorBackGroundGreen divColorCurrent clearFix">
                <img  class="imgStepOneCurrent"  src="https://assets.autoalert.com/img/autoalert-icons/icon-check-mark-vanilla.svg">
            </div>
            <label class="fontBold clearFix lblMargin" >Success</label>
        </div>
        <div class="divCheckList">
            <p class="listFont">Thank you, <b class="listBold">{{checklistSuccessName}}</b> has been assigned to the following people:</p>
            <div class="selected-list-container leftClear bottomHeight" v-on:click="focusOnFilterText()">
                <div v-for="user of checklistSuccessAssociatedUsers" v-bind:key="user.Id" class="selected-item">
                    <avatar v-bind:type="'member'" v-bind:member="user" v-bind:width="'30px'" v-bind:height="'30px'"
                            class="selected-item-avatar"></avatar>
                    <div class="selected-item-title">{{user.Name}}</div>
                </div>
            </div>
        </div>
        <div class="divButtons">
            <button type="button" class="btn btn-primary btn-wizard-dashboard buttonColors buttonMargin" v-on:click="gotoDashBoard" >Go To HR Dashboard
            </button>
            <button type="button" class="btn btn-primary btn-wizard-start buttonMargin" v-on:click="gotoStartNewChecklist" >Assign New Checklist
            </button>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Avatar from '../../components/shared/Avatar.vue';

  export default {
    name: 'TaskWizardSuccess',
    components: { Avatar },
    computed: {
      ...mapGetters(['checklistSuccessName', 'checklistSuccessAssociatedUsers'])
    },
    methods: {
      gotoDashBoard() {
        this.$store.dispatch("setMenuSelected", "Dashboard");
        this.$store.dispatch("setPanelView", "1");
        this.$store.dispatch('setPillSelected', '');
        this.$store.dispatch('setTabSelected', 'task-dashboard');
        this.$store.dispatch('setMenuTab', 'all-dashboards');
        this.$store.dispatch('setMenuCategory', 'Pando-HR-Dashboards');
      },
      gotoStartNewChecklist(){
        this.$store.dispatch('setHrStep', '0');
        this.$store.dispatch('clearChecklistSetup');
        this.$store.dispatch("setMenuSelected", "TaskSelector");
        this.$store.dispatch("setPanelView", "1")
      }
    },
    created: function () {
    }
  }
</script>

<style lang='scss' scoped>
    @import '../../../styles/_colors.scss';
    @import '../../../styles/variables.scss';

    .divSuccess {
        margin: auto;
        height: 100px;
        width: 65px;
        align-content: center;
        padding-top: 100px;
    }
    .divStep {
        border-radius: 50%;
        height: 65px;
        width: 65px;
        text-align: center;
    }
    .divColorCurrent{
        border: solid 2px $green;
    }
    .clearFix{
        float: left;
        clear: both;
    }
    .fontBold {
        font-size: 14px;
        font-weight: 600;
    }
    .lblMargin{
        margin-bottom: 2px;
        margin-top: 5px;
        margin-left: 7px;
        line-height: 15px;
    }
    .divColorBackGroundGreen{
        background-color:$green;
    }
    .imgStepOneCurrent{
        margin-top: 12px;
        height: 35px;
        width: 35px;
    }
    .buttonMargin{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .btnTight{
        margin-left: -9px;
    }
    .btn-primary.btn-wizard-dashboard {
        color: #1f8bd5;
        border: none;
        background: #fff;
        border-radius: 10px 10px 10px 10px;
        margin: 0;
        border: solid 2px $lake;
    }
    .btn-primary.btn-wizard-start {
        color: #fff;
        border: none;
        background: #1f8bd5;
        border-radius: 10px 10px 10px 10px;
        margin: 0;
        border: solid 2px $lake;
    }
    .buttonMargin{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .btnTight{
        margin-left: -9px;
    }
    .divButtons{
        height: 40px;
        margin: auto;
        width: 400px;
        text-align: center;
        clear: both;
    }
    .divCheckList {
        margin: auto;
        height: 40vh;
        width: 50vw;
        align-content: center;
        padding-top: 100px;
    }
    .selected-list-container {
        border: 1px solid #d5d5d5;
        border-radius: 5px;
        padding: 4px;
        max-height: 135px;
        overflow-x: hidden;
        overflow-y: auto;
        cursor: text;

        .selected-item-label {
            line-height: 30px;
            margin: 5px;
            width: 20px;
            text-align: left;
            float: left;
        }

        .selected-item {
            border: 1px solid #e5e5e5;
            display: inline-block;
            margin: 5px;
            border-radius: 5px;
            overflow: hidden;
            vertical-align: top;

            .selected-item-avatar {
                display: inline-block;
                background-color: #555555;
            }

            .selected-item-title {
                display: inline-block;
                font-size: 12px;
                padding: 3px 3px 3px 0px;
            }

            .selected-item-remove {
                margin-right: 3px;
                cursor: pointer;
            }
        }

        .filter-text {
            border-width: 0px; // background-color: #fafafa;
            width: 200px;
            font-size: 16px;
            padding: 4px;
            margin: 4px;
            line-height: 24px;
            vertical-align: top;
        }
    }
    .leftClear {
        float: left;
        clear: both;
    }
    .bottomHeight {
        height: 25vh;
        overflow-x: hidden;
        overflow-y: scroll;
        width: 100%;
    }
    .selected-item {
        border: 1px solid #e5e5e5;
        display: inline-block;
        margin: 5px;
        border-radius: 5px;
        overflow: hidden;
        vertical-align: top;

        .selected-item-avatar {
            display: inline-block;
            background-color: #555555;
        }

        .selected-item-title {
            display: inline-block;
            font-size: 12px;
            padding: 3px 3px 3px 0px;
        }

        .selected-item-remove {
            margin-right: 3px;
            cursor: pointer;
        }
    }
    .listFont {
        font-family: Roboto;
        font-size: 13px;
    }
    .listBold {
        font-weight: 500;
    }
</style>
