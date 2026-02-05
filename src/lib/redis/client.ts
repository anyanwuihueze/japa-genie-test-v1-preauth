import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('Redis env vars not set - memory features disabled')
}

export const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export async function saveConversationMemory(userId: string, message: string, response: string) {
  if (!redis) return
  
  const key = `chat:memory:${userId}`
  const timestamp = Date.now()
  const value = JSON.stringify({
    timestamp,
    message: message.slice(0, 500), // Limit size
    response: response.slice(0, 500),
    summary: message.slice(0, 100) // For quick scanning
  })
  
  // Keep last 50 conversations
  await redis.lpush(key, value)
  await redis.ltrim(key, 0, 49)
  await redis.expire(key, 60 * 60 * 24 * 30) // 30 days
}

export async function getRecentMemory(userId: string, limit = 5) {
  if (!redis) return []
  
  const key = `chat:memory:${userId}`
  const memories = await redis.lrange(key, 0, limit - 1)
  return memories.map(m => JSON.parse(m as string))
}
