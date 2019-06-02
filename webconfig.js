/* eslint-disable no-unused-vars */
// global WEBSERVICE_URL, STATIC_GEOSERVER_URL, DYNAMIC_GEOSERVER_URL, ACHTERGRONDKAART, LUCHTFOTOKAART, PDOKLUCHTFOTO, PDOKBRTACHTERGROND, MANUAL_URL, STATIC_GEOSERVER_URL, PRINT_GEOSERVER_URL

// NOTE: This file will be overwritten automatically by a puppet script in the deployment process, DO NOT EDIT BY HAND, DO NOT MINIFY

// url's for webservice calls
var WEBSERVICE_URL = 'http://tw-160.xtr.deltares.nl/liwo.ws'
var STATIC_GEOSERVER_URL = 'http://tl-396.xtr.deltares.nl:8080/geoserver/ows'
var DYNAMIC_GEOSERVER_URL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/ows'

var ACHTERGRONDKAART = 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png'
var LUCHTFOTOKAART = 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png'

var STATIC_GEOSERVER_LOCAL = 'http://tl-396.xtr.deltares.nl:8080/geoserver/ows' // url for internal routing to static geoserver
var DYNAMIC_GEOSERVER_LOCAL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/ows' // url for internal routing to dynamic geoserver
var PRINT_GEOSERVER_URL = 'http://tl-396.xtr.deltares.nl:8080/print/' // url for print geoserver [ending with a forward slash]

var PDOKLUCHTFOTO = 'http://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms'
var PDOKBRTACHTERGROND = 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts'
var MANUAL_URL = 'https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo'

// URL for combining scenario's
var HYDRO_ENGINE_URL = 'https://hydro-engine.appspot.com'
