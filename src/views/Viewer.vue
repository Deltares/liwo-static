<template>
  <div class="viewer">
    <liwo-map
      :map-layers="mapLayers"
    />
    <layer-panel
      :items="layers"
      @open-export="showExport = true"
    />
    <legend-panel
      v-if="selectedVisibleLayerLegend"
      :caption="selectedVisibleLayerLegend.title"
      :namespace="selectedVisibleLayerLegend.namespace"
      :layer-name="selectedVisibleLayerLegend.layer"
      :style-name="selectedVisibleLayerLegend.style"
    />
    <segmented-buttons
      v-if="variantTitlesForSelectedLayer.length > 1"
      :items="variantTitlesForSelectedLayer"
      :active-index="variantIndexForSelectedLayer"
      @click="setVisibleVariantIdForSelectedlayer"
    />
    <export-popup
      v-if="showExport"
      @close="showExport = false"
    />
  </div>
</template>

<script>
import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import SegmentedButtons from '@/components/SegmentedButtons'

import '@/lib/leaflet-hack'
import { loadLayersetById } from '@/lib/load-layersets'

export default {
  data () {
    return {
      layers: [],
      parsedLayers: [],
      id: 0,
      showExport: false,
      title: ''
    }
  },
  async mounted () {
    const layerSet = await loadLayersetById(this.$route.params.id)
    this.layers = layerSet.layers
    this.title = layerSet.title
    this.id = layerSet.id
  },
  computed: {
    mapLayers () {
      return this.parsedLayers
        // filter by visibility from state
        .filter(({ id }) => this.visibleLayerIds.some(visibleId => visibleId === id))
        .map(layer => {
          // get index for current variant of layer
          const variantIndex = this.$store.state.visibleVariantIndexByLayerId[layer.id]
          return layer.variants[variantIndex]
        })
    },
    selectedLayer () {
      const selectedLayers = this.parsedLayers
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        return selectedLayers[0] // should only be one
      }
    },
    selectedLayerId () {
      return this.$store.state.selectedLayerId
    },
    selectedVisibleLayerLegend () {
      if (this.selectedLayer && this.visibleLayerIds.some(visibleId => visibleId === this.selectedLayerId)) {
        return {
          ...this.selectedLayer.legend,
          layerType: this.selectedLayer.variants[0].type
        }
      }
      return undefined
    },
    variantTitlesForSelectedLayer () {
      return (this.selectedLayer)
        ? this.selectedLayer.variants.map(({title}) => title)
        : []
    },
    variantIndexForSelectedLayer () {
      return this.$store.state.visibleVariantIndexByLayerId[this.selectedLayerId]
    },
    visibleLayerIds () {
      return this.$store.state.visibleLayerIds
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    }
  },
  watch: {
    layers (layers) {
      if (layers.length === 0) {
        return
      }
      // new layers mean new state init
      this.$store.commit('setSelectedLayerId', layers[0].id)

      this.parsedLayers = layers.map(layer => {
        this.$store.commit('showLayerById', layer.id)
        this.$store.commit('setVisibleVariantIndexForLayerId', {index: 0, layerId: layer.id})
        return {
          id: layer.id,
          properties: layer,
          legend: {
            ...layer.legend,
            namespace: layer.variants[0].map.namespace // namespace should be available to legend
          },
          variants: layer.variants.map(variant => ({
            ...variant.map,
            title: variant.title
          }))
        }
      })
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    SegmentedButtons
  }
}
</script>

<style>
@import '../components/variables.css';

.viewer {
  position: relative;
}
.viewer .layer-panel {
  position: absolute;
  top: 1rem;
  left: 2rem;
  z-index: 1000;
  box-shadow: var(--shadow);
}

.viewer .segmented-buttons {
  position: absolute;
  width: 100%;
  bottom: -1rem;
  z-index: 1000;
}

.viewer .legend-panel {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  box-shadow: var(--shadow);
}

</style>
