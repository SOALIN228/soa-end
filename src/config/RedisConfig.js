import redis from 'redis';
import { promisifyAll } from 'bluebird';
import config from './index';

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true, // 设置为true，处理数据完后，返回buffer，而不是返回string
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // 服务器连接错误
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // 服务器连接超时
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // 服务器连接次数大于10次
      return undefined;
    }
    // 每次重连时间
    return Math.min(options.attempt * 100, 3000);
  },
};

// 使用promisifyAll会在原有库上额外添加带有原有方法名+Async的promise方法
const client = promisifyAll(redis.createClient(options));

// 监听client 连接出错的情况
client.on('error', (err) => {
  console.log('redis client error: ' + err);
});

/**
 * 设置key
 * @param key
 * @param value
 * @param time 过期时间
 */
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return;
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      client.set(key, value, 'EX', time, redis.print);
      return;
    }
    client.set(key, value, redis.print);
    return;
  }
  if (typeof value === 'object') {
    // key的value为对象
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print);
    });
  }
};

/**
 * 获取String key
 * @param key
 */
const getValue = (key) => {
  return client.getAsync(key);
};

/**
 * 获取Hash hset key
 * @param key
 */
const getHValue = (key) => {
  return client.hgetallAsync(key);
};

/**
 * 删除key
 * @param key
 */
const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully');
    }
    console.log('delete redis key error:' + err);
  });
};

export { client, setValue, getValue, getHValue, delValue };
