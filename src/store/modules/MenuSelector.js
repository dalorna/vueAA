//import {runInDebugContext} from 'vm';

//import Vue from 'vue'
//import store from '../../store'

function initialState() {
  return {
    panelView: '2P',
    menuSelected: '',
    typeSelected: '',
    detailsView: '',
    overlappingPane: false,
    Modal: {
      showing: false,
      modalTitle: '',
      group: ''
    },
    tabSelected: '',
    pillSelected: '',
    menuTab: '',
    menuCategory: '',
  };
}

const state = initialState();

const getters = {
  panelView(state) {
    return state.panelView;
  },
  menuSelected(state) {
    return state.menuSelected;
  },
  typeSelected(state) {
    return state.typeSelected;
  },
  detailsView(state) {
    return state.detailsView;
  },
  overlappingPane(state) {
    return state.overlappingPane;
  },
  Modal(state) {
    return state.Modal;
  },
  tabSelected(state){
    return state.tabSelected;
  },
  pillSelected(state){
    return state.pillSelected;
  },
  menuTab(state){
    return state.menuTab;
  },
  menuCategory(state){
    return state.menuCategory;
  }
};

const actions = {
  setPanelView(context, panel) {
    context.commit('panelView', panel);
  },
  setMenuSelected(context, menu) {
    context.commit('menuSelected', menu);
    context.commit('typeSelected', '');
    context.commit('detailsView', '');
  },
  setTypeSelected(context, type) {
    context.commit('typeSelected', type);
    context.commit('detailsView', '');
  },
  setDetailsView(context, detail) {
    context.commit('detailsView', detail);
  },
  setOverlappingPane(context, bool) {
    context.commit('setOverlappingPane', bool);
  },
  openModal(context, modal) {
    context.commit('openModal', modal);
  },
  closeModal(context) {
    context.commit('closeModal');
  },
  setTabSelected(context, string){
    context.commit('tabSelected', string);
  },
  setPillSelected(context, string){
    context.commit('pillSelected', string);
  },
  setMenuTab(context, id){
    context.commit('menuTab', id);
  },
  setMenuCategory(context, id){
    context.commit('menuCategory', id);
  }
};

const mutations = {
  panelView(state, val) {
    state.panelView = val + 'P';
  },
  menuSelected(state, val) {
    state.menuSelected = val;
  },
  typeSelected(state, val) {
    state.typeSelected = val;
  },
  detailsView(state, val) {
    state.detailsView = val;
  },
  setOverlappingPane(state, val) {
    state.overlappingPane = val;
  },
  openModal(state, val) {
    state.Modal.modalTitle = val;
    state.Modal.showing = true;
  },
  closeModal(state) {
    let originalState = initialState();
    state.Modal = originalState.Modal;
  },
  tabSelected(state, val){
    state.tabSelected = val;
  },
  pillSelected(state, val){
    state.pillSelected = val;
  },
  menuTab(state, id){
    state.menuTab = id;
  },
  menuCategory(state, id){
    state.menuCategory = id;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
