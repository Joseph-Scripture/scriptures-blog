const prisma = require('../prisma/client')
const redisClient = require('../redis/client')

async function setAllPostToCache() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,

                author: {
                select: {
                    id: true,
                    username: true
                }
                },

            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,

                    author: {
                    select: {
                        id: true,
                        username: true
                        }
                    }
                }
                }
            }
        })

    await redisClient.set(
        'allPosts',
        JSON.stringify(posts),
        { EX: 60*60 } 
    )

    console.log('Cache updated')

} catch (error) {
    console.error('Error setting cache:', error)
    }
}

module.exports = {
    setAllPostToCache
}