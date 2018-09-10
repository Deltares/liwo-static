<template>
  <aside class="legend-panel">
    <h2 class="legend-panel__title">Legenda</h2>
    <figure class="legend-panel__legend">
      <figcaption class="legend-panel__caption">{{ caption }}</figcaption>
      <img :src="legendImageSrc" alt="">
    </figure>
  </aside>
</template>

<script>
import mapConfig from '../map.config'

export default {
  computed: {
    legendImageSrc () {
      const { layerName, namespace, styleName } = this
      const url = mapConfig.services.LEGEND_URL
      return `${url}/${namespace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerName}&STYLE=${styleName}&HEIGHT=16&WIDTH=84`
    }
  },
  props: {
    caption: String,
    layerName: String,
    namespace: String,
    styleName: String
  }
}
</script>

<style>
  @import './variables.css';

  .legend-panel {
    max-width: 20rem;
    height: auto;
    background-color: var(--white);
  }
  .legend-panel__title {
    text-align: center;
    font-weight: normal;
    margin: 0;
    padding: .25rem;
    background-color: var(--lighter-gray);
    color: var(--black);
  }
  .legend-panel__caption {
    text-align: center;
    margin-bottom: 1rem;
  }
  .legend-panel__legend {
    padding: 1rem;
    margin-bottom: 0;
  }

</style>
