import StarIcon from "../../assets/main/star.png";
import { itemsTable } from "../../data/gameplay";
import "./style.scss";
interface ItemProps {
  item_id: number;
  level: number;
  onClick?: (inputs: any) => void;
  isSelected?: boolean;
  className?: string;
}

export default function ItemMain({
  item_id,
  level,
  onClick,
  className,
}: ItemProps) {
  return (
    <div className={`${className || "item"}`} onClick={onClick}>
      <>
        <StarIndicator level={2}></StarIndicator>
        <img src={itemsTable[item_id].imageSource} alt="" />
      </>
    </div>
  );
}

interface IndicatorProps {
  level: number;
}
export function StarIndicator({ level }: IndicatorProps) {
  let stars = [];
  for (let i = 0; i < level; i++) {
    stars.push(<img src={StarIcon}></img>);
  }
  return <div className="star-level">{stars.map((s) => s)}</div>;
}
