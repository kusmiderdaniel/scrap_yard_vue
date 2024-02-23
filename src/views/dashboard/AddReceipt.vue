<template>
    <div class="page-add-receipt">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Kwity</router-link></li>
                <li class="is-active"><router-link to="/dashboard/receipts/add-receipt" aria-current="true">Nowy kwit</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Nowy kwit</h1>
            </div>

            <div class="column is-3-tablet is-12-mobile">
                <div class="field">
                    <label>Numer kwitu</label>

                    <div class="control">
                        <input type="text" class="input" v-model="receipt.receipt_number">
                    </div>
                </div>
            </div>

            <div class="column is-3-tablet is-12-mobile">
                <div class="field">
                    <label>Data kwitu</label>

                    <div class="control">
                        <input type="date" name="receipt_date" class="input" v-model="receipt.date" @change="getReceipts">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Kontrahent</h2>

                <div class="select">
                    <select name="client" v-model="receipt.client">
                        <option value="">- wybierz kontrahenta -</option>
                        <option 
                            v-for="client in clients"
                            v-bind:key="client.id"
                            v-bind:value="client"
                        >
                            {{ client.name }}
                        </option>
                    </select>
                </div>

                <div class="column is-4 box mt-4" v-if="receipt.client">
                    <p><strong>{{ receipt.client.name }}</strong></p>
                    <p><strong>Nr dokumentu:</strong> {{ receipt.client.doc_number }}</p>
                    <p v-if="receipt.client.email"><strong>Email:</strong> {{ receipt.client.email }}</p>
                    <p v-if="receipt.client.address1">{{ receipt.client.address1 }}</p>
                    <p v-if="receipt.client.zipcode || receipt.client.place">{{ receipt.client.zipcode }} {{ receipt.client.place }}</p>
                </div>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Produkty</h2>

                <ItemForm
                    v-for="item in receipt.receipt_items"
                    v-bind:key="item.item_num"
                    v-bind:initialItem="item"
                    @updatePrice="updateTotals"
                    @deleteItem="deleteItem(item)"
                >
                </ItemForm>

                <button class="button is-success is-rounded is-outlined" style="width: 2.5em" @click="addItem">+</button>
            </div>
        </div>

        <div class="column is-12">
            <h2 class="is-size-5 mb-4">Podsumowanie</h2>

            <p><strong>Do wypłaty</strong>: {{ receipt.gross_amount.toFixed(2) }} zł</p>
        </div>

        <div class="column is-12">
            <button class="button is-success mr-4" @click="submitForm">Zapisz</button>
            <button class="button is-dark mr-4" @click="getPdf">Zapisz i pobierz PDF</button>
            <button class="button is-danger" @click="confirmCancel(receipt)">Anuluj</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

const fileDownload = require('js-file-download')

import ItemForm from '@/components/ItemForm.vue'

