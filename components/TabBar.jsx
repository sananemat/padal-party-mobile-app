import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    UIManager,
    Platform,
  } from 'react-native';
  import { useLinkBuilder } from '@react-navigation/native';
  import { Text, PlatformPressable } from '@react-navigation/elements';
  import { Ionicons } from '@expo/vector-icons';
  import { LinearGradient } from 'expo-linear-gradient';
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring
  } from 'react-native-reanimated';
  
  // Enable LayoutAnimation on Android (optional fallback)
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  
  export function TabBar({ state, descriptors, navigation }) {
    const { buildHref } = useLinkBuilder();
  
    // Track position and width of each tab
    const tabMeasurements = useRef({});
    const containerWidth = useRef(SCREEN_WIDTH * 0.9); // 5% left + 5% right = 90%
  
    // Reanimated shared value for translateX
    const translateX = useSharedValue(0);
  
    // Icons mapping
    const icon = {
      profile: (isFocused, props) => (
        <Ionicons name={isFocused ? 'person' : 'person-outline'} size={24} {...props} />
      ),
      home: (isFocused, props) => (
        <Ionicons name={isFocused ? 'home' : 'home-outline'} size={24} {...props} />
      ),
      create: (isFocused, props) => (
        <Ionicons name={isFocused ? 'create' : 'create-outline'} size={24} {...props} />
      ),
    };
  
    // When tab index changes, animate the gradient
    useEffect(() => {
      const focusedIndex = state.index;
      const tabWidth = containerWidth.current / state.routes.length;
      const targetX = focusedIndex * tabWidth;
  
      translateX.value = withSpring(targetX, { damping: 18, stiffness: 180, mass:1 });
    }, [state.index]);
  
    // Measure tab positions on layout
    const onTabLayout = (index) => (event) => {
      const { width } = event.nativeEvent.layout;
      tabMeasurements.current[index] = { width };
    };
  
    const animatedGradientStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
      };
    });
  
    return (
      <View style={styles.container}>
        {/* Cyan Glow (top-left) */}
        <LinearGradient
          colors={['#38C6F4', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.1, y: 0.6 }}
          style={[styles.glow, { top: -0.85, left: -1 }]}
        />
  
        {/* Pink Glow (bottom-right) */}
        <LinearGradient
          colors={['#EE3C79', 'transparent']}
          start={{ x: 1, y: 1 }}
          end={{ x: -0.45, y: 0 }}
          style={[styles.glow, { bottom: -0.8, right: -1 }]}
        />
  
        <View style={styles.tabBar}>
          {/* Animated Gradient Background */}
          <Animated.View
            style={[
              styles.animatedGradientContainer,
              animatedGradientStyle,
              {
                width: containerWidth.current / state.routes.length,
              },
            ]}
          >
            <LinearGradient
              colors={['#38C6F4', '#EE3C79']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: .7, y: 0.5 }}
              style={styles.animatedGradient}
            />
          </Animated.View>
  
          {/* Tab Items */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;
  
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };
  
            return (
              <PlatformPressable
                key={route.name}
                href={buildHref(route.name, route.params)}
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLayout={onTabLayout(index)}
                style={styles.tabBarItem}
              >
                {icon[route.name](isFocused, {
                  color: isFocused ? '#fff' : '#ddd',
                })}
                
                <Text style={{ color: isFocused ? '#fff' : '#ddd' }}>{label}</Text>
              </PlatformPressable>
            );
          })}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 25,
      left: '5%',
      right: '5%',
    },
    glow: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 35,
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 35,
      backgroundColor: '#0E1340',
      paddingVertical: 15,
      shadowColor: '#070b2aff',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 30,
      elevation: 20,
      position: 'relative', // Important for absolute positioning of gradient
      overflow: 'hidden', // So gradient doesn't spill out
    },
    tabBarItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 10,
      zIndex: 2, // Ensure icons/text are above gradient
    },
    animatedGradientContainer: {
      position: 'absolute',
      height: '115%',
      paddingHorizontal: 10,
      borderRadius: 35,
      zIndex: 1,
      overflow: 'hidden',
    },
    animatedGradient: {
      flex: 1,
      borderRadius: 35,
    },
  });