import combineRoutes from 'koa-combine-routers'

import demoRouter from './publicRouter'

export default combineRoutes(demoRouter)
