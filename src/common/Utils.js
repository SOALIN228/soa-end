/**
 * User: soalin
 * Date: 2020/7/4
 * Time: 16:33
 * Desc: 接口通用方法
 */
import { getValue } from '@/config/RedisConfig';

/**
 * 验证码校验
 * @param key
 * @param value
 */
const checkCode = async (key, value) => {
  if (!key || !value) return false;
  const redisData = await getValue(key);
  if (redisData) {
    return redisData.toLowerCase() === value.toLowerCase();
  }
  return false;
};

export { checkCode };
