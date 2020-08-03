import redis from 'redis'
import { promisifyAll } from 'bluebird'
import config from './index'

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true, // 设置为true，处理数据完后，返回buffer，为不是转化为string
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}

const client = promisifyAll(redis.createClient(options))

// 监听client 连接出错的情况
client.on('error', (err) => {
  console.log('redis client error:' + err)
})

/**
 * 设置key 过期时间
 * @param key
 * @param value
 * @param time
 */
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).forEach(item => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);

/**
 * 获取key
 * @param key
 */
const getValue = (key) => {
  return client.getAsync(key)
}

/**
 * 获取使用hset 设置的key
 * @param key
 */
const getHValue = (key) => {
  // v8 Promisify method use util, must node > 8
  // return promisify(client.hgetall).bind(client)(key)

  // bluebird async
  return client.hgetallAsync(key)
}

/**
 * 删除key
 * @param key
 */
const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully')
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}
