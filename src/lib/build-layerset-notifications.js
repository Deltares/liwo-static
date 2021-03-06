import _ from 'lodash'

function buildFeatureNotifications (layers) {
  // create a list of notifications based on the features

  const featureNotificationsTree = layers
  // for all layers that have geojson
    .filter(layer => layer.geojson)
    .map(
      layer => layer.geojson.features
        // for  all features  in each layer
        .map(
          feature => ({
            id: feature.properties.id,
            message: feature.properties.notify,
            // split off the numbers
            layerId: feature.id.replace(/(.+)(\.\d+)/, '$1'),
            show: true
          }))
        .filter(
          // replace items with zeros
          (item) => {
            let result = item.notification
            if (item.notification === 'NULL') {
              result = false
            }
            return result
          }
        )
    )
  const featureNotifications = _.flatten(featureNotificationsTree)
  return featureNotifications
}

function buildLayerNotifications (layers) {
  // create a list of notifications based on the layers
  const layerNotifications = layers
    .filter(layer => layer.layerObj.properties.notify)
    .map(layer => {
      return {
        id: layer.layerObj.id,
        message: layer.layerObj.properties.notify,
        show: true
      }
    })
  return layerNotifications
}

function buildLayerSetFeatureNotifications (layers) {
  // create a list of notifications based on the layerset features, the feature that was  used to create the layerSet
  let layerSetFeatureNotifications = layers
    .filter(layer => _.get(layer, 'layerSet.feature.properties.notify'))
    .map((layer) => {
      return {
        id: layer.layerSet.id,
        message: _.get(layer, 'layerSet.feature.properties.notify'),
        show: true
      }
    })
  layerSetFeatureNotifications = _.filter(layerSetFeatureNotifications)
  // filter out messages that
  // contain NULLs
  layerSetFeatureNotifications = layerSetFeatureNotifications.filter(feature => {
    if (feature.message === 'NULL') {
      return false
    } else {
      return true
    }
  })
  return layerSetFeatureNotifications
}

function buildLayerSetNotifications (layers) {
  // the list of notifications  on layerSet level
  const layerSetNotifications = layers
    .filter(layer => layer.layerSet.notify)
    .map(layer => {
      return {
        id: layer.layerSet.id,
        message: layer.layerSet.notify,
        show: true
      }
    })
  return layerSetNotifications
}

export default function buildNotifications (layers) {
  // this method expects a flattened list of layers
  // create a list of all the  notifications from the layers
  const featureNotifications = buildFeatureNotifications(layers)
  const layerNotifications = buildLayerNotifications(layers)
  const layerSetFeatureNotifications = buildLayerSetFeatureNotifications(layers)
  const layerSetNotifications = buildLayerSetNotifications(layers)

  // concatenate all features
  let result = [
    ...featureNotifications,
    ...layerNotifications,
    ...layerSetFeatureNotifications,
    ...layerSetNotifications
  ]

  // remove any doubles
  result = _.uniqWith(result, _.isEqual)
  return result
}
