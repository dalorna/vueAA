<template>
    <div class="card asset-detail">
        <div class="card-header">
            <div class="card-title">
                <b>{{addeditText | translate}}:</b> <span class="asset-title">{{AssetsItem.name}}</span>
                <div class="float-right">
                    <img class="close-button" src="static/assets/img/SVGIcons/icon-close-circle-blue.svg"
                         v-on:click="closeDetails()"/>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <div class="category-title">Category:</div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="AssetCategory">Category/ Company:</label>
                    <select id="AssetCategory" class="form-control category-selection" disabled v-model="typeInFocus">
                        <option v-for="k in AssetsTypesList" :value="k.id" v-bind:key="k.id">{{k.name}}</option>
                    </select>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="AssetCategoryDescription">Description:</label>
                    <textarea id="AssetCategoryDescription" disabled name="Asset Category Description"
                              v-validate="'max:512'" class="category-selection form-control"
                              v-model="AssetsType.description"></textarea>
                    <span class="error">{{ errors.first('Asset Category Description') }}</span>
                </div>
            </div>
        </div>
        <div class="panel-action-bar bb-1 content">
            <span class="category-title">Asset: </span>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="AssetName">Asset name:</label>
                    <input id="AssetName" v-validate="'required|min:3|max:128'" name="Asset Name"
                           class="category-selection form-control" type="text" v-model="assetName"/>
                    <span class="error errorMargin">{{ errors.first('Asset Name') }}</span>
                </div>
            </div>
            <div class="row col-space">
                <div class="col-md-12">
                    <label class="category-selection" for="AssetName">Description:</label>
                    <textarea id="AssetDescription" name="Asset Description" v-validate="'max:512'"
                              class="category-selection form-control" v-model="assetDescription"></textarea>
                    <span class="error errorMargin">{{ errors.first('Asset Description') }}</span>
                </div>
            </div>
        </div>

        <div class="panel-action-bar bb-1 content">
            <span class="category-title">Asset Properties: </span>
            <div class="content panel-action-bar bb-1" v-for="(prop, index) in AssetsItem.properties"
                 v-bind:key="prop.id">
                <div class="row col-space">
                    <div class="col-md-12">
                        <span class="category-selection">Name Property:</span>
                        <div class="row col-space" style="padding-left:15px;">
                            <input v-bind:name="'name_' + index" v-validate="'assetNameRequired|required'"
                                   class="col-10 category-selection form-control" type="text" v-model="prop.name"
                                   v-on:keyup="isNameChange($event, prop.name, index)"/>
                            <img :name="'delete_' + index" class="col-2 delete-asset-button"
                                 v-on:click="removeProperty(index)"
                                 src="https://assets.autoalert.com/img/autoalert-icons/icon-close-or-remove-lake.svg"/>
                        </div>
                    </div>
                </div>
                <div class="row col-space" v-if="Object.keys(AssetsItem.properties[index].controlMetadata).length === 0">
                    <div class="col-md-12">
                        <span class="category-selection center-align-fields">Property Fields:</span>
                        <select :name="'dataType_' + index" v-validate="'dataTypeSelected:1,2,3,4,5'"
                                class="custom-select" v-bind:value="prop.dataType"
                                @change="isDataTypeChange($event, prop.name, index)">
                            <option value="0" disabled selected>Select Type</option>
                            <option value="1">String</option>
                            <option value="2">Integer</option>
                            <option value="3">Decimal</option>
                            <option value="4">Boolean</option>
                            <option value="5">DateTime</option>
                        </select>
                    </div>
                </div>
                <div class="row col-space" v-if="Object.keys(AssetsItem.properties[index].controlMetadata).length > 0">
                    <div class="col-md-12">
                        <span class="category-selection center-align-fields">Control Type:</span>
                        <select :id="'controlKind_' + index" :name="'controlKind_' + index" v-bind:value="metadataControl[index]" class="custom-select"
                                @change="isControlKindChange($event, prop.name, index)">
                            <option value="0" disabled selected>Select Type</option>
                            <option value="AddressControl">Address</option>
                            <option value="CheckboxesControl">Checkbox Group</option>
                            <option value="DateControl">Date</option>
                            <option value="DateRangeControl">Date Range</option>
                            <option value="DropDownListControl">Drop Down List</option>
                            <option value="EmailAddressControl">Email Address</option>
                            <option value="EncryptedControl">Encrypted</option>
                            <option value="NumberControl">Number</option>
                            <option value="NumberRangeControl">Number Range</option>
                            <option value="PhoneNumberUSControl">Phone Number</option>
                            <option value="RadioButtonsControl">Radio Button Group</option>
                            <option value="LongAnswerControl">Text</option>
                            <option value="ToggleButtonControl">Toggle Button</option>
                        </select>
                    </div>
                    <div class="col-md-12" v-if="showComp[index]">
                        <component :index="index" :metadata="AssetsItem.properties[index].controlMetadata" v-bind:is="metadataControl[index]" @updateMetaDataEvent="updateMetaDataHandler" @addErrorEvent="handleErrorFromComponent" ></component>
                    </div>
                </div>
                <div class="row col-space">
                    <div class="col-md-12">
                        <label class="category-selection" for="AssetDescription">Description:</label>
                        <textarea :name="'description_' + index" v-validate="'max:512'"
                                  class="category-selection form-control" v-model="prop.description"
                                  v-on:keyup="isDescriptionChange($event, prop.name, index)"></textarea>
                        <span class="error pull-left">{{ errors.first('description_' + index)}}</span>
                    </div>
                </div>
                <span class="error pull-left">{{ errors.first('name_' + index)}}</span>
                <span class="error pull-left">{{ errors.first('description_' + index)}}</span>
                <span class="error pull-left">{{ errors.first('dataType_' + index)}}</span>
            </div>
        </div>
        <div align="right" class="panel-action-bar bb-1 content add-property" v-on:click="addProperty()">
            <img class="add-property-button" src="https://assets.autoalert.com/img/autoalert-icons/icon-plus-lake.svg">
            <span class="add-property-text">Add Property</span>
        </div>
        <div class="panel-action-bar bb-1 content">
            <button v-if="isEdit" type="button" class="btn btn-outline" v-on:click="deleteItem()">Delete</button>
            <button type="button" class="save-button btn float-right" v-on:click="save($event)">Save</button>&nbsp;
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {SnotifyPosition} from 'vue-snotify';
  import PhoneNumberUSControl from './PhoneNumberUSControl';
  import CheckboxesControl from './CheckboxesControl';
  import DateControl from './DateControl';
  import DateRangeControl from './DateRangeControl';
  import DropDownListControl from './DropDownListControl';
  import EmailAddressControl from './EmailAddressControl';
  import EncryptedControl from './EncryptedControl';
  import LongAnswerControl from './LongAnswerControl';
  import NumberControl from './NumberControl';
  import NumberRangeControl from './NumberRangeControl';
  import RadioButtonsControl from './RadioButtonsControl';
  import ToggleButtonControl from './ToggleButtonControl';
  import AddressControl from './AddressControl';

  export default {
    name: 'assetsdetail',
    computed: {
      ...mapGetters([
      'User', 
      'AssetsItem', 
      'List', 
      'AssetsType',
      'AssetsTypesList'
      ])
    },
    data() {
      return {
        addeditText: '',
        assetName: '',
        assetDescription: '',
        typeInFocus: 0,
        isEdit: false,
        showComp: [],
        metadataControl: [],
        componentErrors: 0
      }
    },
    watch: {
      AssetsItem: {
        handler(val) {
          if (val && this.typeInFocus !== val.categoryId) {
            this.typeInFocus = val.categoryId;
          }
        }
      },
      assetName: {
        handler(val) {
          this.$store.dispatch('setAssetsProp', ['name', val]);
        }
      },
      assetDescription: {
        handler(val) {
          this.$store.dispatch('setAssetsProp', ['description', val]);
        }
      }
    },
    methods: {
      deleteItem: function () {
        this.$store.dispatch('setDeleteType', 'item');
        this.$store.dispatch('openModal', 'DeleteWarningModal');
      },
      addProperty() {
        this.$store.dispatch('addPropertyToAsset');
      },
      removeProperty(index) {
        this.$store.dispatch('removePropertyFromAsset', index);
      },
      isNameChange(e, name, index) {
        if (e) {
          this.$store.dispatch('setAssetsPropertyPropByName', {type: 'name', value: e.target.value, index: index})
        }
      },
      isDescriptionChange(e, name, index) {
        this.$store.dispatch('setAssetsPropertyPropByName', {type: 'description', value: e.target.value, index: index})
      },
      isDataTypeChange(e, name, index) {
        this.$store.dispatch('setAssetsPropertyPropByName', {
          name: name,
          type: 'dataType',
          value: e.target.value,
          index: index
        })
      },
      isControlKindChange(e, name, index) {
        let vm = this;
        let controlType = vm.$store.getters.AssetControlArray.find(f => f.name === e.target.value);

        this.isEncryptChange(controlType.control === 11, name, index);

        vm.$store.dispatch('setAssetsPropertyPropByName', {
          name: name,
          type: 'control',
          value: controlType.control,
          index: index
        }).then(() => {
          vm.$store.dispatch('setAssetsPropertyPropByName', {
            name: name,
            type: 'dataType',
            value: controlType.control,
            index: index
          })
        }).then(() => {
          for(let mp in vm.AssetsItem.properties[index].controlMetadata){
            if(vm.AssetsItem.properties[index].controlMetadata.hasOwnProperty(mp)){
              delete this.AssetsItem.properties[index].controlMetadata[mp];
            }
          }
          for(let metaProp in controlType){
            if(controlType.hasOwnProperty(metaProp) && metaProp !== 'control' && metaProp !== 'name'){
              vm.$store.dispatch('setAssetsPropertyMetadataByIndex', {metaName: metaProp, metaValue: controlType[metaProp], index: index})
            }
          }

          vm.showComp[index] = true;
          vm.showComp = vm.showComp.slice(0, vm.showComp.length);
          vm.metadataControl[index] = e.target.value;
          vm.metadataControl = vm.metadataControl.slice(0, vm.metadataControl.length);
        });

      },
      updateMetaDataHandler(event){
        for(let prop in event.metadata){
          if(event.metadata.hasOwnProperty(prop)){
            this.AssetsItem.properties[event.index].controlMetadata[prop] = event.metadata[prop];
          }
        }

        for(let prop in this.AssetsItem.properties[event.index].controlMetadata ){
          if(this.AssetsItem.properties[event.index].controlMetadata.hasOwnProperty(prop) && !event.metadata.hasOwnProperty(prop)
            || (event.metadata.hasOwnProperty(prop) && !event.metadata[prop])){
            delete this.AssetsItem.properties[event.index].controlMetadata[prop];
          }
        }
      },
      handleErrorFromComponent(event){
        this.componentErrors = event;
      },
      isEncryptChange(val, name, index) {
        this.$store.dispatch('setAssetsPropertyPropByName', {
          name: name,
          type: 'isEncrypted',
          value: val,
          index: index
        })
      },
      save(event) {
        event.preventDefault();
        let vm = this;
        vm.$validator.validate().then(result => {
          if (result && vm.componentErrors === 0) {
            event.target.disabled = true;
            vm.$store.dispatch('saveAsset', vm.AssetsItem).then((r) => {
              if (r) {
                this.$snotify.success('The Asset has been saved.', 'Save Successful', {
                  showProgressBar: false,
                  closeOnClick: true,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop
                });
              } else {
                this.$snotify.error('The Asset failed to save!', 'Save Error', {
                  showProgressBar: false,
                  closeOnClick: false,
                  timeout: 2500,
                  pauseOnHover: true,
                  position: SnotifyPosition.rightTop,
                });
              }
              this.closeDetails();
            });
          } else {
            this.$snotify.error('Asset requirements not met!', 'Save Error', {
              showProgressBar: false,
              closeOnClick: false,
              timeout: 2500,
              pauseOnHover: true,
              position: SnotifyPosition.rightTop
            });
          }
        });
      },
      closeDetails() {
        let vm = this;
        vm.$store.dispatch('setAssetsItem', '');
        vm.$store.dispatch('setDetailsView', '');
        vm.$store.dispatch('removeAssetItemNewInstance');
      },
      setStartUp() {
        if (this.AssetsItem.id === undefined || this.AssetsItem.id === '00000000-0000-0000-0000-000000000000') {
          this.addeditText = 'Add';
          this.$store.dispatch('setAssetsProp', ['categoryId', this.AssetsType.id]);
          this.typeInFocus = this.AssetsType.id;
          this.isEdit = false;
        }
        else {
          this.addeditText = 'Edit';
          this.assetName = this.AssetsItem.name;
          this.assetDescription = this.AssetsItem.description;
          this.typeInFocus = this.AssetsItem.categoryId;
          this.isEdit = true;
          for (let i = 0; i < this.AssetsItem.properties.length; i++) {
            this.showComp[i] = true;
            if (Object.keys(this.AssetsItem.properties[i].controlMetadata).length === 0) {
              this.metadataControl[i] = 'NONE';
            } else {
              this.metadataControl[i] = this.getMetaDataControl(this.AssetsItem.properties[i].control, this.AssetsItem.properties[i].controlMetadata);
            }
          }
        }
      },
      getMetaDataControl(controlType, metadata) {
        let metaValue = metadata['stringControlType'];
        let ctrl = this.$store.getters.AssetControlArray.find(f => f.control === controlType && f.stringControlType === metaValue);
        return ctrl.name;
      },
      outsideClick(event) {
        if (event.path.find(f => f.id === 'addnewtemplatedetail')) {
          this.assetName = '';
          this.assetDescription = '';
          this.$store.dispatch('setAssetsProp', ['categoryId', this.AssetsType.id]);
          // this.$store.dispatch('setAssets', '00000000-0000-0000-0000-000000000000'); //Don't think this does anything anymore
          this.setStartUp();
        } else if (this.AssetsItem && event.path.find(f => f.id === this.AssetsItem.id)) {
          this.typeInFocus = this.AssetsItem.categoryId;
          this.assetName = this.AssetsItem.name;
          this.assetDescription = this.AssetsItem.description;
          this.setStartUp();
        }
      }
    },
    created: function () {
      this.setStartUp();
      window.addEventListener('click', this.outsideClick);
    },
    destroyed: function () {
      window.removeEventListener('click', this.outsideClick);
    },
    components: {
      PhoneNumberUSControl,
      CheckboxesControl,
      DateControl,
      DateRangeControl,
      DropDownListControl,
      EmailAddressControl,
      EncryptedControl,
      LongAnswerControl,
      NumberControl,
      NumberRangeControl,
      RadioButtonsControl,
      ToggleButtonControl,
      AddressControl
    }
  }
