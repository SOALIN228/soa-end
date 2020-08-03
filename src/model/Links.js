/**
 * User: soalin
 * Date: 2020/8/3
 * Time: 08:06
 * Desc: 友链相关module
 */
import mongoose from '../config/DBHelpler'

const Schema = mongoose.Schema

const LinksSchema = new Schema({
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  type: { type: String, default: 'link' },
  created: { type: Date },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: '0' }
})

// 定义保存前的钩子函数，用于保存创建时间，中间件
LinksSchema.pre('save', function (next) {
  this.created = new Date() // 设置为Date类型，返回给前端，前端在进行格式化
  next()
})

const LinksModel = mongoose.model('links', LinksSchema)

export default LinksModel
