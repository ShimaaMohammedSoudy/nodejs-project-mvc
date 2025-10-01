import commentCollection from "../../database/models/commentModel.js";

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
    const { text, userId, postId } = req.body;
    const newComment = {
      text,
      userId,
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
