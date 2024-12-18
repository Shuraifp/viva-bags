import admin from "firebase-admin";
import serviceAccount from "./vivabags-aa156-firebase-adminsdk-fokip-5481e5a0ca.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;