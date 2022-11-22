import { useRouter } from "next/router";
// import { useAuthContext } from "components/Header/loginObserver";
// import Layout from "pages/layout";
// import { Button } from "react-bootstrap";
// import styles from "./style.module.scss";
// import { updatePlaceState, updateUserStatus, updateUsers } from "utils/qr";

// // QRコード：https://insects-rally.vercel.app/qr?type={type}&place={place}
// // {type} : クイズの問題→quiz, 図鑑用→picture, 入り口→entrance, 出口→exit, チェックイン→checkin, チェックアウト→checkout
// // {place} : 部屋のアルファベット-数字
// // typeがcheckinの場合、mode={basic, avoidCongestion, avoidQuietness, avoidAll}

// const Qrcode = () => {
//   const router = useRouter();
//   const queryPram = router.query;
//   const { userInfo } = useAuthContext();
//   const uid = userInfo?.uid ?? "";
//   const type = queryPram.type as string;
//   const place =
//     type === "checkin" || type === "checkout"
//       ? "受付"
//       : (queryPram.place as string);

//   if (uid !== "") {
//     const qrPlace = setQrPlace(type);
//     switch (qrPlace) {
//       case "room":
//         updateUserStatus(uid, type, place);
//         updatePlaceState(uid, type, place);
//         router.push("/");
//         break;
//       case "front":
//         const mode = queryPram.mode as string;
//         updateUsers(uid, type, place, mode);
//         setTimeout(() => {
//           router.push("/");
//         }, 3000);
//         break;
//       case "lastTest":
//         updateUserStatus(uid, type, "lastTest");
//         router.push("/");
//     }
//   }

//   return (
//     <Layout footer={false}>
//       {type === "quiz" && (
//         <div className={styles.container}>
//           <Button
//             className={styles.button}
//             onClick={() => {
//               updateUserStatus(uid, type, place);
//               updatePlaceState(uid, type, place);
//               router.push({
//                 pathname: "/quiz",
//                 query: { area: place },
//               });
//             }}
//           >
//             このクイズを解放する
//           </Button>
//         </div>
//       )}
//       {type === "checkin" && (
//         <div className={styles.container}>
//           <h3>
//             チェックイン中です。
//             <br />
//             生き物写真展にようこそ！
//           </h3>
//         </div>
//       )}
//       {type === "checkout" && (
//         <div className={styles.container}>
//           <h3>
//             チェックアウト中です。
//             <br />
//             ありがとうございました。
//             <br />
//             アンケートの回答にご協力お願いします。
//           </h3>
//         </div>
//       )}
//     </Layout>
//   );
// };

// const setQrPlace = (type: string) => {
//   if (type === "entrance" || type === "exit") {
//     return "room";
//   } else if (type === "checkin" || type === "checkout") {
//     return "front";
//   } else if (type === "lastTest") {
//     return "lastTest";
//   }
// };

// export default Qrcode;
