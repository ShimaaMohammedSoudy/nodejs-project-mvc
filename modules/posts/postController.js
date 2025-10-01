import postCollection from "../../database/models/postModel.js";

// ========== Create Post ==========
const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    const newPost = await postCollection.add({
      title,
      content,
      imageUrl: imageUrl || null,
      userId: req.user.userId, 
      createdAt: new Date(),
    });

    res.status(201).json({ msg: "Post created", postId: newPost.id });
  } catch (err) {
    res.status(500).json({ msg: "Error creating post", error: err.message });
  }
};

// ========== Get All Posts ==========
const getAllPosts = async (req, res) => {
  try {
    const snapshot = await postCollection.get();
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching posts", error: err.message });
  }
};

// ========== Get Post By Id ==========
const getPostById = async (req, res) => {
  try {
    const postDoc = await postCollection.doc(req.params.id).get();
    if (!postDoc.exists) return res.status(404).json({ msg: "Post not found" });

    res.status(200).json({ id: postDoc.id, ...postDoc.data() });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching post", error: err.message });
  }
};

// ========== Update Post ==========
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postCollection.doc(id).get();

    if (!postDoc.exists) return res.status(404).json({ msg: "Post not found" });

    const postData = postDoc.data();

    
    if (postData.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await postCollection.doc(id).update({ ...req.body, updatedAt: new Date() });

    res.status(200).json({ msg: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating post", error: err.message });
  }
};

// ========== Delete Post ==========
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postCollection.doc(id).get();

    if (!postDoc.exists) return res.status(404).json({ msg: "Post not found" });

    const postData = postDoc.data();

    if (postData.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await postCollection.doc(id).delete();

    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting post", error: err.message });
  }
};

export { createPost, getAllPosts, getPostById, updatePost, deletePost };
