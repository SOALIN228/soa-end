/**
 * User: soalin
 * Date: 2020/7/8
 * Time: 22:08
 * Desc: 内容文章controller
 */
import Post from '@/model/Post';
import Links from '@/model/Links';

class ContentController {
  /**
   * 获取文章列表
   * @param ctx
   */
  async getPostList(ctx) {
    const body = ctx.query;

    const sort = body.sort ? body.sort : 'created';
    const page = body.page ? parseInt(body.page) : 0;
    const limit = body.limit ? parseInt(body.limit) : 20;
    const options = {};

    if (body.catalog) {
      options.catalog = body.catalog;
    }
    if (body.isTop) {
      options.isTop = body.isTop;
    }
    if (body.status) {
      options.status = body.status;
    }
    if (body.isEnd) {
      options.isEnd = body.isEnd;
    }
    if (body.tag) {
      // mongoose的嵌套查询方法，$elemMatch: 查询某个对象数组中，name为body.tag的数据
      options.tags = { $elemMatch: { name: body.tag } };
    }
    const result = await Post.getList(options, sort, page, limit);
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功',
    };
  }

  /**
   * 获取友情链接
   * @param ctx
   */
  async getLinks(ctx) {
    const result = await Links.find({ type: 'links' });
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  /**
   * 获取温馨提示
   * @param ctx
   */
  async getTips(ctx) {
    const result = await Links.find({ type: 'tips' });
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  /**
   * 本周热议
   * @param ctx
   * @returns {Promise<void>}
   */
  async getTopWeek(ctx) {
    const result = await Post.getTopWeek();
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

export default new ContentController();
