<template>
    <div class="page-items-stats">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/items">Produkty</router-link></li>
                <li class="is-active"><router-link to="/dashboard/items/stats" aria-current="true">Statystyki produktów</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Statystyki produktów</h1>

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
                    
                    <label class="label">Kod odpadu</label>
                    <div class="select">
                        <select name="item_code" v-model="filter">
                            <option value="">wszystkie</option>
                            <option v-for="item in itemCodes" :key="item" :value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>

                <div class="column is-12 table-container">
                    <table class="table is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th @click="sortBy('item_code')"><div style="width: 100px;">Kod odpadu</div></th>
                                <th @click="sortBy('name')"><div style="width: 200px;">Produkt</div></th>
                                <th @click="sortBy('quantity')"><div class="has-text-right" style="width: 100px;">Ilość</div></th>
                                <th @click="sortBy('gross_amount')"><div class="has-text-right" style="width: 120px;">Wypłacono</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in sortedItems"
                                v-bind:key="item.id"
                            >
                                <td>{{ item.item_code }}</td>
                                <td>{{ item.name }}</td>
                                <td class="has-text-right">{{ formatNumber(item.quantity) }} kg</td>
                                <td class="has-text-right">{{ formatNumber(item.gross_amount) }} zł</td>
                            </tr>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td></td>
                                <td class="has-text-right"><strong>{{ formatNumber(totalQuantity) }} kg</strong></td>
                                <td class="has-text-right"><strong>{{ formatNumber(totalGrossAmount) }} zł</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- <div class="column is-6">
                    <StatsChart :sortedItems="sortedItems" />
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'
import StatsChart from '@/components/StatsChart.vue';

export default {
    name: 'ItemStatistics',
    data() {
        return {
            dateFrom: '',
            dateTo: '',
            receipt_items: [],
            unique_items: [],
            sortByColumn: null,
            sortDirection: 'asc',
            filter: '',
        }
    },
    components: {
        StatsChart
    },
    mounted() {
        this.getReceiptItems(),
        this.setWeekRange(),
        this.sortBy('item_code')
    },
    computed: {
        sortedItems() {
            let filteredItems = [...this.unique_items];
            if (this.filter) {
                filteredItems = filteredItems.filter(item => item.item_code === this.filter);
            }
            if (this.sortByColumn) {
                filteredItems.sort((a, b) => {
                    const valA = a[this.sortByColumn];
                    const valB = b[this.sortByColumn];
                    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            return filteredItems;
        },
        itemCodes() {
            // Get unique item codes from unique_items
            return [...new Set(this.unique_items.map(item => item.item_code))];
        },
        totalQuantity() {
            let totalQuantity = 0
            for (let i = 0;i < this.sortedItems.length; i++) {
                totalQuantity += this.sortedItems[i].quantity
            }
            return totalQuantity
        },
        totalGrossAmount() {
            let totalGrossAmount = 0
            for (let i = 0;i < this.sortedItems.length; i++) {
                totalGrossAmount += this.sortedItems[i].gross_amount
            }
            return totalGrossAmount
        }
    },
    methods: {
        getReceiptItems() {
            axios
                .get('/api/v1/receipts/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].date >= this.dateFrom && response.data[i].date <= this.dateTo) {
                            for (let x = 0; x < response.data[i].receipt_items.length; x++) {
                                this.receipt_items.push(response.data[i].receipt_items[x])
                            }
                        }
                    }
                    this.calculateItems()
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        calculateItems() {
            // Initialize an object to store unique items
            const uniqueItemsMap = {};

            this.receipt_items.forEach(item => {
                const { source_id, name, item_code, quantity, gross_amount } = item;
                
                // Convert gross_amount to a number
                const grossAmountNumber = parseFloat(gross_amount);
                
                if (uniqueItemsMap[source_id]) {
                    // If item exists, update quantity and gross_value
                    uniqueItemsMap[source_id].name = name;
                    uniqueItemsMap[source_id].item_code = item_code;
                    uniqueItemsMap[source_id].quantity += quantity;
                    uniqueItemsMap[source_id].gross_amount += grossAmountNumber;
                } else {
                    // If item does not exist, create new entry
                    uniqueItemsMap[source_id] = {
                        source_id,
                        name,
                        item_code,
                        quantity,
                        gross_amount: grossAmountNumber
                    };
                }
            });
            
            // Convert object to array of unique items
            this.unique_items = Object.values(uniqueItemsMap);
        },
        async dateChange() {
            await this.getReceiptItems()
            await this.calculateItems
        },
        setWeekRange() {
            const currentDate = new Date();
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+1));
            const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
            
            // Format dates as YYYY-MM-DD strings
            const formattedFirstDay = firstDayOfWeek.toISOString().split('T')[0];
            const formattedLastDay = lastDayOfWeek.toISOString().split('T')[0];
            
            // Set the data properties
            this.dateFrom = formattedFirstDay;
            this.dateTo = formattedLastDay;
        },
        sortBy(column) {
            // Toggle sort direction if the same column header is clicked
            if (this.sortByColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // Otherwise, set the column to sort by and reset sort direction
                this.sortByColumn = column;
                this.sortDirection = 'asc';
            }
        },
        formatNumber(number) {
            // Convert number to string and split it into integer and decimal parts
            const parts = number.toFixed(2).toString().split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1];
            // Insert space every three digits in the integer part
            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            // Concatenate formatted integer part with decimal part and return
            return `${formattedInteger},${decimalPart}`;
        }
    }
}
</script>