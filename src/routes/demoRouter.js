import Router from 'koa-router'
import demoController from '../api/DemoController'

const router = new Router()

router.get('/test', demoController.demo)

export default router
