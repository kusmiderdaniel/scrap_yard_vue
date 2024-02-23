<template>
    <div class="page-receipts">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Kwity</router-link></li>
                <li class="is-active"><router-link to="/dashboard/receipts/accounting" aria-current="true">Zestawienie księgowe</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Kwity</h1>
            </div>

            <div class="column is-3">
                <div class="field">
                    <label class="label">Zakres od:</label>

                    <div class="control">
                        <input type="date" name="receipt_date" class="input" v-model="dateFrom" @change="dateChange">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Zakres do:</label>

                    <div class="control">
                        <input type="date" name="receipt_date" class="input" v-model="dateTo" @change="dateChange">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="columns is-multiline">
            <div class="column is-4 table-container">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th style="width: 100px;">Numer</th>
                            <th class="has-text-centered" style="width: 100px;">Data</th>
                            <th class="has-text-right" style="width: 120px;">Wartość</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="receipt in receipts"
                            v-bind:key="receipt.id"
                        >
                            <td>{{ receipt.receipt_number }}</td>
                            <td class="has-text-centered">{{ formatDate(receipt.date) }}</td>
                            <td class="has-text-right">{{ formatNumber(receipt.gross_amount) }} zł</td>
                        </tr>
                        <tr>
                                <td><strong>Total</strong></td>
                                <td></td>
                                <td class="has-text-right"><strong>{{ formatNumber(totalGrossAmount) }} zł</strong></td>
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
    name: 'ReceiptsAcounting',
    data() {
        return {
            dateFrom: '',
            dateTo: '',
            receipts: []
        }
    },
    mounted() {
        this.setWeekRange(),
        this.getReceipts()
    },
    computed: {
        totalGrossAmount() {
            let totalGrossAmount = 0
            for (let i = 0;i < this.receipts.length; i++) {
                totalGrossAmount += Number(this.receipts[i].gross_amount)
            }
            return totalGrossAmount
        }
    },
    methods: {
        getReceipts() {
            axios
                .get('/api/v1/receipts/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].date >= this.dateFrom && response.data[i].date <= this.dateTo) {
                            this.receipts.push(response.data[i])
                        }
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
        async dateChange() {
            await this.getReceipts()
        },
        setWeekRange() {
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            
            // Format dates as YYYY-MM-DD strings
            const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];
            const formattedLastDay = lastDayOfMonth.toISOString().split('T')[0];
            
            // Set the data properties
            this.dateFrom = formattedFirstDay;
            this.dateTo = formattedLastDay;
        },
    }
}

</script>