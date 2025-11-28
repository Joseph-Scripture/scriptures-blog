const prisma = require("../prisma/client");

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
                        email: true   // optional
                    }
                }
            }
        });

        res.status(201).json({
            message: `Post created successfully by ${post.author.username}`,
            username:post.author.username,
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
        const posts = await prisma.post.findMany({
            include: {
                author: true, //  show author info
            },
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// DELETE POST
async function deletePost(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // 1. Find the post
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // 2. Check if user owns post
        if (post.authorId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 3. Delete post
        await prisma.post.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
};
