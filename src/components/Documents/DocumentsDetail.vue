<template>
    <div class="document-detail card">
        <div class="card-header">
            <div class="card-title">
                <b>{{addeditText}}:</b> <span class="text-overflow document-title">{{DocumentsItem.name}}</span>
                <div class="float-right">
                    <img class="close-button" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg"
                         v-on:click="closeDetails(true)"/>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <div class="category-title">Category:</div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection">Category/ Company:</label>
                    <select class="form-control category-selection" disabled :value="typeInFocus">
                        <option v-for="k in DocumentsTypesList" :value="k.id" v-bind:key="k.id">{{k.name}}</option>
                    </select>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection">Description:</label>
                    <textarea class="form-control category-selection" disabled type="text"
                              :value="DocumentsType.description"/>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <b class="category-title">Document: </b>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="documentName">Document Name:</label>
                    <input id="documentName" name="Document Name" v-validate="'required|min:3|max:128'"
                           class="form-control category-selection" type="text" v-model="documentName"/>
                    <span class="error">{{ errors.first('Document Name') }}</span>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="documentDescription">Description:</label>
                    <textarea id="documentDescription" name="Description" v-validate="'max:512'"
                              class="form-control category-selection" v-model="documentDescription"></textarea>
                    <span class="error">{{ errors.first('Description') }}</span>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content row">
            <span class="col-8 category-title">Document Uploader: </span>
            <!-- <span class="col-4 small-text">Uploaded Date:</span> -->
            <div class="content upload-button">
                <label for="fileInput" class="input-file btn btn-primary">
                    UPLOAD DOCUMENT
                </label>
                <input id="fileInput" type="file" name="fileInput" accept=".pdf, .doc, .docx"
                       v-validate="'ext:doc,docx,pdf'" @change="fileChange($event.target.files);"/>
                <div class="error">{{errors.first('fileInput')}}</div>
                <div v-if="documentUploaded.length > 0 && ((documentUploaded.substring(documentUploaded.length -5, documentUploaded.length) === '.docx') || (documentUploaded.substring(documentUploaded.length -4, documentUploaded.length) === '.doc') || (documentUploaded.substring(documentUploaded.length -4, documentUploaded.length) === '.pdf'))">
                    File Uploaded: {{documentUploaded}}
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="documentDescription">Notes:</label>
                    <textarea id="documentNotes" name="notes" v-validate="'max:512'"
                              class="form-control category-selection" v-model="documentNotes"></textarea>
                    <span class="error">{{ errors.first('notes') }}</span>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <span class="category-title">Documents Uploaded: </span>
            <div>
                <div class="content tableRow"
                     v-show="DocumentsItem.properties[0] && DocumentsItem.properties[0].hasAttachments">
                    <div class="tableCell">
                        <a class="document-download-link" href="#" v-on:click="downloadFile()">Download Document</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <button type="button" class="save-button btn float-right" v-on:click="save($event)">Save</button>&nbsp;
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {SnotifyPosition} from 'vue-snotify';

  export default {
    name: 'documentsdetail',
    computed: {
      ...mapGetters([
        'User',
        'DocumentsItem',
        'DocumentsTypesList',
        'DocumentsType',
      ])
    },
    data() {
      return {
        addeditText: '',
        documentName: '',
        documentDescription: '',
        typeInFocus: 0,
        documentContents: [],
        file: {},
        url: '',
        documentUploaded: [],
        documentNotes: ''
      }
    },
    watch: {
      DocumentsItem: {
        handler(val) {
          if (val && this.typeInFocus !== val.categoryId) {
            this.typeInFocus = val.categoryId;
          }
        }
      },
      documentName: {
        handler(val) {
          this.$store.dispatch('setDocumentsProp', ['name', val]);
        }
      },
      documentDescription: {
        handler(val) {
          this.$store.dispatch('setDocumentsProp', ['description', val]);
        }
      },
      documentNotes: {
        handler(val) {
          this.$store.dispatch('setDocumentsPropertyProp', {type: 'notes', value: val});
        }
      }
    },
    methods: {
      removeDocument: function (index) {
        //not available yet since we can only upload one document at a time
        // this.documentsUploaded.splice(1, index);
        // this.documentContents.splice(1, index);
      },
      deleteItem: function () {
        this.$store.dispatch('setDeleteType', 'item');
        this.$store.dispatch('openModal', 'DeleteWarningModal');
      },
      downloadFile: function (downloadUrl) {
        let vm = this;
        // vm.$store.dispatch('downloadDocumentFile', this.DocumentsItem.versionId).then((successResponse) =>{
        vm.$store.dispatch('downloadDocumentFile', this.DocumentsItem.properties[0].attachmentId).then((successResponse) => {
          let blob = new Blob([successResponse.data], {type: 'application/octet-stream'});
          let blobObjectUrl = window.URL.createObjectURL(blob);
          let blobElement = window.document.createElement('a');

          blobElement.href = blobObjectUrl;
          blobElement.setAttribute('download', successResponse.fileName || 'file.dat');
          blobElement.click();

        }, (failedResponse) => {
          vm.$snotify.error("The template attachment could not be downloaded", 'Download', {
            showProgressBar: false,
            closeOnClick: false,
            timeout: 2500,
            pauseOnHover: true,
            position: SnotifyPosition.rightTop
          });
        });
      },
      save: function (event) {
        event.preventDefault();
        let vm = this;
        vm.$validator.validate().then(result => {
          if (result) {
            event.target.disabled = true;
            vm.$store.dispatch('saveDocument', vm.DocumentsItem).then((r) => {
              if (r && r.success && vm.documentContents && vm.documentContents.byteLength > 0) {
                // vm.$store.dispatch('uploadDocument', {file: vm.file, fileName: vm.file.name, id: r.data.versionId}).then((ru) => {
                vm.$store.dispatch('uploadDocument', {
                  file: vm.file,
                  fileName: vm.file.name,
                  id: r.data.id
                }).then((ru) => {
                  if (ru) {
                    vm.$snotify.success('The Document has been saved.', 'Save Successful', {
                      showProgressBar: false,
                      closeOnClick: true,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  } else {
                    vm.$snotify.error('The Document failed to save!', 'Save Error', {
                      showProgressBar: false,
                      closeOnClick: false,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  }
                }, (err) => {
                  let errorMessage = err ? (err.message ? err.message : 'An unknown error has occurred') : 'An unknown error has occurred';
                  vm.$snotify.error(errorMessage, 'Save Error', {
                    showProgressBar: false,
                    closeOnClick: false,
                    timeout: 2500,
                    pauseOnHover: true,
                    position: SnotifyPosition.rightTop
                  })
                });
              }
              else if (r) {
                vm.$snotify.success('The Document has been saved. However, there is no attachment', 'Save Successful', {
                  showProgressBar: false,
                  closeOnClick: true,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              } else if (!r) {
                vm.$snotify.error('The Document failed to save!', 'Save Error', {
                  showProgressBar: false,
                  closeOnClick: false,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
              vm.closeDetails(false);
            }, (err) => {
              vm.$snotify.error(err.message, 'Save Error', {
                showProgressBar: false,
                closeOnClick: false,
                timeout: 2500,
                pauseOnHover: true,
                position: SnotifyPosition.rightTop
              });
            })
          } else {
            this.$snotify.error('All of the requirements for the\r\ndocument were not met.', 'Save Error', {
              showProgressBar: false,
              closeOnClick: false,
              timeout: 2500,
              pauseOnHover: true,
              position: SnotifyPosition.rightTop
            });
          }
        });

      },
      closeDetails: function (isCancel) {
        const vm = this;
        vm.$store.dispatch('setDocumentsItem', '');
        vm.$store.dispatch('setDetailsView', '');
        if (isCancel)
          vm.$store.dispatch('removeDocumentNewInstance');
      },
      setStartUp() {
        if (this.DocumentsItem.id === undefined || this.DocumentsItem.id === '00000000-0000-0000-0000-000000000000') {
          this.addeditText = 'Add';
          this.$store.dispatch('setDocumentsProp', ['categoryId', this.DocumentsType.id]);
          this.$store.dispatch('setDocumentsPropertyProp', {type: 'notes', value: ''});
          this.typeInFocus = this.DocumentsType.id;
        }
        else {
          this.addeditText = 'Edit';
          this.documentName = this.DocumentsItem.name;
          this.documentDescription = this.DocumentsItem.description;
          this.documentNotes = this.DocumentsItem.properties[0].notes ? this.DocumentsItem.properties[0].notes : '';
          this.typeInFocus = this.DocumentsItem.categoryId;
        }
      },
      outsideClick: function (event) {
        if (event.path.find(f => f.id === 'addnewtemplatedetail')) {
          this.documentName = '';
          this.documentDescription = '';
          this.$store.dispatch('setDocumentsProp', ['categoryId', this.DocumentsType.id]);
          this.$store.dispatch('setDocuments', '00000000-0000-0000-0000-000000000000');
          this.setStartUp();
        } else if (this.DocumentsItem && event.path.find(f => f.id === this.DocumentsItem.id)) {
          this.typeInFocus = this.DocumentsItem.categoryId;
          this.documentName = this.DocumentsItem.name;
          this.documentDescription = this.DocumentsItem.description;
          this.setStartUp();
        }
      },
      fileChange(files) {
        let vm = this;
        vm.$validator.validate().then(result => {
          if (files.length === 1 && result) {
            this.documentUploaded = (document.getElementById('fileInput').files[0].name);
            this.uploadDocument(files[0]);
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
      isEncryptChange() {
        //   this.DocumentsItem.enableAttachmentEncryption = !this.DocumentsItem.enableAttachmentEncryption;
        // if (this.DocumentsItem.properties[0] && this.DocumentsItem.properties[0].enableAttachmentEncryption)
        this.DocumentsItem.properties[0].enableAttachmentEncryption = !this.DocumentsItem.properties[0].enableAttachmentEncryption
      },
      removeDocumentProperty() {
        this.documentContents = [];
        let fileinput = document.getElementById('fileInput');
        fileinput.value = '';
      },
      // setCustomErrors() {
      //   const dictionary = {
      //     en: {
      //       messages: {
      //         ext: () => 'Only PDF, DOC, and DOCX allowed',
      //         min: (name, ref) =>  'Minimum chars of ' + name + ' is ' + ref[0]
      //       }
      //     },
      //     de: {
      //       messages: {
      //         ext: () => 'Nur PDF, DOC und DOCX erlaubt',
      //         min: (name, ref) => 'Mindestanzahl von Zeichen für ' + name + ' ist' + ref[0]
      //       }
      //     },
      //   };
      //
      //   this.$validator.localize(dictionary);
      // }
    },
    created: function () {
      this.setStartUp();
      window.addEventListener('click', this.outsideClick);
    },
    destroyed: function () {
      window.removeEventListener('click', this.outsideClick);
    },
    components: {}
  }
</script>

<style lang='scss' scoped>
    .close-button {
        width: 30px;
        height: 30px;

        vertical-align: text-top;
        margin-top: -5px;
        margin-left: 5px;
        cursor: pointer;
    }

    .content {
        padding: 10px;
    }

    .width50 {
        width: 50%;
    }

    .width100 {
        width: 100%;
    }

    .tableRow {
        display: table-row;
    }

    td {
        text-align: center;
    }

    .tableCell {
        display: table-cell;
    }

    .add-new-button {
        width: 30px;
        height: 30px;

        vertical-align: text-top;
        margin-top: -5px;
        margin-left: 5px;
        cursor: pointer;
    }

    .input-file {
        opacity: 10;
        width: 275px;
        cursor: pointer;
    }

    .text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 5px;
    }

    .plus-icon {
        max-width: 20px;
    }

    .btn-outline {
        border: 1px solid #1f8bd5;
    }

    .save-button {
        min-width: 80px;
        min-height: 32px;
    }

    .category-selection {
        font-size: 13px;
        // font-weight: 500px;
        font-family: Roboto;
    }

    .category-title {
        margin-left: 5px;
        font-size: 16px;
        font-weight: bolder;
        font-family: Roboto;
    }

    .small-text {
        font-size: 12px;
    }

    .upload-button {
        padding: 25px;
        text-align: center;
        margin: 0 auto;
    }

    .store-icon {
        max-width: 30px;
    }

    .store-selected {
        color: $lake;
        padding: 7px;
    }

    .caret-icon {
        max-width: 15px;
        padding-top: 7px;
    }

    input[type="file"] {
        display: none;
    }

    .document-title {
        font-weight: lighter;
        font-size: 16px;
    }

    .display-files-uploaded {
        padding: 15px 0 0 0;
    }

    .remove-document {
        height: 20px;
        width: 20px;
    }

    .document-download-link {
        text-decoration: underline;
        padding: 20px;
    }

    .col-space {
        padding: 10px;
    }

    .document-detail {
        overflow-x: hidden;
    }
</style>
