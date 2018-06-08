import * as React from "react";
const LottieView = require("lottie-react-native");
import { StyleSheet, View, Animated, Dimensions } from "react-native";
const windowSize = Dimensions.get("window");

interface State {
  shellAnimation: Animated.Value;
  yolkAnimation: Animated.Value;
  scrollProgress: Animated.Value;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      shellAnimation: new Animated.Value(0),
      yolkAnimation: new Animated.Value(0),
      scrollProgress: new Animated.Value(0)
    };
  }

  componentDidMount() {
    const { yolkAnimation, shellAnimation } = this.state;

    this.animateEggDrop();
  }

  animateEggDrop() {
    const { yolkAnimation, shellAnimation } = this.state;
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(shellAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(yolkAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true
        })
      ])
    ]).start(() => {
      yolkAnimation.setValue(0);
      shellAnimation.setValue(0);
      this.animateEggDrop();
    });
  }

  renderEggDrop(): JSX.Element {
    const { yolkAnimation, shellAnimation } = this.state;

    return (
      <View style={styles.yolk}>
        <View
          style={{
            position: "absolute",
            left: (windowSize.width - 400) / 2,
            top: 15,
            width: 400,
            height: (400 * 300) / 350
            // opacity: 0.5
          }}
        >
          <LottieView
            style={{
              flex: 1
            }}
            source={require("../animations/egg-shell.json")}
            progress={shellAnimation.interpolate({
              inputRange: [0, 0.25],
              outputRange: [0, 1]
            })}
            speed={1}
          />
        </View>
        <LottieView
          style={styles.yolk}
          source={require("../animations/egg.json")}
          progress={yolkAnimation}
          speed={1}
        />
      </View>
    );
  }

  render() {
    const eggDrop = this.renderEggDrop();

    return <View style={styles.container}>{eggDrop}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6d36ed"
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
  yolk: {
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
