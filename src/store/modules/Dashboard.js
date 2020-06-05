import { DashboardClient, StatsClient, TasksClient, StatusDTO } from '../ManagementAPI';
import { sortType } from '../../utilities/custom.js'

function initialState() {
  return {
    EmployeeTaskList: [],
    EmployeeAssetList: [],
    EmployeeDocumentList: [],
    DashboardTotals: [],
    Asset: [],
    SelectedDocument: {},
    EndOfChecklist: {
      employee: {},
      isStep2: false,
      isAdHoc: false,
      isTerminating: false,
    },
    Reassign: {
      GroupId: null,
      StepInstanceId: null,
      IsReassign: false,
      CallInProgress: false,
    },
    AssetToReclaim: []
  };
}

const state = initialState();

const getters = {
  EmployeeTaskList(state) {
    return state.EmployeeTaskList;
  },
  EmployeeAssetList(state) {
    return state.EmployeeAssetList;
  },
  EmployeeDocumentList(state){
    return state.EmployeeDocumentList;
  },
  DashboardTotals(state) {
    return state.DashboardTotals;
  },
  Asset(state) {
    return state.Asset;
  },
  SelectedDocument(state) {
    return state.SelectedDocument;
  },
  EndOfChecklist(state){
    return state.EndOfChecklist;
  },
  Reassign(state){
    return state.Reassign;
  },
  AssetToReclaim(state){
    return state.AssetToReclaim;
  }
};
const actions = {
  getEmployeeTaskList(context) {
    return new Promise(async (resolve, reject) => { 
      let client = new DashboardClient();
      resolve(await client.getUsersWithStats().then((response) => {
        if(response.successful){
          sortType(response.data);
          context.commit('EmployeeTaskList', response.data);
          return response.successful;
        } else{
          reject(context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getEmployeeTaskList', response)))
        }
      }).catch(err => {
        context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getEmployeeTaskList', err));
      }));
    });
  },
  getDashboardTotals(context) {
    return new Promise(async(resolve, reject) => {
      let client = new StatsClient();
      resolve(await client.getStats().then((response) => {
        if(response.successful){
          context.commit('DashboardTotals', response.data);
        } else {
          reject(context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getDashboardTotals', response)));
        }
      }).catch(err => {
        context.dispatch('addErrorFromAPI', context.rootState.App.getErrorMessage('getDashboardTotals', err));
      }));
    });
  },
  getEmployeeAssetList(context) {
    return new Promise(async (resolve, reject) => { 
      let client = new DashboardClient();
      resolve(await client.getUsersWithAssets().then((response) => {
        sortType(response.data);
        context.commit('EmployeeAssetList', response.data);
        return response.successful;
      }),
      (err) => {
          reject(err);
        });
    });
  },
  getEmployeeDocumentList(context) {
    return false;
    
    //not up yet
    // return new Promise(async (resolve, reject) => { 
    //   let client = new DashboardClient();
    //   resolve(await client.getUsersWithDocuments().then((response) => {
    //     context.commit('EmployeeDocumentList', response.data);
    //     return response.successful;
    //   }),
    //   (err) => {
    //       reject(err);
    //     });
    // });
  },
  hrStatusChange(context, data){
    return new Promise(async(resolve) => {
      let client = new TasksClient();
      let statusDto = new StatusDTO();
      statusDto.taskId = data.task.id;
      statusDto.claimUserId = data.user[0].id;
      statusDto.status = data.status;
      resolve(await client.statusChange(statusDto).then((r) => {
        if(r.success){
          context.dispatch('changeTaskInList', {task: data.task, user: data.user, status: data.status});          
        }
        return r.success;
      }));
    });
  },
  changeTaskInList(context, data){
    let empTaskIndex = context.getters.EmployeeTaskList.findIndex(f => f.tasks.findIndex(i => i.id === data.task.id) >= 0);
    if(empTaskIndex >= 0){
      let empTask = context.getters.EmployeeTaskList.slice(empTaskIndex, empTaskIndex + 1)[0];
      let taskIndex = empTask.tasks.findIndex(f => f.id === data.task.id);
      if (taskIndex >=0 && empTask){
        context.getters.EmployeeTaskList.splice(empTaskIndex, 1);
        empTask.tasks[taskIndex].claimUser.id = data.user[0].id;
        empTask.tasks[taskIndex].claimUser.key = data.user[0].key;
        empTask.tasks[taskIndex].claimUser.name = data.user[0].name;
        empTask.tasks[taskIndex].status = data.status;
        if(data.status === 7 || data.status === 6){
          empTask.tasks[taskIndex].overDue =  false;
        }
        empTask.completedTasks = empTask.tasks.filter(f => f.status === 6).length;
        empTask.overdueTasks = empTask.tasks.filter(f => f.status === 4 || f.overDue).length;
        empTask.newTasks = empTask.tasks.filter(f => f.status === 2).length;
        empTask.tasksinProgress = empTask.tasks.filter(f => f.status === 3).length;
        empTask.unclaimedTasks = empTask.tasks.filter(f => f.status === 1).length;
        context.getters.EmployeeTaskList.splice(empTaskIndex, 0, empTask);
        context.dispatch('getDashboardTotals');
      }
    }
  },
  setAsset(context, asset) {
    context.commit('Asset', asset);
  },
  setSelectedDocument(context, document) {
    context.commit('SelectedDocument', document);
  },
  setEndOfChecklist(context, data){
    context.commit('setEndOfChecklist', data);
  },
  clearChecklistSetup(context){
    context.commit('clearChecklistSetup');
  },
  clearReassignModalData(context){
    context.commit('clearReassignModalData');
  },

  // this will all change
  // getTasksForTermination(context, tasks){
    // return new Promise(async(resolve, reject) => {
    //   let assets = await tasks.map((t) => {
    //     return new Promise(async (resolve, reject) => {
    //       resolve(await context.dispatch('getAssetResource', t.id).then((r) => {
    //         return r;
    //         }, err => reject(err)))
    //     });
    //   });

    //   return resolve(assets);
    // })
  // },
  // getAssetResource(context, id){
  //   return new Promise(async(resolve, reject) => {
  //     const client = new TasksClient();
  //     resolve(await client.getTask(id).then((r) => {
  //       context.commit('pushAssetToReclaim', r.data);
  //     },err => reject(err)));
  //   })
  // },


  //dont think this is needed because its on checklists.js
  // getAssetTemplates(context, templateIds){
  //   return new Promise(async(resolve, reject) => {
  //     const assetClient = new AssetsClient();
  //     resolve(await assetClient.getTemplatesInBulk(templateIds).then((response) => {
  //       return response.data;
  //     }), err => reject(err))
  //   })
  // },
  clearAssetToReclaim(context){
    context.commit('clearAssetToReclaim');
  }
};

const mutations = {
  EmployeeTaskList(state, employees) {
    state.EmployeeTaskList = employees;
  },
  EmployeeAssetList(state, employees) {
    state.EmployeeAssetList = employees;
  },
  EmployeeDocumentList(state, employees){
    state.EmployeeDocumentList = employees;
  },
  DashboardTotals(state, dashboardTotals) {
    state.DashboardTotals = dashboardTotals;
  },
  Asset(state, asset) {
    state.Asset = asset;
  },   
  SelectedDocument(state, document) {
    state.SelectedDocument = document;
  },   
  setEndOfChecklist(state, data){
    state.EndOfChecklist.employee = data.employee;
    state.EndOfChecklist.isStep2 = true;

    state.EndOfChecklist.isAdHoc = data.isAdHoc;
    state.EndOfChecklist.isTerminating = data.isTerminating;
  },
  clearChecklistSetup(state){
    let originalState = initialState();
    state.EndOfChecklist = originalState.EndOfChecklist;
  },
  clearReassignModalData(state){
    let originalState = initialState();
    state.Reassign = originalState.Reassign;
  },
  clearAssetToReclaim(state) {
    state.AssetToReclaim = [];
  },
  pushAssetToReclaim(state, val){
    state.AssetToReclaim.push(val);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

