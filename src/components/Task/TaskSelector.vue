<template>
    <div>
        <div class="center">
            <div class="divProgressBar" >
                <div class="divPadding">
                    <div class="divStepContainer">
                        <div id="divStepOne" class="divStep divColorCurrent clearFix">
                            <img id="imgStepOne" class="imgStepOneCurrent" v-bind:src="getProgressIcon(0,'processes')" />
                        </div>
                        <label id="lblStepOne" class="fontBold clearFix lblMargin" >Choose</label>
                    </div>
                    <div id="divLineOne" class="hrProgress hrBorderPending" >
                    </div>
                    <div class="divStepContainer">
                        <div id="divStepTwo" class="divStep divColorPending clearFix" >
                            <img id="imgStepTwo" class="imgStepOneCurrent" v-bind:src="getProgressIcon(1,'group-2')" />
                        </div>
                        <label id="lblStepTwo" class="fontLight clearFix lblMargin">Assign</label>
                    </div>
                    <div id="divLineTwo" class="hrProgress hrBorderPending" >
                    </div>
                    <div class="divStepContainer">
                        <div id="divStepThree" class="divStep divColorPending clearFix" >
                            <img id="imgStepThree" class="imgStepOneCurrent"  v-bind:src="getProgressIcon(2,'check-mark')" />
                        </div>
                        <label id="lblStepThree" class="fontLight clearFix lblMargin">Review</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="hr"></div>
        <div class="viewContainer">
            <div v-if="hrStep === '0'">
                <check-list-selection @selectPID="checklistIdEventHandler"></check-list-selection>
            </div>
            <div v-else-if="hrStep === '1'">
                <employee-search></employee-search>
            </div>
            <div v-else-if="hrStep === '2'">
                <check-list-review></check-list-review>
            </div>
        </div>
        <div class="footer">
            <div v-show="hrStep === '0'">
                <div class="hr"></div>
                <div class="btn-demo mb-4">
                    <button id="taskNext" type="button" class="btn btn-primary buttonMargin" v-on:click="next('0')"
                            v-bind:class="{disabled : selectionNextDisabled()}" :disabled="selectionNextDisabled()">Next
                    </button>
                </div>
            </div>
            <div v-show="hrStep === '1'">
                <div class="hr"></div>
                <div class="btn-demo mb-4">
                    <button id="empBack" type="button" class="btn btn-primary btn-wizard-delete buttonColors buttonMargin" v-on:click="back('1')">Back
                    </button>
                    <button id="empNext" type="button" class="btn btn-primary btn-wizard-approve buttonMargin btnTight"
                            v-bind:class="{disabled : this.EmployeesSelected.length <= 0}"
                            :disabled="this.EmployeesSelected.length <= 0" v-on:click="next('1')">Next
                    </button>
                </div>
            </div>
            <div v-show="hrStep === '2'">
                <div class="hr"></div>
                <div class="btn-demo mb-4" v-if="!busy">
                    <button type="button" v-bind:class="{disabled : selectionNextDisabled()}" :disabled="selectionNextDisabled()" class="btn btn-primary btn-wizard-delete buttonColors" v-on:click="back('2')">
                        Back
                    </button>
                    <button type="button" class="btn btn-primary btn-wizard-approve buttonMargin btnTight"
                            v-on:click="circleComplete(startCheckList, $event)">Start Checklist
                    </button>
                </div>
                <div class="btn-demo mb-4" v-if="busy">
                    <button type="button" disabled class="btn btn-primary btn-wizard-delete buttonColors buttonMargin"
                            v-on:click="back('2')">Back
                    </button>
                    <button type="button" disabled class="btn btn-primary btn-wizard-approve buttonMargin" style="margin-left: -8px;"
                            v-on:click="circleComplete(startCheckList, $event)">Start Checklist
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CheckListSelection from './CheckListSelection';
  import EmployeeSearch from './EmployeeSearch';
  import CheckListReview from './CheckListReview';
  import { ExternalReferenceUser } from '../../store/ManagementAPI';

  import { SnotifyPosition } from 'vue-snotify';

  export default {
    name: 'taskselector',
    computed: {
      ...mapGetters(['Employees', 'EmployeesSelected', 'ChecklistsItem', 'CheckLists', 'EndOfChecklist', 'Checklists', 'TasksSelected', 'TaskInstancesFromAddTask', 'CheckListTaskHolder', 'hrStep'])
    },
    data() {
      return {
        pid: '0',
        assignedEmployees: [],
        busy: false,
        checklistName: '',
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        listState: {}
      };
    },
    methods: {
      selectionNextDisabled() {
        if (this.ChecklistsItem) {
          let hasTasks = this.ChecklistsItem.tasks && this.ChecklistsItem.tasks.length > 0;
          return this.pid === '0' || !hasTasks;
        }
        return true;
      },
      back: function (e) {
        let hstep = parseInt(this.hrStep);
        hstep--;
        this.$store.dispatch('setHrStep', hstep.toString());
        this.changeLine();
        this.changeCircle();
      },
      next: function (e) {
        let hstep = parseInt(this.hrStep);
        hstep++;
        this.$store.dispatch('setHrStep', hstep.toString());
        this.changeLine();
        this.changeCircle();
        if (e === '0') {
          this.$store.dispatch('setDetailsView', '');
        }
      },
      backToStart: function () {
        this.$store.dispatch('setHrStep', '0');
        this.changeLine();
        this.changeCircle();
        this.clearTaskSelector();
        this.$store.dispatch('clearChecklistSetup');
      },
      clearTaskSelector: function () {
        this.$store.dispatch('setChecklists', '');
        this.$store.dispatch('clearEmployees');
        this.$store.dispatch('clearTasks');
      },
      startCheckList: function () {
        const vm = this;
        this.$store.dispatch('openModal', 'LoadingIndicator');
        this.busy = true;
        vm.$store.dispatch('getAssigneeByExternalReference', this.$store.getters.EmployeesSelected.map(m => m.Id)).then((r) => {
          let payloadUsers = r.map(m => m.id);
          if(vm.listState.isTerminating){
            this.startTerminationCheckList(payloadUsers);
          } else if (vm.listState.isAdHoc){
            this.startAdHocCheckList(payloadUsers);
          } else {
            this.startNormalCheckList(payloadUsers);
          }
        });
      },
      showSuccessView(name) {
        let successDisplay = !this.listState.isTerminating ? this.$store.getters.EmployeesSelected : [this.$store.getters.User];
        this.$store.dispatch('addChecklistSuccessAssociatedUsers', successDisplay).then(() => {
          this.$store.dispatch('setMenuSelected', 'TaskWizardSuccess');
          this.$store.dispatch('setPanelView', '1');
          this.$store.dispatch('addChecklistSuccessName', name);
        });
      },
      checklistIdEventHandler(e) {
        this.pid = e;
      },
      changeLine() {
        let one = document.getElementById('divLineOne');
        let two = document.getElementById('divLineTwo');
        const list = ['hrBorderDone', 'hrBorderPending'];
        if (this.hrStep === '0') {
          one.classList.remove(...list);
          two.classList.remove(...list);

          one.classList.add('hrBorderPending');
          two.classList.add('hrBorderPending');

        } else if (this.hrStep === '1') {
          one.classList.remove(...list);
          two.classList.remove(...list);

          one.classList.add('hrBorderDone');
          two.classList.add('hrBorderPending');
        }
        else {
          one.classList.remove(...list);
          two.classList.remove(...list);

          one.classList.add('hrBorderDone');
          two.classList.add('hrBorderDone');
        }
      },
      changeCircle() {
        let one = document.getElementById('divStepOne');
        let two = document.getElementById('divStepTwo');
        let three = document.getElementById('divStepThree');

        let lblOne = document.getElementById('lblStepOne');
        let lblTwo = document.getElementById('lblStepTwo');
        let lblThree = document.getElementById('lblStepThree');

        const list = ['divColorCurrent', 'divColorPending', 'divColorBackGroundWhite', 'divColorGroundBlue'];
        const fontList = ['fontBold', 'fontLight'];

        if (this.hrStep === '0') {
          two.classList.remove(...list);
          three.classList.remove(...list);
          one.classList.remove('divColorBackGroundWhite', 'divColorGroundBlue');
          lblOne.classList.remove(...fontList);
          lblTwo.classList.remove(...fontList);
          lblThree.classList.remove(...fontList);

          one.classList.add('divColorBackGroundWhite');
          two.classList.add('divColorPending', 'divColorBackGroundWhite');
          three.classList.add('divColorPending', 'divColorBackGroundWhite');

          lblOne.classList.add('fontBold');
          lblTwo.classList.add('fontLight');
          lblThree.classList.add('fontLight');

        } else if (this.hrStep === '1') {
          two.classList.remove(...list);
          three.classList.remove(...list);
          one.classList.remove('divColorBackGroundWhite', 'divColorGroundBlue');
          lblOne.classList.remove(...fontList);
          lblTwo.classList.remove(...fontList);
          lblThree.classList.remove(...fontList);

          one.classList.add('divColorGroundBlue');
          two.classList.add('divColorCurrent', 'divColorBackGroundWhite');
          three.classList.add('divColorPending', 'divColorBackGroundWhite');
          lblOne.classList.add('fontLight');
          lblTwo.classList.add('fontBold');
          lblThree.classList.add('fontLight');
        }
        else {
          two.classList.remove(...list);
          three.classList.remove(...list);
          one.classList.remove('divColorBackGroundWhite', 'divColorGroundBlue');
          lblOne.classList.remove(...fontList);
          lblTwo.classList.remove(...fontList);
          lblThree.classList.remove(...fontList);

          one.classList.add('divColorGroundBlue');
          two.classList.add('divColorCurrent', 'divColorGroundBlue');
          three.classList.add('divColorCurrent', 'divColorBackGroundWhite');
          lblOne.classList.add('fontLight');
          lblTwo.classList.add('fontLight');
          lblThree.classList.add('fontBold');
        }
      },
      circleComplete(callback, event) {
        event.preventDefault();
        event.target.disabled = true;
        let one = document.getElementById('divStepOne');
        let two = document.getElementById('divStepTwo');
        let three = document.getElementById('divStepThree');
        const list = ['divColorCurrent', 'divColorPending', 'divColorBackGroundWhite', 'divColorGroundBlue'];
        one.classList.remove(...list);
        two.classList.remove(...list);
        three.classList.remove(...list);

        one.classList.add('divColorCurrent', 'divColorGroundBlue');
        two.classList.add('divColorCurrent', 'divColorGroundBlue');
        three.classList.add('divColorCurrent', 'divColorGroundBlue');


        let iconPath = 'https://assets.autoalert.com/img/autoalert-icons/icon-check-mark-vanilla.svg';
        let imgThree = document.getElementById('imgStepThree');
        imgThree.src = iconPath;

        callback();
      },
      getProgressIcon(iconStep, iconName) {

        let iconColor = '';
        let iconPath = 'https://assets.autoalert.com/img/autoalert-icons/icon-'; //processes-lake.svg'

        let hrStepInt = parseInt(this.hrStep);

        if (iconStep === hrStepInt) {
          iconColor = '-lake.svg';
        } else if (iconStep < hrStepInt) {
          iconColor = '-vanilla.svg';
        } else {
          iconColor = '-charcoal.svg';
        }

        return iconPath + iconName + iconColor;
      },
      startNormalCheckList(payloadUsers){
        let vm = this;
        let ts = this.TasksSelected.length > 0 ? vm.TasksSelected.map(m => m.id) : [];
        let postObj = {
          ChecklistTemplateId: vm.ChecklistsItem.id,
          // Name: vm.ChecklistsItem.name,
          AdditionalTaskTemplateIds: ts,
          AssociatedEntity: payloadUsers,
        };
        vm.$store.dispatch('StartCheckListPackage', postObj).then((r) => {
          vm.$store.dispatch('closeModal');
          if(r.success){
            vm.showSuccessView(vm.ChecklistsItem.name);
          }
        });
      },
      startAdHocCheckList(payloadUser){
        let vm = this;
        let name = this.$store.getters.EmployeeTaskList.find(f => payloadUser.includes(f.id)).name;
        if(vm.TasksSelected.length === 0){
          vm.$snotify.error('No Tasks To Start!', 'Error', {
            showProgressBar: false,
            closeOnClick: false,
            timeout: 2500,
            pauseOnHover: true,
            position: SnotifyPosition.rightTop,
          });
          return;
        }
        let ts = vm.TasksSelected.map(m => m.id);
        let postObj = {
          ChecklistTemplateId: vm.emptyGuid,
          AdditionalTaskTemplateIds: ts,
          AssociatedEntity: payloadUser,
          Name: 'Ad Hoc Tasks: ' + name
        };
        vm.$store.dispatch('StartCheckListPackage', postObj).then((r) => {
          vm.$store.dispatch('closeModal');
          if(r.success){
            vm.showSuccessView('Ad Hoc List: ' + name);
          }
        });
      },
      startTerminationCheckList(payloadUser){
        let vm = this;
        vm.$store.dispatch('StartTermination', payloadUser[0]).then((r) => {
          vm.$store.dispatch('closeModal');
          if(r.success){
            vm.showSuccessView('Termination: ' + this.$store.getters.EmployeeTaskList.find(f => payloadUser.includes(f.id)).name);
          }
        });
      }
    },
    created: function () {
      this.$store.dispatch('clearCheckListItem');
    },
    mounted: function () {
      if (this.EndOfChecklist.isStep2) {
        this.$store.dispatch('setHrStep', '2');
        this.changeLine();
        this.changeCircle();
        this.checklistName = this.EndOfChecklist.isTerminating ? 'Reclaim Employee Assets' : ( this.EndOfChecklist.isAdHoc ? 'Ad Hoc List' : this.checklistName );
        this.listState = this.$store.getters.EndOfChecklist;
      }
      else {
        this.$store.dispatch('setHrStep', '0');
        this.clearTaskSelector();
        this.listState = {};
      }
    },
    destroyed: function(){
        this.$store.dispatch('setMenuTab', '');
        this.$store.dispatch('setMenuCategory', '');
    },
    components: {
      EmployeeSearch,
      CheckListSelection,
      CheckListReview,
    }
  };
