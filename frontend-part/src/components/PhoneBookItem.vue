<template>
    <div class="row list-element">
        <div class="col-1"><label><input type="checkbox"
                                         :value="item.id"
                                         v-model="selected"></label></div>
        <div class="col-1" v-text="index + 1"></div>
        <div class="col-5" v-text="item.fullName"></div>
        <div class="col-4" v-text="item.phoneNumber"></div>
        <div class="col-1">
            <button title="Удалить" @click="remove">x</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PhoneBookItem",
        props: {
            item: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            },
            selectAll: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selected: false
            }
        },
        methods: {
            remove() {
                this.$emit("remove-item", this.item);
            }
        },
        watch: {
            selectAll: function (newValue) {
                this.selected = newValue;
            },
            selected: function (newValue) {
                this.$emit("selection-changed", this.item, newValue);
            }
        }
    }
</script>
