import L from '@/lib/leaflet-utils/leaf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import {
  BREACH_PRIMARY,
  BREACH_REGIONAL,
  BREACH_OUTSIDE_DIKE,
  BREACH_FLOODING,
  BREACHES_IDS
} from '@/lib/liwo-identifiers'
import mapConfig from '@/map.config'
import { redIcon, blackIcon, greenIcon } from './markers'

import './cluster-icon.css'

const DEFAULT_ICON = new L.Icon.Default()
const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL
const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL

export default function createLayer (layer, { breachCallBack }) {
  if (layer.type === 'json' && layer.geojson) {
    if (layerIsBreach(layer)) {
      const layerGroup = L.layerGroup()
      const clusterGroup = L.markerClusterGroup({
        iconCreateFunction: clusterIconFunction(layer.layer || 'BREACH_PRIMARY'),
         maxClusterRadius: 40
      })

      clusterGroup.addLayer(createBreachGeoJson(layer, breachCallBack, clusterGroup, layerGroup))

      layerGroup.addLayer(clusterGroup)

      layerGroup.layerId = layer.layerId

      return layerGroup
    } else {
      return createGeoJson(layer)
    }
  } else {
    return createWms(layer)
  }
}

export function createGeoJson ({ geojson, style }) {
  return L.geoJson(geojson, {
    style: () => {
      return { className: style }
    }
  })
}

export function createBreachGeoJson ({ geojson, layer: layerId, opacity }, callback, clusterGroup, layerGroup) {
  return L.geoJson(geojson, {
    onEachFeature: (_, layer) => {
      const { naam } = layer.feature.properties

      layer.bindTooltip(`${naam}`)
      layer.on('click', (event) => {
        if (clusterGroup.hasLayer(event.target)) {
          event.target.setZIndexOffset(100)
          clusterGroup.removeLayer(event.target)
          layerGroup.addLayer(event.target)
        } else {
          event.target.setZIndexOffset(0)
          layerGroup.removeLayer(event.target)
          clusterGroup.addLayer(event.target)
        }
        breachClickHandler(event, callback)
      })
      layer.on('mouseover', (event) => { event.target.openTooltip() })
      layer.on('mouseout', (event) => { event.target.closeTooltip() })

      layer.setOpacity(opacity)
      layer.feature.properties.layerType = layerId
      layer.feature.properties.selected
        ? layer.setIcon(redIcon)
        : layer.setIcon(getBreachIcon(layerId))
    }
  })
}

export function createWms ({ namespace, layer, attribution, style, opacity }) {
  return L.tileLayer.wms(geoServerURL(namespace), {
    layers: layer,
    format: 'image/png',
    transparent: true,
    attribution,
    styles: style,
    opacity
  })
}

function geoServerURL (namespace) {
  return namespace === 'LIWO_Operationeel'
    ? DYNAMIC_GEOSERVER_URL
    : STATIC_GEOSERVER_URL
}

function breachClickHandler (event, callback) {
  const { selected, layerType } = event.target.feature.properties

  selected
    ? event.target.setIcon(getBreachIcon(layerType))
    : event.target.setIcon(redIcon)

  event.target.feature.properties.selected = !selected

  if (callback) {
    callback(event)
  }
}

function clusterIconFunction (type) {
  return function (cluster) {
    let childCount = cluster.getChildCount()

    return new L.DivIcon({
      html: '<div><span>' + childCount + '</span></div>',
      className: `cluster-icon cluster-icon__${type}`,
      iconSize: new L.Point(45, 45)
    })
  }
}

function getBreachIcon (type) {
  switch (type) {
    case BREACH_PRIMARY:
      return DEFAULT_ICON
    case BREACH_REGIONAL:
      return greenIcon
    case BREACH_OUTSIDE_DIKE:
      return blackIcon
    case BREACH_FLOODING:
      return blackIcon
    default:
      return DEFAULT_ICON
  }
}

function layerIsBreach ({ layer }) {
  return BREACHES_IDS.indexOf(layer) !== -1
}
