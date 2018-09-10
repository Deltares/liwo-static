<template>
  
</template>

<script>

const DIKE_RING_IDENTIFIER = 'geo_dijkringen'
const BREACH_IDENTIFIER = 'geo_doorbraaklocaties_primair'

export default {
  props: {
    layer: Object
  },
  methods: {
    onEachFeature (feature, layer) {
      const dijkringnr = layer.feature.properties.dijkringnr
      const map = this.mapRef.mapObject

      if (feature.geometry.type === MARKER_IDENTIFIER && dijkringnr !== this.selectedDikeRing) {
        this.breaches[dijkringnr]
          ? this.breaches[dijkringnr] = [ ...this.breaches[dijkringnr], layer ]
          : this.breaches[dijkringnr] = [ layer ]

        const tooltip = renderVue(BreachTooltip, { title: layer.feature.properties.naam })
        layer.bindTooltip(tooltip)

        layer.once('add', () => map.removeLayer(layer))
      }

      if (feature.geometry.type !== MARKER_IDENTIFIER) {
        this.dikeRings[dijkringnr] = layer

        const { beheerder, dijkring } = layer.feature.properties
        const tooltip = renderVue(DikeRingTooltip, { admin: beheerder, title: dijkring })
        layer.bindTooltip(tooltip)

        layer.on('click', () => {
          map.fitBounds(layer.getBounds())
          this.selectedDikeRing = dijkringnr
          this.breaches[dijkringnr].forEach(breach => {
            map.addLayer(breach)
          })
        })
      }
    },
    setStyle (feature, layer) {
      // set the layer to to style object and use css for styling
      return { className: layer.style }
    }
  }
}
</script>
