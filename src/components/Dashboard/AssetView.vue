<template>
    <div>
        <img src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" class="float-right close-button" v-on:click="close()">
        <div class="header">
            <h2>
                Asset: {{Asset.name}}
            </h2>
            <div class="description">{{ Asset.description }}</div>
        </div>
        <div class="body">
            <div v-for="(prop, index) of assetValues" v-bind:key="prop.id">
                <div v-if="Object.keys(prop.controlMetadata).length === 0">
                    <div v-if="prop.dataType === 1">
                        <div class="form-group rowFlex">
                            <label class="col-sm-3 col-form-label">{{prop.name}}</label>
                            <div class="col-sm-9">
                                <input :id="prop.name + '_' + index" :name="prop.name" v-model="prop.value" v-validate="{HrFormTakerRequired: prop, required: true, min: 3}" type="text" class="form-control alignMargin" :disabled="!statusDisableForm" :class="{disabled : !statusDisableForm}" >
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
                                <input type="number" class="form-control alignMargin" v-model="prop.value" :id="prop.name" :name="prop.name" v-validate="{HrFormTakerRequired: prop, required: true, min: 3}" :disabled="!statusDisableForm" :class="{disabled : !statusDisableForm}" />
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
                                <input type="number" step="0.01" min="0.01" class="form-control alignMargin" v-model="prop.value" :id="prop.name" :name="prop.name" v-validate="{HrFormTakerRequired: prop, required: true, min: 3}" :disabled="!statusDisableForm" :class="{disabled : !statusDisableForm}" />
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
                                <input class="form-check-input alignMargin" type="checkbox" v-model="prop.value" :id="prop.name" :disabled="!statusDisableForm" :class="{disabled : !statusDisableForm}" />
                            </div>
                        </div>
                    </div>
                    <div v-if="prop.dataType === 5">
                        <div class="form-group rowFlex">
                            <div class="col-sm-3">{{prop.name}}</div>
                            <div class="col-sm-9 margin-bottom-5">
                                <input class="form-control alignMargin" size="16" type="date" v-model="prop.value" :id="prop.name" :name="prop.name" v-validate="{HrFormTakerRequired: prop, required: true, min: 3}" :disabled="!statusDisableForm" :class="{disabled : !statusDisableForm}" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="Object.keys(prop.controlMetadata).length > 0 && prop.controlMetadata.controlComponent" style="padding:15px;">
                    <component :index="index" :metadata="prop.controlMetadata" :status="statusDisableForm" :data="prop.value"
                                v-bind:is="prop.controlMetadata.controlComponent"></component>
                </div>
                <div v-else>
                    <span>No Control for Asset Type</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

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
    computed:{
        ...mapGetters(['Asset'])
    },
    data: function(){
        return{
            statusDisableForm: false,
            assetValues: [],
        }
    },
    created: function(){
        this.loadAssetValues();
    },
    methods:{
        loadAssetValues: function(){
            let vm = this;
            vm.Asset.properties.forEach(function(element, key){
                vm.assetValues.push({
                    name: element.name, 
                    description: element.description,
                    value: vm.Asset.data[key], 
                    control: element.control, 
                    controlMetadata: element.controlMetadata, 
                    dataType: element.dataType, 
                    id: element.id, 
                    isEncrypted: element.isEncrypted, 
                });
            });
        },
        close: function(){
            this.$store.dispatch("setDetailsView", '');
            this.$store.dispatch("setOverlappingPane", true);
        }
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
<style>
    .close-button {
        width: 30px;
        height: 30px;
        vertical-align: text-top;
        cursor: pointer;
    }
    .property-group{
        margin-top: 15px;
    }
    .header{
        padding: 10px 0 10px 10px;   
    }
    .description{
        font-weight: lighter;
        padding: 0 0 0 5px;
    }
</style>
