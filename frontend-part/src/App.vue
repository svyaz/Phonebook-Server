<template>
    <div id="app" class="container">
        <div class="row top-space">
            <div class="col">
                <h3>Контакты</h3>
            </div>
        </div>
        <PhoneBook></PhoneBook>
    </div>
</template>

<script>
    import PhoneBook from './components/PhoneBook.vue';

    export default {
        name: 'app',
        components: {
            PhoneBook
        }
    }
</script>
