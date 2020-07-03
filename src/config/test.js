import { getHValue, getValue, setValue } from './RedisConfig'

setValue('imooc', 'test')

getValue('imooc').then(res => {
  console.log(res)
})

setValue('imoocobj', { name: 'soa', age: 22, email: 'soa@qq.com' })

getHValue('imoocobj').then(res => {
  console.log(res)
})
