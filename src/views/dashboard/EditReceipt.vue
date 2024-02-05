<template>
    <div class="page-edit-receipt">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Kwity</router-link></li>
                <li><router-link :to="{ name: 'Receipt', params: { id: receipt.id }}">{{ receipt.receipt_number }}</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'EditReceipt', params: { id: receipt.id }}" aria-current="true">Edytuj</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Edytuj kwit</h1>
            </div>

            <div class="column is-3">
                <div class="field">
                    <label>Numer kwitu</label>

                    <div class="control">
                        <input type="text" class="input" v-model="receipt.receipt_number">
                    </div>
                </div>
            </div>

            <div class="column is-3">
                <div class="field">
                    <label>Data kwitu</label>

                    <div class="control">
                        <input type="date" name="receipt_date" class="input" v-model="receipt.date">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Kontrahent</h2>

                <div class="select">
                    <select name="client" v-model="client">
                        <option 
                            v-for="client in clients"
                            v-bind:key="client.id"
                            v-bind:value="client"
                        >
                            {{ client.name }}
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="column is-12">
                <div class="column is-5 box" v-if="client">
                    <p class="title is-5">Dane kontaktowe</p>
                    <p><strong>Nr dokumentu:</strong> {{ client.doc_number }}</p>
                    <p><strong>Email:</strong> {{ client.email }}</p>
                    <p v-if="client.address1">{{ client.address1 }}</p>
                    <p v-if="client.zipcode || client.place">{{ client.zipcode }} {{ client.place }}</p>
                </div>
            </div>

            <div class="column is-12">
                <div class="box">
                    <h2 class="is-size-5 mb-4">Produkty</h2>

                    <EditItemForm
                        v-for="item in tempItems"
                        v-bind:key="item.item_num"
                        v-bind:initialItem="item"
                        @updatePrice="updateTotals"
                        @updateItems="updateItems"
                        @deleteItem="deleteItem(item)"
                    >
                    </EditItemForm>

                    <button class="button is-light" @click="addItem">+</button>
                </div>
            </div>

            <div class="column is-12">
                <div class="column is-5 box">
                    <h2 class="is-size-5 mb-4">Podsumowanie</h2>

                    <p><strong>Do wypłaty</strong>: {{ receipt.gross_amount }} zł</p>
                </div>
            </div>
        </div>

        <div class="column is-12">
            <button class="button is-success" @click="submitForm">Zapisz</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

import EditItemForm from '@/components/EditItemForm.vue'

