<template>
  <div class="home site-landing">
    <div class="landing">

      <div class="landing-cover compact"></div>
      <div class="landing-title">
        <h1>LIWO</h1>
      </div>
      <div class="landing-header">
        <p class="lead">
          Het Landelijk Informatiesysteem Water en Overstromingen (LIWO) bevat kaartlagen voor professionals die zich
          bezighouden met (de voorbereiding op) wateroverlast en overstromingen in Nederland. Het LIWO is een product
          van het Watermanagementcentrum Nederland (WMCN).
        </p>
      </div>
      <section class="landing-body section" role="main">
        <h3>Gebruik</h3>

        <p>
          Het juist duiden van beschikbare kaartlagen vereist specialistische kennis. Deze kennis is beschikbaar bij
          waterbeheerders. Het wordt daarom aanbevolen om deze kennis te betrekken, zowel bij ruimtelijke adaptatie als bij
          wateroverlast en (de voorbereiding op) overstromingen.
        </p>
        <p>Voor niet-professionele gebruikers is er <a href="https://www.overstroomik.nl">www.overstroomik.nl</a>.</p>
        <p>
          Voor uitleg over het gebruik en de gebruikershandleiding kunt u terecht op de <a href="https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/">Helpdesk Water</a>. Hier vindt u ook
          contactgegevens voor het aanvragen van LIWO-opleidingen.
        </p>

        <p>
          Het juist vertalen van beschikbare kaartlagen naar
          bruikbare informatie voor de voorbereiding op
          overstromingen vereist specialistische kennis. Deze kennis
          is beschikbaar bij waterbeheerders. Het wordt daarom
          aanbevolen om deze kennis te betrekken, zowel bij
          ruimtelijke adaptatie en de voorbereiding op
          overstromingen als in hoogwatersituaties.
        </p>
      </section>
    </div>
  </div>
</template>
<script>
const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'

export default {
  name: 'home',
  mounted () {
    this.$store.commit('setPageTitle', PAGE_TITLE)
  }
}
</script>
<style>
  .landing-cover {
  background-image: url("../img/Rhenen 3 hoogwater 1600-400.jpg");
  /* we're in the content now, move back up a bit */
  }
  /* float in the center */
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
</style>
