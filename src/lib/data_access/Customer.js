import Vue from 'vue';

//Customer API Client
export const CustomerAPIClient = {
    getCustomerHeader: function (customerIds){
        return new Promise((resolve, reject)=>{
            Vue.http.post('/profilefuze/CustomerHeader', customerIds ).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerContact: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/CustomerContact', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerProfile: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/CustomerProfile', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerDemographics: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/CustomerDemographics', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerInterest: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/CustomerInterests', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerSearches: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/CustomerSearches', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    },
    getCustomerVOIs: function (customerIds){
        return new Promise((resolve,reject)=>{
            Vue.http.post('/profilefuze/customervois', customerIds).then(function(data){
                resolve(data.data.Data);
            }).catch(function(error){
                reject(error)
            })
        })
    }


}
