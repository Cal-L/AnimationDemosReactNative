import * as React from "react";
const LottieView = require("lottie-react-native");
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity
} from "react-native";
const windowSize = Dimensions.get("window");

interface State {
  animationProgress: Animated.Value;
  scrollProgress: Animated.Value;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      animationProgress: new Animated.Value(0),
      scrollProgress: new Animated.Value(0)
    };
  }

  renderWave(): JSX.Element {
    const { animationProgress } = this.state;

    return (
      <View style={styles.wave}>
        <LottieView
          style={styles.wave}
          source={require("../animations/wave.json")}
          progress={animationProgress}
          speed={1}
        />
      </View>
    );
  }

  renderDrawerOptions(): JSX.Element {
    const { animationProgress } = this.state;
    const options = [
      "City News",
      "Notifications",
      "Friends",
      "Favorites",
      "Settings"
    ];

    const optionRows = options.map((title: string, optionIndex: number) => {
      const relativeAnimationValue = optionIndex / (options.length - 1);
      const animationValueIncrement = 1 / (options.length - 1);
      const translateX = animationProgress.interpolate({
        inputRange: [
          relativeAnimationValue - animationValueIncrement,
          relativeAnimationValue,
          relativeAnimationValue + animationValueIncrement
        ],
        outputRange: [0, 70, 0],
        extrapolate: "clamp"
      });
      const scale = animationProgress.interpolate({
        inputRange: [
          relativeAnimationValue - animationValueIncrement,
          relativeAnimationValue,
          relativeAnimationValue + animationValueIncrement
        ],
        outputRange: [1, 1.4, 1],
        extrapolate: "clamp"
      });
      const opacity = animationProgress.interpolate({
        inputRange: [
          relativeAnimationValue - animationValueIncrement,
          relativeAnimationValue,
          relativeAnimationValue + animationValueIncrement
        ],
        outputRange: [0.7, 1, 0.7],
        extrapolate: "clamp"
      });

      return (
        <Animated.View
          key={optionIndex}
          style={{
            opacity,
            transform: [{ translateX }, { scale }]
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Animated.timing(animationProgress, {
                toValue: optionIndex / (options.length - 1),
                duration: 500,
                useNativeDriver: true
              }).start();
            }}
            style={styles.drawerRow}
          >
            <View style={styles.drawerIcon} />
            <Text style={styles.drawerLabel}>{title.toUpperCase()}</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    });

    return <View style={styles.drawerContainer}>{optionRows}</View>;
  }

  renderDummyList(): JSX.Element {
    const { scrollProgress, animationProgress } = this.state;
    const options = [
      { title: "Night Life", color: "#f34b72" },
      { title: "Arts & Culture", color: "#30d1bb" },
      { title: "Food Festivals", color: "#c777f1" }
    ];

    const optionRows = options.map(
      (option: { title: string; color: string }, optionIndex: number) => {
        const relativeAnimationValue = optionIndex / (options.length - 1);
        const animationValueIncrement = 1 / (options.length - 1);

        const scrollInterpolatedProgress = scrollProgress.interpolate({
          inputRange: [0, windowSize.width],
          outputRange: [0, relativeAnimationValue]
        });
        const combinedAnimationProgress = Animated.add(
          animationProgress,
          scrollInterpolatedProgress
        );

        const translateX = combinedAnimationProgress.interpolate({
          inputRange: [
            relativeAnimationValue - animationValueIncrement,
            relativeAnimationValue,
            relativeAnimationValue + animationValueIncrement
          ],
          outputRange: [0, 50, 0]
          // extrapolate: "clamp"
        });

        // Need to depend on animationProgress which is 0-1 or index of row

        // const combinedAnimationProgress = Animated.add(
        //   animationProgress.interpolate({
        //     inputRange: [
        //       relativeAnimationValue - animationValueIncrement,
        //       relativeAnimationValue,
        //       relativeAnimationValue + animationValueIncrement
        //     ],
        //     outputRange: [0, 50, 0]
        //   }),
        //   scrollInterpolatedProgress
        // );

        // const translateX = combinedAnimationProgress;

        return (
          <View
            key={optionIndex}
            style={[
              styles.listRow,
              {
                backgroundColor: option.color
              }
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateX
                  }
                ]
              }}
            >
              <Text style={styles.listLabel}>{option.title}</Text>
            </Animated.View>
          </View>
        );
      }
    );

    const extensionRows = options.map(
      (option: { color: string }, optionIndex: number) => {
        return (
          <View
            key={optionIndex}
            style={[
              styles.listRow,
              {
                backgroundColor: option.color
              }
            ]}
          />
        );
      }
    );

    const translateX = scrollProgress.interpolate({
      inputRange: [0, windowSize.width],
      outputRange: [-170, 0]
    });

    return (
      <Animated.View
        style={[
          styles.fill,
          {
            transform: [
              {
                translateX
              }
            ]
          }
        ]}
      >
        <View
          style={[
            styles.absoluteFill,
            {
              left: -windowSize.width
            }
          ]}
        >
          {extensionRows}
        </View>
        {optionRows}
      </Animated.View>
    );
  }

  render() {
    const wave = this.renderWave();
    const drawerOptions = this.renderDrawerOptions();
    const dummyList = this.renderDummyList();

    return (
      <Animated.ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: this.state.scrollProgress
                }
              }
            }
          ],
          {
            useNativeDriver: true
          }
        )}
      >
        <View
          style={[
            styles.page,
            {
              zIndex: 2
            }
          ]}
        >
          {wave}
          {drawerOptions}
        </View>
        <View
          style={[
            styles.page,
            {
              zIndex: 1
            }
          ]}
        >
          {dummyList}
        </View>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fill: {
    flex: 1
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject
  },
  page: {
    width: windowSize.width
  },
  wave: {
    position: "absolute",
    left: 0,
    top: 0,
    height: windowSize.height,
    width: (375 * windowSize.height) / 667
  },
  // Drawer Styles
  drawerContainer: {
    flex: 1,
    width: windowSize.width - 50,
    justifyContent: "space-evenly",
    paddingLeft: 20,
    paddingVertical: 30
  },
  drawerRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  drawerIcon: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 15,
    marginRight: 15
  },
  drawerLabel: {
    color: "white",
    fontSize: 20,
    fontFamily: "HelveticaNeue-Medium"
  },
  // List Styles
  listRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listLabel: {
    color: "white",
    fontSize: 20,
    fontFamily: "HelveticaNeue-Medium"
  }
});

export default App;
