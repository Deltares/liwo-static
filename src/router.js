import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About'
import Contact from './views/Contact'
import Home from './views/Home'
import Maps from './views/Maps'
import Viewer from './views/Viewer'
import Combine from './views/Combine'
import Accessibility from './views/Accessibility'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: Maps,
      meta: {
        title: 'Kaarten'
      }
    },
    {
      path: '/viewer/:id(\\d+)',
      name: 'viewer',
      component: Viewer,
      meta: {
        // Title will be filled in once `LayerSet` is loaded.
        title: null
      },
      // pass id to component
      props: (route) => {
        const id = _.toNumber(route.params.id)
        return {
          id
        }
      }
    },
    // Some special views
    {
      // optional ids consisting of numbers and ,
      // the first id is  the layerSetId
      // the ids are the scenario  ids.
      path: '/scenarios/:id/:ids([\\d,]*)?',
      name: 'scenarios',
      // browse scenarios
      component: Combine,
      meta: {
        title: 'Bekijken overstromingsscenario\'s'
      },
      props: {
        selectFeatureMode: 'single',
        filterByIds: false,
        scenarioMode: 'lookup'
      }

    },
    {
      // optional ids consisting of numbers and ,
      path: '/combine/:id/:ids([\\d,]*)?',
      name: 'combine',
      component: Combine,
      meta: {
        title: 'Combineren overstromingsscenario\'s'
      },
      props: {
        selectFeatureMode: 'multiple',
        filterByIds: false,
        scenarioMode: 'lookup'
      }
    },
    {
      // required ids, numbers and ,
      path: '/combined/:id/:ids([\\d,]+)/:band([\\w]+)',
      name: 'combined',
      component: Combine,
      meta: {
        title: 'Gecombineerd scenario'
      },
      props: {
        selectFeatureMode: 'disabled',
        filterByIds: true,
        scenarioMode: 'compute'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'Over LIWO'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        title: 'Contact'
      }
    },
    {
      path: '/accessibility',
      name: 'accessibility',
      component: Accessibility,
      meta: {
        title: 'Toegankelijkheid'
      }
    }
  ]
})

export default router
