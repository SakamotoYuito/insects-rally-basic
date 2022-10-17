import { db } from "utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export type UserLog = {
  uid: string;
  state: string;
  place: string;
};

export type PlaceLog = {
  type: "qr" | "camera";
  place: string;
  congestion: number;
};

const userLogCollection = "userLog1029";
const placeLogCollection = "placeLog1029";

export const writeUserLog = async (log: UserLog) => {
  await addDoc(collection(db, userLogCollection), {
    uid: log.uid,
    state: log.state,
    place: log.place,
    time: Timestamp.now(),
  });
};

export const writePlaceLog = async (log: PlaceLog) => {
  await addDoc(collection(db, placeLogCollection), {
    type: log.type,
    place: log.place,
    congestion: log.congestion,
    time: Timestamp.now(),
  });
};