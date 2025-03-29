import { View } from "react-native";

export function Footer(props: {
  children?: JSX.Element | null;
  className?: string;
}) {
  return <View className="p-4 shrink-0">{props.children}</View>;
}
