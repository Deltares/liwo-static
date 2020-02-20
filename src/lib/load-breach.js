import _ from 'lodash'

import store from '@/store'

import { BREACH_LAYERS_EN, BREACH_LAYERS_NL, BREACH_PRIMARY, BREACH_REGIONAL, getLayerType } from '@/lib/liwo-identifiers'
import mapConfig from '../map.config'

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export async function loadBreach (feature) {
  // Load breach data from the geoserver

  // the breach id is hidden here
  let breachId = feature.properties.id

  // TODO: there's also a code PRIM, should we not use that?
  let layerType = getLayerType(feature)

  // we have different breach layers, depending on the type
  let breachLayers = []
  if (layerType === BREACH_REGIONAL) {
    breachLayers = [`${BREACH_REGIONAL}.${breachId}`]
  } else if (layerType === BREACH_PRIMARY) {
    breachLayers = BREACH_LAYERS_NL
  }

  let promises = breachLayers.map(
    layerName => loadBreachLayer(breachId, layerName)
  )

  // the layers are a bit out of order, so restructure them
  // TODO: consider making this async, otherwise we lock the browser
  let bands = await Promise.all(promises)
  // remove undefined/null bands
  bands = _.filter(bands)

  // merge layers of all unorganized sets
  // and use the feature name
  let layers = _.flatten(_.map(bands, 'layers'))
  let layerSet = {
    id: breachId,
    feature: feature,
    name: feature.properties.name,
    title: feature.properties.name,
    layers: layers
  }
  return layerSet
}

export async function computeCombinedScenario (scenarioIds, band, layerSetId) {
  // combine multiple breachesinto a new scenario
  // Load combined breaches map, computed by the backend
  // The computation is done in Google Earth Engine / HydroEngine
  // the breach id is hidden here

  let selectedLayers = [ band ]
  // load  all the variants
  let promises = selectedLayers.map(
    // pass along  layerSetId for notifications
    bandName => loadBreachesLayer(scenarioIds, bandName, layerSetId)
  )
  // the layers are a bit out of order, so restructure them
  // TODO: consider making this async, otherwise we lock the browser
  let bands = await Promise.all(promises)

  // remove undefined/null bands
  bands = _.filter(bands)

  // convert bands to layerlike objects
  let layers = _.map(bands, (band) => {
    // if it looks like a layer, then it is a layer
    // lookup the translation
    let bandNl = _.get(BREACH_LAYERS_EN, band.band)
    let title = bandNl
    band.title = title
    band.metadata = _.clone(band)
    band.map = {
      type: 'tile',
      url: band.url
    }
    let layer = {
      id: band.mapid,
      variants: [band],
      title: title,
      legend: {
        title: 'Gecombineerd Scenario [-]',
        namespace: 'LIWO_MEGO'
      }
    }
    return layer
  })
  let title = 'Gecombineerd scenario'
  let layerSet = {
    id: scenarioIds.join(','),
    scenarioIds,
    name: title,
    title: title,
    layers
  }
  return layerSet
}

async function loadBreachLayer (breachId, layerName) {
  // Load the dataset  for a breach
  let services = await mapConfig.getServices()
  const BREACHES_BASE_URL = services.WEBSERVICE_URL
  const BREACHES_API_URL = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreachGeneric`

  return fetch(BREACHES_API_URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers,
    body: JSON.stringify({
      breachid: breachId,
      layername: layerName
    })
  })
    .then(res => res.json())
  // get rid of some ASP  fluff
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch(() => null)
}

async function loadBreachesLayer (scenarioIds, band, layerSetId) {
  // TODO: choose appropriate reducer for the band
  // The band here relates to  quantitites
  let reducer = 'max'
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liwo_ids: scenarioIds, band, reducer })
  }
  let services = await mapConfig.getServices()
  const HYDRO_ENGINE_URL = services.HYDRO_ENGINE_URL
  let url = `${HYDRO_ENGINE_URL}/get_liwo_scenarios`
  return fetch(url, requestOptions)
    .then(resp => {
      return resp.json()
    })
    .then(json => {
      let result = { ...json, type: 'tile' }
      if (result.msg) {
        let notification = {
          message: 'Het door u gevraagde gecombineerde resultaat kan niet gemaakt worden. Er zijn kaarlagen beschikbaar voor de gevraagde combinatie.',
          type: 'warning',
          show: true
        }
        console.log('original msg', result.msg)
        store.commit('addNotificationById', { id: layerSetId, notification })
      }
      return result
    })
    .catch((error) => {
      let notification = {
        message: `Het door u gevraagde gecombineerde resultaat kon niet gemaakt worden.`,
        type: 'warning',
        show: true
      }
      console.warn('Combined result failed:', error)
      // notifiy of failure
      store.commit('addNotificationById', { id: layerSetId, notification })
      return null
    })
}

export async function getFeatureIdByScenarioId (scenarioId) {
  // to know which feature corresponds to a scenario we have to call a webservice.
  // TODO: store scenario info in the features...

  let services = await mapConfig.getServices()

  // get mapId from scenarioId
  let promise = fetch(`${services.WEBSERVICE_URL}/Maps.asmx/GetBreachLocationId`, {
    method: 'POST',
    headers,
    // TODO: this is wrong,  we pass a scenarioId to a map Id. This API returns  the breach based on the mapId
    body: JSON.stringify({ mapid: scenarioId })
  })
    .then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => {
      // add the scenarioId to the result
      let result = { ...data, scenarioId }
      return result
    })
  return promise
}

export async function getFeatureIdsByScenarioIds (scenarioIds) {
  // This is very ackward logic to get back the list of feature ids that corresponds to a list of scenario's

  let promises = scenarioIds.map(getFeatureIdByScenarioId)
  let responses = await Promise.all(promises)
  let results = {}
  _.each(responses, (response) => {
    results[response.scenarioId] = response
  })
  let featureIds = _.filter(_.map(results, 'breachlocationid'))
  // get all uniq ids
  featureIds = _.uniq(featureIds)
  return featureIds
}
