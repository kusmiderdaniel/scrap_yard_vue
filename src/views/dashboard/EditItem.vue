<template>
    <div class="page-edit-item">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/items">Produkty</router-link></li>
                <li class="is-active"><router-link to="/dashboard/items/add-item" aria-current="true">Edytuj produkt</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Edytuj - {{ item.name }}</h1>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label class="label">Kategoria</label>
                    
                    <div class="select mr-4">
                        <!-- <div class="select"> -->
                            <select name="category" v-model="item.category">
                                <option 
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </option>
                            </select>
                        <!-- </div> -->
                    </div>

                    <router-link to="/dashboard/items/add-category" class="button is-info">Nowa kategoria</router-link>
                </div>

                <div class="field">
                    <label class="label">Nazwa</label>
                    
                    <div class="control">
                        <input type="text" name="name" class="input" v-model="item.name">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Kod odpadu</label>
                    
                    <div class="control">
                        <input type="text" name="item_code" class="input" v-model="item.item_code" pattern="[0-9]*" maxlength="6">
                    </div>
                    <p class="help">
                        Kod odpadu to 4 lub 6 cyfrowy kod określający rodzaj odpadu.
                    </p>
                </div>

                <div class="field">
                    <label class="label">Cena skupu</label>
                    
                    <div class="control">
                        <input type="number" step="0.01" name="buy_price" class="input" v-model="item.buy_price">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Cena sprzedaży</label>
                    
                    <div class="control">
                        <input type="number" step="0.01" name="sell_price" class="input" v-model="item.sell_price">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <button class="button is-success" @click="submitForm">Zapisz</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'EditItem',
    data() {
        return {
            item: {},
            categories: []
        }
    },
    mounted() {
        this.getItem()
        this.getCategories()
    },
    methods: {
        getItem() {
            const itemID = this.$route.params.id

            axios
                .get(`/api/v1/items/${itemID}`)
                .then(response => {
                    this.item = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        getCategories() {
            axios
                .get('/api/v1/categories/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.categories.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        submitForm() {
            const itemID = this.$route.params.id
            const tempItem = { ...this.item }

            // Validation for category
            if (!this.item.category) {
                toast({
                    message: 'Proszę wybrać kategorię.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })

                // Restore the form data
                this.item = { ...tempItem }
                return // Prevent form submission if validation fails
            }

            // Validation for name
            if (!this.item.name.trim()) {
                toast({
                    message: 'Proszę wprowadzić nazwę produktu.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })

                // Restore the form data
                this.item = { ...tempItem }
                return // Prevent form submission if validation fails
            }

            // Validation for item_code
            if (!/^[0-9]{6}$/.test(this.item.item_code)) {
                toast({
                    message: 'Kod odpadu musi składać się z dokładnie 6 cyfr.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })

                // Restore the form data
                this.item = { ...tempItem }
                return
            }

            // Validation for buy_price and sell_price
            if (
                !/^\d+(\.\d{1,2})?$/.test(this.item.buy_price) ||
                parseFloat(this.item.buy_price) <= 0 ||
                !/^\d+(\.\d{1,2})?$/.test(this.item.sell_price) ||
                parseFloat(this.item.sell_price) <= 0
            ) {
                toast({
                    message: 'Proszę wprowadzić poprawne ceny skupu i sprzedaży (większe niż 0, maksymalnie 2 miejsca po przecinku).',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })

                // Restore the form data
                this.item = { ...tempItem }
                return // Prevent form submission if validation fails
            }

            axios
                .patch(`/api/v1/items/${itemID}/`, this.item)
                .then(response => {
                    toast({
                        message: 'Zmiany zostały zapisane',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/items')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd. Proszę spróbować ponownie',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                })
        }               
    }
}
</script>