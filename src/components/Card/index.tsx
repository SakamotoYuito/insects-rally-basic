import { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { InsectsInfo } from "./PictureCard";
import styles from "./style.module.scss";
import MyToast from "components/Toast";

type Props = {
  info: InsectsInfo;
};

const CardComponent = (props: Props) => {
  const [isToastShow, setIsToastShow] = useState(false);
  const appearToast = () => {
    setIsToastShow(!isToastShow);
  };

  return (
    <>
      <Card className={styles.card} onClick={() => appearToast()}>
        <Card.Header>{props.info.name}</Card.Header>
        <picture>
          <source srcSet={props.info.image} type="image/webp" />
          <img src={props.info.image} alt={props.info.name} />
        </picture>
        {props.info.gender ? (
          <ListGroup variant="flush">
            <ListGroup.Item className={styles.list}>
              <Badge className={styles.badge} pill bg="primary">
                性別
              </Badge>
              {props.info.gender}
            </ListGroup.Item>
          </ListGroup>
        ) : null}
      </Card>
      <MyToast
        title={props.info.name}
        small={props.info.gender}
        image={props.info.image}
        explain={props.info.explain}
        isShow={isToastShow}
        onClose={() => appearToast()}
      />
    </>
  );
};

export default CardComponent;
