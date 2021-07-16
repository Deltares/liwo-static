<template>
<div class="site-outer-wrapper">
  <vue-skip-to class="skip-link" to="#content" label="Direct naar hoofdinhoud" />
  <vue-skip-to class="skip-link" to="#nav" label="Direct naar hoofdnavigatie" />

  <div class="site-container" id="app">
    <app-header :page-title="title" />
    <main id="content" role="main">
      <!-- main content goes here, based on router view -->
      <!-- make sure we  reload when changing the route name -->
      <router-view :key="$route.name" />
    </main>

    <footer class="site-footer noindex">
      <img src="https://staticresources.rijkswaterstaat.nl/assets/img/footer-logo.png?v=2.19.2" width="500" height="24" alt="Water. Wegen. Werken. Rijkswaterstaat." class="accessibility">
      <div class="site-footer__content">
        <cookie-law
          @accept="consentGiven()"
          message="Deze website gebruikt anonieme cookies."
          button-class="btn primary"
          button-text="Accepteer"
          :button-decline="true"
          button-decline-text="Geen cookies"
          button-decline-class="btn warning"
          button-link="https://www.rijkswaterstaat.nl/cookies"
          button-link-text="Meer info"
          :button-link-new-tab="true"
        >
        </cookie-law>
      </div>
    </footer>
  </div>

  <portal-target name="portal-target" />
</div>
</template>

<script>
import CookieLaw from 'vue-cookie-law'
import { mapGetters } from 'vuex'
import AppHeader from '../src/components/AppHeader.vue'

export default {
  components: {
    AppHeader,
    CookieLaw
  },
  head: {
    title () {
      if (!this.title) {
        return {
          inner: '',
          separator: ' '
        }
      }

      return {
        inner: this.title
      }
    }
  },
  methods: {
    consentGiven () {
      this.$matomo && this.$matomo.rememberConsentGiven()
    }
  },
  watch: {
    title: {
      immediate: true,
      handler () {
        // emit this event to let vue-head know it should update the title element
        // https://www.npmjs.com/package/vue-head#update-elements-with-asynchronous-data-or-after-page-loaded
        this.$emit('updateHead')
      }
    }
  },
  computed: {
    ...mapGetters([
      'layerSet'
    ]),
    title () {
      if (this.$route.name === 'viewer') {
        if (this.layerSet) {
          return this.layerSet.title
        }
      }

      return this.$route.meta.title
    }
  }
}
</script>

<style lang="scss">
@import './styles/rws.css';
/* overwrites font-face with location from https://staticresources.rijkswaterstaat.nl/ */
@import './styles/rws-embedded.css';
@import './styles/liwo.css';
@import './styles/skip-links.css';

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

ul,
ul > li {
  margin: 0;
  padding: 0;
}

ul > li::before {
  content: none;
  float: none;
  margin-left: 0;
}

.icon {
  vertical-align: middle;
}

.site-footer__content {
  padding: 0.5em 0.5em;
}
.Cookie__buttons .btn {
  margin-right: .9375rem;
}
</style>
