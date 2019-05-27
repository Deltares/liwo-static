import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'

import { loadLayerSetById } from './lib/load-layersets'
import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from './lib/layer-parser'
import buildLayerSetNotifications from './lib/build-layerset-notifications'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    // we have three or four levels that can be current/active/selected
    // layerSet -> layers -> variants (-> features|bands)
    // active/current -> currently loaded TODO: use consistent
    // selected -> selected by user

    // current/active/selected layer,
    // changing these triggers a load of the corresponding data
    layerSetId: 0,

    // TODO: consider storing layers by id separate, then  we don't need breach layers
    layerSetsById: {},

    // We keep track of some state across pages.
    // all layer data (stored so it doesn't need to fetch on changing pages)
    // all notifications, by LayerSetId
    notificationsById: {},

    // This is the filter for probabilities (a string  used to pass to the backend)
    probabilityFilter: ''
  },
  mutations: {
    setLayerSetById (state, { id, layerSet }) {
      Vue.set(state.layerSetsById, id, layerSet)
    },
    setLayerSetId (state, id) {
      state.layerSetId = id
    },
    setLayersByLayerSetId (state, {id, layers}) {
      // update the layers in layerSet id
      let layerSet = this.getters.layerSet
      Vue.set(layerSet, 'layers', layers)
      Vue.set(state.layerSetsById, id, layerSet)
    },
    setNotificationsById (state, {id, notifications}) {
      // set the notifications
      Vue.set(state.notificationsById, id, notifications)
    },
    addNotificationById (state, {id, notification}) {
      // store a notification
      const notifications = state.notificationsById[id] || []
      notifications.push(notification)
      state.notificationsById[id] = notifications
    }
  },
  actions: {
    async loadLayerSetById (state, { id }) {
      // Skip if we already loaded this layerSet
      if (_.has(state.layerSetsById, id)) {
        return
      }
      // Load a layerSet
      // Make  sure you don't add any interaction here  yet.
      // This should just load and clean up, no filtering, no dependency on any view state

      // load the raw layerSet
      const layerSetRaw = await loadLayerSetById(id)
      // the data we get from the api is a bit unorganized so normalize it
      // Actually I think we're  unnormalizing....
      // deep clone before and after or look at  json response to compare what changed
      const layerSetNormalized = normalizeLayerSet(layerSetRaw)
      // There might be some issues that we need to  fix...
      const layerSet = cleanLayerSet(layerSetNormalized)

      // The layers are in a deep  structure. Flatten it before  building the notifications
      const layers = flattenLayerSet(layerSet)

      const notifications = buildLayerSetNotifications(layers)

      // TODO: the function is called setLayerSet[s]
      // but it only loads  the layers of 1 layerSet, make this consistent

      state.commit('setLayerSetById', { id, layerSet: layerSet })
      // TODO: why not in the view...
      state.commit('setNotificationsById', {id, notifications})
    }

  },
  getters: {
    layerSet ({ layerSetsById, layerSetId }) {
      // return the current layerSet
      return layerSetsById[layerSetId]
    },
    layers (state, { layerSet }) {
      // flatten all layers and return
      if (!layerSet) {
        return []
      }
      return flattenLayerSet(layerSet)
    },
    currentNotifications (state) {
      const { layerSetId, notificationsById } = state
      let notifications = _.get(notificationsById, layerSetId, [])
      return notifications
    }
  }
})
