<template>
    <div class="page-clients">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li class="is-active"><router-link to="/dashboard/clients" aria-current="true">Kontrahenci</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Kontrahenci</h1>

                <router-link :to="{ name: 'AddClient' }" class="button is-light mt-4">Nowy kontrahent</router-link>
            </div>

            <div class="column is-12 table-container">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Nazwisko i Imię</th>
                            <th>Nr dokumentu</th>
                            <th>Email</th>
                            <th>Adres</th>
                            <th>Kod pocztowy</th>
                            <th>Miejscowość</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="client in clients"
                            v-bind:key="client.id"
                        >
                            <td>{{ client.name }}</td>
                            <td>{{ client.doc_number }}</td>
                            <td>{{ client.email }}</td>
                            <td>{{ client.address1 }}</td>
                            <td>{{ client.zipcode }}</td>
                            <td>{{ client.place }}</td>
                            <td>
                                <router-link :to="{ name: 'Client', params: { id: client.id }}">Szczegóły</router-link>
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
    name: 'Clients',
    data() {
        return {
            clients: []
        }
    },
    mounted() {
        this.getClients()
    },
    methods: {
        getClients() {
            axios
                .get('/api/v1/clients/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.clients.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }
}
</script>