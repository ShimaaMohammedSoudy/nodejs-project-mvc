import userCollection from "../../database/models/userModel.js";
import postCollection from "../../database/models/postModel.js";
import commentCollection from "../../database/models/commentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//////////// Signup //////////////

const SignUP = async (req, res) => {
  let { name, email, password, role } = req.body; 
  let existingUser = await userCollection.where("email", "==", email).get();
  if (!existingUser.empty) {
    return res.status(400).send({ msg: "Email already registered" });
  }

  let hashedpassword = bcrypt.hashSync(password, 8);

  const newUser = await userCollection.add({
    name,
    email,
    password: hashedpassword,
    role: role || "user", 
  });

  res.status(201).json({ msg: "user created", userId: newUser.id });

};

//////////// Login //////////////

const Login = async (req, res) => {
  let { email, password } = req.body;
  let existinguser = await userCollection.where("email", "==", email).get();
  if (existinguser.empty) {
    res.status(400).send({ msg: "Invalid email or password" });
  } else {
    let userpass = existinguser.docs[0].data().password;
   
    const isMatch = bcrypt.compareSync(password, userpass);

    if (isMatch) {
      // create token
      const userId = existinguser.docs[0].id;
      const role = existinguser.docs[0].data().role

      const token = jwt.sign({ email, userId, role }, "mysecretpassword");
      res.status(200).json({ msg: "login success", token, role }); 
    } else {
      res.status(400).send("login failed");
    }
  }
};




//////////// Get User Profile //////////////
const getProfile = async (req, res) => {

  const userId = req.user.userId;
  const userDoc = await userCollection.doc(req.user.userId).get();

  if (!userDoc.exists) return res.status(404).json({ msg: "User not found" });

    const postsSnapshot = await postCollection.where("userId", "==", userId).get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const commentsSnapshot = await commentCollection.where("userId", "==", userId).get();
    const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


  res.status(200).json({ id: userDoc.id, ...userDoc.data(), password: undefined ,posts,comments});
};

//////////// Update User Profile //////////////
const updateProfile = async (req, res) => {
  const updates = req.body;
  if (updates.password) 
    updates.password = bcrypt.hashSync(updates.password, 8);

  await userCollection.doc(req.user.userId).update(updates);
  res.status(200).json({ msg: "Profile updated successfully" });
};

// -------------- Get All Users (Admin only) --------------
const getAllUsers = async (req, res) => {
  const snapshot = await userCollection.get();
  const users = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    users.push({
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  });
  res.status(200).json(users);
};


export { SignUP, Login,getProfile, updateProfile,getAllUsers };
