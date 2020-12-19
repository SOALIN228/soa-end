import Router from 'koa-router';
import publicController from '@/api/PublicController';
import contentController from '@/api/ContentController';

const router = new Router();
router.prefix('/public');
// 图形验证码
router.get('/getCaptcha', publicController.getCaptcha);
// 文章列表
router.get('/list', contentController.getPostList);
// 友情链接
router.get('/links', contentController.getLinks);
// 温馨提醒
router.get('/tips', contentController.getTips);
// 本周热议
router.get('/topWeek', contentController.getTopWeek);

export default router;
