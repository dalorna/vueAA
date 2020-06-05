import store from '../../store';
import {DocumentClient, Template, AssetsClient, AssetTemplatesClient} from '../ManagementAPI';
import { sortType } from '../../utilities/custom.js'

function initialState() {
  return {
    DocumentsTypesList: [],
    DocumentsType: {},
    DocumentsItemsList: [],
    DocumentsItem: {},
  };
}

const state = initialState();

const getters = {
  DocumentsTypesList(state){
    return state.DocumentsTypesList;
  },
  DocumentsType(state){
    return state.DocumentsType;
  },
  DocumentsItemsList(state){
    return state.DocumentsItemsList;
  },
  DocumentsItem(state){
    return state.DocumentsItem;
  },
};

const actions = {
  getDocumentsTypesList(context) {
    return new Promise(async (resolve, reject) => {
      const client = new DocumentClient();
      resolve(await client.getDocumentClassifications().then((response) => {
        if(response.success && response.data && response.data.length > 0 && response.data[0].id){
          context.commit('DocumentsTypesList', response.data);
          context.dispatch('setDocumentsType', context.state.DocumentsTypesList[0].id);
        } else {
          context.commit('DocumentsTypesList', []);
          context.commit('DocumentsItemsList', '');
          context.dispatch('setDocumentsType', '');
          context.dispatch('setDocumentsItem', '');
          context.dispatch('showModal', false);
        }
        return response.success;
      }))
    });
  },
  setDocumentsType(context, id){
    if(id){
      let type = state.DocumentsTypesList.find(x => x.id === id);
      context.commit('DocumentsType', type);
    } else{
      context.commit('DocumentsType', {});
    }
  },
  getDocumentsItemsList(context, id){
    if (id) {
      return new Promise(async (resolve, reject) => {
        const client = new DocumentClient();
        resolve(await client.getDocumentTemplatesByClassification(id).then((r) => {
          context.commit('DocumentsItemsList', r.data || []);
          context.dispatch('showModal', false);
        }, err => reject(err)));
      });
    } else {
      context.commit('DocumentsItemsList', []);
    }
  },
  setDocumentsItem(context, id){
    if(state.DocumentsItemsList.length > 0){
      const item = state.DocumentsItemsList.find(x => x.id === id);
      context.commit('DocumentsItem', item);
    }
    else{
      context.commit('DocumentsItem', {});
    }
  },
  async addDocumentsType(context, obj) {
    context.commit('DocumentsTypeAddItemTemp', obj);
    const client = new DocumentClient();
    // return client.saveClassification(obj).then((r) => {
    return client.saveAndGetClassification(obj).then((r) => {
      if (r.success) {
        context.dispatch('setDocumentsType', r.data.id)
        context.commit('updateNewDocumentType', r.data);
      }
      return r;
    });
  },
  saveDocumentClassifiction(context, obj) {
    context.commit('DocumentsType', obj);
    const client = new DocumentClient();
    client.saveAndGetClassification(obj);
  },
  newDocumentsInstance(context) {
    if (!state.DocumentsItemsList.find(f => f.id === '00000000-0000-0000-0000-000000000000')) {
      const newDoc = new Template();
      newDoc.id = '00000000-0000-0000-0000-000000000000';
      newDoc.clientId = '00000000-0000-0000-0000-000000000000';
      newDoc.tenantId = '00000000-0000-0000-0000-000000000000';
      newDoc.categoryId = '00000000-0000-0000-0000-000000000000';
      newDoc.libraryType = 2;
      newDoc.name = '';
      newDoc.description = '';
      newDoc.hasAttachments = false;
      newDoc.enableAttachmentEncryption = true;
      newDoc.properties = [{"hasAttachments": false, "enableAttachmentEncryption": false}];
      newDoc.kind = 2;
      newDoc.status = 1;

      context.commit('DocumentsItem', newDoc);
      context.commit('DocumentAddItemTemp', newDoc);
    }
  },

  removeDocumentNewInstance(context) {
    context.commit('removeDocumentNewInstance');
  },
  setDocumentsProp(context, props) {
    if (props[0] && (props[1] !== null || props[1] !== undefined)) {
      context.commit('SetDocumentProperty', props);
    }
  },
  setDocumentsPropertyProp(context, props) {
    context.commit('SetDocumentPropertyProp', { type: props.type, value: props.value });
  },
  downloadDocumentFile(context, assetTemplateId) {
    return new Promise(async (resolve, reject) => {
        let client = new DocumentClient();
        client.downloadTemplateAttachment(assetTemplateId).then((successResponse) => {
          resolve(successResponse);
        }, (failedResponse) => {
          reject(failedResponse)
        });
    });
  },
  downloadAssetDocumentFile(context, assetTemplateId) {
    return new Promise(async (resolve, reject) => {
        let client = new DocumentClient();
        client.downloadAssetAttachment(assetTemplateId).then((successResponse) => {
          resolve(successResponse);
        }, (failedResponse) => {
          reject(failedResponse)
        });
    });
  },
  clearDocumentFileProperty(context) {
    context.commit('ClearDocumentFileProperty');
  },
  RemoveDocumentsClassification(context, classification) {
    let _documentClient = new DocumentClient();
    context.commit('RemoveDocumentsClassification', classification);
    _documentClient.deleteClassification(classification.id).then((r) => {
      return r;
    });
  },
  ChangeDocumentsTypeName(context, category) {
    return new Promise(async (resolve, reject) => {
      const client = new DocumentClient();
      resolve(await client.saveAndGetClassification(category).then((r) => {
          if(r.success){
            context.commit('updateDocumentsType', r.data);
            return r;
          } else {
            reject(r);
          }
        },
        (err) => {reject(console.log(err));
      }));
    });
  },
  saveDocument(context, obj) {
    return new Promise(async (resolve, reject) => {
      const client = new DocumentClient();
      resolve(await client.saveAndGetTemplate(obj).then((r) => {
        if(r.success){
          context.commit('updateDocumentsItem', r.data)   
        }
        return r;
      },
        (err) => {
        reject(err);
      }))
    });
  },
  uploadDocument(context, data) {
    return new Promise(async (resolve, reject) => {
      const client = new DocumentClient();
      resolve(await client.uploadTemplateAttachment({ data: data.file, fileName: data.fileName }, data.id).then(r => {
        if (r.successful) {
          context.commit('SetDocumentPropertyById', ['attachmentId', r.data, data.id]);
          context.commit('SetDocumentPropertyById', ['hasAttachments', true, data.id]);
        }
        return r.successful;
      }, (err) => reject(err)));
    });
  },
  uploadAssetDocument(context, data) {
    return new Promise(async (resolve, reject) => {
      const client = new DocumentClient();
      resolve(await client.uploadAssetAttachment({ data: data.file, fileName: data.fileName }, data.id).then(r => {
        return r.successful;
      }, (err) => reject(err)));
    });
  },
  deleteDocumentsItem(context, item){
    let _dc = new DocumentClient();
    _dc.deleteTemplate(item.id).then((r) => {
    });
  },
};

