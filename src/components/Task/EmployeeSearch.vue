<template>
    <div class="search-container">
        <employee-select :usersSelected="EmployeesSelected" @selectUserEvent="selectedEmployeeEventHandler" @removeUserEvent="removeEmployeeEventHandler" ></employee-select>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import EmployeeSelect from '../shared/EmployeeSelect'


    export default {
        name: "EmployeeSearch",
        components: { EmployeeSelect },
        computed: {
          ...mapGetters(['EmployeesSelected']),
        },
        methods: {
          selectedEmployeeEventHandler(event) {
            this.$store.dispatch('addEmployee', event);
          },
          removeEmployeeEventHandler(event) {
            this.$store.dispatch('removeEmployee', event);
          }
        }
    }
</script>

<style lang="scss">
    .search-container{
        margin: auto;
        width: 60%;
        min-width: 800px;
    }
</style>
