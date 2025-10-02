import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PlatformPressable, Text } from "@react-navigation/elements";

export function NeonCard({
  children,
  width = "100%",
  height = "100%",
  glowColors = ["#38C6F4", "#EE3C79"], // default cyan → pink
  style,
  onPress,
  flexDirection='column'
}) {
  return (
    <PlatformPressable onPress={onPress} style={[{ width, height,  flex:1 }, style]}>
      <View style={[styles.card, { width, height }]}>
        {/* Cyan Glow (top-left) */}
        <LinearGradient
          colors={[glowColors[0], "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.1, y: 0.6 }}
          style={[styles.glow, { top: -0.85, left: -1 }]}
        />

        {/* Pink Glow (bottom-right) */}
        <LinearGradient
          colors={[glowColors[1], "transparent"]}
          start={{ x: 1, y: 1 }}
          end={{ x: -0.45, y: 0 }}
          style={[styles.glow, { bottom: -0.8, right: -1 }]}
        />
        <View style={styles.contentBox}>
            {/* Content inside the card */}
            <View style={[styles.content, {flexDirection}]}>{children}</View>
        </View>
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        bottom: 25,
    },
    glow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    contentBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 35,
        backgroundColor: '#0E1340',
        shadowColor: '#070b2aff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 20,
        position: 'relative', // Important for absolute positioning of gradient
        overflow: 'hidden', // So gradient doesn't spill out
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        width: '100%',
        height: '100%'
    },
});
