import { Theme, useTheme } from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

export default function HomeScreen(props: {
  setTheme: (value: string) => void;
}) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.text}>Home</Text>
        <Link style={styles.link} href="/lists/1">
          List 1
        </Link>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
    },
    link: {
      color: theme.colors.primary,
    },
  });
