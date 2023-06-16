interface IProps {
  tag?: string;
  wisdom: number;
  attack: number;
  luck: number;
  charm: number;
  family: number;
  speed: number;
  defence: number;
  age: number;
  className?: string;
}

export default function StatusDisplay(props: IProps) {
  const { tag = "Status", wisdom, attack, luck, charm, family, speed, defence, age } = props;
  return (
    <>
      <div className={`status-display ${props.className}`}>
        <span className="tag">{tag}</span>
        <span className="value ms-2">{wisdom}</span>
        <span className="value ms-2">{attack}</span>
        <span className="value ms-2">{luck}</span>
        <span className="value ms-2">{charm}</span>
        <span className="value ms-2">{family}</span>
        <span className="value ms-2">{speed}</span>
        <span className="value ms-2">{defence}</span>
        <span className="value ms-2">{age}</span>
      </div>
    </>
  );
}
