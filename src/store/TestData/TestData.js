



var test = {
    getLocalCheckListTypes(){
    var types = [
        {id: '101', name: "Start New Hire Checklist", description: 'A new hire will be starting'},
        {id: '102', name: "Begin Termination Sequence", description: 'Some one is getting canned'}
        ];
    return types;
    },
    getLocalCheckList() {
    return [
        {id: '1', typeid: '101', tasks: [
            {id: '45h459oiyh', name: 'I-9 Form (with acceptable documents)', description: 'Employment Eligibility Verification - Department of Homeland Security U.S. Citizenship and Immigration Services', completionInterval: 3600},
            {id: '45h451wer3', name: 'W-4 Form', description: 'Complete From W-4 so that your employer can withhold the correct federal income tax from you pay. Consider completing a new From W-4 each year and when you personal of financial situation changes.', completionInterval: 9960},
            {id: '45h459iyua', name: 'Employee Red Flag Compliance', description: '', completionInterval: 10000},
            {id: '45h45lkiuh', name: 'Harassment Policy', description: '', completionInterval: 129600},
            {id: '45h45asxcf', name: 'Drug and Alcohol Abuse Consent', description: '', completionInterval: 124550},
            {id: '45h456nhjk', name: 'New Employee Information Form', description: 'Please fill out this form to the best of your knowledge', completionInterval: 17980},
            {id: '45h456sdfv', name: 'Employee Handbook', description: '', completionInterval: 172800},
            {id: '45h456hjnh', name: 'Salesperson Pay Plan (Only if in Sales)', description: '', completionInterval: 172800},
            {id: '45h456h8ik', name: 'Group Health Employee Enrollment Application', description: '', completionInterval: 86400},
            {id: '45h456h5tg', name: 'Highlights of your health care coverage', description: '', completionInterval: 86400},
            {id: '45h456h4rf', name: 'Dental Employee Change Form', description: '', completionInterval: 43200},
            {id: '45h456hedc', name: 'Dental Employee Waiver Form', description: '', completionInterval: 43200},
            {id: '45h456hhjk', name: 'Dental Benefit Summary', description: '', completionInterval: 43200},
            {id: '45h456hrty', name: 'Sign - Prescription Drug Coverage and Medicare', description: '',completionInterval: 43200},
            {id: '45h456hqwe', name: 'Sign - Section 125: Premium Election Form', description: '', completionInterval: 43200},
            {id: '45h456hjue', name: 'Sign - I, the employee have read and reviewed Section 125 plan',description: '',completionInterval: 43200},
            {id: '45h456h56d', name: 'Sign - Final Signature',description: 'By signing here I am acknowledging that I have received and understand everything I\'ve read from the forms listed above. I have kept a copy of all documents received. If there are any questions please contact the HR Department', completionInterval: 1800 }
        ]},
        {id: '2', typeid: '102', tasks: [
                {name: 'Fire Them 1', id: 'ftu875sdft', description: 'Here is a description', completionInterval: 1800},
                {name: 'Fire Them 2', id: '8iu2wsdfrt', description: 'Here is a another description', completionInterval: 1800},
                {name: 'Fire Them 3', id: 'u7nsdjsdfs', description: 'We to do something else here', completionInterval: 1800},
                {name: 'Fire Them 4', id: '6h4rtegt34', description: 'Something else will neeed to be done, so that we can do it',completionInterval: 1800},
                {name: 'Fire Them 5', id: 'k65yyt5ete', description: 'Don\'t for get to do this step', completionInterval: 1800},
                {name: 'Fire Them 6', id: '43terggdss', description: 'Another step to help get the person out the door',completionInterval: 1800},
                {name: 'Fire Them 7', id: '76yger5yy5', description: 'Slam door in the dudes face!', completionInterval: 1800}]}];
    },
    genRandomChecklistsTypes(){
    var assets = [];
    var types = testListTypeLibraryTest();
    var descriptions = testListTypeDescriptions();
    for(var i = 0; i < types.length; i++){
        assets.push({
            id: i + 1, name: types[i], description: descriptions[i]
        });
    }
    return assets;
},
    genRandomLists(type){
    var l = [];
    var stores = [];
    if(type != undefined){
        var fields = generateRequiredFields();
        var ass = testListLibraryList(type.id - 1);

        for(var i = 0; i < ass.length; i++){
            l.push({
                id: i + 1, name: ass[i], description: ass[i] + '::Description of the list', HelpText: ass[i] + '::This is an ID-10-T error.', TypeId: type.id, Type: type, Stores: stores, Fields: fields
            });
        }
    }
    return l;
},
    testListTypeDescriptions(){
    var descs = [];
    descs.push("This is the new hire list.");
    return descs;
},
    testListLibraryList(type){
    var v = [];
    if(type === 0){
        v.push("New Employee Information Form");
        v.push("I-9 Form (with acceptable documents)");
        v.push("W-4 Form");
        v.push("Employee Red Flag Compliance");
        v.push("Harassment Policy");
        v.push("Drug and Alcohol Abuse Consent");
        v.push("Employee Handbook");
        v.push("Salesperson Pay Plan (Only if in Sales)");
        v.push("Group Health Employee Enrollment Application");
        v.push("Highlights of your health care coverage");
        v.push("Dental Employee Change Form");
        v.push("Dental Employee Waiver Form");
        v.push("Dental Benefit Summary");
        v.push("Sign - Prescription Drug Coverage and Medicare");
        v.push("Sign - Section 125: Premium Election Form");
        v.push("Sign - I, the employee have read and reviewed Section 125 plan");
        v.push("Sign - Final Signature");

    }
    return v;
},
    rndStr(len) {
    let text = " "
    let chars = "abcdefghijklmnopqrstuvwxyz"

    for( let i=0; i < len; i++ ) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return text
},
    generateRequiredFields(){
    var fields = [];
    fields.push({ id: 1, name: 'Device Type', Type: 'Text', Mask: ''});
    fields.push({ id: 2, name: 'Device Make', Type: 'Text', Mask: ''});
    fields.push({ id: 3, name: 'Device Model', Type: 'Text', Mask: ''});
    fields.push({ id: 4, name: 'Device Tel Number', Type: 'Text', Mask: '(xxx) xxx - xxxx'});
    fields.push({ id: 5, name: 'Device Serial Number', Type: 'Text', Mask: ''});
    fields.push({ id: 6, name: 'Device Condition at Assignment', Type: 'Text', Mask: ''});
    return fields;
},
    getLocalCheckListById(id) {
        var list = [
            { id: '1', typeid: '101', tasks: [
                {id: '45h459oiyh', name: 'I-9 Form (with acceptable documents)', description: 'Employment Eligibility Verification - Department of Homeland Security U.S. Citizenship and Immigration Services', completionInterval: 3600},
                {Id: '45h451wer3', name: 'W-4 Form', description: 'Complete From W-4 so that your employer can withhold the correct federal income tax from you pay. Consider completing a new From W-4 each year and when you personal of financial situation changes.', completionInterval: 9960},
                {Id: '45h459iyua', name: 'Employee Red Flag Compliance', description: '', completionInterval: 10000},
                {Id: '45h45lkiuh', name: 'Harassment Policy', description: '', completionInterval: 129600},
                {Id: '45h45asxcf', name: 'Drug and Alcohol Abuse Consent', description: '', completionInterval: 124550},
                {Id: '45h456nhjk', name: 'New Employee Information Form', description: 'Please fill out this form to the best of your knowledge', completionInterval: 17980},
                {Id: '45h456sdfv', name: 'Employee Handbook', description: '', completionInterval: 172800},
                {Id: '45h456hjnh', name: 'Salesperson Pay Plan (Only if in Sales)', description: '', completionInterval: 172800},
                {Id: '45h456h8ik', name: 'Group Health Employee Enrollment Application', description: '', completionInterval: 86400},
                {Id: '45h456h5tg', name: 'Highlights of your health care coverage', description: '', completionInterval: 86400},
                {Id: '45h456h4rf', name: 'Dental Employee Change Form', description: '', completionInterval: 43200},
                {Id: '45h456hedc', name: 'Dental Employee Waiver Form', description: '', completionInterval: 43200},
                {Id: '45h456hhjk', name: 'Dental Benefit Summary', description: '', completionInterval: 43200},
                {Id: '45h456hrty', name: 'Sign - Prescription Drug Coverage and Medicare',description: '', completionInterval: 43200},
                {Id: '45h456hqwe', name: 'Sign - Section 125: Premium Election Form', description: '', completionInterval: 43200},
                {Id: '45h456hjue', name: 'Sign - I, the employee have read and reviewed Section 125 plan', description: '', completionInterval: 43200},
                {Id: '45h456h56d', name: 'Sign - Final Signature', description: 'By signing here I am acknowledging that I have received and understand everything I\'ve read from the forms listed above. I have kept a copy of all documents received. If there are any questions please contact the HR Department', completionInterval: 1800}
            ]},
            { Id: '2', typeid: '102', tasks: [
                    {name: 'Fire Them 1', Id: 'ftu875sdft', description: 'Here is a description', completionInterval: 1800},
                    {name: 'Fire Them 2', Id: '8iu2wsdfrt', description: 'Here is a another description', completionInterval: 1800},
                    {name: 'Fire Them 3', Id: 'u7nsdjsdfs', description: 'We to do something else here', completionInterval: 1800},
                    {name: 'Fire Them 4', Id: '6h4rtegt34', description: 'Something else will neeed to be done, so that we can do it', completionInterval: 1800},
                    {name: 'Fire Them 5', Id: 'k65yyt5ete', description: 'Don\'t for get to do this step', completionInterval: 1800},
                    {name: 'Fire Them 6', Id: '43terggdss', description: 'Another step to help get the person out the door', completionInterval: 1800},
                    {name: 'Fire Them 7', Id: '76yger5yy5', description: 'Slam door in the dudes face!', completionInterval: 1800}]}];

        var index = list.findIndex(f => f.typeid === id);
        return list.slice(index, index + 1)[0];
    },
    getLocalEmployees() {
    return [{ avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic1-w.png', name: 'Jane Goodman', title: 'Project Manager', id: '2v35g353' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic2-w.png', name: 'Monique Guerrero', title: 'Project Analyst', id: '4g5b45455' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Krystal Woods', title: 'Product Owner', id: 'verg344' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic1-w.png', name: 'Debbie Castillo', title: 'Sales Associate', id: 'g5vbg5yh4g' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic2-w.png', name: 'Bernice Chambers', title: 'HR Assistant', id: '245g54345' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Orlando Summers', title: 'HR Admin', id: '65bhg354' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic2-w.png', name: 'Sheri Berry', title: 'HR Assistant', id: '5yh4gb54' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Christie Barnett', title: 'HR Manager', id: 'hv34b545d' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic1-w.png', name: 'Sherri Cox', title: 'Receptionist', id: '6h45y6t54' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic4-m.png', name: 'Saul Page', title: 'Sales Associate', id: '65v5ytrth' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic5-m.png', name: 'Ernesto Shaw', title: 'Sales Associate', id: 'n54v53346' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic6-m.png', name: 'Juan Nunez', title: 'Sales Associate', id: 'n4536' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic5-m.png', name: 'Ian Herrera', title: 'Sales Associate', id: 'v3g4354gyh' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic6-m.png', name: 'Tim Berry', title: 'Sales Associate', id: '7vb53hr5' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Wendy Torres', title: 'HR Admin', id: '8jf64jf64kj' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic2-w.png', name: 'Nichole Cobb', title: 'HR Assistant', id: '94krf78fkjs' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Ian Graves', title: 'HR Manager', id: 'ltge397gve' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Elsa Farmer', title: 'HR Admin', id: '0j76f32sert' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic2-w.png', name: 'Inez Christensen', title: 'HR Assistant', id: '9n54swe6yg' },
        { avatarurl: 'static/assets/img/ProfilePics60px/ProfilePic3-w.png', name: 'Kevin Rogers', title: 'HR Manager', id: '8dckmedyeh' }];
},
    getLocalGroups() {
    return [{ avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'HR Administration', id: 'dg4sja65fd' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Sales and Marketing', id: '6ykjsdfyh8' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Parts and Technical', id: '0eryhn656y' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Mechanics', id: 'okhgfg547y' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Service', id: '90hhsd24s' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Finance', id: 'kdfhe3t3hu' },
        { avatarurl: 'static/assets/img/MainNavIcons/icon-groups-blue.svg', name: 'Cashiers', id: '0ih65hcse1' }];
},
    genRandomAssets(type){
    var assets = [];
    var stores = [];
    if(type != undefined){
        var fields = generateRequiredFields();
        var ass = testAssetLibraryList(type.id - 1);

        for(var i = 0; i < ass.length; i++){
            assets.push({
                id: i + 1, name: ass[i], description: ass[i] + '::Description of the asset', HelpText: ass[i] + '::This is an ID-10-T error.', TypeId: type.id, Type: type, Stores: stores, Fields: fields
            });
        }
    }
    return assets;
},
    testAssetTypeLibraryTest(){
    var types = ["Vendor Software", "Hardware", "Physical Access", "Vehicles"];
    return types;
    },
    testAssetTypeDescriptions(){
    var descs = [];
    descs.push("Life is short, smile while you still have teeth.");
    descs.push("A balanced diet means a cupcake in each hand.");
    descs.push("I used to think I was indecisive, but now I'm not too sure.");
    descs.push("I am not lazy, I am on energy saving mode.");
    descs.push("An apple a day keeps anyone away if you throw it hard enough.");
    return descs;
},
    testAssetLibraryList(type){
    var assets = [];
    if(type === 0){
        assets.push("Salesforce");
        assets.push("Outlook");
        assets.push("Amazon AWS");
        assets.push("Wordpress");
    }
    else if(type === 1){
        assets.push("Tablet");
        assets.push("Phone");
        assets.push("Computer");
        assets.push("Scanner");
        assets.push("Portable Printer");
    }
    else if(type === 2){
        assets.push("Building Keys");
        assets.push("Garage Badge");
        assets.push("HR Office Key");
        assets.push("Supply Closet Key");
        assets.push("Mailbox Key");
    }
    else if(type === 3){
        assets.push("GTI Key");
        assets.push("Demo SUV Key");
        assets.push("BMW");
    }
    return assets;
},
    rndStr(len) {
    let text = " "
    let chars = "abcdefghijklmnopqrstuvwxyz"

    for( let i=0; i < len; i++ ) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return text
},
    generateRequiredFields(){
    var fields = [];
    fields.push({ id: 1, name: 'Device Type', Type: 'Text', Mask: ''});
    fields.push({ id: 2, name: 'Device Make', Type: 'Text', Mask: ''});
    fields.push({ id: 3, name: 'Device Model', Type: 'Text', Mask: ''});
    fields.push({ id: 4, name: 'Device Tel Number', Type: 'Text', Mask: '(xxx) xxx - xxxx'});
    fields.push({ id: 5, name: 'Device Serial Number', Type: 'Text', Mask: ''});
    fields.push({ id: 6, name: 'Device Condition at Assignment', Type: 'Text', Mask: ''});
    return fields;
},
    genRandomDocTypes(){
    var docs = [];
    var types = testDocTypeLibraryTest();
    var descriptions = testDocTypeDescriptions();
    for(var i = 0; i < types.length; i++){
        docs.push({
            id: i + 1, name: types[i], description: descriptions[i]
        });
    }
    return docs;
},
    getRandomDocs(type){
        var docs = [];
        var stores = [];
        if(type != undefined){
            var fields = generateRequiredFields();
            var ass = testDocLibraryList(type.id - 1);

            for(var i = 0; i < ass.length; i++){
                docs.push({
                    id: i + 1, name: ass[i], description: ass[i] + '::Description of the asset', HelpText: ass[i] + '::This is an ID-10-T error.', TypeId: type.id, Type: type, Stores: stores, Fields: fields
                });
            }
        }
        return docs;
    },
    testDocTypeLibraryTest(){
        var types = ["Health Care", "Off Boarding", "Tax Forms", "Vendors"];
        return types;
    },
    testDocTypeDescriptions(){
        var descs = [];
        descs.push("Life is short, smile while you still have teeth.");
        descs.push("A balanced diet means a cupcake in each hand.");
        descs.push("I used to think I was indecisive, but now I'm not too sure.");
        descs.push("I am not lazy, I am on energy saving mode.");
        descs.push("An apple a day keeps anyone away if you throw it hard enough.");
        return descs;
    },
    testDocLibraryList(type){
        var docs = [];
        if(type === 0){
            docs.push("Beneficiaries");
            docs.push("Medical Claim");
            docs.push("Dental Claim");
            docs.push("Workmans Comp Claim");
        }
        else if(type === 1){
            docs.push("Termination");
            docs.push("Resignation Letter");
            docs.push("Cobra");
        }
        else if(type === 2){
            docs.push("I-9");
            docs.push("W-2");
            docs.push("10-99");
            docs.push("Kansas");
            docs.push("Missouri");
        }
        else if(type === 3){
            docs.push("Insane Asylum");
            docs.push("Outhouse");
            docs.push("Hot Dog");
        }
        return docs;
    },
    generateRequiredFields(){
        var fields = [];
        fields.push({ id: 1, name: 'Device Type', Type: 'Text', Mask: ''});
        fields.push({ id: 2, name: 'Device Make', Type: 'Text', Mask: ''});
        fields.push({ id: 3, name: 'Device Model', Type: 'Text', Mask: ''});
        fields.push({ id: 4, name: 'Device Tel Number', Type: 'Text', Mask: '(xxx) xxx - xxxx'});
        fields.push({ id: 5, name: 'Device Serial Number', Type: 'Text', Mask: ''});
        fields.push({ id: 6, name: 'Device Condition at Assignment', Type: 'Text', Mask: ''});
        return fields;
    },
}
  
export default test
