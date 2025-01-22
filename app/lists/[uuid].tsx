import { Theme, useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function List() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView>
      <Text style={styles.text}>LIst 1</Text>
      <Link style={styles.link} href="..">
        Home
      </Link>
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
