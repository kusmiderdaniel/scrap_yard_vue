<template>
    <div class="page-add-client">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/clients">Kontrahenci</router-link></li>
                <li class="is-active"><router-link to="/dashboard/clients/add" aria-current="true">Nowy kontrahent</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Nowy kontrahent</h1>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Nazwisko i Imię (na potrzeby sortowania podaj w takiej kolejności)</label>
                    
                    <div class="control">
                        <input type="text" name="name" class="input" v-model="client.name">
                    </div>
                </div>

                <div class="field">
                    <label>Email</label>
                    
                    <div class="control">
                        <input type="email" name="email" class="input" v-model="client.email">
                    </div>
                </div>

                <div class="field">
                    <label>Numer dowodu osobistego / Paszportu</label>
                    
                    <div class="control">
                        <input type="email" name="doc_number" class="input" v-model="client.doc_number">
                    </div>

                    <p class="help is-danger" v-if="!validateDocNumber(client.doc_number)">
                        Numer dowodu osobistego musi składać się z 3 liter i 6 cyfr.
                        Numer paszportu musi składać się z 2 liter i 7 cyfr.
                    </p>
                </div>

                <div class="field">
                    <label>Adres</label>
                    
                    <div class="control">
                        <input type="text" name="address1" class="input" v-model="client.address1">
                    </div>
                </div>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Kod pocztowy</label>
                    
                    <div class="control">
                        <input type="text" name="zipcode" class="input" placeholder="00-000" v-model="client.zipcode" @input="zipcodeInput">
                    </div>

                    <p class="help is-danger" v-if="!validateZipCode(client.zipcode)">
                        Kod pocztowy musi być w formacie 00-000.
                    </p>
                </div>

                <div class="field">
                    <label>Miejscowość</label>
                    
                    <div class="control">
                        <input type="text" name="place" class="input" v-model="client.place">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <button class="button is-success mr-4" @click="submitForm">Zapisz</button>
                        <button class="button is-danger" @click="confirmCancel()">Anuluj</button>
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
    name: 'AddClient',
    data() {
        return {
            client: {}
        }
    },
    methods: {
        confirmCancel() {
            const confirmMessage = `Czy na pewno chcesz anluować wprowadzanie kontrahenta?`

            if (window.confirm(confirmMessage)) {
                this.$router.push('/dashboard/clients')
            }
        },
        validateName(name) {
            // Check if the name is not empty
            return name !== undefined && name.trim() !== '';
        },
        validateDocNumber(docNumber) {
            // Define the regular expressions for validation
            const regex1 = /^[A-Za-z]{3}\d{6}$/; // 3 letters + 6 digits - ID
            const regex2 = /^[A-Za-z]{2}\d{7}$/; // 2 letters + 7 digits - passport

            // Check if the docNumber matches either of the regular expressions
            return regex1.test(docNumber) || regex2.test(docNumber) 
        },
        validateZipCode(zipcode) {
            const regex = /^\d{2}-\d{3}$/; // Pattern for "00-000"
            return regex.test(zipcode);
        },
        zipcodeInput() {
            let zipcode_text = this.client.zipcode || ''

            // Allow backspace and delete
            if (zipcode_text.length === 6 && event.inputType === 'deleteContentBackward') {
                zipcode_text = zipcode_text.substring(0, 6);
            } else if (zipcode_text.length === 3 && event.inputType === 'deleteContentBackward') {
                zipcode_text = zipcode_text.substring(0, 3);
            }

            // Add "-" after the first two characters
            if (zipcode_text.length === 2 && event.inputType !== 'deleteContentBackward') {
                zipcode_text += '-';
            }

            this.client.zipcode = zipcode_text
        },
        submitForm() {

            // Validate name
            if (!this.validateName(this.client.name)) {
                // Display an error message and prevent form submission
                toast({
                    message: 'Podaj nazwisko i imię.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            // Validate doc_number
            if (!this.validateDocNumber(this.client.doc_number)) {
                // Display an error message and prevent form submission
                toast({
                    message: 'Nieprawidłowy numer dowodu osobistego / Paszportu.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            // Validate zip code
            if (this.client.zipcode && !/^(\d{2}-\d{3})?$/.test(this.client.zipcode)) {
                // Display an error message for invalid zip code
                toast({
                    message: 'Nieprawidłowy kod pocztowy. Wprowadź w formie 00-000.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            axios
                .post("/api/v1/clients/", this.client)
                .then(response => {
                    toast({
                        message: 'Dodano klienta',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/clients')
                })
                .catch(error => {
                    console.log(error.response)
                })
        }
    }
}
</script>