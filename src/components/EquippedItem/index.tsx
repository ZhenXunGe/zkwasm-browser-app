import { itemsTable } from "../../data/gameplay";
import { WasmInstance } from "../../types/game";
import ItemMain from "../ItemMain";
import { StarIndicator } from "../ItemMain";
interface EquippedItemProps {
  slotIndex: number;
  instance: WasmInstance | null;
  onSelect: (itemIndex: number) => void;
}

export default function EquippedItem({
  slotIndex,
  instance,
  onSelect,
}: EquippedItemProps) {
  const itemIndex = instance?.get_active_items()[slotIndex];
  if (itemIndex === undefined) return <div className="item"></div>;
  return (
    <>
      <ItemMain
        level={instance!.get_active_item_level(itemIndex)}
        item_id={itemIndex}
        onClick={onSelect}
      ></ItemMain>
    </>
    // <div
    //   className="item"
    //   onClick={() => {
    //     onSelect(slotIndex!);
    //   }}
    // >
    //   <StarIndicator level={2}></StarIndicator>
    //   <img src={itemsTable[itemIndex!].imageSource} alt="" />
    // </div>
  );
}
