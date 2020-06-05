<template>
    <div class="hr-form-taker">
        <div class="form-taker is-plugin-view">
            <div class="topHeaderHeight">
                <img class="close-button" src="static/assets/img/SVGIcons/icon-close-circle-blue.svg" align="right"
                     v-on:click="closeFormTakerModal()">
                <div>
                    <h3>
                        {{Processes.Task ? Processes.Task.name : ''}}
                    </h3>
                </div>
                <div>
                    <p>
                        {{Processes.Task ? Processes.Task.description : ''}}
                    </p>
                </div>
            </div>
            <button v-if="showAuthorize && !isAuthorized" class="btn btn primary btn-block"
                    v-on:click="(showSignIn = !showSignIn)" style="margin-bottom: 10px;">View Protected Fields
            </button>
            <div v-if="showSignIn" class="grey-background" align="center">
                <div class="h6">Please re-type in your password to view the protected fields.</div>
                <div class="input-container">
                    <b-form-input autofocus id="authenticate-password" class="form-control" type='password' placeholder='Password' 
                                  :state="setState" v-model="password" v-on:keyup.enter="authorize()"></b-form-input>
                    <small style="color: red;" v-if="incorrectPassword">Incorrect password.</small>
                </div>
                <button v-on:click="showSignIn = false" class="btn btn-primary authorize-button">Close</button>
                <button v-on:click="authorize()" class="btn btn-primary authorize-button">Authorize</button>
            </div>
            <div class="contentHeight">
                <div v-for="(template, assetIndex) of AssetInstanceControls" v-bind:key="template.Id"
                     class="bottomBorder"
                     style="width: 97%">
                    <h4>{{template.name}}</h4>
                    <p class="bottomBorder">{{template.description}}</p>
                    <div v-if="template.libraryType === 1">
                        <div v-for="(prop, index) of template.properties" v-bind:id="prop.name" v-bind:key="index">
                            <div v-if="Object.keys(prop.controlMetadata).length === 0">
                                <div v-if="prop.dataType === 1">
                                    <div class="form-group rowFlex">
                                        <label class="col-sm-3 col-form-label">{{prop.name}}</label>
                                        <div class="col-sm-9">
                                            <input :id="prop.name + '_' + index" :name="prop.name"
                                                   v-validate="{HrFormTakerRequired: prop, required: true, min: 3}"
                                                   type="text" class="form-control alignMargin" v-model="prop.value"
                                                   :disabled="!statusDisableForm"
                                                   :class="{disabled : !statusDisableForm}">
                                        </div>
                                    </div>
                                    <div class="rowFlex">
                                        <span class="error errorMargin">{{errors.first(prop.name)}}</span>
                                    </div>
                                </div>
                                <div v-if="prop.dataType === 2">
                                    <div class="form-group rowFlex">
                                        <label class="col-sm-3">{{prop.name}}</label>
                                        <div class="col-sm-9 margin-bottom-5">
                                            <input type="number" class="form-control alignMargin" v-model="prop.value"
                                                   :id="prop.name" :name="prop.name"
                                                   v-validate="{HrFormTakerRequired: prop, required: true, min: 3}"
                                                   :disabled="!statusDisableForm"
                                                   :class="{disabled : !statusDisableForm}"/>
                                        </div>
                                    </div>
                                    <div class="rowFlex">
                                        <span class="error errorMargin">{{errors.first(prop.name)}}</span>
                                    </div>
                                </div>
                                <div v-if="prop.dataType === 3">
                                    <div class="form-group rowFlex">
                                        <label class="col-sm-3">{{prop.name}}</label>
                                        <div class="col-sm-9 margin-bottom-5">
                                            <input type="number" step="0.01" min="0.01" class="form-control alignMargin"
                                                   v-model="prop.value" :id="prop.name" :name="prop.name"
                                                   v-validate="{HrFormTakerRequired: prop, required: true, min: 3}"
                                                   :disabled="!statusDisableForm"
                                                   :class="{disabled : !statusDisableForm}"/>
                                        </div>
                                    </div>
                                    <div class="rowFlex">
                                        <span class="error errorMargin">{{errors.first(prop.name)}}</span>
                                    </div>
                                </div>
                                <div v-if="prop.dataType === 4">
                                    <div class="form-group rowFlex">
                                        <div class="col-sm-3">{{prop.name}}</div>
                                        <div class="col-sm-9 margin-bottom-5">
                                            <input class="form-check-input alignMargin" type="checkbox"
                                                   v-model="prop.value"
                                                   :id="prop.name" :disabled="!statusDisableForm"
                                                   :class="{disabled : !statusDisableForm}"/>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="prop.dataType === 5">
                                    <div class="form-group rowFlex">
                                        <div class="col-sm-3">{{prop.name}}</div>
                                        <div class="col-sm-9 margin-bottom-5">
                                            <input class="form-control alignMargin" size="16" type="date"
                                                   v-model="prop.value" :id="prop.name" :name="prop.name"
                                                   v-validate="{HrFormTakerRequired: prop, required: true, min: 3}"
                                                   :disabled="!statusDisableForm"
                                                   :class="{disabled : !statusDisableForm}"/>
                                        </div>
                                    </div>
                                    <div class="rowFlex">
                                        <span class="error errorMargin">{{errors.first(prop.name)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="Object.keys(prop.controlMetadata).length > 0 && assetPropertyControl[assetIndex] && assetPropertyControl[assetIndex][index]">
                                <component :index="index" :assetIndex="assetIndex" :metadata="prop.controlMetadata"
                                           :status="statusDisableForm" :data="prop.data"
                                           @updateData="updateDataHandler"
                                           v-bind:is="assetPropertyControl[assetIndex][index]"></component>
                            </div>
                            <div v-else>
                                <span>No Control for Asset Type</span>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="template.libraryType === 2">
                        <div v-for="(prop, index) of template.properties" v-bind:id="prop.name" v-bind:key="index">
                            <div v-if="prop.hasAttachments">
                                <a style="text-decoration: underline;" :id="index"
                                   v-on:click="downloadFile(prop.attachmentId)" download>Download Template Document</a>
                            </div>
                            <div v-else>
                                <span>Ask for paper copy of document</span>
                            </div>
                            <div class="panel-action-bar bb-1 content row">
                                <!--<span class="col-8 category-title">{{ statusDisableForm ? 'Document Uploader' : 'Document Uploaded' }}</span>-->
                                <div class="content upload-button topBorder width100">
                                    <div v-if="statusDisableForm" class="alignCenter" >
                                        <label for="fileInput" class="input-file btn btn-primary">
                                            UPLOAD DOCUMENT
                                        </label>
                                        <input id="fileInput" type="file" name="fileInput" accept=".pdf, .doc, .docx"
                                               v-validate="'ext:doc,docx,pdf'"
                                               @change="fileChange($event.target.files, template.id);"/>
                                        <div class="error">{{errors.first('fileInput')}}</div>
                                    </div>
                                    <div class="alignCenter" v-if="documentUploaded.length > 0 && ((documentUploaded.substring(documentUploaded.length -5, documentUploaded.length) === '.docx') || (documentUploaded.substring(documentUploaded.length -4, documentUploaded.length) === '.doc') || (documentUploaded.substring(documentUploaded.length -4, documentUploaded.length) === '.pdf'))">
                                        File Uploaded: {{documentUploaded}}
                                    </div>
                                    <div v-if="template.data && template.data[index] && template.data[index].attachmentId" class="width100 alignCenter">
                                        <span>Download: </span>
                                        <a style="text-decoration: underline; width: 100%;"
                                           v-on:click="downloadAssetFile(template.data[index].attachmentId)" download>{{template.data[index].fileName}}</a>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-action-bar bb-1 content row">
                                <textarea id="notesText" class="form-control disabled"  v-model="prop.notes" disabled ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottomFooterHeight" style="bottom: 20px;">
                <button id="HrFormTaker-submit" v-if="statusDisableForm" type="button" :disabled="savesDisabled"
                        :class="{disabled : savesDisabled}"
                        class="btn btn-sm primary margin-bottom-5 margin-left-5 left-align"
                        v-on:click="handleSubmitButton(true, $event)">Submit Form
                </button>
                <button id="HrFormTaker-save" v-if="statusDisableForm" type="button" :disabled="savesDisabled"
                        :class="{disabled : savesDisabled}"
                        class="btn btn-sm primary--text margin-bottom-5 pull-right"
                        v-on:click="handleSubmitButton(false, $event)">
                    Save
                </button>
            </div>
        </div>
        <div v-if="FormTakerIsLoading" class="modal-container">
            <div class="loading-indicator">
                <!-- <img class="close-btn" title="Close" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="closeLoadingIndicator" /> -->
                <div class="loading-container">
                    <div class="loading-text">
                        <i class="fa fa-spinner fa-spin"></i>&nbsp;Loading...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {SnotifyPosition} from 'vue-snotify';
  import {Encryption} from '../../../src/auth/index';
  import {getSilentRedirectURI} from '../../../src/auth/index';

  import AddressPropertyControl from '../AssetControls/AddressPropertyControl';
  import PhoneNumberUSPropertyControl from '../AssetControls/PhoneNumberUSPropertyControl';
  import CheckboxesPropertyControl from '../AssetControls/CheckboxesPropertyControl';
  import DatePropertyControl from '../AssetControls/DatePropertyControl';
  import DateRangePropertyControl from '../AssetControls/DateRangePropertyControl';
  import DropDownListPropertyControl from '../AssetControls/DropDownListPropertyControl';
  import EmailAddressPropertyControl from '../AssetControls/EmailAddressPropertyControl';
  import EncryptedPropertyControl from '../AssetControls/EncryptedPropertyControl';
  import LongAnswerPropertyControl from '../AssetControls/LongAnswerPropertyControl';
  import NumberPropertyControl from '../AssetControls/NumberPropertyControl';
  import NumberRangePropertyControl from '../AssetControls/NumberRangePropertyControl';
  import RadioButtonsPropertyControl from '../AssetControls/RadioButtonsPropertyControl';
  import ToggleButtonPropertyControl from '../AssetControls/ToggleButtonPropertyControl';

  export default {
    name: "hrFormTaker",
    computed: {
      ...mapGetters(['Processes', 'group', 'User', 'Assignees', 'AssetInstanceControls', 'FormTakerIsLoading', 'isAuthorized', 'EncryptionUser'])
    },
    data: function () {
      return {
        taskChange: {},
        AssetInstanceControlsChange: [],
        statusDisableForm: false,
        submit: false,
        assetPropertyControl: [],
        metadataPropertyControl: [],
        savesDisabled: true,
        savesDisabledAllControls: [],
        isLoading: false,
        showAuthorize: false,
        password: '',
        showSignIn: false,
        assetIds: [],
        incorrectPassword: false,
        setState: null,
        documentContents: [],
        file: {},
        documentUploaded: [],
        filesInView: []

      }
    },
    watch: {
      Processes: {
        handler(val) {
          //because the processes is constantly being monitored and changing, we need to check
          //to see if the task id has changed before we reload
          if (val.Task.id !== this.taskChange.id) {
            this.loadForm();
          }
        },
        deep: true
      },
      AssetInstanceControls: {
        handler(val) {
          if (this.hasAssetInstanceControlsChanged(val, this.AssetInstanceControlsChange)) {
            this.loadForm();
          }
        }
      }
    },
    methods: {
      authorize() {
        let vm = this;
        Encryption.login(this.password).then(function (r) {
          console.log(r)
          if (r.Success) {
            vm.$store.dispatch('isAuthorized', true);
            vm.showSignIn = false;
            vm.setState = null;
            //r.data.expires_in
          }
          else {
            vm.$store.dispatch('isAuthorized', false);
            vm.setState = false;
            vm.incorrectPassword = true;
          }
        });
      },
      handleSubmitButton: function (e, event) {
        event.preventDefault();
        let vm = this;
        this.submit = true;
        this.setStatus();
        document.getElementById('HrFormTaker-submit').disabled = true;
        document.getElementById('HrFormTaker-save').disabled = true;
        vm.$store.dispatch('openModal', 'LoadingIndicator');
        vm.$validator.validate().then(result => {
          if (result) {
            event.target.disabled = true;
            vm.$store.dispatch('getAssignee', vm.User.Id).then((ret) => {
              let claimUser = ret;
              vm.prepAssetInstanceControlsForSave();
              vm.Processes.Assets = vm.AssetInstanceControls;
              vm.dealWithDocuments(vm.AssetInstanceControls, vm.filesInView).then(() => {
                vm.$store.dispatch('saveAssetInstances', vm.AssetInstanceControls).then(() => {
                  //submit is true, save is false
                  if (e) {
                    setTimeout(function () {
                      vm.$store.dispatch('hrStatusChange', {
                        task: vm.Processes.Task,
                        user: [claimUser],
                        status: 6
                      }).then((success) => {
                        vm.$store.dispatch('closeModal');
                        if (success) {
                          vm.$snotify.success('The asset has been saved.', 'Save Successful', {
                            showProgressBar: false,
                            closeOnClick: true,
                            timeout: 2500,
                            pauseOnHover: true,
                            position: SnotifyPosition.rightTop
                          });
                        } else {
                          vm.$snotify.error('The asset failed to save.', 'Save Error', {
                            showProgressBar: false,
                            closeOnClick: true,
                            timeout: 2500,
                            pauseOnHover: true,
                            position: SnotifyPosition.rightTop
                          });
                        }
                        vm.closeFormTakerModal();
                      })
                    }, 500);
                    return;
                  }
                  vm.$store.dispatch('closeModal');
                  vm.$snotify.success('The asset has been saved.', 'Save Successful', {
                    showProgressBar: false,
                    closeOnClick: true,
                    timeout: 2500,
                    pauseOnHover: true,
                    position: SnotifyPosition.rightTop
                  });
                  vm.closeFormTakerModal();
                })
              });
            })
          }
          else {
            vm.$store.dispatch('closeModal');
            vm.$snotify.error('Task requirements not met!', 'Save Error', {
              showProgressBar: false,
              closeOnClick: false,
              timeout: 2500,
              pauseOnHover: true,
              position: SnotifyPosition.rightTop
            });
          }
        });
      },
      dealWithDocuments(allAssetInstances, filesToUpload) {

        return new Promise(async (resolve) => {
          let documentInstances = allAssetInstances.filter(f => f.libraryType === 2).slice();
          resolve(await this.saveDocuments(documentInstances, filesToUpload))
        });
      },
      saveDocuments(documentInstances, filesToUpload) {
        if (documentInstances.length > 0) {
          for (let i = 0; i < documentInstances.length; i++) {
            let fileToUpload = filesToUpload.find(f => f.assetInstanceId === documentInstances[0].id);
            if(fileToUpload){
              this.$store.dispatch('uploadAssetDocument', {
                file: fileToUpload.file,
                fileName: fileToUpload.fileName,
                id: fileToUpload.assetInstanceId
              }).then((ru) => {
                return ru;
              })
            }
          }
        }
        return true;
      },
      closeFormTakerModal: function () {
        this.$store.dispatch('setDetailsView', '');
      },
      downloadFile(downloadAttachmentId) {
        let vm = this;
        vm.$store.dispatch('downloadDocumentFile', downloadAttachmentId).then((successResponse) => {
          let blob = new Blob([successResponse.data], {type: 'application/octet-stream'});
          let blobObjectUrl = window.URL.createObjectURL(blob);
          let blobElement = window.document.createElement('a');

          blobElement.href = blobObjectUrl;
          blobElement.setAttribute('download', successResponse.fileName || 'file.dat');
          blobElement.click();

        });
      },
      downloadAssetFile(downloadAttachmentId) {
        let vm = this;
        vm.$store.dispatch('downloadAssetDocumentFile', downloadAttachmentId).then((successResponse) => {
          let blob = new Blob([successResponse.data], {type: 'application/octet-stream'});
          let blobObjectUrl = window.URL.createObjectURL(blob);
          let blobElement = window.document.createElement('a');

          blobElement.href = blobObjectUrl;
          blobElement.setAttribute('download', successResponse.fileName || 'file.dat');
          blobElement.click();

        });
      },
      fileChange(files, assetInstanceId) {
        let vm = this;
        vm.$validator.validate().then(result => {
          if (files.length === 1 && result) {
            vm.documentUploaded = (document.getElementById('fileInput').files[0].name);
            vm.uploadDocument(files[0]);

            vm.filesInView.push({
              fileName: vm.documentUploaded,
              assetInstanceId: assetInstanceId,
              file: files[0],
              attachmentId: ''
            });
            vm.savesDisabled = (vm.filesInView.length !== vm.AssetInstanceControls.length);
          }
        });
      },
      uploadDocument(file) {
        let vm = this;

        vm.file = file;
        let reader = new FileReader();
        reader.onload = (i) => {
          vm.documentContents = i.target.result;
        };
        reader.readAsArrayBuffer(file);
      },
      setStatus() {
        if (this.submit) {
          return false;
        }
        if (this.Processes.Task) {
          if (this.Processes.Task.status === 5 || this.Processes.Task.status === 6 || this.Processes.Task.status === 7) {
            return false;
          } else {
            return true;
          }
        } else {
          this.$store.dispatch('setDetailsView', '');
          return false;
        }

      },
      loadForm() {
        if (this.Processes.Task && this.AssetInstanceControls.length > 0) {
          this.statusDisableForm = this.setStatus();
          this.taskChange = this.Processes.Task;
          this.AssetInstanceControlsChange = this.AssetInstanceControls;
          this.assetPropertyControl = [];
          for (let j = 0; j < this.AssetInstanceControls.length; j++) {
            if (this.AssetInstanceControls[j].libraryType === 1) {
              this.metadataPropertyControl = [];
              for (let i = 0; i < Object.keys(this.AssetInstanceControls[j].properties).length; i++) {
                if (!!this.AssetInstanceControls[j].properties[i].controlMetadata && (Object.keys(this.AssetInstanceControls[j].properties[i].controlMetadata).length === 0)) {
                  this.metadataPropertyControl[i] = 'NONE';
                } else {
                  this.metadataPropertyControl[i] = this.getMetaDataControl(this.AssetInstanceControls[j].properties[i].control, this.AssetInstanceControls[j].properties[i].controlMetadata);
                  this.AssetInstanceControls[j].properties[i].data = this.AssetInstanceControls[j].data[i];
                }
              }
              this.assetPropertyControl[j] = this.metadataPropertyControl;
            }
          }

          if(this.AssetInstanceControls.filter(f => f.libraryType === 1).length === 0){
            this.savesDisabled = this.checkDocumentsForDisabledControls();
          }

          this.$store.dispatch('formTakerModalOff');
        }
        this.hasEncryptedControl();
      },
      getMetaDataControl(controlType, metadata) {
        let metaValue = metadata['stringControlType'];
        let ctrl = this.$store.getters.AssetControlArray.find(f => f.control === controlType && f.stringControlType === metaValue);
        return ctrl.controlComponent;
      },
      hasAssetInstanceControlsChanged(newControls, oldControls) {

        if(this.AssetInstanceControls.length === 0 && newControls.length === 0){
          this.savesDisabled = false;
          this.statusDisableForm = true;
          return false;
        }

        if (oldControls.length === 0) {
          return true
        }

        let newInstances = newControls.flatMap(f => f.templateId);
        let oldInstance = oldControls.flatMap(f => f.templateId);

        return !this.arraysEqual(newInstances, oldInstance);
      },
      arraysEqual(_arr1, _arr2) {
        if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
          return false;
        }
        let arr1 = _arr1.concat().sort();
        let arr2 = _arr2.concat().sort();
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }

        return true;
      },
      checkDocumentsForDisabledControls(){
        let documentInstances = this.AssetInstanceControls.filter(f => f.libraryType === 2);
        if(documentInstances.length > 0){
          if(documentInstances.flatMap(m => m.data).length === 0) {
            return true;
          }
          return documentInstances.flatMap(m => m.data.map(d => !d.hasAttachments)).reduce((t, a) => { return t || a});
        }
        return false;
      },
      updateDataHandler(event) {
        this.savesDisabledAllControls[event.index] = !event.isValid;
        this.savesDisabled = this.savesDisabledAllControls.reduce((t, a) => {
          return t || a
        }) || this.checkDocumentsForDisabledControls();
        this.AssetInstanceControls[event.assetIndex].properties[event.index].data = event.data;
        this.AssetInstanceControls[event.assetIndex].data[event.index] = event.data;
      },
      hasEncryptedControl: function () {
        let vm = this;
        vm.AssetInstanceControls.forEach(function (value, key) {
          if (value.kind === 1) { //we just need asset id's not document id's
            vm.assetIds.push(value.id);
          }
          for (var x = 0; x < value.properties.length; x++) {
            if (value.properties[x].control === 11 && vm.isAuthorized) {
              vm.showAuthorize = false;
            }
            else if (value.properties[x].control === 11 && !vm.isAuthorized) {
              vm.showAuthorize = true;
            }
            else {
              vm.showAuthorize = false;
            }
          }
        });
      },
      prepAssetInstanceControlsForSave(){
        for(let i = 0; i < this.AssetInstanceControls.length; i++){
          if(this.AssetInstanceControls[i].hasOwnProperty('properties')){
            for(let j = 0; j < this.AssetInstanceControls[i].properties.length; j++){
              for(let prop in this.AssetInstanceControls[i].properties[j]){
                if(this.AssetInstanceControls[i].properties[j].hasOwnProperty(prop) && prop === 'data'){
                  delete this.AssetInstanceControls[i].properties[j][prop];
                }
              }
            }
          }
        }
      }
    },
    created: function () {
      this.statusDisableForm = false;
    },
    components: {
      AddressPropertyControl,
      PhoneNumberUSPropertyControl,
      CheckboxesPropertyControl,
      DatePropertyControl,
      DateRangePropertyControl,
      DropDownListPropertyControl,
      EmailAddressPropertyControl,
      EncryptedPropertyControl,
      LongAnswerPropertyControl,
      NumberPropertyControl,
      NumberRangePropertyControl,
      RadioButtonsPropertyControl,
      ToggleButtonPropertyControl
    }
  }
