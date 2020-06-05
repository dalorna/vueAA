//task dashboard
export var taskdashboard = {
    getDashboardTotals(){
        let totals = {
            unclaimedTasksCount: 25,
            newTaskCount: 76,
            inProgressCount: 54,
            overdueTasksCount: 143,
            completedTasksCount: 97,
            newHiresCount: 252,
            currentEmployeesCount: 728,
            tasksCount: 5,
            currentEmployeesCount: 560, 
            inActiveEmployeesCount: 163,
        }
        return totals;
    },
    getEmployeeTaskList(){
        var employeeList = [];
        employeeList.push({   
            id: '983107a8-ebd2-06a9-7245-0ef3042b9df5', 
            name: 'Aaron Hoyt', 
            title: null, 
            location: null, 
            unclaimedTasks: 0, 
            newTasks: 0, 
            tasksinProgress: 1, 
            overdueTasks: 0, 
            completedTasks: 0, 
            employeeStatus: 2, 
            asignee: '', 
            tasks: [
                {
                    id: '3ff68473-bbf8-4ab5-90636-2b42a2a4591e', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a189e2', 
                    name: 'Aarons 2', 
                    description: 'this task is the first to test and its a great task because i made it myself and i am doing a really good job at this i really hope so thx', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 3, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1b', 
                                    value: 'sweets', 
                                    dataType: 11,
                                    name: 'cinco', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                        }
                    ]
                }
            ]
        });
        employeeList.push({   
            id: '983107a8-ebd2-06a9-7245-0ef3042b9df6', 
            name: 'Sylvia Finger', 
            title: null, 
            location: null, 
            unclaimedTasks: 0, 
            newTasks: 0, 
            tasksinProgress: 1, 
            overdueTasks: 0, 
            completedTasks: 0, 
            employeeStatus: 2, 
            asignee: '', 
            tasks: [
                {
                    id: '3ff68473-bbf8-4ab5-9066-2b4f2a2a4591f', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a189e2', 
                    name: 'Sylvias Task', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 3, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 4, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1v', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                            attachments: [
                                {
                                    id: 0,
                                    typeid: 0,
                                    itemid: 0,
                                    providerid: 0,
                                    fullpath: '',
                                    originalFileName: '',
                                    originalFileExtension: '',
                                    createDate: 'timestamp',
                                    createUserId: '',
                                    updateDate: 'timestamp',
                                    updateUserId: '',
    
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        employeeList.push({
            id: '983107a8-ebd2-06a9-7245-0ef3042b9df7', 
            name: 'aaa bbb', 
            title: null, 
            location: null, 
            unclaimedTasks: 0, 
            newTasks: 0, 
            tasksinProgress: 1, 
            overdueTasks: 0, 
            completedTasks: 0, 
            employeeStatus: 2, 
            asignee: '', 
            tasks: [
                {
                    id: '3ff68473-bbf8-4ab5-906e6-2b42a2a4591g', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a1892', 
                    name: 'aaas Task', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 3, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1w', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                            attachments: [
                                {
                                    id: 0,
                                    typeid: 0,
                                    itemid: 0,
                                    providerid: 0,
                                    fullpath: '',
                                    originalFileName: '',
                                    originalFileExtension: '',
                                    createDate: 'timestamp',
                                    createUserId: '',
                                    updateDate: 'timestamp',
                                    updateUserId: '',
    
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        employeeList.push({
            id: '983107a8-ebd2-06a9-7245-0ef3042b9df8', 
            name: 'Sophia Smith', 
            title: null, 
            location: null, 
            unclaimedTasks: 0, 
            newTasks: 4, 
            tasksinProgress: 0, 
            overdueTasks: 0, 
            completedTasks: 0, 
            employeeStatus: 2, 
            asignee: '', 
            tasks: [
                {
                    id: '3ff68473-bbf8-4ab5-9066-2b42a2a4591zz', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a1892', 
                    name: 'Task 2', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 2, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1w', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                        }
                    ]
                },
                {
                    id: '3ff68473-bbf8-4ab5-9066-2db42a2a4591h', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a1892', 
                    name: 'Task 3', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 2, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1w', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                        }
                    ]
                },
                {
                    id: '3ff68473-bbf8-4ab5-9066-2b4f2a2a4591j', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a1892', 
                    name: 'Task 4', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 2, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1w', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                        }
                    ]
                },
                {
                    id: '3ff68473-bbf8-4ab5-9066-2qb42a2a4591k', 
                    templateid: '45d2165d-d4fd-4d87-bb1c-75d0a9a1892', 
                    name: 'Task 5', 
                    description: '', 
                    claimuser: {}, 
                    claimUserId: '2691f7ce-11f3-4e72-9429-428adaf0db36', 
                    claimUserName: 'Sylvia Finger', 
                    startDate: 'timestamp', 
                    endDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    dueDate: 'Thu Dec 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    status: 2, 
                    createdDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    createUserId: null, 
                    accountId: '64d3ad7a-892d-9c0c-21be-709d74e1f6fe', 
                    accountPlatformId: '93b6126e-0c80-474d-4815-27f4fa32c3f4', 
                    parentId: '5ae0081a-8c96-4dd2-b370-8bfa5d4fdf5a', 
                    overDue: false, 
                    version: 1, 
                    lastUpdateDate: 'Tue Nov 06 2018 14:33:59 GMT-0600 (Central Standard Time)', 
                    lastUpdateUserId: null, 
                    assignees: [], 
                    assets: [
                        {
                            id: 0, 
                            client: 0, 
                            templateid: 'guid', 
                            libraryType: 1, 
                            categoryId: 0, 
                            name: '2 Prop', 
                            description: 'test2', 
                            status: 0, 
                            createdate: 'timestamp', 
                            createUserId: '', 
                            updatedate: 'timestamp', 
                            updateUserId: '', 
                            properties: [
                                {
                                    id: '14bd81c9-1e67-4923-a97d-ad01d031ad1w', 
                                    value: null, 
                                    name: 'prop 1', 
                                    description: '1', 
                                    control: 11, 
                                    controlMetadata: 
                                        { 
                                        controlComponent: 'EncryptedPropertyControl', 
                                        uiControl: 'v2'
                                        }    
                                } 
                            ],
                        }
                    ]
                },
            ]
        });
        return employeeList;
    }
    
    
}



//-----------------------------------------------------------------------------------------
//asset dashboard