<template>
  <div id="wrapper">
    <nav class="navbar is-fixed-top is-dark" role="navigation" aria-label="main-navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
        </a>
        <router-link :to="$store.state.isAuthenticated ? '/dashboard' : '/'" class="navbar-item"><strong>ZłomApp</strong></router-link>
      
        <a role="button" @click="makeBurger" class="navbar-burger is-right" aria-label="menu" aria-expanded="false" data-target="navMenu" v-bind:class="{ 'is-active': activator }">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navMenu" class="navbar-menu is-right" v-bind:class="{ 'is-active': activator }">
        <div class="navbar-end">
          <template v-if="$store.state.isAuthenticated">
            <router-link to="/dashboard" class="navbar-item has-text-right">Dashboard</router-link>
            <router-link to="/dashboard/clients" class="navbar-item has-text-right">Kontrahenci</router-link>
            <router-link to="/dashboard/items" class="navbar-item has-text-right">Produkty</router-link>
            <router-link to="/dashboard/receipts" class="navbar-item has-text-right">Kwity</router-link>
            <router-link to="/dashboard/receipts/add-receipt" class="navbar-item has-text-weight-bold has-text-success has-text-right">Nowy kwit</router-link>
            
            <hr>

            <div class="navbar-item is-hoverable">
              <a class="navbar-link has-text-right">
                Moje konto
              </a>

              <div class="navbar-dropdown is-right has-text-right">
                <a class="navbar-item">
                  <router-link to="/dashboard/my-account/edit-team" class="has-text-black">Edytuj dane firmy</router-link>
                </a>
                <a class="navbar-item has-text-danger has-text-weight-bold" @click="logout()">
                  Wyloguj
                </a>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="navbar-item">
              <div class="buttons">
                <!-- <router-link to="/sign-up" class="button is-success"><strong>Rejestracja</strong></router-link> -->
                <router-link to="/log-in" class="button is-light">Logowanie</router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <section class="section">
      <router-view/>
    </section>

    <footer class="footer has-text-centered mt-auto is-flex-align-items-flex-end">
      <p>Copyright (c) 2024</p>
      <p>Daniel Kuśmider</p>
      <p>kusmiderdaniel@gmail.com</p>
    </footer>
    <div v-if="activator" @click="closeBurger" class="navbar-overlay"></div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'App',
    data () {
      return {
        msg: '',
        activator: false,
        dropdown_activator: false,
      }
    },
    beforeCreate() {
      this.$store.commit('initializeStore')

      const token = this.$store.state.token

      if (token) {
        axios.defaults.headers.common['Authorization'] = 'Token ' + token
      } else {
        axios.defaults.headers.common['Authorization'] = ''
      }
    },
    methods: {
      makeBurger () {
        this.activator = !this.activator
        return this.activator
      },
      closeBurger() {
        this.activator = false;
      },
      logout() {
        axios
            .post("/api/v1/token/logout/")
            .then(response => {
                axios.defaults.headers.common["Authorization"] = ""

                localStorage.removeItem("username")
                localStorage.removeItem("userid")
                localStorage.removeItem("token")

                this.$store.commit('removeToken')

                this.$router.push('/')
            })
            .catch(error => {
                if (error.response) {
                    console.log(JSON.stringify(error.response.data))
                } else if (error.message) {
                    console.log(JSON.stringify(error.message))
                } else {
                    console.log(JSON.stringify(error))
                }
            })
        }
    },
    watch: {
      // Watch for route changes and close the burger menu
      '$route': 'closeBurger',
  },
  }
</script>

<style lang="scss">
@import '../node_modules/bulma';

.navbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
</style>
