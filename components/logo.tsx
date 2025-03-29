import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Appearance, StyleSheet } from "react-native";

export function Logo() {
  const [source, setSource] = useState(
    require("../assets/images/logo-light.svg"),
  );

  useFocusEffect(
    useCallback(() => {
      const colorScheme = Appearance.getColorScheme();
      setSource(
        colorScheme === "dark"
          ? require("../assets/images/logo-dark.svg")
          : require("../assets/images/logo-light.svg"),
      );
    }, []),
  );

  return <Image style={styles.img} source={source} />;
}

const styles = StyleSheet.create({
  img: {
    width: 53,
    height: 26,
  },
});
