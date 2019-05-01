import { Accelerometer, Svg } from "expo";
import React from "react";
import { StyleSheet, View } from "react-native";

type Vector2 = {
  x: number;
  y: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type State = {
  position: Vector2;
  accelerometer: Vector3;
};

type StateUpdator = (state: State) => State;

const svgSize: number = 300;
const size: number = 200;
const accelerometerToSize: number = half(size);

function half(n: number): number {
  return n / 2;
}

function setAccelerometer({
  x,
  y,
  z
}: Accelerometer.AccelerometerObject): StateUpdator {
  return (state: State) => {
    return {
      ...state,
      accelerometer: {
        x: x * accelerometerToSize,
        y: y * accelerometerToSize,
        z: z * accelerometerToSize
      }
    };
  };
}

function updateState(state: State): State {
  return {
    ...state,
    position: {
      x: state.position.x + (state.accelerometer.x - state.position.x) * 0.5,
      y: state.position.y + (-state.accelerometer.y - state.position.y) * 0.5
    }
  };
}

export default function App() {
  const [state, setState] = React.useState<State>({
    position: { x: 0, y: 0 },
    accelerometer: { x: 0, y: 0, z: 0 }
  });
  React.useEffect(() => {
    Accelerometer.addListener(a => {
      setState(setAccelerometer(a));
    });
    let requestID: number | null = null;
    const loop = () => {
      setState(updateState);
      requestID = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => {
      Accelerometer.removeAllListeners();
      if (requestID !== null) {
        cancelAnimationFrame(requestID);
      }
    };
  }, []);
  return (
    <View style={styles.container}>
      <Svg
        width={svgSize}
        height={svgSize}
        viewBox={`${-half(size)} ${-half(size)} ${size} ${size}`}
      >
        <Svg.ClipPath id="border">
          <Svg.Circle cx={0} cy={0} r={half(size)} />
        </Svg.ClipPath>
        <Svg.G clipPath="url(#border)">
          <Svg.Circle
            cx={0}
            cy={0}
            r={half(size)}
            stroke={"greenyellow"}
            fill={"greenyellow"}
          />
          <Svg.Circle
            cx={state.position.x}
            cy={state.position.y}
            r={half(size) * 0.3 - 1}
            stroke={"limegreen"}
            strokeWidth={2}
            fill={"white"}
          />
          <Svg.Path d={`M ${-half(size)} 0 L ${half(size)} 0`} stroke="black" />
          <Svg.Path d={`M 0 ${-half(size)} L 0 ${half(size)}`} stroke="black" />
          <Svg.Circle
            cx={0}
            cy={0}
            r={half(size) * 0.3}
            stroke={"black"}
            strokeWidth={1}
            fill={"transparent"}
          />
          <Svg.Circle
            cx={0}
            cy={0}
            r={half(size)}
            stroke={"black"}
            strokeWidth={2}
            fill={"transparent"}
          />
        </Svg.G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  }
});
