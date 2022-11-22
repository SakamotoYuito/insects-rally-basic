import React, { useState } from "react";
import Link from "next/link";
import { useSignup } from "utils/firebase";
import MyTextForm from "components/Form/TextForm";
import styles from "./style.module.scss";

export const useSignupPage = () => {
  const { handleChangeEmail, handleCreateUser, error } = useSignup();
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    await handleCreateUser();
  };

  return (
    <div className={styles.signUp}>
      <h1 className={styles.title}>
        謎解き写真展
        <br />
        新規登録
      </h1>
      <MyTextForm
        validated={validated}
        label="好きな名前で登録してください"
        type="text"
        placeHolder="ユーザーID"
        feedback="ユーザーIDを入力してください"
        onSubmit={(e) => handleSubmit(e)}
        onChange={(e) => handleChangeEmail(e)}
        buttonStr="ユーザー登録"
        error={error}
      />
      <Link href="/login">
        <p className={styles.link}>すでに登録している方はこちら</p>
      </Link>
    </div>
  );
};

export default useSignupPage;
