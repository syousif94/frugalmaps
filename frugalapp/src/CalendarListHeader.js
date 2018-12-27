import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";
// import MonoText from "./MonoText";

// import { RED } from "./Colors";

export default class CalendarListHeader extends PureComponent {
  static height = 30;

  // constructor(props) {
  //   super(props);
  //   if (this._shouldTick()) {
  //     const time = moment();
  //     this.state = {
  //       now: time.format("h:mm:ss"),
  //       meridian: time.format(" a")
  //     };
  //   }
  // }

  // _shouldTick = () => {
  //   const { away, title } = this.props.section;
  //   return away === 0 && title !== "Closest";
  // };

  // componentDidMount() {
  //   if (this._shouldTick()) {
  //     this._interval = setInterval(() => {
  //       const time = moment();
  //       this.setState({
  //         now: time.format("h:mm:ss"),
  //         meridian: time.format(" a")
  //       });
  //     }, 500);
  //   }
  // }

  // componentDidUpdate() {
  //   if (this._shouldTick() && !this._interval) {
  //     this._interval = setInterval(() => {
  //       this.setState({
  //         now: moment().format("h:mm:ss a")
  //       });
  //     }, 500);
  //   } else if (this._interval && !this._shouldTick()) {
  //     clearInterval(this._interval);
  //     this._interval = null;
  //   }
  // }

  // componentWillUnmount() {
  //   clearInterval(this._interval);
  // }

  render() {
    const { section } = this.props;

    let relativeText;

    const isClosest = section.title === "Closest";

    // switch (section.away) {
    //   case 0:
    //     relativeText = "Today";
    //     break;
    //   case 1:
    //     relativeText = "Tomorrrow";
    //     break;
    //   default:
    //     relativeText = `${section.away} days away`;
    // }

    // if (isClosest) {
    //   const today = moment().format("dddd, MMMM Do Y");
    //   relativeText = `${today}`;
    // }

    const titleText = isClosest ? section.title : "Today";

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText}>{titleText}</Text>
          {/* <View style={styles.relative}>
            {isClosest ? (
              <Text style={styles.relativeText}>{relativeText}</Text>
            ) : (
              <MonoText
                text={this.state.now}
                textStyle={styles.relativeText}
                suffix={this.state.meridian}
                characterWidth={7.5}
              />
            )}
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  info: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  titleText: {
    fontWeight: "600",
    color: "#fff"
  }
  // relative: {
  //   marginLeft: 10,
  //   paddingVertical: 3,
  //   paddingHorizontal: 5,
  //   borderRadius: 3,
  //   backgroundColor: "rgba(0,0,0,0.2)"
  // },
  // relativeText: {
  //   color: "#fff",
  //   fontSize: 12,
  //   fontWeight: "600"
  // }
});
