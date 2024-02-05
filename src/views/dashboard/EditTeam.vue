<template>
    <div class="page-edit-team">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/my-account">Moje konto</router-link></li>
                <li class="is-active"><router-link to="/dashboard/my-account/edit-team" aria-current="true">Edytuj dane firmy</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Edytuj dane firmy</h1>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Nazwa</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.name">
                    </div>
                </div>

                <div class="field">
                    <label>Imię i Nazwisko właściciela</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.owner_name">
                    </div>
                </div>

                <div class="field">
                    <label>Nazwa skrócona</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.short_name">
                    </div>
                </div>

                <div class="field">
                    <label>NIP</label>
                    <div class="control">
                        <input type="text" class="input" placeholder="000-000-00-00" v-model="team.org_number" @input="orgNumberInput">
                    </div>
                    <p class="help is-danger" v-if="!validateOrgNumber(team.org_number)">
                        NIP musi być w formacie 000-000-00-00.
                    </p>
                </div>

                <div class="field">
                    <label>REGON</label>
                    <div class="control">
                        <input type="text" class="input" placeholder="000000000" v-model="team.org_number2">
                    </div>
                    <p class="help is-danger" v-if="!validateOrgNumber2(team.org_number2)">
                        REGON musi zawierać 9 cyfr.
                    </p>
                </div>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label>Numer telefonu</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.phone_number" @input="phoneNumberInput">
                    </div>
                    <p class="help is-danger" v-if="!validatePhoneNumber(team.phone_number)">
                        Numer telefonu powinien być w formacie "+00 000 000 000" lub "000 000 000".
                    </p>
                </div>

                <div class="field">
                    <label>Email</label>
                    <div class="control">
                        <input type="email" class="input" v-model="team.email">
                    </div>
                </div>

                <div class="field">
                    <label>Adres</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.address1">
                    </div>
                </div>

                <div class="field">
                    <label>Kod pocztowy</label>

                    <div class="control">
                        <input type="text" class="input" placeholder="00-000" v-model="team.zipcode" @input="zipcodeInput">
                    </div>

                    <p class="help is-danger" v-if="!validateZipCode(team.zipcode)">
                        Kod pocztowy musi być w formacie 00-000.
                    </p>
                </div>

                <div class="field">
                    <label>Miejscowość</label>
                    <div class="control">
                        <input type="text" class="input" v-model="team.place">
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <button class="button is-success" @click="submitForm">Zapisz</button>
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
    name: 'EditTeam',
    data() {
        return {
            team: {}
        }
    },
    async mounted() {
        await this.getOrCreateTeam()
    },
    methods: {
        getOrCreateTeam() {
            axios
                .get('/api/v1/teams/')
                .then(response => {
                    this.team = response.data[0]
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        validateZipCode(zipcode) {
            const regex = /^\d{2}-\d{3}$/; // Pattern for "00-000"
            return regex.test(zipcode);
        },
        validateOrgNumber(orgNumber) {
            const regex = /^\d{3}-\d{3}-\d{2}-\d{2}$/; // Pattern for "000-000-00-00"
            return regex.test(orgNumber);
        },
        validateOrgNumber2(orgNumber2) {
            const regex = /^\d{9}$/; // Pattern for "000000000"
            return regex.test(orgNumber2);
        },
        validatePhoneNumber(phone_number) {
            const regex1 = /^\d{3} \d{3} \d{3}$/; // Pattern for "000 000 000"
            const regex2 = /^\+\d{2} \d{3} \d{3} \d{3}$/; // Pattern for "+48 000 000 000"
            return regex1.test(phone_number) || regex2.test(phone_number)
        },
        zipcodeInput() {
            let zipcode_text = this.team.zipcode || ''

            // Allow backspace and delete
            if (zipcode_text.length === 6 && event.inputType === 'deleteContentBackward') {
                zipcode_text = zipcode_text.substring(0, 6);
            } else if (zipcode_text.length === 3 && event.inputType === 'deleteContentBackward') {
                zipcode_text = zipcode_text.substring(0, 2);
            }

            // Add "-" after the first two characters
            if (zipcode_text.length === 2 && event.inputType !== 'deleteContentBackward') {
                zipcode_text += '-';
            }

            this.team.zipcode = zipcode_text
        },
        phoneNumberInput() {
            let phone_number_text = this.team.phone_number || ''

            // Allow backspace and delete
            if (phone_number_text.length === 15 && event.inputType === 'deleteContentBackward') {
                phone_number_text = phone_number_text.substring(0, 15);
            } else if (phone_number_text.length === 11 && event.inputType === 'deleteContentBackward') {
                phone_number_text = phone_number_text.substring(0, 11);
            } else if (phone_number_text.length === 7 && event.inputType === 'deleteContentBackward') {
                phone_number_text = phone_number_text.substring(0, 7);
            } else if (phone_number_text.length === 3 && event.inputType === 'deleteContentBackward') {
                phone_number_text = phone_number_text.substring(0, 3);
            }

            // Add "-" after the first two characters
            if (phone_number_text.length === 3 && event.inputType !== 'deleteContentBackward') {
                phone_number_text += ' ';
            } else if (phone_number_text.length === 7 && event.inputType !== 'deleteContentBackward') {
                phone_number_text += ' ';
            } else if (phone_number_text.length === 12 && event.inputType !== 'deleteContentBackward') {
                phone_number_text = phone_number_text.substring(0, 11) + ' ' + phone_number_text.substring(11, 12)
            }

            this.team.phone_number = phone_number_text
        },
        orgNumberInput() {
            let org_number_text = this.team.org_number || ''

            // Allow backspace and delete
            if (org_number_text.length === 13 && event.inputType === 'deleteContentBackward') {
                org_number_text = org_number_text.substring(0, 13);
            } else if (org_number_text.length === 10 && event.inputType === 'deleteContentBackward') {
                org_number_text = org_number_text.substring(0, 10);
            } else if (org_number_text.length === 7 && event.inputType === 'deleteContentBackward') {
                org_number_text = org_number_text.substring(0, 7);
            }

            // Add "-" after the first two characters
            if (org_number_text.length === 3 && event.inputType !== 'deleteContentBackward') {
                org_number_text += '-';
            } else if (org_number_text.length === 7 && event.inputType !== 'deleteContentBackward') {
                org_number_text += '-';
            } else if (org_number_text.length === 10 && event.inputType !== 'deleteContentBackward') {
                org_number_text += '-';
            }

            this.team.org_number = org_number_text
        },
        submitForm() {

            // Validate org_number
            if (this.team.org_number && !/^\d{3}-\d{3}-\d{2}-\d{2}$/.test(this.team.org_number)) {
                // Display an error message for invalid zip code
                toast({
                    message: 'Nieprawidłowy NIP. Wprowadź w formie 000-000-00-00.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            // Validate org_number2
            if (this.team.org_number2 && !/^\d{9}$/.test(this.team.org_number2)) {
                // Display an error message for invalid org number 2
                toast({
                    message: 'REGON powinien składać się z 9 cyfr.',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 3000,
                    position: 'bottom-right',
                });
                return;
            }

            // Validate zip code
            if (this.team.zipcode && !/^(\d{2}-\d{3})?$/.test(this.team.zipcode)) {
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
                .patch(`/api/v1/teams/${this.team.id}/`, this.team)
                .then(response => {
                    toast({
                        message: 'Zmiany zostały zapisane',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/my-account')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }
}
</script>