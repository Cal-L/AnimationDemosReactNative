import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  SafeAreaView
} from "react-native";
import Planets from "./planets";
import Tabs from "./tabs";
import Wave from "./wave";
import Egg from "./egg";

const windowSize = Dimensions.get("window");

export type DemoName = "tabs" | "planets" | "wave" | "egg";

export interface Demo {
  element: React.ComponentClass<any>;
}

export type Demos = { [K in DemoName]: Demo };

interface State {
  activeDemo: DemoName;
}

const demos: Demos = {
  tabs: {
    element: Tabs
  },
  planets: {
    element: Planets
  },
  wave: {
    element: Wave
  },
  egg: {
    element: Egg
  }
};

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeDemo: "egg"
    };
  }

  renderDemo(): JSX.Element {
    const { activeDemo } = this.state;

    const Demo = demos[activeDemo];
    return <Demo.element />;
  }

  renderNav(): JSX.Element {
    const { activeDemo } = this.state;
    const demoOptions = Object.keys(demos).map(
      (demoKey: string, demoIndex: number) => {
        const demoName = demoKey as DemoName;
        return (
          <TouchableOpacity
            key={demoName}
            style={styles.navOption}
            onPress={() => {
              this.setState({
                activeDemo: demoName
              });
            }}
          >
            <Text
              style={[
                styles.navLabel,
                {
                  fontWeight: activeDemo === demoName ? "700" : "400",
                  fontSize: activeDemo === demoName ? 14 : 12
                }
              ]}
            >
              {demoName.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      }
    );

    return <View style={styles.nav}>{demoOptions}</View>;
  }

  render() {
    const demo = this.renderDemo();
    const nav = this.renderNav();

    return (
      <SafeAreaView style={styles.container}>
        {demo}
        {nav}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nav: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: windowSize.width,
    height: 30,
    borderTopWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  navOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  navLabel: {
    color: "white",
    fontSize: 12
  }
});

export default App;
