<template>
    <div class="page-items">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li class="is-active"><router-link to="/dashboard/items" aria-current="true">Produkty</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Produkty</h1>

                <div class="buttons">
                    <button class="col-2 button is-success" @click="submitForm">Zapisz zmiany cen</button>
                    <router-link to="/dashboard/items/add-category" class="col-2 button is-light">Nowa kategoria</router-link>
                    <router-link to="/dashboard/items/add-item" class="col-2 button is-light">Nowy produkt</router-link>
                    <router-link to="/dashboard/items/stats" class="col-2 button is-info">Statystyki</router-link>
                </div>
            </div>
        </div>

        <div 
            class="column is-10-desktop is-12-tablet box"
            v-for="category in categories"
            v-bind:key="category.id"
        >
            <h3 class="title is-4">{{ category.name }}</h3>

            <div class="table-container">
                <table class="table is-hoverable">
                    <thead>
                        <tr>
                            <th><div style="width: 200px;">Produkt</div></th>
                            <th><div style="width: 100px;">Kod odpadu</div></th>
                            <th><div style="width: 150px;">Cena skupu</div></th>
                            <th><div style="width: 150px;">Cena sprzedaży</div></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in items"
                            v-bind:key="item.id"
                        >
                            <td v-if="item.category === category.id">{{ item.name }}</td>
                            <td v-if="item.category === category.id"><div class="has-text-centered">{{ item.item_code }}</div></td>
                            <td v-if="item.category === category.id"><input type="number" step="0.01" class="input is-small has-text-right" size="4" v-model="item.buy_price"></td>
                            <td v-if="item.category === category.id"><input type="number" step="0.01" class="input is-small has-text-right" size="4" v-model="item.sell_price"></td>
                            <td v-if="item.category === category.id"><router-link :to="{ name: 'EditItem', params: { id: item.id }}" class="button is-info is-small">Edytuj</router-link></td>
                            <!-- <td v-if="item.category === category.id"><button class="button is-danger is-small" @click="confirmDelete(item)">Usuń</button></td> -->
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Items',
    data() {
        return {
            categories: [],
            items: []
        }
    },
    mounted() {
        this.getCategories()
        this.getItems()
    },
    methods: {
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
        getItems() {
            axios
                .get('/api/v1/items/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.items.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        submitForm() {
            // Prepare data for updating buy_price and sell_price
            const updatedItems = this.items
                .filter(item => item.buy_price !== undefined || item.sell_price !== undefined)
                .map(
                    item => ({
                        id: item.id,
                        buy_price: item.buy_price,
                        sell_price: item.sell_price
                    })
                )

            // Update backend using Axios
            updatedItems.forEach(item => {
                axios
                    .patch(`/api/v1/items/${item.id}/`, {
                        buy_price: item.buy_price,
                        sell_price: item.sell_price
                    })
                    .then(response => {
                        
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
                toast({
                    message: 'Zapisano nowe ceny produktów',
                    type: 'is-success',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })
            )
        },
        confirmDelete(item) {
            this.selectedItemToDelete = item
            const confirmMessage = `Czy na pewno chcesz usunąć produkt "${item.name}"?`

            if (window.confirm(confirmMessage)) {
                this.deleteItem()
            }
        },
        deleteItem() {
            if (!this.selectedItemToDelete) {
                return
            }

            axios
                .delete(`/api/v1/items/${this.selectedItemToDelete.id}/`)
                .then(response => {
                    // Remove the deleted item from the items list
                    const index = this.items.findIndex(item => item.id === this.selectedItemToDelete.id)
                    if (index !== -1) {
                        this.items.splice(index, 1)
                    }

                    toast({
                        message: 'Produkt został usunięty',
                        type: 'is-success',
                        dismissible: true,
                        duration: 2000,
                        position: 'bottom-right'
                    })

                    this.selectedItemToDelete = null
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd podczas usuwania produktu',
                        type: 'is-danger',
                        dismissible: true,
                        duration: 2000,
                        position: 'bottom-right'
                    })
                })
        }
    }
}
</script>