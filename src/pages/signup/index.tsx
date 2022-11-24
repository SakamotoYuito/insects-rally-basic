import React, { useState } from "react";
import { useSignup } from "utils/firebase";
import MyTextForm from "components/Form/TextForm";
import styles from "./style.module.scss";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";

export const useSignupPage = () => {
  const { handleChangeEmail, handleCreateUser, error } = useSignup();
  const [validated, setValidated] = useState(false);
  const router = useRouter();

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
      <Button className={styles.button} onClick={() => router.push("/login")}>
        ログイン(既に登録済みの方)
      </Button>
    </div>
  );
};

export default useSignupPage;
