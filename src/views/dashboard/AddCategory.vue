<template>
    <div class="page-add-category">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/items">Produkty</router-link></li>
                <li class="is-active"><router-link to="/dashboard/items/add-category" aria-current="true">Nowa kategoria</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Nowa kategoria</h1>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Nazwa</label>
                    
                    <div class="control">
                        <input type="text" name="name" class="input" v-model="category.name">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <button class="button is-success mr-4" @click="submitForm">Zapisz</button>
                        <button class="button is-danger" @click="confirmCancel">Anuluj</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'AddCategory',
    data() {
        return {
            category: {}
        }
    },
    methods: {
        confirmCancel() {
            const confirmMessage = `Czy na pewno chcesz anluować wprowadzanie kategorii?`

            if (window.confirm(confirmMessage)) {
                this.$router.push('/dashboard/items')
            }
        },
        submitForm() {
            axios
                .post("/api/v1/categories/", this.category)
                .then(response => {
                    toast({
                        message: 'Dodano kategorię',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/items')
                })
                .catch(error => {
                    console.log(error.response)
                })
        }
    }
}
</script>