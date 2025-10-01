import db from "../firebase.js";

const commentCollection = db.collection("comments");

export default commentCollection;
