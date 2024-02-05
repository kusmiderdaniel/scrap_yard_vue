<template>
    <div class="page-receipt">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Kwity</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'Receipt', params: { id: receipt.id }}" aria-current="true">{{ receipt.receipt_number }}</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">{{ receipt.receipt_number }}</h1>
                <h2 class="title is-5">Data: {{ formatDate(receipt.date) }}</h2>
                <div class="buttons">
                    <router-link :to="{ name: 'EditReceipt', params: { id: receipt.id }}" class="button is-light mt-4">Edytuj</router-link>
                    <button class="button is-danger mt-4" @click="confirmDelete(receipt)">Usuń</button>
                    <button @click="getPdf()" class="button is-dark mt-4">Pobierz PDF</button>
                </div>
            </div>

            <div class="column is-8 mb-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Kontrahent</h3>

                    <p><strong>{{ receipt.client_name }}</strong></p>
                    <p><strong>Nr dokumentu:</strong> {{ receipt.client_doc_number }}</p>
                    <p v-if="receipt.client_email"><strong>Email:</strong> {{ receipt.client_email }}</p>
                    <p><strong>Adres:</strong></p>
                    <p v-if="receipt.client_address1">{{ receipt.client_address1 }}</p>
                    <p v-if="receipt.client_zipcode || receipt.client_place">{{ receipt.client_zipcode }} {{ receipt.client_place }}</p>
                </div>
            </div>

            <div class="column is-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Podsumowanie</h3>

                    <div class="columns">
                        <div class="column is-6">
                            <p><strong>Do wypłaty</strong>: {{ receipt.gross_amount }} zł</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="column is-12 mb-4">
                <div class="box">
                    <h3 class="is-size-4 mb-5">Produkty</h3>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th><div style="width: 120px;">Produkt</div></th>
                                <th><div class="has-text-centered">Kod odpadu</div></th>
                                <th><div class="has-text-centered">Ilość</div></th>
                                <th><div class="has-text-centered">Cena skupu</div></th>
                                <th><div class="has-text-centered">Wartość</div></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr 
                                v-for="item in receipt.receipt_items"
                                v-bind:key="item.id"
                            >
                                <td>{{ item.name }}</td>
                                <td class="has-text-centered">{{ item.item_code }}</td>
                                <td class="has-text-right">{{ item.quantity }} kg</td>
                                <td class="has-text-right">{{ item.buy_price }} zł</td>
                                <td class="has-text-right">{{ getItemTotal(item) }} zł</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'

    const fileDownload = require('js-file-download')

    export default {
        name: 'Receipt',
        data() {
            return {
                receipt: {}
            }
        },
        mounted() {
            this.getReceipt()
            console.log(this.receipt)
        },
        methods: {
            getReceipt() {
                const receiptID = this.$route.params.id

                axios
                    .get(`/api/v1/receipts/${receiptID}`)
                    .then(response => {
                        this.receipt = response.data
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                    })
            },
            formatDate(date) {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                return new Date(date).toLocaleDateString(undefined, options);
            },
            getPdf() {
                const receiptID = this.$route.params.id

                axios
                    .get(`/api/v1/receipts/${receiptID}/generate_pdf/`, {
                        responseType: 'blob',
                    }).then(res => {
                        fileDownload(res.data, `kwit_${this.receipt.receipt_number}.pdf`);
                    }).catch(err => {
                        console.log(err);
                    })
            },
            getItemTotal(item) {
                const total = item.buy_price * item.quantity

                return parseFloat(total).toFixed(2)
            },
            confirmDelete(receipt) {
                this.selectedReceiptToDelete = receipt
                const confirmMessage = `Czy na pewno chcesz usunąć kwit "${receipt.receipt_number}"?`

                if (window.confirm(confirmMessage)) {
                    this.deleteReceipt()
                }
            },
            deleteReceipt() {
                if (!this.selectedReceiptToDelete) {
                    return
                }

                axios
                    .delete(`/api/v1/receipts/${this.selectedReceiptToDelete.id}/`)
                    .then(response => {
                        
                        toast({
                            message: 'Kwit został usunięty',
                            type: 'is-success',
                            dismissible: true,
                            duration: 2000,
                            position: 'bottom-right'
                        })

                        this.selectedReceiptToDelete = null
                        this.$router.push('/dashboard/receipts')
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error))
                        toast({
                            message: 'Wystąpił błąd podczas usuwania kwitu',
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