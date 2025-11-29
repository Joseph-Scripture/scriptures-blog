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
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
// 695904596



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

        res.json({
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

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    updatePost,
};
