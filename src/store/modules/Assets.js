import store from '../../store';
import {AssetTemplatesClient} from '../ManagementAPI';
import { sortType } from '../../utilities/custom.js'

function initialState() {
  return {
    AssetsTypesList: [],
    AssetsType: {},
    AssetsItem: {},
    AssetControlArray: [{control: 1, name: 'AddressControl', controlComponent: 'AddressPropertyControl', stringControlType: 'Address', uiControl: 'v2'},
      {control: 1, name: 'EmailAddressControl', controlComponent: 'EmailAddressPropertyControl', stringControlType: 'EmailAddress', uiControl: 'v2'},
      {control: 1, name: 'PhoneNumberUSControl', controlComponent: 'PhoneNumberUSPropertyControl', stringControlType: 'PhoneNumberUS', uiControl: 'v2'},
      {control: 2, name: 'LongAnswerControl', controlComponent: 'LongAnswerPropertyControl', uiControl: 'v2'},
      {control: 3, name: 'CheckboxesControl', controlComponent: 'CheckboxesPropertyControl', uiControl: 'v2'},
      {control: 4, name: 'DropDownListControl', controlComponent: 'DropDownListPropertyControl', uiControl: 'v2'},
      {control: 5, name: 'RadioButtonsControl', controlComponent: 'RadioButtonsPropertyControl', uiControl: 'v2'},
      {control: 6, name: 'NumberControl', controlComponent: 'NumberPropertyControl', uiControl: 'v2'},
      {control: 7, name: 'NumberRangeControl', controlComponent: 'NumberRangePropertyControl', uiControl: 'v2'},
      {control: 8, name: 'DateControl', controlComponent: 'DatePropertyControl', uiControl: 'v2'},
      {control: 9, name: 'DateRangeControl', controlComponent: 'DateRangePropertyControl', uiControl: 'v2'},
      {control: 10, name: 'ToggleButtonControl', controlComponent: 'ToggleButtonPropertyControl', uiControl: 'v2'},
      {control: 11, name: 'EncryptedControl', controlComponent: 'EncryptedPropertyControl', uiControl: 'v2'}],
    AssetsItemsList: []
  };
}

const state = initialState();

const getters = {
  AssetsTypesList(state) {
    return state.AssetsTypesList;
  },
  AssetsType(state) {
    return state.AssetsType;
  },
  AssetsItemsList(state) {
    return state.AssetsItemsList;
  },
  AssetsItem(state) {
    return state.AssetsItem;
  },
  AssetControlArray(state) {
    return state.AssetControlArray;
  }
};

