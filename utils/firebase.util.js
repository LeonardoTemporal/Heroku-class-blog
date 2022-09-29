const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const dotenv = require("dotenv");
const { upload } = require("./multer.util");
const { PostImg } = require("../models/postImg.model");

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROYECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Map async
const uploadPostImgs = async (img, postId) => {
  const imgPromises = img.map(async (img) => {
    const [originalName, ext] = img.originalname.split(".");

    const filename = `posts/${postId}/${originalName}-${Date.now()}.${ext}`;

    const imgRef = ref(storage, filename);

    // Upload image to firebase
    const result = await uploadBytes(imgRef, img.buffer);

    await PostImg.create({
      postId,
      imgUrl: result.metadata.fullPath,
    });
  });

  await Promise.all(imgPromises);
};

const getPostImgUrls = async (posts) => {
  const postsWithImgsPromises = posts.map(async (post) => {
    // Get img url
    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);

      postImg.imgUrl = imgUrl;
      return postImg;
    });

    const postImgs = await Promise.all(postImgsPromises);

    post.postImgs = postImgs;
    return post;
  });

  return await Promise.all(postsWithImgsPromises);
};

module.exports = { storage, uploadPostImgs, getPostImgUrls };
