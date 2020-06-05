



export var testCheckListTemplate = {
  getCheckListTemplates() {

    let temp = CheckListTemplatesAsRecord.slice();

    return temp.map(m => { return { id: m.id, category: m.category, name: m.name, description: m.description,  status: m.status }});
  },
  getCheckListTemplatesWithTasks() {

    let temp = CheckListTemplatesAsRecord.slice();
    let tasks = taskTemplatesAsRecord.slice(0);

    let returnList = [];
    let tempTaskList = [];

    for(let i = 0; i < temp.length; i++){

      let taskTemp = tasks.filter(f => temp[i].tasks.includes(f.id));

      let tasktempTemp = taskTemp.slice();

      let tempC = {};
      for(var prop in temp[i]){
        if(temp[i].hasOwnProperty(prop)){
          tempC[prop] = temp[i][prop];
        }
      }

      tempC.tasks = tasktempTemp;
      returnList.push(tempC);
    }

    return returnList;
  },
  saveCheckListTemplate(checklistTemplate) {
    let index = CheckListTemplatesAsRecord.findIndex(f => f.id === checklistTemplate.id);

    if(index >= 0){
      CheckListTemplatesAsRecord[index].name = checklistTemplate.name;
      CheckListTemplatesAsRecord[index].description = checklistTemplate.description;
    } else {
      checklistTemplate.id = guid();
      CheckListTemplatesAsRecord.push(checklistTemplate);
    }
  },
  deleteChecklistTemplate(checkListTemplate){
    let index = CheckListTemplatesAsRecord.findIndex(f => f.id === checkListTemplate.id);
    CheckListTemplatesAsRecord.splice(index, 1);
  },
  getTerminationTaskListByExternalReference(referenceId){
    let reclaimObjectsTemp = reclaimedTasksByReference.slice();
    let reclaimObject = reclaimObjectsTemp.find(f => f.id === referenceId);
    return reclaimObject.tasks.slice();
  }
};
export var testTaskTemplate = {
  getCheckListWithTasks(id){
    let checklistTemplate = CheckListTemplatesAsRecord.find(f => f.id === id).tasks.slice();
    let temp = taskTemplatesAsRecord.slice(0, taskTemplatesAsRecord.length);
    let retTemplates = temp.filter(f => checklistTemplate.includes(f.id));

    checklistTemplate.tasks = [];
    for(let i = 0; i < retTemplates.length; i++ ){
      checklistTemplate.tasks.push(retTemplates[i]);
    }

    return checklistTemplate;
  },
  saveTaskTemplate(taskTemplateWithChecklistId) {
    let index = taskTemplatesAsRecord.findIndex(f => f.id === taskTemplateWithChecklistId.task.id);

    if(index >= 0){
      taskTemplatesAsRecord.splice(index, 1);
      taskTemplatesAsRecord.splice(index, 0, taskTemplateWithChecklistId.task);
    } else {
      taskTemplateWithChecklistId.task.id = guid();
      taskTemplatesAsRecord.push(taskTemplateWithChecklistId.task);

      let checkList = CheckListTemplatesAsRecord.find(f => f.id === taskTemplateWithChecklistId.checklistId);
      checkList.tasks.push(taskTemplateWithChecklistId.task.id);
    }
  },
  deleteTaskTemplate(taskTemplateWithChecklistId) {
    let index = taskTemplatesAsRecord.findIndex(f => f.id === taskTemplateWithChecklistId.task.id);
    let checkList = CheckListTemplatesAsRecord.find(f => f.id === taskTemplateWithChecklistId.checklistId);

    if(index >= 0){
      taskTemplatesAsRecord.splice(index, 1);
      let taskIndex = checkList.tasks.findIndex(i => i === taskTemplateWithChecklistId.task.id);
      checkList.tasks.splice(taskIndex, 1);
    }

    return checkList;
  }
};
export var testAssetTemplate = {
  getAllAssets(){

    let temp = assetTemplateAsRecord.slice();

    return temp.map(m => {return {id: m.id, name: m.name}});
  },
  getAssetsById(id){
    let temp = assetTemplateAsRecord.slice();

    return temp.find(f => f.id === id);
  }
};
let CheckListTemplatesAsRecord = [
  {id: '00000000-0000-0000-0000-000000000001', category: 0, name: 'First Category', description: 'First Category Test',
    tasks: ['00000000-0000-0000-0000-100000000001','00000000-0000-0000-0000-100000000002','00000000-0000-0000-0000-100000000003'], status: 1},
  {id: '00000000-0000-0000-0000-000000000002', category: 0, name: 'Second Category', description: 'Second Category Test',
    tasks: ['00000000-0000-0000-0000-100000000004', '00000000-0000-0000-0000-100000000005', '00000000-0000-0000-0000-100000000006'],status: 1},
  {id: '00000000-0000-0000-0000-000000000003', category: 0, name: 'Third Category', description: 'Third Category Test',
    tasks: ['00000000-0000-0000-0000-100000000007'],status: 1}
];
let taskTemplatesAsRecord = [
  {id: '00000000-0000-0000-0000-100000000001', name: 'Task 1', description: 'Task 1 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000002', name: 'Task 2', description: 'Task 2 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000003', name: 'Task 3', description: 'Task 3 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000004', name: 'Task 4', description: 'Task 4 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000005', name: 'Task 5', description: 'Task 5 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000006', name: 'Task 6', description: 'Task 6 Test', assets: [], assignees: [], status: 1},
  {id: '00000000-0000-0000-0000-100000000007', name: 'Task 7', description: 'Task 7 Test', assets: [], assignees: [], status: 1}
];
let assetTemplateAsRecord = [
  {id: '00000000-0000-0000-1000-100000000001', name: 'Asset 1', description: 'Asset 1 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000002', name: 'Asset 2', description: 'Asset 2 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000003', name: 'Asset 3', description: 'Asset 3 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000004', name: 'Asset 4', description: 'Asset 4 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000005', name: 'Asset 5', description: 'Asset 5 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000006', name: 'Asset 6', description: 'Asset 6 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000007', name: 'Asset 7', description: 'Asset 7 Test', properties: {}, data: {}, status: 1},
  {id: '00000000-0000-0000-1000-100000000008', name: 'Asset 8', description: 'Asset 8 Test', properties: {}, data: {}, status: 1}
];
let externalReferenceAsRecord = [{id: 'c4ac17ef-92bd-4796-90da-c0d04fa33cef', name: 'AAA GUY'},
  {id: '89170fbb-2025-423a-8868-52b1f84135c5', name: 'Aaron Fauto'},
  {id: 'fa48d9fe-2031-49f8-b956-10d9b896014f', name: 'Abby Meachum'}
];
let reclaimedTasksByReference = [{id: 'c4ac17ef-92bd-4796-90da-c0d04fa33cef',
  tasks: [
    {id: '10000000-0000-0000-0000-000000000001',name: 'Reclaim: LapTop', description: 'Serial Number: 123-4323-23'},
    {id: '10000000-0000-0000-0000-000000000002',name: 'Reclaim: Phone', description: 'Serial Number: 1235665430'},
    {id: '10000000-0000-0000-0000-000000000003',name: 'Reclaim: User Email', description: 'Email: ag.aa.com'},
    {id: '10000000-0000-0000-0000-000000000004',name: 'Reclaim: Id Badge', description: 'Id No: 1234'}
  ]},
  {id: '89170fbb-2025-423a-8868-52b1f84135c5', tasks: [
      {id: '10000000-0000-0000-0000-000000000005',name: 'Reclaim: LapTop', description: 'Model Number: 123-8777-23'},
      {id: '10000000-0000-0000-0000-000000000006',name: 'Reclaim: Phone', description: 'Serial Number: 1236876756'},
      {id: '10000000-0000-0000-0000-000000000007',name: 'Reclaim: User Email', description: 'Email: af.aa.com'},
      {id: '10000000-0000-0000-0000-000000000008',name: 'Reclaim: Id Badge', description: 'Id No: 1235'}
    ]},
  {id: 'fa48d9fe-2031-49f8-b956-10d9b896014f', tasks: [
      {id: '10000000-0000-0000-0000-000000000009',name: 'Reclaim: LapTop', description: 'Model Number: 123-4567-23'},
      {id: '10000000-0000-0000-0000-0000000000010',name: 'Reclaim: Phone', description: 'Serial Number: 1239876550'},
      {id: '10000000-0000-0000-0000-0000000000011',name: 'Reclaim: User Email', description: 'Email: am.aa.com'},
      {id: '10000000-0000-0000-0000-0000000000012',name: 'Reclaim: Id Badge', description: 'Id No: 1236'}
    ]}];
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

















