import redisClient from '../config/redis.js';

export const cacheMiddleware = (duration = 60) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.user ? req.user.id : 'public'}:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        redisClient.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    } catch (error) {
      next();
    }
  };
};

export const clearCache = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length) {
    await redisClient.del(keys);
  }
};