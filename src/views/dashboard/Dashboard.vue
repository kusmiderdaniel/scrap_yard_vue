<template>
    <div class="page-dashboard">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Dashboard</h1>
            </div>

            <div class="column is-8-desktop is-12-tablet" v-if="receipts">
                <div class="box">
                    <h1 class="title is-4">Dzisiaj</h1>
                    <div class="columns">

                        <div class="column is-4 level-item has-text-centered">
                            <div>
                            <p class="heading">Wypłacono</p>
                            <p class="title">{{ gross_total_value }} zł</p>
                            </div>
                        </div>

                        <div class="column is-4 level-item has-text-centered">
                            <div>
                            <p class="heading">Odebrano</p>
                            <p class="title">{{ total_quantity }} kg</p>
                            </div>
                        </div>

                        <div class="column is-4 level-item has-text-centered">
                            <div>
                            <p class="heading">Klienci</p>
                            <p class="title">{{ this.receipts.length }}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div class="box">
                    <h2 class="title is-4">Dzisiejsze kwity</h2>

                    <div class="table-container">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Numer</th>
                                    <th>Klient</th>
                                    <th class="has-text-centered">Data</th>
                                    <th style="width: 120px;">Wartość</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="receipt in receipts"
                                    v-bind:key="receipt.id"
                                >
                                    <td>{{ receipt.receipt_number }}</td>
                                    <td>{{ receipt.client_name }}</td>
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

            <div class="column is-4-desktop is-12-tablet">
                <div class="box">
                    <h2 class="title is-5">Twoja firma</h2>
                    <router-link to="/dashboard/my-account/edit-team" class="button is-light">Edytuj dane firmy</router-link>
                    <hr>
                    <p><strong>{{ team.name }}</strong></p>
                    <p><strong>{{ team.owner_name }}</strong></p>
                    <p><strong>NIP:</strong> {{ team.org_number }}</p>
                    <p><strong>REGON:</strong> {{ team.org_number2 }}</p>
                    <p><strong>Nr telefonu:</strong> {{ team.phone_number }}</p>
                    <p><strong>Email:</strong> {{ team.email }}</p>
                    <p><strong>Address:</strong></p>
                    <p>{{ team.address1 }}</p>
                    <p>{{ team.zipcode }} {{ team.place }}</p>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Dashboard',
    data() {
        return {
            receipts: [],
            team: {},
            gross_total_value: 0,
            total_quantity: 0
        }
    },
    mounted() {
        this.getReceipts(),
        this.getTeam()
    },
    methods: {
        getReceipts() {
            axios
                .get('/api/v1/receipts/')
                .then(response => {
                    // Filter receipts to only include today's date
                    const today = new Date().toISOString().split('T')[0]
                    this.receipts = response.data.filter(receipt => receipt.date === today)

                    let gross_total_value = 0
                    let total_quantity = 0
                    for (let i = 0; i < this.receipts.length; i++) {
                        gross_total_value += Number(this.receipts[i].gross_amount)
                        total_quantity += Number(this.receipts[i].total_quantity)
                    }
                    this.gross_total_value = gross_total_value.toFixed(2)
                    this.total_quantity = total_quantity.toFixed(2)
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
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
    }
}
</script>
