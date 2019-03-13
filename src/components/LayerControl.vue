<template>
  <div :class="`layer-control${(active) ? ' layer-control--active' : ''}`"
    @click="selectLayer">
    <form class="layer-control__main">
      <input type="checkbox"
        class="sr-only layer-control__vis-checkbox"
        :name="`layer-${id}-vis`"
        :id="`layer-${id}-vis`"
        value="zichtbaar"
        :checked="visible"
      >
      <label
        @click.prevent="(event) => toggleLayer(event, id)"
        class="layer-control__vis-label"
        :for="`layer-${id}-vis`"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
          <path fill="none" d="M0 0h64v64H0z"/>
          <path d="M59 28c-3-5-12-16-27-16S8 23 5 28v6c3 5 12 16 27 16s24-11 27-16v-6zm-27-7a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 24c-15 0-22-14-22-14s3-6 10-10l-2 4a14 14 0 1 0 28 3c0-5-4-8-9-10 12 2 17 13 17 13s-7 14-22 14z"/>
        </svg>
        <span class="sr-only">Zichtbaarheid</span>
      </label>
      <div class="layer-control__identifiers">
        <p class="layer-control__title">
          {{ title }}
        </p>
      </div>
    </form>
    <div v-if="isBreachControlLayer" class="layer-control__options">
      <layer-control-select
        name="probability-filter"
        :options="probabilityFilterOptions"
        :selected="breachProbabilityFilterIndex"
        @change="setProbabilityFilter"
      />
    </div>
    <div v-if="variantsOptions.length" class="layer-control__options">
      <layer-control-select name="layer-variant" :options="variantsOptions" @change="setLayerVariant" />
    </div>
    <div class="layer-control__options">
      <layer-control-select :name="`layer-${id}-trans`" :options="transparancyOptions" @change="setOpacity" />
      <button v-if="metadata" class="layer-control__info" @click="popupIsOpen=true">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
          <path fill="none" d="M0 0h64v64H0z"/>
          <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
        </svg>
      </button>
      <layer-popup v-if="popupIsOpen"
        :metadata="metadata"
        @close="popupIsOpen=false"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LayerPopup from '@/components/LayerPopup'
import LayerControlSelect from '@/components/LayerControlSelect'

import { probabilityTitles } from '@/lib/probability-filter'

import { BREACH_PREFIX } from '@/lib/liwo-identifiers'

export default {
  data () {
    return { popupIsOpen: false }
  },
  props: {
    id: [String, Number],
    title: String,
    metadata: Object,
    active: Boolean,
    variants: Array,
    layerType: String,
    visible: Boolean
  },
  computed: {
    ...mapState([
      'breachProbabilityFilterIndex',
      'visibleLayerIds'
    ]),
    transparancyOptions () {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => ({
        value: 1 - (0.1 * index),
        title: `${index * 10}% transparantie`
      }))
    },
    probabilityFilterOptions () {
      return probabilityTitles.map((title, index) => ({
        value: index,
        title
      }))
    },
    variantsOptions () {
      const variantsLength = this.variants.length
      if (!variantsLength || variantsLength === 1) {
        return []
      }

      return this.variants.map((variant, index) => ({
        value: Number(index),
        title: variant.title
      }))
    },
    isBreachControlLayer () {
      if (typeof this.layerType !== 'string') {
        return false
      }

      return this.layerType.startsWith(BREACH_PREFIX)
    }
  },
  methods: {
    setOpacity ({ target }) {
      this.$emit('changeOpacity', {
        layerId: this.id,
        opacity: target.value
      })
    },
    setLayerVariant ({ target }) {
      this.$emit('selectVariant', {
        layerId: this.id,
        variantIndex: Number(target.value)
      })
    },
    setProbabilityFilter ({ target }) {
      this.$store.commit('setProbabilityFilterIndex', Number(target.value))
    },
    selectLayer () {
      this.$emit('selectActiveLayer', this.id)
    },
    toggleLayer (event, id) {
      this.$emit('toggle', id)
      if (this.visible) {
        event.stopPropagation()
      }
    }
  },
  watch: {
    // Always close meta when switching layers
    active (isActive) {
      if (!isActive) {
        this.popupIsOpen = false
      }
    }
  },
  components: {
    LayerControlSelect,
    LayerPopup
  }
}
</script>

<style>
  @import './variables.css';

  .layer-control {
    background-color: var(--white);
  }

  .layer-control__identifiers {
    display: inline-block;
  }

  .layer-control__title {
    margin: 0;
    padding: 0;
  }

  .layer-control__main,
  .layer-control__options {
    position: relative;
    display: block;
    padding: .5rem .5rem .25rem 2.5rem;
  }

  .layer-control__main {
    margin-bottom: 0;
  }

  .layer-control__vis-label>.icon {
    position: absolute;
    left: .5rem;
  }

  .layer-control__options {
    display: none;
    border-top: 1px solid var(--white);
    padding-top: .25rem;
    justify-content: space-between;
  }
  .layer-control__info {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
  }
  .layer-control__vis-checkbox + .layer-control__vis-label svg {
    fill: var(--medium-gray);
  }
  .layer-control__vis-checkbox:checked + .layer-control__vis-label svg {
    fill: var(--black);
  }

  .layer-control--active {
    background-color: var(--light-yellow);
  }
  .layer-control--active .layer-control__options {
    display: block;
    display: flex;
  }
</style>
