import { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "./ui/button";
import { ChevronLeft } from "./ui/icons";
import { Text } from "./ui/text";

const MAX_TITLE_LENGTH = 25;

export function Header(props: {
  title: JSX.Element | null;
  onBack?: () => void;
  actions?: JSX.Element | null;
}) {
  return (
    <View className="p-4 text-card-foreground">
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

          {props.title}
        </View>

        {props.actions}
      </View>
    </View>
  );
}

Header.Title = function (props: { children?: ReactNode }) {
  return (
    <Text className="text-2xl font-medium shrink" numberOfLines={1}>
      {props.children}
    </Text>
  );
};
