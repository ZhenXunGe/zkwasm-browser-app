import { itemsTable } from "../../data/gameplay";
import { WasmInstance } from "../../types/game";
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
    <div
      className="item"
      onClick={() => {
        onSelect(slotIndex!);
      }}
    >
      <img src={itemsTable[itemIndex!].imageSource} alt="" />
    </div>
  );
}
