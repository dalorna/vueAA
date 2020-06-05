import test from '../TestData/TestData';
import { PersonaClient } from '../ManagementAPI';

function initialState() {
  return {
    Employees: [],
    Groups: [],
    EmployeesSelected: [],
    AssigneeEmployees: []
  };
}

const state = initialState();

const getters = {
  Employees(state) {
    return state.Employees;
  },
  Groups(state) {
    return state.Groups;
  },
  EmployeesSelected(state) {
    return state.EmployeesSelected;
  },
  AssigneeEmployees(state) {
    return state.AssigneeEmployees;
  }
};

const actions = {
  async getEmployees(context) {
    let pc = new PersonaClient();
    await pc.getUsers().then((response) => {
      context.commit('Employees', response.data);
    });
  },
  getGroups(context) {
    //Currently pulling test Data because there is no API
    let e = test.getLocalGroups();
    context.commit('Groups', e);
  },
  addEmployee(context, emp) {
    context.commit('AddEmployeesSelected', emp);
  },
  removeEmployee(context, emp) {
    context.commit('RemoveEmployeesSelected', emp);
  },
  clearEmployees(context) {
    context.commit('clearEmployeesSelected');
  },
  addAssigneeEmployee(context, emp) {
    context.commit('addAssigneeEmployeeSelected', emp);
  },
  removeAssigneeEmployee(context, emp) {
    context.commit('removeAssigneeEmployeeSelected', emp);
  },
  clearAssigneeEmployees(context) {
    context.commit('clearAssigneeEmployeesSelected');
  }
};

const mutations = {
  Employees(state, e) {
    state.Employees = e;
  },
  Groups(state, e) {
    state.Groups = e;
  },
  AddEmployeesSelected(state, e) {
    state.EmployeesSelected.push(e);
  },
  RemoveEmployeesSelected(state, e) {
    let index = state.EmployeesSelected.findIndex(f => f === e);
    state.EmployeesSelected.splice(index, 1);
  },
  clearEmployeesSelected(state) {
    state.EmployeesSelected = [];
  },
  addAssigneeEmployeeSelected(state, e) {
    state.AssigneeEmployees.push(e);
  },
  removeAssigneeEmployeeSelected(state, e) {
    let index = state.EmployeesSelected.findIndex(f => f === e);
    state.AssigneeEmployees.splice(index, 1);
  },
  clearAssigneeEmployeesSelected(state) {
    state.AssigneeEmployees = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
