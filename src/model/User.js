/**
 * User: soalin
 * Date: 2020/7/5
 * Time: 22:10
 * Desc: 用户信息module
 */
import mongoose from '../config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  // 创建唯一索引(去重，防止重复的名称插入数据库)，sparse：该条数据存在username这个属性才会检索
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String },
  create: { type: Date },
  update: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/img/header.png' }, // 入口文件设置了静态资源目录， / 代表public目录
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' }, // match 正则
  status: { type: String, default: '0' },
  regmark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 }
})

UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.post('save', function (error, doc, next) {
  // mongoose官网提供的，插入重复的key，发生的错误
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Mongoose has a duplicate key'))
  } else {
    next(error)
  }
})

UserSchema.statics = {
  /**
   * 获取用户信息
   * @param id 用户id
   */
  findById (id) {
    // 第一个筛选条件,第二个对数据的一些字段进行过滤，0是不显示（通常用于敏感信息）
    return this.findOne({ _id: id }, {
      password: 0,
      username: 0,
      mobile: 0
    })
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
