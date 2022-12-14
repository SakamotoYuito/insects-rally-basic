import { useState } from "react";
import Card from "react-bootstrap/Card";
import { InsectsInfo } from "./PictureCard";
import styles from "./style.module.scss";
import MyToast from "components/Toast";
import Image from "next/image";

type Props = {
  info: InsectsInfo;
  isKnown: boolean;
};

const CardComponent = (props: Props) => {
  const [isToastShow, setIsToastShow] = useState(false);
  const appearToast = () => {
    setIsToastShow(!isToastShow);
  };

  return (
    <>
      {props.isKnown === true ? (
        <>
          <Card className={styles.card} onClick={() => appearToast()}>
            <Card.Header>{props.info.name}</Card.Header>
            <div className={styles.image}>
              <Image
                src={props.info.image}
                width={500}
                height={500}
                objectFit="contain"
                alt={props.info.name}
                quality={20}
              />
            </div>
          </Card>
          <MyToast
            title={props.info.name}
            image={props.info.image}
            explain={props.info.explain}
            isShow={isToastShow}
            onClose={() => appearToast()}
          />
        </>
      ) : (
        <>
          <Card className={styles.unknown}>
            <Card.Header>{props.info.name}</Card.Header>
            <div className={styles.image}>
              <Image
                src="/unknown.png"
                width={500}
                height={500}
                objectFit="contain"
                alt={props.info.name}
                quality={20}
              />
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default CardComponent;