export default {
    name: 'AddReceipt',
    components: {
        ItemForm
    },
    data() {
        return {
            receipt: {
                receipt_number: '',
                date: new Date().toISOString().substr(0, 10),
                client: '',
                receipt_items: [
                    {
                        item_num: 0,
                        name: '',
                        buy_price: '',
                        quantity: 1,
                    }
                ],
                receipt_empty_items: [],
                gross_amount: 0,
                total_quantity: 0
            },
            receipts: [],
            clients: [],
            team: {},
            receiptID: ''
        }
    },
    async mounted() {
        await this.getClients(),
        await this.getTeam(),
        await this.getReceipts()
    },
    methods: {
        getClients() {
            axios
                .get('/api/v1/clients/')
                .then(response => {
                    this.clients = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        async getReceipts() {
            await axios
                .get('/api/v1/receipts/')
                .then(response => {
                    this.receipts = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
            
            try {
                let existingReceipts = []
                for (let i = 0; i < this.receipts.length; i++) {
                    if (this.receipts[i].date === this.receipt.date) {
                        existingReceipts.push(this.receipts[i])
                    }
                }
                const lastReceipt = existingReceipts[0];

                if (lastReceipt) {
                    const lastReceiptNumberParts = lastReceipt.receipt_number.split('/');
                    const nextReceiptNumberPart1 = parseInt(lastReceiptNumberParts[0], 10) + 1;
                    this.receipt.receipt_number = `${nextReceiptNumberPart1}/${this.formatDate(this.receipt.date)}`;
                } else {
                // If no existing receipts for the date, start with 1
                this.receipt.receipt_number = `1/${this.formatDate(this.receipt.date)}`;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
            }
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
            
            const index = this.receipt.receipt_items.indexOf(selectedItem)
            if (index > -1) {
                this.receipt.receipt_items.splice(index, 1)
            }

            // Update the gross amount after deletion
            this.updateTotals()
        },
        updateTotals(changedItem) {
            let gross_amount = 0
            let total_quantity = 0

            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                gross_amount += this.receipt.receipt_items[i].gross_amount
                if (this.receipt.receipt_items[i].quantity === '') {
                    total_quantity += 0
                } else {
                    total_quantity += this.receipt.receipt_items[i].quantity
                }
            }

            this.receipt.gross_amount = Number(gross_amount.toFixed(2))
            this.receipt.total_quantity = Number(total_quantity.toFixed(2))
        },
        confirmCancel(receipt) {
            const confirmMessage = `Czy na pewno chcesz anluować wprowadzanie kwitu "${receipt.receipt_number}"?`

            if (window.confirm(confirmMessage)) {
                this.$router.push('/dashboard/receipts')
            }
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
                const item = this.receipt.receipt_items[i]

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

            if (this.receipt.receipt_items.length < 15) {
                for (let i = 0; i < (15 - this.receipt.receipt_items.length); i++) {
                    this.receipt.receipt_empty_items.push({
                        item_num: this.receipt.receipt_items.length + i
                    })
                }
            }

            this.receipt.client_name = this.receipt.client.name
            this.receipt.client_email = this.receipt.client.email
            this.receipt.client_doc_number = this.receipt.client.doc_number
            this.receipt.client_address1 = this.receipt.client.address1
            this.receipt.client_zipcode = this.receipt.client.zipcode
            this.receipt.client_place = this.receipt.client.place
            this.receipt.client = this.receipt.client.id

            let selectedItemName = ''
            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                selectedItemName = this.receipt.receipt_items[i].name.name
                this.receipt.receipt_items[i].name = selectedItemName
            }

            axios
                .post('/api/v1/receipts/', this.receipt)
                .then(response => {
                    const newReceiptID = response.data.id
                    toast({
                        message: 'Kwit został dodany',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push(`/dashboard/receipts/${newReceiptID}`)
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd podczas dodawania kwitu. Spróbuj ponownie.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 3000,
                        position: 'bottom-right',
                    })
                })
        },
        async getPdf() {
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
                const item = this.receipt.receipt_items[i]

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

            if (this.receipt.receipt_items.length < 15) {
                for (let i = 0; i < (15 - this.receipt.receipt_items.length); i++) {
                    this.receipt.receipt_empty_items.push({
                        item_num: this.receipt.receipt_items.length + i
                    })
                }
            }

            this.receipt.client_name = this.receipt.client.name
            this.receipt.client_email = this.receipt.client.email
            this.receipt.client_doc_number = this.receipt.client.doc_number
            this.receipt.client_address1 = this.receipt.client.address1
            this.receipt.client_zipcode = this.receipt.client.zipcode
            this.receipt.client_place = this.receipt.client.place
            this.receipt.client = this.receipt.client.id

            let selectedItemName = ''
            for (let i = 0; i < this.receipt.receipt_items.length; i++) {
                selectedItemName = this.receipt.receipt_items[i].name.name
                this.receipt.receipt_items[i].name = selectedItemName
            }

            await axios
                .post('/api/v1/receipts/', this.receipt)
                .then(response => {
                    const newReceiptID = response.data.id
                    console.log(newReceiptID)
                    this.receiptID = newReceiptID
                    toast({
                        message: 'Kwit został dodany',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd podczas dodawania kwitu. Spróbuj ponownie.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 3000,
                        position: 'bottom-right',
                    })
                })

            await axios
                .get(`/api/v1/receipts/${this.receiptID}/generate_pdf/`, {
                    responseType: 'blob',
                }).then(res => {
                    fileDownload(res.data, `kwit_${this.receipt.receipt_number}.pdf`);
                }).catch(err => {
                    console.log(err);
                })

            this.$router.push(`/dashboard/receipts/${this.receiptID}`)
        },
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