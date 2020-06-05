module.exports = {
    NotificationType: {
        MessageResponse: 1, //supported
        Article: 2,
        Gaming: 3,
        Gaming_leaderChange: 4,
        PendingUser: 5,
        ApprovedUser: 6,
        DeviceTokenCheck: 9,
        WorkflowMessageActionStatus: 10,
        GroupResponse: 11, //supported
        GroupCreatedResponse: 12, //supported
        GroupUpdatedResponse: 13, //supported
        GroupDeletedResponse: 14, //supported
        GroupAddUserResponse: 15, //supported
        GroupRemoveUserResponse: 16, //supported
        GroupFavoriteResponse: 17, //supported
        SystemResponse: 18,
        AccountUserResponse: 19, //supported
        UserResponse: 20,
        SystemWideResponse: 21,
        SystemWideUnavailable: 22,
        SystemWideLogout: 23,
        UserNotification: 24, //supported
        StoreNotification: 25,
        GroupMessageResponse: 26,
        ViewStoreUpdate: 27
    },
    ChannelType: {
        Unknown: 0,
        Control: 5,
        Direct: 10,
        Group: 20,
        Request: 30
    },
    StepInstanceStatus: {
        NotSet: 0,
        New: 10,
        Ready: 50,
        InProgress: 100,
        Overdue: 150,
        Paused: 500,
        Cancelled: 900,
        Success: 1000,
        CanClaimStep: 246,
        CanCompleteStep: 246
    },
    GroupType: {
        Unknown: 0,
        SystemAccount: 1, //Channels (Groups)
        SystemStore: 2, //Channels (Groups)
        AdHoc: 3, //Channels (Groups)
        Team: 4, //Channels (Groups)
        DirectMessage: 5, //Messages
        CrmCustomer: 6, //Channels (Groups)
        Request: 7, //Processes
        CustomAccount: 8, //Channels (Groups)
        CustomStore: 9 //Channels (Groups)
    },
    GroupMessagingType: {
        None: 0,
        Broadcast: 10,
        Interactive: 20
    },
    MessageType: {
        Unknown: 0,
        User: 10,
        System: 20
    },
    WorkflowStepAction: {
        NotSet: 0,
        DeclineRequest: 5,
        Claim: 10,
        Complete: 20,
        TakeSurvey: 30,
        TakeForm: 40,
        CompleteYes: 50,
        CompleteNo: 60,
        Assign: 70,
        Reassign: 80
    },
    WorkflowStepType: {
        NotSet: 0,
        Task: 10,
        Form: 20,
        Survey: 30,
        File: 40,
        Condition: 50,
        Integration: 60
    },
    PayloadType: {
        Error: 999999,
        NotSet: 0,
        Url: 1,
        Inventory: 2,
        Customer: 3,
        AutoAlertNotification: 4,
        Giphy: 5,
        Form: 6,
        Json: 7
    },
    CoreUserStatus: {
        Active: 1,
        Inactive: 2,
        Pending: 3
    },
    UserAvailability: {
        Available: 10,
        Busy: 20,
        // "Not Available": 100,
        NotAvailable: 100
    },
    DataMiningAlertBlock: {
        NONE: 0x00000000,
        A: 0x00000001, // Alert
        F: 0x00000002, // Flex Alert
        S: 0x00000004, // Service Alert
        P: 0x00000008, // Service Appointment
        M: 0x00000010, // Mileage Alert
        W: 0x00000020, // Warranty Alert
        C: 0x00000040, // Contract End Alert
        I: 0x00000080, // In-Market Alert
        E: 0x00000100 // In-Market Engaged Alert
    },
    FeatureFlags: {
        Calendar: 1, //fuzecast
        Reviews: 2, //fuzecast
        Comparisons: 4, //fuzecast
        Articles: 8, //fuzecast
        Messages: 16, //fuzecast
        Pando: 32, //fuzecast
        ProfileFuze: 64, //fuzecast
        Gamification: 128, //fuzecast
        Reports: 256, //fuzecast
        PandoLite: 512 //fuzecast
    },
    InboxFilterCategory: {
        Inbox: 'Inbox',
        UnreadMessages: 'Inbox: Unread Messages',
        New: 'Inbox: New',
        InProgress: 'Inbox: In Progress',
        Overdue: 'Inbox: Overdue',
        Favorites: 'Favorites',
        Messages: 'Messages',
        //Channels: 'Channels', // NOTE: changed to "Groups"
        Groups: 'Groups',
        Processes: 'Processes',
        Tasks: 'Tasks'
    },
    // SupportedFileUploadFormats: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "csv", "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "rtf"],
    SupportedFilePreviewFormats: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "jfif", "txt"],
    FileFormatIcons: ["csv", "doc", "docx", "eml", "form", "html", "pdf", "ppt", "pptx", "rtf", "tif", "tiff", "txt", "xls", "xlsx"],
    Colors: ["304976", "6CBE6A", "68A4D6", "68CCE4", "95989A", "9088BF", "E94D68", "EE8761", "F8BE6B"],
    DefaultAvatars: {
        PandoBot: 'static/assets/img/pando_bot_avatar.png',
        Channel: 'static/assets/img/channel_avatar.png'
    },
    WorkflowInstanceStatus: {
        NotSet: 0,
        New: 10,
        InProgress: 100,
        Overdue: 150,
        Cancelled: 900,
        AutoCancelled: 901,
        Success: 1000
        // CanClaim: New | InProgress | Overdue,
        // CanComplete: InProgress | Overdue
    },
    FormInputTypes: [{
            Name: 'SectionHeader',
            Id: 0
        },
        {
            Name: 'Boolean',
            Id: 1
        },
        {
            Name: 'ShortAnswer',
            Id: 2
        },
        {
            Name: 'LongAnswer',
            Id: 3
        },
        {
            Name: 'SingleSelectDropDown',
            Id: 4
        },
        {
            Name: 'MultiSelection',
            Id: 5
        },
        {
            Name: 'Date',
            Id: 6
        },
        {
            Name: 'Time',
            Id: 7
        },
        {
            Name: 'SingleSelectRadio',
            Id: 8
        },
        {
            Name: 'LinearScale',
            Id: 9
        },
        {
            Name: 'ShortName',
            Id: 10
        },
        {
            Name: 'FullName',
            Id: 11
        },
        {
            Name: 'Address',
            Id: 12
        }
    ],
    HtmlEscapeCodes: [{
            Symbol: /&/g,
            EscapeCode: "&amp;"
        },
        {
            Symbol: /"/g,
            EscapeCode: "&quot;"
        },
        {
            Symbol: /'/g,
            EscapeCode: "&#039;"
        },
        {
            Symbol: /</g,
            EscapeCode: "&lt;"
        },
        {
            Symbol: />/g,
            EscapeCode: "&gt;"
        }
    ],
    DayOfWeek: {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    },
    KeyCodes: {
        Enter: 13,
        UpArrow: 38,
        DownArrow: 40
    },
    Mentions: {
        NotSet: 0,
        User: 1,
        Channel: 2,
        Reserved: 3
    },
    NotifyLevel: {
        All: 1,
        MentionsOnly: 2,
        None: 3
    },
    UserWorkScheduleType: {
        NotScheduled: 1,
        Scheduled: 10,
        TimeOff: 20,
        Sick: 30,
        Training: 40,
        Other: 100
    },
    EpochTicks: 621355968000000000,
    OnboardingTaskStatus: {
        NotStarted: 1,
        InProgress: 2,
        Waiting: 3,
        PendingApproval: 4,
        Rejected: 5,
        InReview: 6,
        NotCompleted: 9,
        Complete: 10
    },
    OnboardingTaskType: {
        Vendor: 1,
        Document: 2,
        Education: 3,
        PhysicalAsset: 4
    },
    LookupType:{
        Document: 1,
        Education: 2,
        PhysicalAsset: 3
    },
    EmployeeStatus:{
        NewHire: 1,
        Employee: 2,
        InActive: 3
      },
   
    TaskStatus: {
        Unclaimed: 1,
        New: 2,
        InProgress: 3,
        Overdue: 4,
        Cancelled: 5,
        Completed: 6,
        Deleted: 7,
      },
    
    AssetKind: {
        InActive: 0,
        Active: 1,
      }
}