const actions = {
  getAssetsTypesList(context) {
    return new Promise(async (resolve, reject) => {
      const client = new AssetTemplatesClient();
      resolve(await client.getAssetCategories().then((response) => {
        if(response.success && response.data && response.data.length > 0 && response.data[0].id){
          context.commit('AssetsTypesList', response.data);
          context.dispatch('setAssetsType', context.state.AssetsTypesList[0].id);
        } else {
          context.commit('AssetsTypesList', []);
          context.commit('AssetsItemsList', []);
          context.dispatch('setAssetsItem', '');
          context.dispatch('setAssetsType', '');
        }
        return response.success;
      }))
    });
  },
  setAssetsType(context, id) {
    if(id){
      const type = state.AssetsTypesList.find(x => x.id === id);
      context.commit('AssetsType', type);
    } else{
      context.commit('AssetsType', {});
    }
  },
  getAssetsItemsList(context, id) {
    if(id){
      return new Promise(async (resolve, reject) => {
        const client = new AssetTemplatesClient();
        resolve(await client.getAssetTemplatesByCategoryId(id).then((r) => {
          if(r.success){
            context.commit('AssetsItemsList', r.data || []);
            context.dispatch('showModal', false);
            return r.success;
          } else {
            reject(context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getAssetsItemsList', r)))
          }
          }).catch(err => {
          context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getAssetsItemsList', err));
        }));
      });
    } else{
      context.commit('AssetsItemsList', []);
    }
  },
  setAssetsItem(context, id) {
    if(state.AssetsItemsList.length > 0){
      const asset = state.AssetsItemsList.find(x => x.id === id);
      context.commit('AssetsItem', asset);
    }
  },
  addAssetsType(context, obj) {
    return new Promise(async (resolve, reject) => {
      const client = new AssetTemplatesClient();
      resolve(await client.saveCategory(obj).then((r) => {
        if(r.success){
          context.commit('updateNewAssetType', r.data);
          return r.success;
        }
        return r;
      }))
    });
  },
  newAssetsInstance(context) {
    if (!state.AssetsItemsList.find(f => f.id === '0')) {
      const a = {
        id: '00000000-0000-0000-0000-000000000000',
        name: '',
        description: '',
        properties: [],
        clientId: '00000000-0000-0000-0000-000000000000',
        locatorId: '00000000-0000-0000-0000-000000000000', 
        tenantId: '00000000-0000-0000-0000-000000000000',
        libraryType: 1,
        status: 1,
        categoryId: context.getters.AssetsType.id,
        properties: [],
      };
      context.commit('AssetsItem', a);
      context.commit('AssetAddItemTemp', a);
    }
  },
  removeAssetItemNewInstance(context) {
    context.commit('removeAssetItemNewInstance');
  },
  saveAsset(context, obj) {
    context.commit('AssetsItem', obj);
    const client = new AssetTemplatesClient();
    return client.saveAssetTemplate(obj).then((r) => {
      if (r.success) {
        context.commit('updateAssetItem', r.data)
      }
      return r.success;
    });
  },
  setAssetsProp(context, props) {
    if (props[0] && (props[1] !== null || props[1] !== undefined)) {
      context.commit('SetAssetProperty', props);
    }
  },
  setAssetsPropertyPropByName(context, props) {
    context.commit('SetAssetPropertyProp', {
      type: props.type,
      value: props.value,
      index: props.index
    });
  },
  setAssetsPropertyMetadataByIndex(context, props) {
    context.commit('SetAssetPropertyMetadata', {
      metaName: props.metaName,
      metaValue: props.metaValue,
      index: props.index
    });
  },
  addPropertyToAsset(context) {
    context.commit('PushAssetProperty');
  },
  // addStoreToAsset(context) {
  //   context.commit('PushAssetStore');
  // },
  removePropertyFromAsset(context, index) {
    context.commit('RemoveAssetProperty', index);
  },
  RemoveAssetsClassification(context, category) {
    return new Promise(async (resolve, reject) => {
      let client = new AssetTemplatesClient();
      resolve(await client.deleteCategory(category.id).then((r) => {
        if(r.success){
          context.commit('RemoveAssetsClassification', category);
        }
        return r.success;
      }));
    });
    },
  deleteAssetsItem(context, item) {
    let client = new AssetTemplatesClient();
    client.deleteTemplate(item.id).then((r) => {
      if(r.success){
        context.commit('removeAssetsItem', item);
     }
       return r.success;
     });
  },
  ChangeAssetsTypeName(context, category) {
    return new Promise(async (resolve, reject) => {
      const client = new AssetTemplatesClient();
      resolve(await client.saveCategory(category).then((r) => {
          if (r.success) {
            context.commit('updateAssetsType', category);
            return r;
          } else {
            reject(r);
          }
        },
        (err) => {
          reject(console.log(err));
        }));
    });
  },
}

const mutations = {
  AssetsTypesList(state, types) {
    sortType(types)
    state.AssetsTypesList = types;
  },
  AssetsType(state, val) {
    state.AssetsType = val;
  },
  AssetsItemsList(state, items) {
    if (items && items.length > 0) {
      items.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
    }
    if (!items) {
      items = [];
    }
    state.AssetsItemsList = items;
  },
  AssetsItem(state, val) {
    state.AssetsItem = val;
  },
  updateNewAssetType(state, obj) {
    state.AssetsTypesList.splice(0, 0, obj);
    state.AssetsType = obj;
  },
  updateAssetCategory(state, swap) {
    state.AssetsTypesList.find(f => f.id === swap.ogid).id = swap.newid;
  },
  updateAssetsType(state, obj){
    const index = state.AssetsTypesList.findIndex(x => x.id === obj.id);
    state.AssetsTypesList[index] = obj;
    state.AssetsType = obj;
  },
  AssetAddItemTemp(state, val) {
    state.AssetsItemsList.push(val);
  },
  removeAssetItemNewInstance(state) {
    const index = state.AssetsItemsList.findIndex(f => f.id === '0');
    if (index >= 0) {
      state.AssetsItemsList.splice(index, 1);
    }
  },
  updateAssetItem(state, obj) {
    if (state.AssetsItemsList.length >= 0) {
      let index = state.AssetsItemsList.findIndex(x => x.id === obj.id);
      state.AssetsItemsList.splice(index, 1, obj);
    }
  },
  SetAssetProperty(state, props) {
    state.AssetsItem[props[0]] = props[1];
  },
  SetAssetPropertyProp(state, props) {
    state.AssetsItem.properties[props.index][props['type']] = props['value'];
  },
  SetAssetPropertyMetadata(state, props) {
    state.AssetsItem.properties[props.index].controlMetadata[props['metaName']] = props['metaValue'];
  },
  PushAssetProperty(state) {
    const p = {};
    p['dataType'] = 0;
    p['name'] = '';
    p['description'] = '';
    p['control'] = 0;
    p['id'] = '00000000-0000-0000-0000-000000000000';
    p['controlMetadata'] = {
      uiControl: 'v2'
    };
    state.AssetsItem.properties.push(p);
  },
  RemoveAssetProperty(state, index) {
    state.AssetsItem.properties.splice(index, 1);
  },
  RemoveAssetsClassification(state, classification) {
    let index = state.AssetsTypesList.findIndex(f => f.id === classification.id);
    if (index >= 0) {
      state.AssetsTypesList.splice(index, 1);
    }
  },
  removeAssetsItem(state, item){
    let index = state.AssetsItemsList.findIndex(x => x.id === item.id);
    state.AssetsItemsList.splice(index, 1);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
};
