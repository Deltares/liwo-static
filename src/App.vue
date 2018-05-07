<template>
  <div class="site-outer-wrapper">
    <div class="site-container" id="app">
      <header role="banner" class="site-header">
        <nav>
          <a><router-link :to="{name: 'contact'}">Contact</router-link></a>
        </nav>
        <h1><a href="" class="logo"><img src="https://staticresources.rijkswaterstaat.nl/assets/img/logo.png?v=2.19.2" width="270" height="72" alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat." class="accessibility"></a></h1>
      </header>
      <div role="navigation" class="site-nav">
        <div class="container noindex">

          <button class="offcanvas__close"><span class="accessibility">Navigatie sluiten</span></button><nav id="nav" class="nav-main">
            <ul>
              <li class="main-item "><router-link :to="{name: 'home'}">Home</router-link></li>
              <li class="main-item  "><router-link :to="{name: 'maps'}">Kaarten</router-link></li>
              <li class="main-item  "><router-link :to="{name: 'about'}">Over LIWO</router-link></li>
            </ul>
            <ul class="quicklinks">
              <li><router-link :to="{name: 'contact'}">Contact</router-link></li>
            </ul>
          </nav>

        </div>
      </div>
      <div id="content" role="main">
        <!-- main content goes here, based on router view -->
        <router-view/>
      </div>
      <footer class="site-footer noindex">
        <img src="https://staticresources.rijkswaterstaat.nl/assets/img/footer-logo.png?v=2.19.2" width="500" height="24" alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat. Water. Wegen. Werken." class="accessibility">
        <div class="site-footer__content">
          <!-- nothing here for now -->
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
  @import './styles/rws.css';
  @import './styles/rws-embedded.css';

</style>
