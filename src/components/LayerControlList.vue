<template>
  <ul class="layer-control-list" :class="{ 'layer-control-list--active': visible }">
    <li>
      <layer-control
        v-if="panelLayerTitle"
        :active="(panelLayerId === selectedLayerId)"
        :id="panelLayerId"
        :variants="[]"
        :layerType="''"
        :visible="activeMarkerLayerIsVisible"
        :isMarkerLayer="true"
        :title="LOCATION"
        @toggle="toggleActiveMarker"
      />
    </li>
    <li
      class="layer-control-list__item"
      v-for="layer in layers"
      :key="layer.id"
    >
      <layer-control
        :active="(layer.id === selectedLayerId)"
        :id="layer.id"
        :title="layer.properties.title || layer.properties.name"
        :metadata="layerMetaData(layer)"
        :variants="layer.variants || []"
        :layerType="layer.legend.layer"
        :visible="layerIsVisible(layer.id)"
        @toggle="toggleLayerVisibilityById"
        @changeOpacity="setLayerOpacity"
        @selectVariant="setVisibleVariant"
        @selectActiveLayer="setSelectedLayerId"
      />
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import LayerControl from './LayerControl'

const LOCATION = 'Locatie'

export default {
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: true
    },
    panelLayerTitle: {
      type: String,
      default: ''
    },
    panelLayerId: {
      type: [String, Number],
      default: ''
    },
    isBreachLocation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      LOCATION
    }
  },
  computed: {
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds',
      'visibleVariantIndexByLayerId',
      'hidden',
      'hiddenLayers',
      'visibleLayerIds'
    ]),
    activeMarkerLayerIsVisible () {
      return !this.hiddenLayers.includes(this.panelLayerId)
    }
  },
  methods: {
    layerMetaData ({ id, variants }) {
      const index = this.visibleVariantIndexByLayerId[id]
      return typeof index !== 'undefined'
        ? variants[index].metadata
        : variants[0].metadata
    },
    layerIsVisible (id) {
      return this.visibleLayerIds.indexOf(id) !== -1
    },
    setSelectedLayerId (id) {
      this.$store.commit('setSelectedLayerId', id)
    },
    setLayerOpacity ({ layerId, opacity }) {
      this.$store.commit('setOpacityByLayerId', {
        layerId,
        opacity
      })
    },
    toggleLayerVisibilityById (id) {
      this.layers.forEach(layer => {
        if (this.visibleLayerIds.includes(layer.id) && layer.id !== id) {
          this.$store.commit('toggleLayerById', layer.id)
        } else if (layer.id === id) {
          this.$store.commit('toggleLayerById', id)
        }
      })

    },
    setVisibleVariant ({ layerId, variantIndex }) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { layerId, index: variantIndex })
    },
    toggleActiveMarker (id) {
      this.$store.commit('toggleActiveMarker', id)
    }
  },
  mounted () {
    this.$store.commit('toggleLayerById', this.panelLayerId)
  },
  components: {
    LayerControl
  }
}
</script>

<style>
  .layer-control-list {
    background-color: white;
    height: 0;
    overflow: hidden;
  }

  .layer-control-list--active {
    height: auto;
  }

  .layer-control-list__item {
    border-bottom: 1px solid var(--light-gray)
  }
</style>
