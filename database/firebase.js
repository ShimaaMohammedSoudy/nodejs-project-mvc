import admin from "firebase-admin"
 import {readFileSync} from "fs"
const serviceAccount = JSON.parse(
   
     readFileSync("./serviceAccountKey.json")
)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()


export default db;