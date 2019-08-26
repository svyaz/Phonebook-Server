import $ from 'jquery';

export default function PhoneBookService() {
    this.getContacts = function (searchString) {
        return $.get("/getContacts?searchString=" + searchString);
    };

    this.addContact = function (contact) {
        return $.post({
            url: '/addContact',
            contentType: 'application/json',
            data: JSON.stringify({request: contact})
        });
    };

    this.deleteContact = function (id) {
        return $.post({
            url: '/deleteContact',
            contentType: 'application/json',
            data: JSON.stringify({id: id})
        });
    };
};

//todo: 2. Объединить пост-запросы