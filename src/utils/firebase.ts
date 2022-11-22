import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { writeUserLog } from "utils/writeLog";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const useSignup = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const password = process.env.NEXT_PUBLIC_PASSWORD!;

  const quiz = {
    "A-1": "unanswered",
    "A-2": "unanswered",
    "A-3": "unanswered",
    "B-1": "unanswered",
    "B-2": "unanswered",
    "B-3": "unanswered",
    "C-1": "unanswered",
    "C-2": "unanswered",
    "C-3": "unanswered",
    "C-4": "unanswered",
    "D-1": "unanswered",
    "D-2": "unanswered",
    "E-1": "unanswered",
    "E-2": "unanswered",
    "E-3": "unanswered",
    "E-4": "unanswered",
    "F-1": "unanswered",
    "F-2": "unanswered",
    "G-1": "unanswered",
    "G-2": "unanswered",
  };

  const initMtTrueList = [
    "mt-4",
    "mt-8",
    "mt-20",
    "mt-30",
    "mt-33",
    "mt-42",
    "mt-44",
    "mt-45",
    "mt-46",
    "mt-47",
    "mt-48",
    "mt-49",
  ];

  const initRvTrueList = [
    "rv-4",
    "rv-18",
    "rv-29",
    "rv-32",
    "rv-33",
    "rv-36",
    "rv-38",
    "rv-39",
    "rv-41",
    "rv-43",
    "rv-45",
    "rv-46",
    "rv-47",
    "rv-49",
    "rv-52",
  ];

  const initGdTrueList = [
    "gd-1",
    "gd-4",
    "gd-5",
    "gd-9",
    "gd-12",
    "gd-14",
    "gd-24",
    "gd-29",
    "gd-31",
    "gd-32",
  ];

  const handleChangeEmail = (e: any) => {
    setError(null);
    const email = e.currentTarget.value + "@example.com";
    setEmail(email);
  };

  const handleCreateUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(collection(db, "users"), {
        userName: userCredential.user.email?.split("@")[0],
        uid: userCredential.user.uid,
        checkIn: false,
        mode: "none",
        createdAt: Timestamp.now(),
      });
      const mtList = new Array<boolean>(49).fill(false);
      initMtTrueList.forEach((pictureId) => {
        const id = Number(pictureId.split("-")[1]);
        if (mtList[id - 1] === false) mtList[id - 1] = true;
      });
      const rvList = new Array<boolean>(55).fill(false);
      initRvTrueList.forEach((pictureId) => {
        const id = Number(pictureId.split("-")[1]);
        if (rvList[id - 1] === false) rvList[id - 1] = true;
      });
      const gdList = new Array<boolean>(33).fill(false);
      initGdTrueList.forEach((pictureId) => {
        const id = Number(pictureId.split("-")[1]);
        if (gdList[id - 1] === false) gdList[id - 1] = true;
      });

      await addDoc(collection(db, "userStatus"), {
        uid: userCredential.user.uid,
        answered: 0,
        quiz: quiz,
        points: 0,
        pictures: {
          mt: mtList,
          rv: rvList,
          gd: gdList,
        },
      });
      const logData = {
        uid: userCredential.user.uid,
        place: "start",
        state: "signUp",
      };
      await writeUserLog(logData);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        setError(err.message);
      }
    }
  };

  return {
    handleChangeEmail,
    handleCreateUser,
    error,
  };
};

export const useLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const password = process.env.NEXT_PUBLIC_PASSWORD!;

  const handleChangeEmail = (e: any) => {
    setError(null);
    const addr = e.currentTarget.value + "@example.com";
    setEmail(addr);
  };

  const handleSignInUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return {
    handleChangeEmail,
    handleSignInUser,
    error,
  };
};

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.message);
        router.push("/login");
      }
    }
  };
  return handleLogout;
};
