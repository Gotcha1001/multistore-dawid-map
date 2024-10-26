import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  value: string;
  icon: IconDefinition;
  onClick: () => void;
  label: ReactNode;
  defaultChecked?: boolean;
};

export default function LabelRadioButton({
  value,
  icon,
  onClick,
  label,
  defaultChecked = false,
  name,
}: Props) {
  return (
    <label className=" radio-btn group ">
      <span className="icon group-has-[:checked]:bg-blue-500 group-has-[:checked]:text-white">
        <FontAwesomeIcon icon={icon} size="sm" />
      </span>

      <input
        onClick={() => onClick()}
        className="hidden"
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
      />
      {label}
    </label>
  );
}
