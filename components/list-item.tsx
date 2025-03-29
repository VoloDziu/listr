import { Pressable, View } from "react-native";
import { Doc } from "~/convex/_generated/dataModel";
import { cn } from "~/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Text } from "./ui/text";

export function ListItem(props: { item: Doc<"todos">; onPress: () => void }) {
  return (
    <View className="flex-row items-center pr-4 pl-6 bg-background ">
      <Pressable
        onPress={props.onPress}
        className="flex-1 flex-row items-center py-3 gap-4"
      >
        <Checkbox
          checked={!!props.item.completed}
          onCheckedChange={props.onPress}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={cn(
            "text-lg break-before-all shrink",
            props.item.completed && "line-through text-muted-foreground",
          )}
        >
          {props.item.name}
        </Text>
      </Pressable>
    </View>
  );
}
