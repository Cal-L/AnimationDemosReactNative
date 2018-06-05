import * as React from "react";
const LottieView = require("lottie-react-native");
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
const windowSize = Dimensions.get("window");

interface State {
  scrollerProgress: Animated.Value;
}

class App extends React.Component<{}, State> {
  sliderWidth: number;
  numberOfMainSections: number;

  constructor(props: {}) {
    super(props);

    this.sliderWidth = windowSize.width;
    this.state = {
      // scrollerProgress: new Animated.Value(this.sliderWidth + (this.sliderWidth / 2)),
      scrollerProgress: new Animated.Value(0)
    };
    this.numberOfMainSections = 12;
  }

  renderPlanets(): JSX.Element {
    const { scrollerProgress } = this.state;

    return (
      <LottieView
        style={styles.lottie}
        source={require("../animations/planets.json")}
        progress={scrollerProgress.interpolate({
          inputRange: [
            -windowSize.width,
            0,
            windowSize.width / 4 * this.numberOfMainSections,
            windowSize.width / 4 * this.numberOfMainSections + windowSize.width
          ],
          outputRange: [0, 0.1, 0.9, 1]
          //extrapolate: 'clamp',
        })}
        speed={1}
      />
    );
  }

  renderAnimation(): JSX.Element {
    const planets = this.renderPlanets();

    return <View style={styles.topContainer}>{planets}</View>;
  }

  renderSliderIndicator(): JSX.Element {
    return (
      <View style={styles.sliderIndicatorContainer} pointerEvents={"none"}>
        <Text style={styles.sliderIndicatorText}>{"MILLIONS OF MILES"}</Text>
      </View>
    );
  }

  renderMeasurement(): JSX.Element[] {
    let elements: JSX.Element[] = [];
    for (let i = 0; i < this.numberOfMainSections; i++) {
      elements.push(
        <View
          key={i}
          style={[
            styles.sliderSection,
            {
              width: this.sliderWidth / 4
            }
          ]}
        >
          <View style={styles.sliderIndicator} />
          <Text style={styles.measurementText}>{i + 1}</Text>
        </View>
      );
    }

    return elements;
  }

  renderSlider(): JSX.Element {
    const sliderIndicator = this.renderSliderIndicator();
    const measurement = this.renderMeasurement();

    return (
      <View style={styles.bottomContainer}>
        {sliderIndicator}
        <View
          style={[
            styles.sliderContainer,
            {
              width: this.sliderWidth
            }
          ]}
        >
          <Animated.ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentOffset={{
              //x: this.sliderWidth + this.sliderWidth / 2,
              x: 0,
              y: 0
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.state.scrollerProgress
                    }
                  }
                }
              ],
              {
                useNativeDriver: true
              }
            )}
            contentContainerStyle={{
              paddingHorizontal: (this.sliderWidth - this.sliderWidth / 4) / 2
            }}
            snapToInterval={this.sliderWidth / 4}
            scrollEventThrottle={16}
            style={styles.sliderScroller}
          >
            {measurement}
          </Animated.ScrollView>
        </View>
      </View>
    );
  }

  render() {
    const animation = this.renderAnimation();
    const slider = this.renderSlider();

    return (
      <View style={styles.container}>
        {animation}
        {slider}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192345"
  },
  topContainer: {
    flex: 1
  },
  bottomContainer: {
    height: 100
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  sliderContainer: {
    borderTopWidth: 4,
    borderColor: "white",
    flex: 1
  },
  mainSliderSection: {
    flexDirection: "row"
  },
  measurementText: {
    fontWeight: "600",
    color: "white",
    fontSize: 30
  },
  sliderScroller: {
    flex: 1
  },
  sliderSection: {
    alignItems: "center"
  },
  spacerSection: {},
  sliderIndicatorContainer: {
    alignItems: "center"
  },
  sliderIndicatorText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 10,
    marginBottom: 5,
    color: "white"
  },
  sliderIndicator: {
    width: 4,
    height: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: "white"
  },
  lottie: {
    flex: 1
  }
});

export default App;
