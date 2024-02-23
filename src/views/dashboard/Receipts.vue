<template>
    <div class="page-receipts">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li class="is-active"><router-link to="/dashboard/receipts" aria-current="true">Kwity</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Kwity</h1>
            </div>

            <div class="column is-12 buttons">
                <router-link to="/dashboard/receipts/add-receipt" class="button is-success">Nowy kwit</router-link>
                <router-link to="/dashboard/receipts/accounting" class="button is-info">Zestawienie księgowe</router-link>
            </div>

            <div class="column is-12 table-container">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th style="width: 300px;">Numer</th>
                            <th style="width: 200px;">Data</th>
                            <th style="width: 200px;">Kontrahent</th>
                            <th style="width: 200px;">Nr dokumentu</th>
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
                            <td>{{ formatDate(receipt.date) }}</td>
                            <td>{{ receipt.client_name }}</td>
                            <td>{{ receipt.client_doc_number }}</td>
                            <td class="has-text-right">{{ formatNumber(receipt.gross_amount) }} zł</td>
                            <td class="has-text-right">
                                <router-link :to="{ name: 'Receipt', params: { id: receipt.id }}">Szczegóły</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Receipts',
    data() {
        return {
            receipts: []
        }
    },
    mounted() {
        this.getReceipts()
    },
    methods: {
        getReceipts() {
            axios
                .get('/api/v1/receipts/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.receipts.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        formatNumber(number) {
            // Convert number to string and split it into integer and decimal parts
            const parts = Number(number).toFixed(2).toString().split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1];
            // Insert space every three digits in the integer part
            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            // Concatenate formatted integer part with decimal part and return
            return `${formattedInteger},${decimalPart}`;
        },
    }
}

</script>