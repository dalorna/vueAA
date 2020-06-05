export var assetsManager = {
    //ASSETS
    getCategories(){ 
        var categories = []
        categories.push({id: '1234', libraryType: 0, name: 'category 1', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})
        categories.push({id: '1235', libraryType: 0, name: 'category 2', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})
        categories.push({id: '1236', libraryType: 0, name: 'category 3', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})
        categories.push({id: '1237', libraryType: 0, name: 'category 4', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})
        categories.push({id: '1238', libraryType: 0, name: 'category 5', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})
        categories.push({id: '1239', libraryType: 0, name: 'category 5', description: 'here is my description', status: 0, createDate: 'TimeStamp', createUserId: '', lastUpdateDate: 'TimeStamp', lastUpdateUserId: ''})

        return categories;
    },
    getTemplatesByCategoryId(id){ 
        var assets = [];
        assets.push({id: '1', libraryType: 0, categoryId: '1234', name: 'asset 1', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '2', libraryType: 0, categoryId: '1234', name: 'asset 2', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '3', libraryType: 0, categoryId: '1235', name: 'asset 3', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '4', libraryType: 0, categoryId: '1235', name: 'asset 4', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '5', libraryType: 0, categoryId: '1236', name: 'asset 5', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '6', libraryType: 0, categoryId: '1236', name: 'asset 6', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '7', libraryType: 0, categoryId: '1237', name: 'asset 7', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '8', libraryType: 0, categoryId: '1237', name: 'asset 8', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '9', libraryType: 0, categoryId: '1238', name: 'asset 9', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '10', libraryType: 0, categoryId: '1238', name: 'asset 10', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
        assets.push({id: '11', libraryType: 0, categoryId: '1238', name: 'asset 11', description: 'temp desc', status: 0, createDate: 'TimeStamp', createUserId: '', updateDate: 'TimeStamp', updateUserID: '', properties: []})
    
        if(id){
            var tempArr = [];
            assets.forEach(function(value) {
                if(value.categoryId === id){
                    tempArr.push(value);
                }
            });
            return tempArr;
        }
        return assets;
    },
    saveAsset(obj){

    }
}