</script>

<style lang="scss" scoped>
    $chat-bubble-color: #d5d5d5;

    .width100{
        width: 100%;
    }
    .form-taker {
        &.is-plugin-view {
            top: 0;
            margin: 5px;
            .component-form-footer {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 50%;
                left: 35%;
                overflow: hidden;
            }
        }
    }
    .bottomBorder {
        border-bottom: 1px solid #dee2e6 !important;
    }
    .topBorder {
        border-top: 1px solid #dee2e6 !important;
    }
    .alignMargin {
        margin-left: -10px;
    }
    .alignCenter{
        text-align: center;
    }
    p {
        font-size: 12px;
        color: #444B4F;
        font-weight: 300;
        font-family: "Roboto", sans-serif;
        white-space: pre-line;
    }
    h4 {
        font-size: 16px;
        color: #444B4F;
        font-weight: 500;
        font-family: "Roboto", sans-serif;
    }
    .topHeaderHeight {
        height: 15vh;
        display: block;
    }
    .contentHeight {
        height: 70vh;
        display: block;
        width: 100%;
        overflow-y: auto;
    }
    .bottomFooterHeight {
        height: 5vh;
        position: absolute;
        width: 90%;
        text-align: center;
        overflow: hidden;
    }
    .errorMargin {
        margin-left: 140px;
        margin-top: 3px;
    }
    .rowFlex {
        display: flex;
        flex-wrap: wrap;
        height: 20px;
        margin-top: 10px;
    }
    .close-button {
        max-width: 30px;
        // max-height: 30px;
        cursor: pointer;
    }
    .left-align {
        float: left;
        margin-left: 15px;
    }
    .input-file {
        opacity: 10;
        width: 275px;
        cursor: pointer;
    }

    /*loading modal for form taker*/
    .modal-container {
        //background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        position: absolute;
        height: 85vh;
        top: 5vh;
        background-color: rgba(0, 0, 0, 0.3);
        bottom: 100px;
        width: 98%;
        margin-left: 5px;
        margin-right: 2px;
    }
    .loading-indicator {
        padding: 20px;
        text-align: center;
        position: relative;
        top: 40%;
        width: 80%;
        background-color: #fff;
        border-radius: 10px;
        margin-left: 10%;

        .loading-container {
            width: 250px;
            display: inline-block;

            .app-logo-container {
                text-align: center;
                padding: 40px 0px;

                .app-logo-wrapper {
                    position: relative;
                    display: inline-block;

                    .app-logo-border {
                        background: linear-gradient(60deg, #34699E, #34699E, #1F8BD5, #1F8BD5, #03C0E6, #03C0E6);
                        padding: 3px;
                        animation: rot 1s linear infinite;
                        border-style: solid;
                        border-color: transparent;
                        border-radius: 50%;
                        border-width: 1px;
                        width: 200px;
                        height: 200px;
                        -webkit-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                        -moz-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                        box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                    }

                    .app-logo {
                        width: 194px;
                        height: 194px;
                        position: absolute;
                        top: 3px;
                        left: 3px;
                    }

                    @keyframes rot {
                        0% {
                            transform: rotate(0deg)
                        }
                        25% {
                            transform: rotate(90deg)
                        }
                        50% {
                            transform: rotate(180deg)
                        }
                        75% {
                            transform: rotate(270deg)
                        }
                        100% {
                            transform: rotate(360deg)
                        }
                    }
                }
            }

            .loading-text {
                font-size: 25px;
                color: #1F8BD5
            }

            .loading-item {
                font-size: 16px;
                margin-top: 5px;
                text-align: left;
                color: #1F8BD5

                // &.is-completed {
                //     color: @Color-gray-md;

                //     .loading-item-text {
                //         text-decoration: line-through;
                //     }
                // }
            }
        }
    }
    .hr-form-taker {
        padding: 15px;
    }
    .grey-background {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #e7e7e7;
        border-radius: 10px;
    }
    .authorize-button {
        margin-top: 10px;
        text-align: center;
    }
    .content{
        padding: 10px;
    }
    input[type="file"] {
        display: none;
    }
</style>