const mutations = {
  DocumentsTypesList(state, types){
    sortType(types);
    state.DocumentsTypesList = types;
  },
  DocumentsType(state, type){
    state.DocumentsType = type;
  },
  DocumentsItemsList(state, items){
    if (items && items.length > 0) {
      items.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
    }
    if(!items){
      items = [];
    }
    state.DocumentsItemsList = items;
  },
  DocumentsItem(state, item){
    state.DocumentsItem = item;
  },
  DocumentsTypeAddItemTemp(state, type) {
    state.DocumentsTypesList.splice(0, 0, {
      id: 0, name: type.name, description: type.description
    });
  },
  DocumentAddItemTemp(state, val) {
    state.DocumentsItemsList.push(val);
  },
  SetDocumentPropertyById(state, props) {
    const index = state.DocumentsItemsList.findIndex(f => f.id === props[2]);
    // state.DocumentsItemsList[index][props[0]] = props[1];
    state.DocumentsItemsList[index]['properties'][0][props[0]] = props[1];
  },
  SetDocumentProperty(state, props) {
    state.DocumentsItem[props[0]] = props[1];
  },
  SetDocumentPropertyProp(state, props) {
    const property = state.DocumentsItem.properties[0];
    if (property) {
      state.DocumentsItem.properties[0][props['type']] = props['value'];
    }
  },
  removeDocumentNewInstance(state) {
    const index = state.DocumentsItemsList.findIndex(f => f.id === '00000000-0000-0000-0000-000000000000');
    if (index >= 0) {
      state.DocumentsItemsList.splice(index, 1);
    }
  },
  ClearDocumentFileProperty(state) {
    state.DocumentsItem.properties = [];
  },
  RemoveDocumentsClassification(state, classification) {
    const index = state.DocumentsTypesList.findIndex(f => f.id === classification.id);
    state.DocumentsTypesList.splice(index, 1);
  },
  updateNewDocumentType(state, id) {
    sortType(state.DocumentsTypesList);
    let index = state.DocumentsTypesList.findIndex(f => f.id === 0);
    let docType = state.DocumentsTypesList[index];
    state.DocumentsType = docType
  },
  updateDocumentsType(state, obj){
    let index = state.DocumentsTypesList.findIndex(x => x.id === obj.id);
    state.DocumentsTypesList[index] = obj;
    state.DocumentsType = obj;
  },
  updateDocumentsItem(state, obj){
    if(state.DocumentsItemsList.length >= 0){
      let index = state.DocumentsItemsList.findIndex(x => x.id === obj.id);
      state.DocumentsItemsList.splice(index, 1, obj);
      state.DocumentsItem = obj;
    }
  },
  removeDocumentItem(state, item){
    let index = state.DocumentsItemsList.findIndex(f => f.id === item.id);
    state.DocumentsItemsList.splice(index, 1);
  },

};

export default {
  state,
  getters,
  actions,
  mutations
};
