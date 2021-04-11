/**
 * User: soalin
 * Date: 2020/7/8
 * Time: 21:10
 * Desc: 发帖记录module
 */
import mongoose from '../config/DBHelpler';
import dayjs from 'dayjs';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // ref关联users表
  uid: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  created: { type: Date },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: '0' },
  tags: {
    type: Array,
    default: [],
  },
});

PostSchema.pre('save', function (next) {
  this.created = new Date();
  next();
});

PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param options {Object} 筛选条件
   * @param sort {String} 排序方式
   * @param page {Number} 分页页数
   * @param limit {Number} 分页条数
   */
  getList(options, sort, page, limit) {
    return this.find(options) // 筛选参数
      .sort({ [sort]: -1 }) // 倒序排列
      .skip(page * limit) // 跳过多少页数据
      .limit(limit) // 获取多少条数据
      .populate({
        // 联合查询根据path，过滤筛选需要的字段（排除一些不必要的字段，或者是敏感字段）
        path: 'uid', // 指定过滤筛选字段
        select: 'name isVip pic', // 从相应的数据中拿到相应的字段，填充到过滤字段下
      });
  },
  /**
   * 获取本周热议数据
   */
  getTopWeek() {
    return this.find(
      {
        created: {
          // 根据创建时间来筛选最近7天内的数据（大于等于现在时间-7天的时间内的文章）
          $gte: dayjs().subtract(7, 'days'),
        },
      },
      {
        answer: 1, // 第二个对象，告诉mongodb，显示哪些字段 1是显示 0不显示
        title: 1,
      },
    )
      .sort({ answer: -1 })
      .limit(15); // 排序 按照answer这个字段进行（-1）倒序排列，（0）正序排列，长度限制15条
  },
};

const PostModel = mongoose.model('post', PostSchema);

export default PostModel;
