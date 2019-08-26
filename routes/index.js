const express = require('express');
const router = express.Router();

const ERR_MSG_ALREADY_EXISTS = 'Контакт с таким номером телефона уже есть.';

let list = [
    {id: 1000, firstName: "John", lastName: "Lennon", fullName: "John Lennon", phoneNumber: "111-111-111"},
    {id: 2000, firstName: "Ned", lastName: "Stark", fullName: "Ned Stark", phoneNumber: "222-222-222"},
    {id: 3000, firstName: "Michael", lastName: "Boyarskiy", fullName: "Michael Boyarskiy", phoneNumber: "333-333-333"},
    {id: 4000, firstName: "Max", lastName: "Kuzhelev", fullName: "Max Kuzhelev", phoneNumber: "444-444-444"}
];

/* Get home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

/* Get contacts list with filter. */
router.get('/getContacts', function (req, res) {
    const searchString = (req.query.searchString || '').toLowerCase();

    res.send({
        contacts: list.filter(function (item) {
            return searchString.length === 0 ||
                item.firstName.toLowerCase().indexOf(searchString) >= 0 ||
                item.lastName.toLowerCase().indexOf(searchString) >= 0 ||
                item.phoneNumber.toLowerCase().indexOf(searchString) >= 0;
        })
    });
});

/* Add contact. */
router.post('/addContact', function (req, res) {
    const newItem = req.body.request;
    const addStatus = {};

    const isFound = list.some(function (item) {
        return newItem.phoneNumber === item.phoneNumber;
    });

    if (isFound) {
        // контакт уже есть
        addStatus.status = false;
        addStatus.message = ERR_MSG_ALREADY_EXISTS;
    } else {
        // Добавляем контакт
        newItem.id = (new Date()).getTime();
        list.push(newItem);
        addStatus.status = true;
        addStatus.message = newItem.id;
    }

    res.send(addStatus);
});

/* Delete contact. */
router.post('/deleteContact', function (req, res) {
    const id = req.body.id;
    const index = list.findIndex(function (item) {
        return item.id === id;
    });

    if (index >= 0) {
        list.splice(index, 1);
    }

    res.send();
});

module.exports = router;
