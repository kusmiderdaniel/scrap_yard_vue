<template>
    <div class="page-client">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/clients">Kontrahenci</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'Client', params: { id: client.id }}" aria-current="true">{{ client.name }}</router-link></li>
            </ul>
        </nav>
        
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">{{ client.name }}</h1>

                <router-link :to="{ name: 'EditClient', params: { id: client.id }}" class="button is-light mt-4 mr-4">Edytuj</router-link>
                <button class="button is-danger mt-4" @click="confirmDelete(client)">Usuń</button>
            </div>

            <div class="column is-12">
                <div class="column is-4 box">
                    <h2 class="subtitle">Dane kontaktowe</h2>

                    <p><strong>{{ client.name }}</strong></p>
                    
                    <p v-if="client.address1">{{ client.address1 }}</p>
                    <p v-if="client.zipcode || client.place">{{ client.zipcode }} {{ client.place }}</p>
                </div>
            </div>

            <div class="column is-12" v-if="client.receipts">
                <div class="box">
                    <h2 class="subtitle">Kwity</h2>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Numer</th>
                                <th class="has-text-centered">Data</th>
                                <th style="width: 120px;">Wartość</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="receipt in client.receipts"
                                v-bind:key="receipt.id"
                            >
                                <td>{{ receipt.receipt_number }}</td>
                                <td class="has-text-centered">{{ receipt.date }}</td>
                                <td class="has-text-right">{{ receipt.gross_amount }} zł</td>
                                <td class="has-text-right">
                                    <router-link :to="{ name: 'Receipt', params: { id: receipt.id } }">Szczegóły</router-link>
                                </td>
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

export default {
    name: 'Client',
    data () {
        return {
            client: {
                receipts: []
            }
        }
    },
    mounted() {
        this.getClient()
    },
    methods: {
        getClient() {
            const clientID = this.$route.params.id

            axios
                .get(`/api/v1/clients/${clientID}`)
                .then(response => {
                    this.client = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        confirmDelete(client) {
            this.selectedClientToDelete = client
            const confirmMessage = `Czy na pewno chcesz usunąć kontrahenta "${client.name}"? \nSpowoduje to równie usunięcie kwitów z nim związanych!`

            if (window.confirm(confirmMessage)) {
                this.deleteClient()
            }
        },
        deleteClient() {
            if (!this.selectedClientToDelete) {
                return
            }

            axios
                .delete(`/api/v1/clients/${this.selectedClientToDelete.id}/`)
                .then(response => {
                    // Remove the deleted client from the clients list
                    
                    toast({
                        message: 'Kontrahent został usunięty',
                        type: 'is-success',
                        dismissible: true,
                        duration: 2000,
                        position: 'bottom-right'
                    })

                    this.selectedClientToDelete = null
                    this.$router.push('/dashboard/clients')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                    toast({
                        message: 'Wystąpił błąd podczas usuwania kontrahenta',
                        type: 'is-danger',
                        dismissible: true,
                        duration: 2000,
                        position: 'bottom-right'
                    })
                })
        }
    },
    computed: {
    }
}
</script>