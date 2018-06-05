import * as React from "react";
const LottieView = require("lottie-react-native");
import { StyleSheet, View, Animated, Dimensions } from "react-native";
const windowSize = Dimensions.get("window");

interface State {
  scrollProgress: Animated.Value;
}

interface MagicTab {
  icon: any;
  color: string;
}

class App extends React.Component<{}, State> {
  magicTabs: MagicTab[];

  constructor(props: {}) {
    super(props);
    this.magicTabs = [
      {
        icon: require("../animations/smiley.json"),
        color: "#6bd69b"
      },
      {
        icon: require("../animations/chart.json"),
        color: "#7468e1"
      }
    ];

    this.state = {
      scrollProgress: new Animated.Value(0)
    };
  }

  renderTabBar(): JSX.Element {
    const { scrollProgress } = this.state;

    const icons: JSX.Element[] = this.magicTabs.map(
      (magicTab: MagicTab, tabIndex: number) => {
        const animationProgress = scrollProgress.interpolate({
          inputRange: [
            windowSize.width * tabIndex - windowSize.width,
            windowSize.width * tabIndex,
            windowSize.width * tabIndex + windowSize.width
          ],
          outputRange: [0, 1, 0],
          extrapolate: "clamp"
        });
        return (
          <View key={`tab-${tabIndex}`} style={styles.navBarIcon}>
            <LottieView
              style={styles.fill}
              source={magicTab.icon}
              progress={animationProgress}
              speed={1}
            />
          </View>
        );
      }
    );

    const scrollIndicators: JSX.Element[] = this.magicTabs.map(
      (magicTab: MagicTab, tabIndex: number) => {
        const opacityProgress = scrollProgress.interpolate({
          inputRange: [
            windowSize.width * tabIndex - windowSize.width,
            windowSize.width * tabIndex,
            windowSize.width * tabIndex + windowSize.width
          ],
          outputRange: [0, 1, 0],
          extrapolate: "clamp"
        });
        return (
          <Animated.View
            key={`scroll-indicator-${tabIndex}`}
            style={[
              styles.navBarIndicator,
              {
                backgroundColor: magicTab.color,
                opacity: opacityProgress,
                transform: [
                  {
                    translateX: scrollProgress.interpolate({
                      inputRange: [
                        windowSize.width * tabIndex - windowSize.width,
                        windowSize.width * tabIndex,
                        windowSize.width * tabIndex + windowSize.width
                      ],
                      outputRange: [-80, 0, 80]
                    })
                  }
                ]
              }
            ]}
          />
        );
      }
    );

    return (
      <View style={styles.navBarContainer}>
        <View style={styles.navBar}>{icons}</View>
        <View style={styles.navBarIndicatorContainer}>{scrollIndicators}</View>
        <View style={styles.navBarSeparator} />
      </View>
    );
  }

  renderScrollView(): JSX.Element {
    const pages: JSX.Element[] = this.magicTabs.map(
      (magicTab: MagicTab, tabIndex: number) => {
        return (
          <View
            style={[
              styles.page,
              {
                backgroundColor: magicTab.color
              }
            ]}
            key={`scroll-indicator-${tabIndex}`}
          />
        );
      }
    );

    return (
      <Animated.ScrollView
        style={styles.fill}
        horizontal={true}
        pagingEnabled={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
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
        {pages}
      </Animated.ScrollView>
    );
  }

  render() {
    const tabBar = this.renderTabBar();
    const scrollView = this.renderScrollView();

    return (
      <View style={styles.container}>
        {tabBar}
        {scrollView}
      </View>
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
  navBarContainer: {
    paddingTop: 20
  },
  navBar: {
    height: 90,
    flexDirection: "row"
  },
  navBarIcon: {
    marginHorizontal: 5,
    width: 70
  },
  navBarIndicatorContainer: {
    height: 4,
    flexDirection: "row"
  },
  navBarIndicator: {
    bottom: 2,
    height: 4,
    borderRadius: 2,
    width: 80
  },
  navBarSeparator: {
    height: 1,
    backgroundColor: "#B0B0B0"
  },
  page: {
    width: windowSize.width
  }
});

export default App;
