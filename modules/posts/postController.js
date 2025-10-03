import postCollection from "../../database/models/postModel.js";


// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      title,
      content,
      userId: req.user.userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await postCollection.add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const snapshot = await postCollection.get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await postCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postCollection.doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postData = postDoc.data();

    // Check ownership or admin
    if (postData.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    await postCollection.doc(id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post (only owner or admin)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postCollection.doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postData = postDoc.data();

    // Check ownership or admin
    if (postData.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await postCollection.doc(id).delete();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};