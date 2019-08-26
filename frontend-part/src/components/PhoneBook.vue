<template>
    <div>
        <AddItemForm v-model="newContact"
                     :inputAddStatus="addStatus"
                     @add-item="addItem"></AddItemForm>
        <SearchForm @search-items="loadContacts"></SearchForm>
        <div class="row list-header">
            <div class="col-1"><label><input type="checkbox" v-model="selectAll"></label></div>
            <div class="col-1">№</div>
            <div class="col-5">Имя и фамилия</div>
            <div class="col-4">Номер телефона</div>
            <div class="col-1"></div>
        </div>
        <transition-group name="fade">
            <PhoneBookItem v-for="(item, index) in list"
                           :item="item"
                           :index="index"
                           :key="item.id"
                           :selectAll="selectAll"
                           @remove-item="removeItem"
                           @selection-changed="changeItemSelection"></PhoneBookItem>
        </transition-group>
        <transition name="fade">
            <div class="row top-space" v-if="list.length === 0">
                <div class="col centered">Нет контактов.</div>
            </div>
        </transition>
    </div>
</template>

<script>
    import PhoneBookItem from './PhoneBookItem.vue';
    import AddItemForm from './AddItemForm.vue';
    import SearchForm from './SearchForm.vue';

    import PhoneBookService from '../PhoneBookService';

    const service = new PhoneBookService();

    export default {
        name: "PhoneBook",
        components: {AddItemForm, SearchForm, PhoneBookItem},
        props: {
            item: {
                type: Object,
            }
        },

        data() {
            return {
                /* для изменения чекбоксов в элементах списка */
                selectAll: false,

                /* для получения нового контакта из формы добавления */
                newContact: {},

                /* для хранения списка контактов */
                list: [
                    /*{
                        id: 1000,
                        firstName: "John",
                        lastName: "Lennon",
                        fullName: "John Lennon",
                        phoneNumber: "111-111-111"
                    },
                    {id: 2000, firstName: "Ned", lastName: "Stark", fullName: "Ned Stark", phoneNumber: "222-222-222"},
                    {
                        id: 3000,
                        firstName: "Michael",
                        lastName: "Boyarskiy",
                        fullName: "Michael Boyarskiy",
                        phoneNumber: "333-333-333"
                    },
                    {
                        id: 4000,
                        firstName: "Max",
                        lastName: "Kuzhelev",
                        fullName: "Max Kuzhelev",
                        phoneNumber: "444-444-444"
                    }*/
                ],

                /* для хранения контактов, отмеченных чекбоксами */
                selectedList: [],

                /* для поиска */
                searchString: '',

                /* Для передачи сообщения о статусе добавления нового контакта.
                * status: [true|false] - контакт добавлен или нет.
                * message: строка. Если добавлен - id нового контакта. Если нет - текст ошибки. */
                addStatus: {
                    status: true,
                    message: ''
                }
            };
        },

        methods: {
            addItem(item) {
                const that = this;

                service.addContact(item).done(function (response) {
                    that.addStatus = response;
                    if (response.status) {
                        that.loadContacts(that.searchString);
                    }
                }).fail(function () {
                    console.log("addItem request error.");
                }).always(function () {
                    console.log("Always in addItem.");
                });
            },

            removeItem(item) {
                const confirmMessage = this.selectedList.length === 0 ?
                    `Вы действительно хотите удалить ${item.fullName}?` :
                    `Вы действительно хотите удалить выбранные контакты?`;

                const that = this;

                this.$bvModal.msgBoxConfirm(confirmMessage, {
                    size: 'md',
                    buttonSize: 'sm',
                    okVariant: 'primary',
                    okTitle: 'Удалить',
                    cancelTitle: 'Отмена',
                    footerClass: 'p-2',
                    hideHeader: true,
                    hideHeaderClose: true,
                    centered: false
                }).then(value => {
                    if (value) {
                        const listToDelete = this.selectedList.length === 0 ?
                            [item.id] :
                            this.selectedList.map(function (e) {
                                return e.id;
                            });

                        service.deleteContact(listToDelete).done(function (response) {
                            if (response.status) {
                                that.loadContacts(that.searchString);
                            }
                        }).fail(function () {
                            console.log("removeItem request error.");
                        }).always(function () {
                            console.log("Always in removeItem.");
                        });

                        this.selectedList = [];
                        this.selectAll = false;
                    }
                });
            },

            changeItemSelection(item, newValue) {
                /* Добавление/удаление из списка с установленным чекбоксом */
                if (newValue) {
                    //добавить если нет
                    if (!this.selectedList.includes(item)) {
                        this.selectedList.push(item);
                    }
                } else {
                    //удалить если есть
                    this.selectedList = this.selectedList.filter(function (e) {
                        return e.id !== item.id;
                    });
                }
            },

            loadContacts(searchString) {
                const that = this;

                service.getContacts(searchString).done(function (response) {
                    that.list = response.contacts;
                }).fail(function () {
                    console.log("loadContacts request error.");
                }).always(function () {
                    console.log("Always in loadContacts.");
                });
            }
        },

        mounted() {
            this.loadContacts(this.searchString);
        }
    }
</script>

<!--TODO

1. Индикатор загрузки

-->