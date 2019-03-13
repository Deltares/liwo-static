import { stringify } from 'query-string'
import mapConfig from '../map.config.js'

export default function ({
  url,
  service,
  request,
  encode = true,
  width = 256,
  height = 256,
  ...rest
}) {
  if (!service || !request) {
    return undefined
  }

  const params = stringify({
    service,
    request,
    width,
    height,
    ...rest
  }, { encode, sort: false })

  return `${url || mapConfig.services.STATIC_GEOSERVER_URL}?${params}`
}
