const prisma = require("../prisma/client");

const Cache = require('../services/cacheServices');
const redisClient = require('../redis/client');

// CREATE POST


async function createPost(req, res) {
    const { title, content } = req.body;
    const userId = req.user.userId;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                author: {
                    connect: { id: userId }
                }
            },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        // Invalidate the cache when a new post is created
        await redisClient.del('allPosts');

        res.status(201).json({
            message: `Post created successfully by ${post.author.username}`,
            
            post
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}




// GET ALL POSTS
async function getAllPosts(req, res) {
    try {
        // 1. Try to get posts from cache FIRST
        const cachedPosts = await redisClient.get('allPosts');
        if (cachedPosts) {
            console.log("Serving from cache");
            return res.status(200).json(JSON.parse(cachedPosts));
        }

        // 2. If no cache, hit the database
        const posts = await prisma.post.findMany({
            where: {published: true},
            include: {
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                comments:{
                    include:{
                        author:{
                            select:{username:true}
                        }
                    }
                }
            },
        });

        // 3. Save to cache for exactly 1 hour
        await redisClient.set('allPosts', JSON.stringify(posts), { EX: 60 * 60 });

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// GET MY POSTS
async function getMyPosts(req, res) {
    const userId = req.user.userId;
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                comments:{
                    include:{
                        author:{
                            select:{username:true}
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getSinglePost(req, res) {
    const { id } = req.params;

    const cachedPost = await redisClient.get(`post:${id}`);
    if (cachedPost) {
        console.log("Serving from cache");
        return res.status(200).json(JSON.parse(cachedPost));
    }

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

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Cache.cacheSinglePost(id);

        return res.status(200).json(post);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        // 1. Make sure post exists
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // 2. Check ownership
        if (post.authorId !== req.user.userId) {
            return res.status(403).json({ message: "Not allowed to update this post" });
        }

        // 3. Update it
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content }
        });

        // Invalidate the cache when a post is updated
        await redisClient.del('allPosts');

        return res.status(201).json({
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
async function deletePost(req, res) {
    const { id } = req.params;

    try {
        // 1. Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }
        // 2. Ownership check
        if (post.authorId !== req.user.userId) {
            return res.status(403).json({ message: "You are not allowed to delete this post" });
        }

        // 3. Delete post
        await prisma.post.delete({
            where: { id: Number(id) }
        });

        // Invalidate the cache when a post is deleted
        await redisClient.del('allPosts');

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
async function publishPost(req, res) {
    const { id } = req.params;

    try {
        // 1. Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }
        // 2. Ownership check
        if (post.authorId !== req.user.userId) {
            return res.status(403).json({ message: "You are not allowed to publish this post" });
        }
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { published: true }
        });

        // Invalidate the cache when a post is published
        await redisClient.del('allPosts');

        return res.status(200).json({ message: "Post published successfully", post: updatedPost });

    } catch (err) {
        console.error("Publish error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
module.exports = {
    createPost,
    getAllPosts,
    getMyPosts,
    deletePost,
    updatePost,
    getSinglePost,
    publishPost
};
