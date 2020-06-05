<template>
    <div>
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <span><b>{{ ClassificationDetailType }}: </b>
                      <span v-if="ClassificationDetailType === 'Edit'" class="edit-title">{{ type.name }}</span>
                    </span>
                    <img id="classification-detail-close" class="close-button float-right"
                         src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="cancel()"/>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content input-fields">
            <div class="name-input-field row">
                <label for="classificationName" class="col-3 category-selection">Name: </label>
                <input id="classificationName" name="Name" v-bind:placeholder="typeName"
                       v-validate="'required|min:3|max:128'" class="col-8 form-control category-selection"
                       v-model="typeName">
                <div>
                    <span class="error errorMargin">{{errors.first('Name')}}</span>
                </div>
            </div>
            <div class="row">
                <label for="classificationDescription" class="col-3 category-selection">Description: </label>
                <textarea v-bind:placeholder="typeDescription" id="classificationDescription" name="Description"
                          v-validate="'max:512'"
                          v-model="typeDescription"
                          class="category-selection col-8 form-control description-input-field"></textarea>
                <div>
                    <p class="error errorDescriptionMargin">{{errors.first('Description')}}</p>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content footer" align="right">
            <button id="classification-detail-save" class="btn btn-primary" v-on:click="saveClassification($event)">Save</button>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {SnotifyPosition} from 'vue-snotify';
  import {ResourceDTO } from '../../store/ManagementAPI';

  export default {
    computed: {
      ...mapGetters(['Key', 'ClassificationDetailType', 'User', 'HrScopeInView', 'HrStores', 'DocumentsType', 'AssetsType', 'ChecklistsType','ClassificationType'])
    },
    data() {
      return {
        type: '',
        typeName: '',
        typeDescription: '',
        typeResources: [],
        storesInView: []
      };
    },
    created: function () {
      let vm = this;
      if (vm.ClassificationDetailType === 'Edit') {
        if(vm.Key === 'Documents'){
          vm.type = vm.DocumentsType;
        }
        else if(vm.Key === 'Assets'){
          vm.type = vm.AssetsType;
        }
        else if(vm.Key === 'Checklists'){
          vm.type = vm.ChecklistsType;
        }
        vm.typeName = vm.type.name;
        vm.typeDescription = vm.type.description;
        // vm.type.resources = vm.type.resources || [];
        // if(vm.type.resources.length > 0)
        //   vm.typeResources = vm.type.resources.slice(0, vm.Type.resources.length);

        vm.storesInView = vm.HrStores.map(m => {
          if(m.level === 'Store'){
              let checkMark = vm.typeResources.find(f => f.status === 1 && f.linkType === 11 && f.linkId === m.contextKey && f.ownerId === vm.Type.id);
              return {webKey: m.contextKey, Name: m.name, checked: !!checkMark};
          }
        }).filter(f => f !== undefined);
      }
      if (this.ClassificationDetailType === 'Add') {
        this.typeName = '';
        this.typeDescription = '';
        this.typeResources = [];
      }
    },
    methods: {
      saveClassification(event) {
        event.preventDefault();
        let vm = this;
        const category = vm.Key;
        const name = vm.typeName;
        const description = vm.typeDescription;

        if (vm.ClassificationDetailType === 'Edit') {
          vm.$validator.validate().then(validResult => {
            if (validResult) {
              event.target.disabled = true;
              vm.$store.dispatch('Change' + vm.Key + 'TypeName', {
                  clientId: vm.type.clientId,
                  tenantId: vm.type.tenantId,
                  libraryType: vm.type.libraryType,
                  name: name, 
                  description: description, 
                  id: vm.type.id,
                  status: vm.type.status,
                  tasks: []
                  // libraryId: vm.type.libraryId
              }).then((r) => {
                if (r.success) {
                  this.$snotify.success('The ' + vm.Key + ' category has been saved.', 'Save Successful', {
                    showProgressBar: false,
                    closeOnClick: true,
                    timeout: 2500,
                    pauseOnHover: true,
                    position: SnotifyPosition.rightTop
                  });
                }
              });
            } else {
              this.$snotify.error('The ' + category + ' did not meet the \r\n minimum requirements for saving', 'Save Error', {
                showProgressBar: false,
                closeOnClick: false,
                timeout: 2500,
                pauseOnHover: true,
                position: SnotifyPosition.rightTop
              });
            }
          });
        }
        else if (this.ClassificationDetailType === 'Add') {
          let libraryIdGuid = '';
          if(this.Key === 'Assets'){
            libraryIdGuid = '20180000-0000-0000-0000-000000000001'

            vm.$validator.validate().then(validResult => {
              if (validResult) {
                event.target.disabled = true;
                vm.$store.dispatch('addAssetsType', {
                    id: '00000000-0000-0000-0000-000000000000',
                    name: name,
                    description: description,
                    status: 1,
                    libraryType: 1,
                    clientId: '00000000-0000-0000-0000-000000000001',
                    tenantId: '00000000-0000-0000-0000-000000000001'
                }).then((r) => {
                  if (r) {
                    this.$snotify.success('The ' + category + ' has been saved.', 'Save Successful', {
                      showProgressBar: false,
                      closeOnClick: true,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  } else {
                    this.$snotify.error('The ' + category + ' failed to save!', 'Save Error', {
                      showProgressBar: false,
                      closeOnClick: false,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  }
                });
              } else {
                this.$snotify.error('The ' + category + ' did not meet the \r\n minimum requirements for saving', 'Save Error', {
                  showProgressBar: false,
                  closeOnClick: false,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
            });
          }
          else if(this.Key === 'Documents'){
            libraryIdGuid = '20180000-0000-0000-0000-000000000002'

            vm.$validator.validate().then(validResult => {
              if (validResult) {
                event.target.disabled = true;
                // vm.$store.dispatch('addChecklistsType', {
                vm.$store.dispatch('addDocumentsType', {
                  id: '00000000-0000-0000-0000-000000000000',
                  // category: 0,
                  clientId: '00000000-0000-0000-0000-000000000000',
                  tenantId: '00000000-0000-0000-0000-000000000000',
                  libraryType: 2,
                  name: name,
                  description: description,
                  status: 1,
                  tasks: []
                }).then((r) => {
                  if (r) {
                    this.$snotify.success('The ' + category + ' has been saved.', 'Save Successful', {
                      showProgressBar: false,
                      closeOnClick: true,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  } else {
                    this.$snotify.error('The ' + category + ' failed to save!', 'Save Error', {
                      showProgressBar: false,
                      closeOnClick: false,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  }
                });
              } else {
                this.$snotify.error('The ' + category + ' did not meet the \r\n minimum requirements for saving', 'Save Error', {
                  showProgressBar: false,
                  closeOnClick: false,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
            });            
          }
          else if(this.Key === 'Checklists'){
            libraryIdGuid = '20180000-0000-0000-0000-000000000003'

            vm.$validator.validate().then(validResult => {
              if (validResult) {
                event.target.disabled = true;
                // vm.$store.dispatch('addChecklistsType', {
                vm.$store.dispatch('addChecklistsType', {
                  id: '00000000-0000-0000-0000-000000000000',
                  category: 0,
                  name: name,
                  description: description,
                  status: 1,
                  tasks: []
                }).then((r) => {
                  if (r) {
                    this.$snotify.success('The ' + category + ' has been saved.', 'Save Successful', {
                      showProgressBar: false,
                      closeOnClick: true,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  } else {
                    this.$snotify.error('The ' + category + ' failed to save!', 'Save Error', {
                      showProgressBar: false,
                      closeOnClick: false,
                      timeout: 2500,
                      pauseOnHover: true,
                      position: SnotifyPosition.rightTop
                    });
                  }
                });
              } else {
                this.$snotify.error('The ' + category + ' did not meet the \r\n minimum requirements for saving', 'Save Error', {
                  showProgressBar: false,
                  closeOnClick: false,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              }
            });            
          }
        }
        vm.typeName = '';
        vm.typeDescription = '';
        vm.$store.dispatch('setDetailsView', '');
      },
      cancel() {
        this.typeName = '';
        this.typeDescription = '';
        this.$store.dispatch('setDetailsView', '');
      }
    }
  };
</script>

<style>
    .input-fields {
        padding: 15px;
    }

    .name-input-field {
        margin-bottom: 10px;
    }

    .description-input-field {
        min-height: 100px;
    }

    .footer {
        padding: 10px;
    }

    .btn-outline {
        border: 1px solid #1f8bd5;
    }

    .edit-title {
        font-weight: lighter;
        font-size: 16px;
    }

    .category-selection {
        font-size: 13px;
        font-family: Roboto;
    }

    .errorMargin {
        margin-left: 140px;
        margin-top: 3px;
    }

    .errorDescriptionMargin {
        margin-left: 120px;
        margin-top: 3px;
    }

    .close-button {
        width: 30px;
        height: 30px;

        /* vertical-align: text-top;
        margin-top: -5px;
        margin-left: 5px; */
        cursor: pointer;
    }

    .checkboxLeft {
        float: left;
        min-height: 1px;
        margin-left: 20px;
    }

    .control-group{
        margin-bottom: 10px;
    }

    div2 {
        width: 180px;
    }

    .clearLeft {
        clear: left;
    }

    .storeHeight {
        height: 50vh;
    }
</style>

