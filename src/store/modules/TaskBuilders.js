

function initialState() {
    return {
        Key: '',
        deleteType: '',
        ClassificationDetailType: '',
        showModal: false,
    };
  }

const state = initialState();

const getters = {
    Key(state){
        return state.Key;
    },
    deleteType(state){
        return state.deleteType;
    },
    ClassificationDetailType(state){
        return state.ClassificationDetailType;
    },
    showModal(state){
        return state.showModal;
    }
}
const actions = {
    setClassificationDetailType(context, string){
        context.commit('ClassificationDetailType', string);
    },
    setDeleteType(context, val){
        context.commit('deleteType', val);
    },
    setKey(context, val){
        context.commit('Key', val);
    },
    showModal(context, val){
        context.commit('showModal', val);
    }
}

const mutations = {
    ClassificationDetailType(state, string){
        state.ClassificationDetailType = string;
    },
    deleteType(state, val){
        state.deleteType = val;
    },
    Key(state, val){
        state.Key = val;
    },
    showModal(context, val){
        state.showModal = val;
    }
}


export default {
    state,
    getters,
    actions,
    mutations
  };