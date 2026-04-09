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


} catch (error) {
    console.error('Error setting cache:', error)
    return null;
    }
}

async function cacheSinglePost(id) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true,
                        createdAt: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                username: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });

        if (post) {
            await redisClient.set(`post:${id}`, JSON.stringify(post), { EX: 60 * 60 });
            return post;
        }

        return null;

    } catch (err) {
        console.error(err);
        return null;
    }
}

async function cacheComments(id) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: Number(id) },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (comments) {
            await redisClient.set(`comments:${id}`, JSON.stringify(comments), { EX: 60 * 60 });
            return comments;
        }

        return null;

    } catch (error) {
        console.err(error)
        return null
    }
    
}

module.exports = {
    setAllPostToCache,
    cacheSinglePost
}