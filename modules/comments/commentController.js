import commentCollection from "../../database/models/commentModel.js";
import postCollection from "../../database/models/postModel.js"; 

// Get all comments
export const getComments = async (req, res) => {
  try {
    const snapshot = await commentCollection.get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get comment by ID
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await commentCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new comment 
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ msg: "Post ID is required in URL" });
    }

    if (!text) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const postDoc = await postCollection.doc(postId).get();

    if (!postDoc.exists) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (postDoc.data().userId !== req.user.userId) {
      return res.status(403).json({ msg: "You can only comment on your own posts" });
    }

    const newComment = {
      text,
      userId: req.user.userId,
      postId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await commentCollection.add(newComment);
    res.status(201).json({ id: docRef.id, ...newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update comment
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    await commentCollection.doc(id).update(req.body);
    res.json({ message: "Comment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment
export const removeComment = async (req, res) => {
  try {
    const { id } = req.params;
    await commentCollection.doc(id).delete();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
