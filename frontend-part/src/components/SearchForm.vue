<template>
    <div>
        <div class="row top-space">
            <div class="col">
                <h5>Поиск</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-md-4 col-lg-3">
                <label><input type="text" placeholder="По имени или телефону" tabindex="5" v-model="searchString"></label>
            </div>
            <div class="col-3 col-md-2">
                <button tabindex="6" @click="search">Найти</button>
            </div>
            <div class="col-3 col-md-2">
                <button tabindex="6" @click="clearFilter">Сброс</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchForm",
        data() {
            return {
                searchString: ""
            }
        },
        methods: {
            search() {
                this.$emit("search-items", this.searchString);
            },
            clearFilter() {
                this.searchString = "";
                this.$emit("search-items", "");
            }
        }
    }
</script>
