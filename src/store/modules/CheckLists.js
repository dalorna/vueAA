import {types, debug} from "util";
import {
  TasksClient,
  PersonaClient,
  AssetsClient,
  ChecklistClient,
  ChecklistTemplateClient,
  TaskTemplateClient,
  AssetTemplatesClient
} from '../ManagementAPI';
import {sortType} from '../../utilities/custom.js';
import {testCheckListTemplate, testTaskTemplate, testAssetTemplate} from '../TestData/TestDataTaskCheckListTemplate';

function initialState() {
  return {
    ChecklistsTypes: [], //list templates w/o Tasks
    ChecklistsType: {}, // Selected list template
    Checklists: [], // List templates w/ tasks
    ChecklistsItem: {}, // Selected list template w/tasks
    AssetsFromAssets: [],
    DocumentsFromDocuments: [],
    Assignees: [],
    AssetClassifications: [],
    TypeOptions: [],
    TasksSelected: [],
    TotalTasks: [],
    TaskInView: [],
    Task: {},
    AddTaskPaneShowing: false,
    ExcludedObjectList: [],
    TaskInstancesFromAddTask: [],
    CheckListTaskHolder: {},
    hrStep: '-1',
    correctAssetVersions: [],
    checklistSuccessName: '',
    checklistSuccessAssociatedUsers: [],
    TasksFromSelectedChecklist: []
  }
}

const state = initialState();

const getters = {
  ChecklistsTypes(state) {
    return state.ChecklistsTypes;
  },
  ChecklistsType(state) {
    return state.ChecklistsType;
  },
  Checklists(state) {
    return state.Checklists;
  },
  ChecklistsItem(state) {
    return state.ChecklistsItem;
  },
  TypeOptions(state) {
    return state.TypeOptions;
  },
  //Deals with task adding
  TasksSelected(state) {
    return state.TasksSelected;
  },
  TotalTasks(state) {
    return state.TotalTasks;
  },
  TaskInView(state) {
    return state.TaskInView;
  },
  Task(state) {
    return state.Task;
  },
  AssetsFromAssets(state) {
    return state.AssetsFromAssets;
  },
  DocumentsFromDocuments(state) {
    return state.DocumentsFromDocuments;
  },
  Assignees(state) {
    return state.Assignees;
  },
  AssetClassifications(state) {
    return state.AssetClassifications;
  },
  AddTaskPaneShowing(state) {
    return state.AddTaskPaneShowing;
  },
  ExcludedObjectList(state) {
    return state.ExcludedObjectList;
  },
  TaskInstancesFromAddTask(state) {
    return state.TaskInstancesFromAddTask;
  },
  CheckListTaskHolder(state) {
    return state.CheckListTaskHolder;
  },
  hrStep(state) {
    return state.hrStep;
  },
  correctAssetVersions(state) {
    return state.correctAssetVersions;
  },
  checklistSuccessName(state) {
    return state.checklistSuccessName;
  },
  checklistSuccessAssociatedUsers(state) {
    return state.checklistSuccessAssociatedUsers;
  },
  TasksFromSelectedChecklist(state) {
    return state.TasksFromSelectedChecklist;
  }
}

