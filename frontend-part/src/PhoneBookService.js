import $ from 'jquery';

export default function PhoneBookService() {
    this.getContacts = function (searchString) {
        return $.get("/getContacts?searchString=" + searchString);
    };

    this.addContact = function (contact) {
        return post('/addContact', {contact: contact});
    };

    this.deleteContact = function (idList) {
        return post('/deleteContact', {idList: idList});
    };

    function post(url, data) {
        return $.post({
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
    }
};
