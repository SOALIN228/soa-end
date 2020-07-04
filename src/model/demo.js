import User from './User'

const user = {
  name: 'soalin',
  age: '22',
  email: 'soalin228@163.com'
}

// 增
const insertMethods = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

// 查
const findMethods = async () => {
  const result = await User.find()
  console.log(result)
}

// 改
const updateMethods = async () => {
  const result = await User.updateOne({ name: 'soalin' }, {
    email: 'soalin@163.com'
  })
  console.log(result)
}

// 删
const deleteMethods = async () => {
  const result = await User.deleteOne({ name: 'soalin' })
  console.log(result)
}

deleteMethods()
