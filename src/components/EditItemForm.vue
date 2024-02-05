<template>
    <div class="columns">

        <div class="column is-3">
            <label>Produkt</label>

            <div class="control">
                <div id="item-select" class="select">
                    <select name="name" v-model="item.name" @change="itemChange($event)">
                        <option value="">- wybierz produkt -</option>
                        <option 
                            v-for="item in items"
                            v-bind:key="item.id"
                            v-bind:value="item.name"
                        >
                            {{ item.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <div class="column is-2">
            <div class="field">
                <label>Kod odpadu</label>
                <div class="control">
                    <input type="text" name="item_code" class="input has-text-centered" v-model="item.item_code" disabled>
                </div>
            </div>
        </div>

        <div class="column is-2">
            <div class="field">
                <label>Cena skupu [zł]</label>
                <div class="control">
                    <input type="number" name="buy_price" step="0.01" class="input has-text-right" v-model="item.buy_price" @change="itemUpdate">
                </div>
            </div>
        </div>

        <div class="column is-2">
            <div class="field">
                <label>Ilość [kg]</label>
                <div class="control">
                    <input type="number" name="quantity" step="0.01" class="input has-text-right" v-model="item.quantity" @change="itemUpdate">
                </div>
            </div>
        </div>

        <div class="column is-2">
            <div class="field">
                <label>Wartość [zł]</label>
                <div class="control">
                    <input type="number" step="0.01" class="input has-text-right" v-bind:value="gross_amount" disabled>
                </div>
            </div>
        </div>

        <div class="column is-1">
            <label>&nbsp;</label>
            <div class="control">
                <button class="button is-danger is-rounded is-outlined" style="width: 2.5em" @click="deleteItem"><strong>-</strong></button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'EditItemForm',
    props: {
        initialItem: Object
    },
    data() {
        return {
            item: this.initialItem,
            items: []
        }
    },
    mounted() {
        this.getItems()
        // this.initiate()
    },
    methods: {
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
        itemChange() {
            // Find the selected item from the items array
            const selectedItemName = this.item.name;
            const selectedItem = this.items.find((item) => item.name === selectedItemName);

            // Update the buy_price field with the selected item's buy_price
            if (selectedItem) {
                this.item.buy_price = selectedItem.buy_price;
                this.item.item_code = selectedItem.item_code;
                this.item.source_id = selectedItem.id;
                this.item.id = selectedItem.id;
            }

            // Emit an event to notify the parent component about the updated item
            this.$emit('itemUpdated', this.item);
            this.$emit('updatePrice', this.item);
        },
        itemUpdate() {
            // Emit an event to notify the parent component about the updated item
            this.$emit('itemUpdated', this.item);
            this.$emit('updatePrice', this.item);
        },
        deleteItem() {
            // Emit an event to notify the parent component about the deletion
            this.$emit('deleteItem', this.item.item_num)
        },
    },
    computed: {
        gross_amount() {
            const buy_price = this.item.buy_price
            const quantity = this.item.quantity

            this.item.gross_amount = buy_price * quantity

            this.item.gross_amount = Number(this.item.gross_amount.toFixed(2))

            // this.$emit('updatePrice', this.item)

            return this.item.gross_amount.toFixed(2)
        }
    }
}
</script>