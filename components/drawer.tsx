import { useEffect, useRef } from "react";
import { Animated, Button, Dimensions, StyleSheet, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export default function DrawerComponent({ visible, onClose }: DrawerProps) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <>
      {visible && (
        <View style={styles.overlay}>
          <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.title}>抽屉组件内容</Text>
            <Button title="关闭抽屉" onPress={onClose} />
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    // top: -100,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  panel: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: { fontSize: 24, marginBottom: 20 },
});
