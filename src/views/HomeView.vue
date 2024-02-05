<template>
  <div class="home">
    <h1 class="title has-text-centered">Witaj na Złomie</h1>
    <section class="section">
      <div class="container">
        <!-- Start Carousel -->
        <div id="carousel-demo" class="carousel">
          <div class="item-1">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Podglądaj najważniejsze informacje</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Dashboard.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
          <div class="item-2">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Przechowuj informacje o kontrahentach</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Kontrahenci.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
          <div class="item-3">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Dodaj swoje produkty wg kategorii</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Produkty.png" alt="Metal Image" width="1000" height="200">
                </div>
              </div>
            </div>
          </div>
          <div class="item-4">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Twórz nowe kwity</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Nowy kwit.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
          <div class="item-5">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Dodawaj produkty do kwitów</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Kwit_produkty.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
          <div class="item-6">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Przeglądaj transakcje związane z danym kontrahentem</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Kontrahent.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
          <div class="item-7">
            <!-- Slide Content -->
            <div class="center-image">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <h1 class="subtitle has-text-centered">Pobieraj kwity w PDF i drukuj dwie kopie na jednej stronie A4</h1>
                </div>
                <div class="column is-12 has-text-centered">
                  <img src="../assets/Kwit_PDF.png" alt="Metal Image" width="1000" height="1000">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Carousel -->
      </div>
    </section>

    <div class="columns">
      <div class="description column is-6 content">
        <h1 class="title is-4">Możliwości</h1>
        <ul>
          <li>Tworzenie własnych produktów wg kategorii</li>
          <li>Ustawianie cen dla każdego produktu</li>
          <li>Edycja produktów i kategorii</li>
          <li>Tworzenie własnych kontrahentów z informacjami takimi jak imię i nazwisko, nr dokumentu, email, adres</li>
          <li>Edytowanie kontrahentów</li>
          <li>Podgląd kwitów przypisanych do danego kontrahenta</li>
          <li>Tworzenie kwitów</li>
          <li>Dodawanie i usuwanie produktów z kwitów</li>
          <li>Automatyczne generowanie nr kwitu na podstawie daty kwitu</li>
          <li>Edycja zapisanych kwitów</li>
          <li>Pobieranie kwitów w formacie PDF przygotowanych do wydruku w formie dwóch kopii - dla Ciebie i kontrahenta - na jednej stronie A4 do przecięcia</li>
        </ul>
      </div>
      <div class="description column is-6 content">
        <h1 class="title is-4">Planowane</h1>
        <ul>
          <li>Statystyki zmian cen w czasie</li>
          <li>Statystyki skupionych odpadów</li>
          <li>Pełna responsywność na urządzeniach mobilnych</li>
          <li>Możliwość wyeksportowania danych koniecznych do księgowości</li>
          <li>Możliwość generowania kwitu w formie potrzebnej kontrahentom do dotacji</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

<script>
export default {
  name: 'HomeView',
  mounted() {
    // Check if the bulmaCarousel object is available
    if (window.bulmaCarousel) {
      // Initialize the carousel when the component is mounted
      window.bulmaCarousel.attach('#carousel-demo', {
        slidesToScroll: 1,
        slidesToShow: 1,
      });
    }
  },
};
</script>