const actions = {
  async getChecklistsTypes(context) {
    return new Promise(async (resolve, reject) => {
      const client = new ChecklistTemplateClient()
      resolve(await client.getTemplates(false).then((response) => {
        if (response.success && response.data && response.data.length > 0) {
          context.commit('ChecklistsTypes', response.data);
          context.dispatch('setChecklistsType', response.data[0].id);
        } else {
          context.commit('ChecklistsTypes', []);
          context.commit('ChecklistsItem', '');
        }
      }, err => { reject(err)}))
    });
  },
  setChecklistsType(context, id) {
    if (id) {
      let type = state.ChecklistsTypes.find(x => x.id === id);
      context.commit('ChecklistsType', type);
    } else{
      context.commit('ChecklistsType', {});
    }
  },
  setChecklists(context, id) {
    if(id){
      let l = state.Checklists.find(x => x.id === id);
      context.commit('ChecklistsItem', l);
    } else {
      context.commit('ChecklistsItem', {});
    }
  },
  getChecklists(context, id) {
      return new Promise(async (resolve, reject) => {
        let ts = new ChecklistTemplateClient();
        if(id){
          resolve( await ts.getChecklistTemplate(id).then((response) => {
            context.commit('ChecklistsItem', response.data);
            context.dispatch('showModal', false);
            },
              err => { reject(err)})
          );
        } else {
          resolve(context.commit('ChecklistsItem', {}));
        }
      });
  },
  getCheckListById(context, id) {
    return new Promise(async (resolve, reject) => {
      let ts = new TasksClient();
      if (id) {
        resolve(await ts.getTemplate(id).then((response) => {
            return response;
          },
          err => {
            reject(err)
          })
        );
      } else {
        resolve(context.commit('ChecklistsItem', {}));
      }
    });
  },
  getAllChecklists(context) {
    //used to get all the tasks from all the checklists
    //used in the addtask.vue to find tasks to add a checklist ad hoc
    return new Promise(async (resolve, reject) => {
      let ts = new ChecklistTemplateClient();
      resolve(await ts.getTemplates(true).then((response) => {
          context.commit('Checklists', response.data.slice());
          context.commit('TypeOptions', response.data.slice());
        }),
        (err) => {
          reject(err);
        });
    });

  },
  async getAssetClassifications(context) {
    let ts = new AssetsClient();
    await ts.getClasifications().then((response) => {
      context.commit('AssetClassifications', response);
    });
  },
  getAssetAll(context) {
    // return new Promise(async (resolve, reject) => {
    //   let ts = new AssetsClient();
    //   resolve(await ts.getAll().then((response) => {
    //     context.commit('AssetsFromAssets', response);
    //     return new Promise(async (resolve, reject) => {
    //       let ts = new DocumentClient();
    //       resolve(await ts.getDocumentTemplates().then((response) => {
    //         context.commit('DocumentsFromDocuments', response.data);
    //       }, err => reject(err)))
    //     });
    //   }, err => reject(err)))
    // });

    //
    // let assets = testAssetTemplate.getAllAssets();
    // context.commit('AssetsFromAssets', assets);

    return new Promise(async (resolve, reject) => {
      let client = new AssetTemplatesClient();

      resolve(await client.getAllAssetTemplates().then((r) => {
        if(r.success){
          context.commit('AssetsFromAssets', r.data);
        }
        return r.success;
      }))
    })

  },
  getAssigneeAll(context) {
    if(context.getters.Assignees.length === 0) {
      return new Promise(async (resolve, reject) => {
        const ts = new PersonaClient();
        resolve(await ts.getUsers().then((response) => {
          if(response.successful){
            let data = response.data;
            if(data) {
              data.sort(function (a, b) {
                return a.name.localeCompare(b.name);
              });
            }
            context.commit('Assignees', data || []);
          } else {
            reject(context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getAssigneeAll', response)));
          }
        }).catch(err => {
          context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getAssigneeAll', err));
        }));
      });
    }
  },
  getAssignee(context, id) {
    if(context.getters.Assignees.length === 0){
      return new Promise(async(resolve) => {
        context.dispatch('getAssigneeAll').then(() => {
          return resolve(context.getters.Assignees.find(f => f.key === id));
        });
      });
    } else {
      return context.getters.Assignees.find(f => f.key === id);
    }
  },
  getAssigneeByExternalReference(context, id) {
    if(context.getters.Assignees.length === 0){
     return new Promise(async(resolve) => { context.dispatch('getAssigneeAll').then(() => {
        return resolve(context.getters.Assignees.filter(f => id.includes(f.key)));
      })
     });
    } else {
      return context.getters.Assignees.filter(f => id.includes(f.key));
    }
  },
  async getCheckListsAssets(context) {
    // TODO: Change this with the API call and handle the different JSON return types
    let checkListsAssetsTypes = test.getCheckListsAssets();
    // var assTypes = [];
    context.commit('ListsAssetsTypes', checkListsAssetsTypes);
  },
  // getTypeOptions(context) {
  //   //Same as getChecklistsTypes, but adds starter option for the drop down
  //   //Tasks/ListTemplates
  //   let ts = new TasksClient();
  //   ts.getTemplates(true).then((response) => {
  //     context.commit('TypeOptions', response.data);
  //   });
  // },
  addChecklistsType(context, obj) {
     context.commit('ChecklistsTypeAddItemTemp', obj);
     // Mock Data
     // testCheckListTemplate.saveCheckListTemplate(obj);

    //Real Stuff
    return new Promise(async (resolve, reject) => {
      const client = new ChecklistTemplateClient();
      resolve(await client.saveTemplate(obj).then((response) => {
        if (response.success && response.data) {
          context.commit('updateChecklistTypeId', {ogid: '00000000-0000-0000-0000-000000000000', newid: response.data.id});
          this.commit('ChecklistsType', response.data);
          this.commit('Checklists', []);
          return response.success;
        } else {

          let index = state.ChecklistsTypes.findIndex(f => f.id === '00000000-0000-0000-0000-000000000000');
          state.ChecklistsTypes.splice(index, 1);
          context.commit('ChecklistsType', {});
          return response.success;
          // context.dispatch('setChecklistsType', '');
        }
      }, err => {
        reject(err);
        let index = state.ChecklistsTypes.findIndex(f => f.id === '00000000-0000-0000-0000-000000000000');
        state.ChecklistsTypes.splice(index, 1);
        context.commit('ChecklistsType', {});
        return response.success;
      }))
    });
    //Real Stuff



    // return new Promise(async (resolve, reject) => {
    //   let ts = new TasksClient();
    //   resolve(await ts.saveTemplate('00000000-0000-0000-0000-000000000000', taskTemplate).then((response) => {
    //       console.log('response', response);
    //       if (response.success) {
    //         context.commit('updateSavedChecklistItemType', {
    //           ogid: '00000000-0000-0000-0000-000000000000',
    //           newid: response.data
    //         });
    //       } else {
    //         context.commit('RemoveChecklistsClassification', taskTemplate);
    //       }
    //       return response;
    //     }),
    //     (err) => {
    //       reject(err);
    //     });
    // })
  },
  newChecklistsInstance(context) {
    // context.commit('setMode', 'Add');
    let a = {
      id: 0,
      name: '',
      description: '',
      HelpText: '',
      TypeId: state.ChecklistsType.id,
      Type: state.ChecklistsType,
      Stores: [],
      Fields: []
    };
    context.dispatch('setTaskItem', '0');
    // Save to the server (API call)
    // context.commit('ChecklistsItem', a);
    context.commit('ChecklistAddItemTemp', a);
  },
  setTaskItem(context, id) {
    context.dispatch('setDetailsView', '');
    context.dispatch('getAssetAll');
    // context.dispatch('getAssetClassifications');
    context.dispatch('getAssigneeAll');
    // context.dispatch('getGroups');

    if (id === '0') {
      let task = {
        completionInterval: 9960,
        createdDate: null,
        createdUserId: '',
        description: '',
        id: 0,
        lastUpdatedDate: '',
        lastUpdatedUserId: '',
        name: '',
        sequence: 4,
        taskTemplateAsset: [],
        taskTemplatePersona: [],
        storeAccess: []
      };

      context.commit('Task', task);
      // context.commit('CheckListsAssets', []);
      // context.commit('CheckListsAssignees', []);
    } else {
      if(state.ChecklistsItem && state.ChecklistsItem.tasks && state.ChecklistsItem.tasks.length){
        let t = state.ChecklistsItem.tasks.find(x => x.id === id);
        context.commit('Task', t);
      } else {
        context.commit('Task', []);
      }
    }
  },
  //create a new instance of a checklist which is a task of list type based off of template of list type
  async saveChecklist(context, obj) {
    // Save task to API
    let ts = new TasksClient();
    let currentDatetime = moment().format('YYYY-MM-DD hh:mm A');

    let template = {
      'id': obj.id,
      'description': obj.description,
      'name': obj.name,
      'sequence': obj.sequence,
      'completionInterval': obj.completionInterval,
      'createdDate': obj.createdDate || currentDatetime,
      'createdUserId': obj.userId,
      'lastUpdatedDate': currentDatetime,
      'lastUpdatedUserId': obj.userId,
      'taskTemplateAsset': obj.checkListsAssets,
      'taskTemplatePersona': obj.checkListsAssignees,
      'storeAccess': obj.checkListsStores,
      'accountId': obj.accountId,
      'accountPlatformId': obj.accountPlatformID,
      'versionId': obj.versionId || '00000000-0000-0000-0000-000000000000',
      'version': obj.version
    };

    await ts.saveTemplate(template).then((response) => {
      let template = response.data;
      context.commit('template', template);

      // if (template.id === 0) {
      //     ts.addTemplateToList(task.id, obj.checkListsItemId).then((response) => {
      //         var data = response;
      //     });
      // }
      context.dispatch('getChecklists', obj.checkListsItemId);
    }, (err) => {
      console.log(err);
    })
  },
  saveTemplate(context, templateWithCheckListId) {
    return new Promise(async (resolve, reject) => {
      const client = new TaskTemplateClient();
      resolve(await client.saveTemplate(templateWithCheckListId.checklistId, templateWithCheckListId.task).then((response) => {
        context.commit('updateSavedChecklistItemType', {oldTask: templateWithCheckListId.task, newTask: response.data});
        return response;
      }, err => {reject(err)}));
    });
  },
  ChangeChecklistsTypeName(context, classification) {
    // context.commit('updateChecklistsTypeName', classification);
    // return new Promise(async (resolve, reject) => {
    //   let ts = new TasksClient();
    //   resolve(await ts.saveTemplate(classification.id, context.getters.ChecklistsType).then((response) => {
    //       if (response.success) {
    //         context.commit('updateSavedChecklistItemType', {ogid: classification.id, newid: response.data});
    //         context.dispatch('getChecklists', response.data);
    //         return response;
    //       }
    //     }),
    //     (err) => {
    //       reject(err);
    //     });
    // })

    //JR
    // context.commit('updateChecklistsTypeName', classification);
    // let category = state.ChecklistsType;
    // context.commit('updateSavedChecklistItemType', category);
    // testCheckListTemplate.saveCheckListTemplate(classification);
    //JR

    context.commit('updateChecklistsTypeName', classification);
    return new Promise(async (resolve, reject) => {
      let ts = new ChecklistTemplateClient();
      // resolve(await ts.saveTemplate(classification.id, context.getters.ChecklistsType).then((response) => {
      resolve(await ts.saveTemplate(classification, context.getters.ChecklistsType).then((response) => {
          if (response.success) {
            context.commit('updateSavedChecklistType', response.data);
            context.dispatch('getChecklists', response.data.id);
            return response;
          }
        },
        (err) => {
          reject(err);
        }));
    })

    return {success: true};
  },
  // Deals with task adding
  addTask(context, emp) {
    context.commit('AddTasksSelected', emp);
  },
  removeTask(context, emp) {
    context.commit('RemoveTasksSelected', emp);
  },
  clearTasks(context) {
    context.commit('clearTasksSelected');
  },
  addTotalTask(context, emp) {
    context.commit('AddTotalTask', emp);
  },
  clearTotalTasks(context) {
    context.commit('clearTotalTasks');
  },
  addTaskInView(context, emp) {
    context.commit('addTaskInView', emp);
  },
  removeTaskInView(context, emp) {
    context.commit('removeTaskInView', emp);
  },
  clearTaskInView(context) {
    context.commit('clearTaskInView');
  },
  clearCheckListItem(context) {
    context.commit('ChecklistsItem', {});
  },
  setAddTaskPaneShowing(context, val) {
    context.commit('AddTaskPaneShowing', val);
  },
  RemoveChecklistsClassification(context, classification) {
    return new Promise(async(resolve, reject) => {
      let client = new ChecklistTemplateClient();
      resolve(await client.deleteTemplate(classification.id).then(r => {
        if(r.success){
          context.commit('RemoveChecklistsClassification', classification);
        }
        return r.success;
      }, err => reject(err)))
    });
  },
  pushExcludedObjectList(context, val) {
    context.commit('pushExcludedObjectList', val);
  },
  clearExcludedObjectList(context, val) {
    context.commit('clearExcludedObjectList', val);
  },
  setTaskInstancesFromAddTask(context, val) {
    context.commit('setTaskInstancesFromAddTask', val);
  },
  setCheckListTaskHolder(context, val) {
    context.commit('setCheckListTaskHolder', val);
  },
  clearTaskInstancesFromAddTask(context) {
    context.commit('clearTaskInstancesFromAddTask');
  },
  clearCheckListTaskHolder(context) {
    context.commit('clearCheckListTaskHolder');
  },
  setHrStep(context, val) {
    context.commit('setHrStep', val);
  },
  getCorrectAssetVersion(context, assetLinkIds) {
    return new Promise((resolve, reject) => {
      let client = new AssetsClient();
      resolve(client.getTemplatesInBulk(assetLinkIds).then((r) => {
          if (r.success) {
            context.commit('correctAssetVersions', r.data)
          }
        }),
        (err) => {
          reject(err);
          console.log(err)
        });
    })
  },
  addChecklistSuccessName(context, val) {
    context.commit('setChecklistSuccessName', val);
  },
  addChecklistSuccessAssociatedUsers(context, val) {
    context.commit('setChecklistSuccessAssociatedUsers', val);
  },
  deleteChecklistsItem(context, item) {
   // let newCheckList = testTaskTemplate.deleteTaskTemplate({checklistId: state.ChecklistsType.id, task: item});
   // let index = state.ChecklistsItem.tasks.findIndex(f => f.id === item.id);
   // state.ChecklistsItem.tasks.splice(index, 1);
   // this.commit('ChecklistsType', newCheckList); // Selected list template
   // this.commit('Checklists', state.ChecklistsItem.tasks); // List templates w/ tasks


    return new Promise(async (resolve, reject) => {

      let client = new TaskTemplateClient();

      resolve(await client.deleteTemplate(item.id).then((response) => {
        if(response.success){
          let index = state.ChecklistsItem.tasks.findIndex(f => f.id === item.id);
          state.ChecklistsItem.tasks.splice(index, 1);
          // this.commit('ChecklistsType', newCheckList); // Selected list template ? not sure if I need this...
          this.commit('Checklists', state.ChecklistsItem.tasks); // List templates w/ tasks
        }
      }, err => reject(err)))
    });
  },
  getTasksForTerminatedUser(context, employeeId){
    return new Promise(async(resolve) => {
      let client = new ChecklistClient();
      resolve(await client.getReclaimChecklist(employeeId).then((r) => {
        return r;
      }));
    })
  },
  StartTermination(context, employeeId){
    return new Promise(async(resolve) => {
      let client = new ChecklistClient();
      resolve(await client.startReclaim(employeeId).then((r) => {
        return r;
      }));
    })
  },
  StartCheckListPackage(context, checkListPackage){
    return new Promise(async (resolve, reject) => {
      let client = new ChecklistClient();
      resolve(await client.startCheckList(checkListPackage).then((r) => {
        if(r.messages){
          console.log('Errors Messages: ', r.messages);
        }
        return r;
      }));
    });
  }
};

const mutations = {
  ChecklistsTypes(state, types) {
    if(types && types.length > 0){
      sortType(types);
    }
    state.ChecklistsTypes = types;
  },
  ChecklistsType(state, val) {
    state.ChecklistsType = val;
  },
  Checklists(state, items) {
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
    state.Checklists = items;
  },
  ChecklistsItem(state, val) {
    state.ChecklistsItem = val;
  },
  AssetClassifications(state, t) {
    state.AssetClassifications = t;
  },
  AssetsFromAssets(state, data) {
    sortType(data);
    state.AssetsFromAssets = data;
  },
  DocumentsFromDocuments(state, data) {
    state.DocumentsFromDocuments = data;
    let temp = state.AssetsFromAssets.concat(state.DocumentsFromDocuments);
    sortType(temp);
    state.AssetsFromAssets = temp;
  },
  Assignees(state, t) {
    state.Assignees = t;
  },
  TypeOptions(state, types) {
    sortType(types);
    types.unshift({id: 0, name: 'Select a Checklist', disabled: true});
    state.TypeOptions = types;
  },
  ChecklistsTypeAddItemTemp(state, type) {
    state.ChecklistsTypes.push({
      id: '00000000-0000-0000-0000-000000000000', name: type.name, description: type.description
    });
  },
  updateChecklistsTypeName(state, val) {
    state.ChecklistsType.name = val.name;
    state.ChecklistsType.description = val.description;
  },
  updateSavedChecklistType(state, classification) {
    sortType(state.ChecklistsTypes);
    let index = state.ChecklistsTypes.findIndex(f => f.id === classification.id);
    // state.ChecklistsTypes.splice(index, 1);
    // state.ChecklistsTypes.splice(index, 0, classification);
    state.ChecklistsTypes[index] = classification;


  },
  updateSavedChecklistItemType(state, taskTemplate) {
    let index = state.ChecklistsItem.tasks ? state.ChecklistsItem.tasks.findIndex(f => f.id === taskTemplate.newTask.id) : -1;
    if (index >= 0) {
      state.ChecklistsItem.tasks.splice(index, 1);
    }
    state.ChecklistsItem.task = state.ChecklistsItem.task || [];

    state.ChecklistsItem.tasks.push(taskTemplate.newTask);
  },
  updateChecklistTypeId(state, swap){
    sortType(state.ChecklistsTypes);
    state.ChecklistsTypes.find(f => f.id === swap.ogid).id = swap.newid;
  },
  RemoveChecklistsClassification(state, classification) {
    const index = state.ChecklistsTypes.findIndex(f => f.id === classification.id);
    state.ChecklistsTypes.splice(index, 1);
  },
  ChecklistAddItemTemp(state, val) {
    state.Checklists.push(val);
  },
  Task(state, t) {
    state.Task = t;
  },

  CheckListsAssetsTypes(state, types) {
    state.CheckListsAssetsTypes = types;
  },
  CheckListsAssets(state, assets) {
    state.CheckListsAssets = assets;
  },
  CheckListsAssignees(state, assignees) {
    state.CheckListsAssignees = assignees;
  },
  //Deals with task adding
  AddTasksSelected(state, e) {
    state.TasksSelected.push(e);
  },
  RemoveTasksSelected(state, e) {
    let index = state.TasksSelected.findIndex(f => f.id === e.id);
    state.TasksSelected.splice(index, 1);
  },
  clearTasksSelected(state) {
    state.TasksSelected = [];
  },
  AddTotalTask(state, e) {
    if(e && e.length > 0){
      for (let i of e) {
        state.TotalTasks.push(i);
      }
    }
  },
  clearTotalTasks(state) {
    state.TotalTasks = [];
  },
  clearTaskInView(state) {
    state.TaskInView = [];
  },
  addTaskInView(state, e) {
    state.TaskInView.push(e);
  },
  removeTaskInView(state, e) {
    let index = state.TaskInView.findIndex(f => f.id === e.id);
    state.TaskInView.splice(index, 1);
  },
  addItem(state, item) {
    // state.Items.push(item);
  },
  AddTaskPaneShowing(state, val) {
    state.AddTaskPaneShowing = val;
  },

  pushExcludedObjectList(state, val) {
    state.ExcludedObjectList.push(val);
  },
  clearExcludedObjectList(state) {
    state.ExcludedObjectList = [];
  },
  setTaskInstancesFromAddTask(state, val) {
    state.TaskInstancesFromAddTask = val;
  },
  setCheckListTaskHolder(state, val) {
    state.CheckListTaskHolder = val;
  },
  clearTaskInstancesFromAddTask(state) {
    state.TaskInstancesFromAddTask = [];
  },
  clearCheckListTaskHolder(state) {
    state.CheckListTaskHolder = {};
  },
  setHrStep(state, val) {
    state.hrStep = val;
  },
  correctAssetVersions(state, val) {
    state.correctAssetVersions = val;
  },
  setChecklistSuccessName(state, val) {
    state.checklistSuccessName = val;
  },
  setChecklistSuccessAssociatedUsers(state, val) {
    state.checklistSuccessAssociatedUsers = val;
  },
  setTasksFromSelectedChecklist(state, val) {
    state.TasksFromSelectedChecklist = val;
  },
  addTasksFromSelectedChecklist(state, val) {
    state.TasksFromSelectedChecklist.push(val);
  },
  removeTasksFromSelectedChecklist(state, val) {
    //TODO, find index && splice the list of the removed task upon delete
  }
}

export default {
  state,
  getters,
  actions,
  mutations
};
