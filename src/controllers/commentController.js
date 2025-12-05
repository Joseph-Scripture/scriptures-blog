const prisma = require('../prisma/client');

async function createComment(req, res) {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.userId;

    try {
        // Validate content
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Content is required" });
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: Number(postId),
                authorId: userId
            },
            include:{
                author:{
                    select:{
                        username: true,
                    }
                }

            }
        });

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });

    } catch (err) {
        console.error("Comment error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
// Get all comments on a particular post
async function getAllComments(req, res) {
    const { postId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) },
            include: {
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        const enhancedComments = comments.map(c => ({
            ...c,
            authorId: c.authorId  
        }));

        return res.status(200).json({ comments: enhancedComments });

    } catch (err) {
        console.error("Get comments error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


// update comment
async function updateComment(req, res) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Content cannot be empty" });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.authorId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content },
            include: {
                author: {
                    select: { username: true, email: true }
                }
            }
        });

        return res.status(200).json({
            message: "Comment updated successfully",
            updatedComment
        });

    } catch (err) {
        console.error("Update comment error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

// Delete comment

async function deleteComment(req, res) {
    const { id } = req.params;
    const userId = req.user.userId; 

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.authorId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await prisma.comment.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (err) {
        console.error("Delete comment error:", err);
        res.status(500).json({ message: "Server error" });
    }
}


module.exports = {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}