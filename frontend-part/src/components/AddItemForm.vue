<template>
    <div>
        <div class="row top-space">
            <div class="col">
                <h5>Добавить контакт</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-md-4 col-lg-3">
                <label><input type="text" :placeholder="firstNameText" tabindex="1"
                              v-model="newFirstName"
                              :class="{'empty-field': (isHighlighted && newFirstName === '')}"></label>
            </div>
            <div class="col-6 col-md-4 col-lg-3">
                <label><input type="text" :placeholder="lastNameText" tabindex="2"
                              v-model="newLastName"
                              :class="{'empty-field': (isHighlighted && newLastName === '')}"></label>
            </div>
            <div class="col-6 col-md-4 col-lg-3">
                <label><input type="text" :placeholder="phoneNumberText" tabindex="3"
                              v-model="newPhoneNumber"
                              :class="{'empty-field': (isHighlighted && newPhoneNumber === '')}"></label>
            </div>
            <div class="col-3 col-md-2">
                <button @click="addContact" tabindex="4">Добавить</button>
            </div>
        </div>
        <transition name="fade">
            <div class="row" v-if="errorMessage.length > 0">
                <div class="col centered">
                    <b-alert show variant="danger" v-text="errorMessage"></b-alert>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    const ERR_MSG_EMPTY_ITEMS = "Вы не заполнили поля: ";

    export default {
        name: "AddItemForm",

        props: {
            inputAddStatus: {
                type: Object,
                default: {
                    status: true,
                    message: ''
                }
            }
        },

        data() {
            return {
                newContact: {},
                newFirstName: "",
                newLastName: "",
                newPhoneNumber: "",
                firstNameText: "Имя",
                lastNameText: "Фамилия",
                phoneNumberText: "Номер телефона",
                isHighlighted: false,
                errorMessage: ""
            }
        },

        methods: {
            addContact() {
                const notFilled = [];
                if (this.newFirstName === "") {
                    notFilled.push(this.firstNameText);
                }
                if (this.newLastName === "") {
                    notFilled.push(this.lastNameText);
                }
                if (this.newPhoneNumber === "") {
                    notFilled.push(this.phoneNumberText);
                }

                if (notFilled.length > 0) {
                    this.isHighlighted = true;
                    this.errorMessage = ERR_MSG_EMPTY_ITEMS + notFilled.join(", ");
                    return;
                }

                this.newContact = {
                    id: (new Date()).getTime(),
                    firstName: this.newFirstName,
                    lastName: this.newLastName,
                    fullName: this.newFirstName + " " + this.newLastName,
                    phoneNumber: this.newPhoneNumber
                };

                this.isHighlighted = false;
                this.$emit("add-item", this.newContact);
            }
        },

        watch: {
            inputAddStatus: function (newValue) {
                if (newValue.status) {
                    this.newFirstName = "";
                    this.newLastName = "";
                    this.newPhoneNumber = "";
                }
                this.errorMessage = newValue.message;
            }
        }
    }
</script>