</script>

<style lang='scss' scoped>
    .close-button {
        width: 25px;
        height: 25px;

        vertical-align: text-top;
        margin-top: -3px;
        margin-left: 5px;
        cursor: pointer;
    }

    .content {
        padding: 10px;
    }

    .width50 {
        width: 50%;
    }

    .width150 {
        width: 150px;
    }

    .widthName {
        //width: 200px;
        width: 25%;
    }

    .widthDataType {
        //width: 115px;
        width: 24%;
    }

    .widthMultiple {
        //width: 75px;
        width: 16%;
    }

    .widthEmpty {
        //width: 90px;
        width: 19%;
    }

    .widthDelete {
        width: 15%;
    }

    .cellLeft {
        display: table-cell;
        // padding-left: 5px;
    }

    td {
        text-align: center; /* center checkbox horizontally */
        vertical-align: middle; /* center checkbox vertically */
    }

    table {
        width: 100%;
        overflow: visible;

    }

    .header {
        font-weight: bold;
    }

    .add-new-button {
        width: 30px;
        height: 30px;

        vertical-align: text-top;
        margin-top: -5px;
        margin-left: 5px;
        cursor: pointer;
    }

    .hw100 {
        width: 100%;
        height: 100%;
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
        padding-bottom: 10px;
    }

    .store-icon {
        max-width: 30px;
    }

    .store-selected {
        color: $lake;
        padding: 7px;
        font-size: 18px;
        font-weight: bolder;
    }

    .caret-icon {
        max-width: 15px;
        padding-top: 7px;
    }

    .asset-title {
        font-weight: lighter;
        font-size: 16px;
    }

    .bottom-padding {
        padding: 0 0 15px 0;
    }

    .delete-asset-button {
        max-height: 20px;
        margin: 14px 0 0 0;
    }

    .remove-padding {
        padding: 0 0 0 0 !important;
    }

    .asset-table {
        padding: 0;
        overflow: auto;
    }

    .btn-outline {
        border: 1px solid #1f8bd5;
    }

    .add-property {
        width: 100%;
        padding-bottom: 30px;
    }

    .add-property-text {
        color: $lake;
        font-size: 14px;
    }

    .add-property-button {
        max-width: 20px;
    }

    .center-align-fields {
        margin-top: 7px;
    }

    .errorMargin {
        margin-left: 110px;
    }

    .col-space {
        padding: 10px;
    }

    .asset-detail {
        overflow-x: hidden;
    }
</style>
