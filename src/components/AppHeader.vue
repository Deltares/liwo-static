<template>
  <header class="app-header">
    <div role="banner" class="site-header">
      <nav class="app-header__top-nav">
        <router-link :to="{name: 'contact'}">Contact</router-link>
        <router-link :to="{name: 'accessibility'}">Toegankelijkheid</router-link>
        <a  href="https://www.rijkswaterstaat.nl/cookies">Cookies</a>
      </nav>
      <a href="/" class="logo"><img src="https://staticresources.rijkswaterstaat.nl/assets/img/logo.png?v=2.19.2" width="270" height="72" alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat." class="accessibility"></a>
  </div>
  <div id="menu" class="app-header__menu">
    <div class="app-header__top-menu container">
        <div class="app-header__app-title"><strong>LIWO</strong></div>
        <!-- <div class="app-header__login"><span>(Guest)</span>&nbsp;<a href="/liwo/#/login">Inloggen</a> </div> -->
    </div>
      <nav role="navigation" class="app-header__nav" id="nav">
        <ul class="container">
          <li><router-link :to="{name: 'home'}" exact>Home</router-link></li>
          <li><router-link :to="{name: 'maps'}">Kaarten</router-link></li>
          <li><router-link :to="{name: 'about'}">Over LIWO</router-link></li>
        </ul>
      </nav>
    <h1 class="app-header__page-title container">{{ this.pageTitle }}</h1>
  </div>
  </header>
</template>

<script>
export default {
  props: {
    pageTitle: {
      type: String,
      default: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
    }
  }
}
</script>

<style>
  @import './variables.css';

  .app-header {
    min-width: 320px;
  }
  .app-header .container {
    padding: 0 1rem;
    width: calc(100% - 2rem);
    max-width: 1200px;
    margin: auto;
  }
  .app-header__menu {
    background-color: var(--light-yellow);
  }
  .app-header__top-menu {
    display: flex;
    justify-content: space-between;
    padding: .25rem;
    font-size: 1.2em;
  }

  .site-header .app-header__top-nav {
    display: flex;
    flex-direction: column;
    text-align: right;
  }

  .app-header__nav {
    margin-left: -1em;
    padding-right: 1em;
    background-color: var(--yellow);
    color: var(--black);
    font-size: 1.2em;
    font-weight: 400;
  }
  .app-header__nav ul {
    display: flex;
  }
  .app-header__nav li {
    margin: 0;
    list-style: none;
  }
  .app-header__nav a {
    color: inherit;
    display: inline-block;
    padding: 6px 1em;
  }
  .app-header__nav a:hover,
  .app-header__nav a.router-link-active {
    background-color: var(--light-yellow);
  }
  .app-header__page-title {
    color: #000;
    font-size: 2.2em;
    margin: .25rem 0;
    text-align: left;
    min-height: 45px;
  }
</style>
