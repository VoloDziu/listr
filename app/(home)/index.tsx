import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Settings, Trash } from "~/components/ui/icons";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Doc } from "~/convex/_generated/dataModel";

function EmptyList() {
  return (
    <View className="flex-grow items-center justify-center">
      <Button onPress={() => router.push("/new")}>
        <Text>Create your first list</Text>
      </Button>
    </View>
  );
}

function Item(props: { item: Doc<"lists"> }) {
  const remove = useMutation(api.lists.deleteList);

  const todos = useQuery(api.todos.getTodos, { listId: props.item._id });
  const completedTodosCount = todos?.filter((todo) => todo.completed).length;
  const totalTodosCount = todos?.length;

  return (
    <Card className="flex-row items-center p-4">
      <Pressable
        className="flex-grow shrink gap-1"
        onPress={() => router.push(`/lists/${props.item._id}`)}
      >
        <CardTitle
          className="text-lg font-semibold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.item.name}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {completedTodosCount ? completedTodosCount + "/" : ""}
          {totalTodosCount} items
        </CardDescription>
      </Pressable>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onPress={() => remove({ id: props.item._id })}
      >
        <Text asChild>
          <Trash className="size-5" />
        </Text>
      </Button>
    </Card>
  );
}

export default function HomeScreen() {
  const items = useQuery(api.lists.getNonArchivedLists);

  return (
    <View className="flex-1 bg-background">
      <Header
        title={<Logo />}
        actions={
          <Button
            size="icon"
            variant="ghost"
            onPress={() => router.push("/profile")}
          >
            <Text asChild>
              <Settings />
            </Text>
          </Button>
        }
      />

      {items?.length === 0 ? <EmptyList /> : null}

      {items?.length && items.length > 0 ? (
        <>
          <FlatList
            data={items ?? []}
            renderItem={(item) => <Item item={item.item} />}
            keyExtractor={(item) => item._id}
            contentContainerClassName="py-4 px-4 gap-4 flex-col"
          />

          <Footer>
            <Button onPress={() => router.push("/new")}>
              <Text>Add</Text>
            </Button>
          </Footer>
        </>
      ) : null}
    </View>
  );
}