export default {
    name: 'EditReceipt',
    components: {
        EditItemForm
    },
    data() {
        return {
            receipt: {
                receipt_number: '',
                date: '',
                client: '',
                receipt_items: [],
                receipt_empty_items: [],
                gross_amount: 0,
                total_quantity: 0
            },
            tempItems: [],
            client: {},
            clients: [],
            team: {}
        }
    },
    async mounted() {
        await this.getReceipt();
        await this.getTeam()
    },
    methods: {
        async getReceipt() {
            const receiptID = this.$route.params.id

            await axios
                .get(`/api/v1/receipts/${receiptID}`)
                .then(response => {
                    this.receipt = response.data
                    this.receipt.receipt_empty_items = []
                    for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                        let tempItem = {}
                        tempItem.id = this.receipt.receipt_items[i].source_id
                        tempItem.name = this.receipt.receipt_items[i].name
                        tempItem.item_code = this.receipt.receipt_items[i].item_code
                        tempItem.buy_price = this.receipt.receipt_items[i].buy_price
                        tempItem.item_num = this.receipt.receipt_items[i].item_num
                        tempItem.quantity = this.receipt.receipt_items[i].quantity
                        tempItem.source_id = this.receipt.receipt_items[i].source_id
                        this.tempItems.push(tempItem)
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
            
            // getClients
            await axios
                .get('/api/v1/clients/')
                .then(response => {
                    this.clients = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
            
            // getClient
            const clientID = this.receipt.client
            this.client = this.clients.find((client) => client.id === clientID)
        },
        getTeam() {
            axios
                .get('/api/v1/teams/')
                .then(response => {
                    this.team = response.data[0]
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
            return new Date(date).toLocaleDateString(undefined, options)
        },
        addItem() {
            if (this.receipt.receipt_items.length < 15) {
                this.tempItems.push({
                    item_num: this.receipt.receipt_items.length,
                    category: '',
                    name: '',
                    buy_price: '',
                    quantity: 1,
                })
                this.receipt.receipt_items.push({
                    item_num: this.receipt.receipt_items.length,
                    category: '',
                    name: '',
                    buy_price: '',
                    quantity: 1,
                })
            } else {
                toast({
                    message: 'Maksymalna ilość produktów na kwicie to 15.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                })
            }
        },
        deleteItem(selectedItem) {
            // Remove the item from the array
            const index = this.tempItems.indexOf(selectedItem)
            if (index > -1) {
                this.tempItems.splice(index, 1)
                this.receipt.receipt_items.splice(index, 1)
            }

            // Update the gross amount after deletion
            this.updateTotals()
        },
        updateItems() {
            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                this.receipt.receipt_items[i].name = this.tempItems[i].name
                this.receipt.receipt_items[i].item_code = this.tempItems[i].item_code
                this.receipt.receipt_items[i].buy_price = this.tempItems[i].buy_price
                this.receipt.receipt_items[i].quantity = this.tempItems[i].quantity
                this.receipt.receipt_items[i].source_id = this.tempItems[i].source_id
                this.receipt.receipt_items[i].gross_amount = Number(this.receipt.receipt_items[i].buy_price) * Number(this.receipt.receipt_items[i].quantity)
                this.receipt.receipt_items[i].gross_amount = Number(this.receipt.receipt_items[i].gross_amount).toFixed(2)
            }
        },
        async updateTotals() {
            let gross_amount = 0
            let total_quantity = 0
            await this.updateItems()

            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                gross_amount += Number(this.receipt.receipt_items[i].gross_amount)
                if (this.receipt.receipt_items[i].quantity === '') {
                    total_quantity += 0
                } else {
                    total_quantity += this.receipt.receipt_items[i].quantity
                }
            }

            this.receipt.gross_amount = Number(gross_amount).toFixed(2)
            this.receipt.total_quantity = Number(total_quantity.toFixed(2))
        },
        submitForm() {
            // Validation checks
            if (!this.receipt.client) {
                toast({
                    message: 'Proszę wybrać kontrahenta.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                const item = this.receipt.receipt_items[i];

                if (!item.name || !item.buy_price || !item.quantity) {
                    toast({
                        message: 'Proszę wypełnić wszystkie pola dla produktów.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 3000,
                        position: 'bottom-right',
                    });
                    return;
                }
            }

            this.receipt.receipt_empty_items = []
            console.log(this.receipt.receipt_empty_items)
            if (this.receipt.receipt_items.length < 15) {
                for (let i = 0; i < (15 - this.receipt.receipt_items.length); i++) {
                    this.receipt.receipt_empty_items.push({
                        item_num: this.receipt.receipt_items.length + i
                    })
                }
            }
            console.log(this.receipt.receipt_empty_items)


            this.receipt.client_name = this.client.name
            this.receipt.client_email = this.client.email
            this.receipt.client_doc_number = this.client.doc_number
            this.receipt.client_address1 = this.client.address1
            this.receipt.client_zipcode = this.client.zipcode
            this.receipt.client_place = this.client.place
            this.receipt.client = this.client.id

            const receiptID = this.$route.params.id

            axios
                .patch(`/api/v1/receipts/${receiptID}/`, this.receipt)
                .then(response => {
                    toast({
                        message: 'Zmiany zostały zapisane',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/receipts')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd podczas zapisywanie zmian. Spróbuj ponownie.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 3000,
                        position: 'bottom-right',
                    })
                })
        }
    }
}
</script>

<style lang="scss">
    #item-select {
        width: 120%;
    }
    .select select {
        width: 100%;
    }
</style>