</script>

<style lang='scss' scoped>
    @import '../../../styles/_colors.scss';
    @import '../../../styles/variables.scss';

    $headerHeight: 105px;
    $footHeight: 65px;


    .footer {
        bottom: 0;
        text-align: center;
        overflow-x: visible;
        position: relative;
        width: 100%;
        height: $footHeight;

    }
    .center {
        text-align: center;
    }
    .hr {
        height: 1px;
        width: 100%;
        border-bottom: solid 1px #e7e7e7;
        margin-top: 5px;
        margin-bottom: 5px;
        float: left;
        clear: both;
    }
    .hrProgress {
        height: 1px;
        width: 25%;
        margin-bottom: 5px;
        float: left;
        margin-top: 40px;
    }
    .hrBorderDone{
        border-bottom: solid 2px $lake;
    }
    .hrBorderPending{
        border-bottom: solid 2px $gray-lt;
    }
    .buttonColors {
        color: #1F8BD5;
        background-color: #FFFFFF;
        border: solid 2px #1F8BD5;
    }
    #progressDiv {
        display: inline-block;
    }
    .progress-img {
        height: 35px;
        width: 35px;
        display: inline-block;
    }
    .divStep {
        border-radius: 50%;
        height: 65px;
        width: 65px;
        text-align: center;
    }
    .divColorCurrent{
        border: solid 2px $lake;
    }
    .divColorPending{
        border: solid 2px $gray-lt;
    }
    .divColorBackGroundWhite{
        background-color:$white;
    }
    .divColorGroundBlue{
        background-color:$lake;
    }
    .imgStepOneCurrent{
        margin-top: 12px;
        height: 35px;
        width: 35px;
    }
    .divStepContainer{
        float: left;
        margin-top: 5px;
    }
    .fontBold {
        font-size: 14px;
        font-weight: 600;
    }
    .fontLight{
        font-size: 14px;
        font-weight: 300;
    }
    .clearFix{
        float: left;
        clear: both;
    }
    .lblMargin{
        width: 100%;
        line-height: 15px;
        margin-bottom: 2px;
        margin-top: 5px;
    }
    .divProgressBar{
        width: 390px;
        margin: 0 auto;
        height: $headerHeight;
        overflow: auto;
    }
    .divPadding{
        height: 85px;
        padding-bottom: 10px;
        padding-top: 10px
    }
    .viewContainer {
        height: calc(#{$Panel-height} - #{$headerHeight} - #{$footHeight});
    }
    .btn-primary.btn-wizard-approve {
        color: #fff;
        border: solid 2px $lake;
        background: $lake;
        border-radius: 0 10px 10px 0;
    }
    .btn-primary.btn-wizard-approve:hover {
        background: #34699e;
        border: solid 2px #34699e;
    }
    .btn-primary:active, .btn-primary:hover {
        border: none;
    }
    .buttonMargin{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .btn.btn-primary.btn-wizard-delete.buttonColors:hover {
        border: solid 2px $lake;
    }
    .btnTight{
        margin-left: -9px;
    }
</style>
