import { View } from "react-native";
import { Button } from "./ui/button";
import { ChevronLeft } from "./ui/icons";
import { Text } from "./ui/text";

const MAX_TITLE_LENGTH = 25;

export function Header(props: {
  title: string;
  onBack?: () => void;
  actions?: JSX.Element | null;
}) {
  return (
    <View className="p-4 border-b border-border">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 grow shrink">
          {props.onBack && (
            <Button
              className="shrink-0"
              variant="ghost"
              size="icon"
              onPress={props.onBack}
            >
              <Text asChild>
                <ChevronLeft />
              </Text>
            </Button>
          )}

          <Text className="text-lg font-medium shrink" numberOfLines={1}>
            {props.title}
          </Text>
        </View>

        {props.actions}
      </View>
    </View>
  );
}
