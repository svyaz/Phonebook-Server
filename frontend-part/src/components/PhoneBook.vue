<template>
    <div>
        <AddItemForm v-model="newContact"
                     :errorStatus="errorStatus"
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
        <div class="text-center load-indicator" v-if="isIndicatorVisible">
            <b-spinner variant="secondary"></b-spinner>
        </div>
    </div>
</template>

<script>
    import PhoneBookItem from './PhoneBookItem.vue';
    import AddItemForm from './AddItemForm.vue';
    import SearchForm from './SearchForm.vue';
    import PhoneBookService from '../PhoneBookService';

    const service = new PhoneBookService();
    const ERR_MSG_COMMUNICATION_ERROR = "Сбой соединения с сервером.";

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

                /* Видимость индикатора загрузки */
                isIndicatorVisible: false,

                /* Для передачи сообщения об ошибке на форму статусе добавления нового контакта.
                * status: [true|false] - ошибка или нет.
                * message: строка. Текст ошибки. */
                errorStatus: {
                    status: false,
                    message: ''
                }
            };
        },

        methods: {
            addItem(item) {
                this.isIndicatorVisible = true;

                service.addContact(item).done(response => {
                    this.errorStatus = response;
                    if (!response.status) {
                        this.loadContacts(this.searchString);
                    }
                }).fail(() => {
                    this.errorStatus = {
                        status: true,
                        message: ERR_MSG_COMMUNICATION_ERROR
                    };
                }).always(() => {
                    this.isIndicatorVisible = false;
                });
            },

            removeItem(item) {
                const confirmMessage = this.selectedList.length === 0 ?
                    `Вы действительно хотите удалить ${item.fullName}?` :
                    `Вы действительно хотите удалить выбранные контакты?`;

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
                        this.isIndicatorVisible = true;

                        service.deleteContact(listToDelete).done(response => {
                            if (response.status) {
                                this.loadContacts(this.searchString);
                                this.errorStatus = {
                                    status: false,
                                    message: ''
                                };
                            }
                        }).fail(() => {
                            this.errorStatus = {
                                status: true,
                                message: ERR_MSG_COMMUNICATION_ERROR
                            };
                        }).always(() => {
                            this.isIndicatorVisible = false;
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
                this.isIndicatorVisible = true;

                service.getContacts(searchString).done(response => {
                    this.list = response.contacts;
                    this.errorStatus = {
                        status: false,
                        message: ''
                    }
                }).fail(() => {
                    this.errorStatus = {
                        status: true,
                        message: ERR_MSG_COMMUNICATION_ERROR
                    };
                }).always(() => {
                    this.isIndicatorVisible = false;
                });
            }
        },

        mounted() {
            this.loadContacts(this.searchString);
        }
    }
</script>
