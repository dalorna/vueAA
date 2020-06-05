import enums from '../../utilities/enums';
import {
  TasksClient,
  AssetsClient,
  PersonaClient,
  AssetModel
} from '../ManagementAPI';

function initialState() {
  return {
    //want to change this to just asset and task
    Processes: {
      Task: null,
      Assets: null
    },
    GroupMembers: [],
    TaskInstance: {},
    DocumentUrls: [],
    isEmpty(ob) {
      for (var i in ob) {
        if (ob.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    },
    AssetInstanceControls: [],
    FormTakerIsLoading: false,
    isAuthorized: false,
  };
}

const state = initialState();

const getters = {
  Processes(state) {
    return state.Processes;
  },
  GroupMembers(state) {
    return state.GroupMembers;
  },
  TaskInstance(state) {
    return state.TaskInstance;
  },
  DocumentUrls(state) {
    return state.DocumentUrls;
  },
  AssetInstanceControls(state){
    return state.AssetInstanceControls;
  },
  FormTakerIsLoading(state){
    return state.FormTakerIsLoading;
  },
  isAuthorized(state){
    return state.isAuthorized;
  }
};

const actions = {
  getTaskData(context, id){
    return new Promise(async (resolve, reject) => {
      let client = new PersonaClient();
      resolve(await client.getTaskDataById(id).then((r) => {
        if(r.success){
          context.commit('setTask', r.data.taskInstance);
          context.commit('setAssetInstance', r.data.assetInstances);
        }
        else {
          context.commit('setTask', null);
          context.commit('setAssetInstance', []);
        }
      }))
    });
  },
  setAssets(context, val) {
    context.commit('setAssetInstance', val);
  },
  setTask(context, val){
    context.commit('setTask', val)
  },
  clearDocumentUrlObject(context) {
    context.commit('clearDocumentUrlObject');
  },

  //the next two methods might change depending on how mike decides what is sent back on getTaskDataById() call
  // async getUrlsForDocuments(context, assetTemplates) {
  //   return assetTemplates.forEach(async (template) => {
  //     if (template.kind === 2) {
  //       return context.dispatch('getLink', template);
  //     }
  //   });
  // },
  // async getLink(context, template) {
  //   //old
  //   // const client = new DocumentClient();
  //   // const tid = template.id;
  //   // return new Promise(async (resolve, reject) => {
  //   //   const url = await client.downloadTemplateAttachmentLink(tid);
  //   //   if (url) {
  //   //     context.commit('pushDocumentUrlObject', { id: tid, url: url.data });
  //   //     resolve(url.data);
  //   //   } else {
  //   //     reject('no url');
  //   //   }
  //   // });
  // },

  //not needed
  // createAssetInstances(context, data) {
  //   //old
  //   // const aInstances = data.HrTask ? data.HrTask.resourceAssets : null;
  //   // for (const template of data.assetTemplates) {
  //   //   const atId = template.versionId;
  //   //   const aInstIndex = aInstances ? aInstances.findIndex(f => f.asset ? f.asset.templateVersionId === atId : null) : -1;
  //   //   const aInst = aInstances ? aInstances[aInstIndex] : null;
  //
  //   //   template['assetInstanceId'] = aInst ? (aInst.asset ? aInst.asset.id : '00000000-0000-0000-0000-000000000000') : '00000000-0000-0000-0000-000000000000';
  //   //   template['resourceDtoId'] = aInst ? aInst.id : '00000000-0000-0000-0000-000000000000';
  //   //   template['assetLinkId'] = aInst ? aInst.linkId : '00000000-0000-0000-0000-000000000000';
  //
  //   //   if (template.kind === 1) {
  //   //     for (let index = 0; index < template.properties.length; index++) {
  //   //       // const tName = template.properties[index].name;
  //   //       const tName = template.properties[index].name;
  //   //       if (aInstIndex >= 0) {
  //   //         let pv = aInst.asset.properties.find(f => f.name === tName).value;
  //   //         template.properties[index]['value'] = pv;
  //   //       } else {
  //   //         template.properties[index]['value'] = null;
  //   //       }
  //   //     }
  //   //   }
  //   // }
  // },

  saveAssetInstances(context, assetInstance) {
    return new Promise(async (resolve, reject) => {
      let client = new AssetsClient();
      resolve(await client.saveAndGetAssetInBulk(assetInstance).then((r) => {
        return r;
      }));
    });
  },
  getGroupMemebers(context, task) {
    let _tasksClient = new TasksClient();
    _tasksClient.getPersonaForTaskTemplate(task.taskTemplateId).then((response) => {
        let group = response.data[0];
        if(response.data[0]){
            let _personaClient = new PersonaClient();
            _personaClient.getGroupMembership(group).then((response) => {
                console.log(response)
                let groupMembers = response;
            // context.commit('GroupMembers', groupMembers);
            })
        }
        else{
            context.commit('GroupMembers', state.EmployeeTaskList)
        }
    })
  },
  //Not sure what this does, or what it is for, but it isn't called anywhere that I can see
  // Also Tasks have change so much that it will need to be updated if it is ever to work
  // handleRegularMessage(context, data) {
  //   const message = data.Message;
  //   if (message.message && message.message.rtid === enums.NotificationType.OnboardingTask) {
  //     context.dispatch('handleHrTaskResponse', message.message.msg);
  //   }
  // },
  // handleHrTaskResponse(context, msg) {
  //   const _tasksClient = new TasksClient();
  //   _tasksClient.grpresponse(task.taskTemplateId).then((grpresponse) => {
  //     // console.log(grpresponse)
  //
  //     if (grpresponse.GroupId === msg.GroupId && msg.TaskInstanceId) {
  //       const taskId = msg.TaskInstanceId;
  //       const result = context.getters.EmployeeSelected;
  //
  //       _tasksClient.getTaskInstance(taskId).then((response) => {
  //         const res = response.data;
  //         const index = result.data.findIndex(t => t.id === taskId);
  //         if (index > -1) {
  //           // Update task attributes
  //           result.data[index]['startDate'] = res['startDate'];
  //           result.data[index]['endDate'] = res['endDate'];
  //           result.data[index]['status'] = res['status'];
  //           result.data[index]['claimUserId'] = res['claimUserId'];
  //
  //           // Get claim username
  //           if (res['claimUserId']) {
  //             const groupMembers = context.getters.group.Members;
  //             const searhUserId = res['claimUserId'];
  //             const ind = groupMembers.findIndex(m => m.Id === searhUserId);
  //
  //             if (ind > -1) {
  //               result.data[index]['claimUserName'] = groupMembers[ind]['FirstName'] + ' ' + groupMembers[ind]['LastName'];
  //             }
  //           }
  //         }
  //       });
  //     }
  //   });
  // },
  formTakerModalOff(context){
    context.commit('FormTakerIsLoading', false);
  },
  isAuthorized(context, bool){
    context.commit('isAuthorized', bool);
  },
  setFormTakerIsLoading(context, bool){
    context.commit('FormTakerIsLoading', bool);
  }
};

const mutations = {
  setTask(state, val) {
    state.Processes.Task = val;
  },
  setAssetTemplates(state, val) {
    state.AssetInstanceControls = val;
  },
  setAssetInstance(state, val) {
    state.AssetInstanceControls = val;
  },
  GroupMembers(state, val) {
    state.GroupMembers = val;
  },
  TaskInstance(state, val) {
    state.TaskInstance = val;
  },
  clearDocumentUrlObject(state) {
    state.DocumentUrls = [];
  },
  pushDocumentUrlObject(state, val) {
    state.DocumentUrls.push(val);
  },
  FormTakerIsLoading(state, val) {
    state.FormTakerIsLoading = val;
  },
  isAuthorized(state, bool){
    state.isAuthorized = bool;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
