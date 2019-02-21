import React, { PureComponent } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
} from "react-native";
import { connect } from "react-redux";
import * as Events from "./store/events";
import emitter from "tiny-emitter/instance";
import { SafeArea } from "./Constants";

class DayPicker extends PureComponent {
  componentDidMount() {
    emitter.on("scroll-picker", this._scrollTo);
  }

  componentWillUnmount() {
    emitter.off("scroll-picker", this._scrollTo);
  }

  componentDidUpdate(prev) {
    if (this.props.day === "All" && prev.day !== this.props.day) {
      this._scrollTo(0, true);
    }
  }

  _scrollTo = (offset, animated = false) => {
    const x = offset !== undefined ? offset : 0;
    this._list.getScrollResponder().scrollTo({ x, y: 0, animated });
  };

  _selectDay = day => {
    if (day === this.props.day && this.props.scroll) {
      requestAnimationFrame(() => {
        emitter.emit("calendar-top", 0, true);
      });
      return;
    }
    requestAnimationFrame(() => {
      this.props.set({
        day
      });
      emitter.emit("scroll-picker", this._lastPosition);
    });
  };

  _lastPosition;

  _onScrollEnd = e => {
    this._lastPosition = e.nativeEvent.contentOffset.x;
  };

  _setRef = ref => {
    this._list = ref;
  };
  render() {
    const { calendar, day, recent } = this.props;
    const days = [...recent, ...calendar];
    return (
      <SafeArea style={styles.container}>
        <ScrollView
          ref={this._setRef}
          onScrollEndDrag={this._onScrollEnd}
          onMomentumScrollEnd={this._onScrollEnd}
          horizontal
          alwaysBounceHorizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {days.map(data => {
            const btnStyle = [styles.btnBg];
            if (day === data.title) {
              btnStyle.push(styles.selected);
            }
            const onPress = this._selectDay.bind(null, data.title);
            return (
              <View key={data.title} style={btnStyle}>
                <TouchableOpacity style={styles.btn} onPress={onPress}>
                  <Text style={styles.btnText}>{data.title}</Text>
                  <View style={styles.count}>
                    <Text style={styles.btnText}>{data.data.length}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeArea>
    );
  }
}

const mapStateToProps = state => ({
  day: state.events.day,
  calendar: state.events.calendar,
  recent: state.events.recent
});

const mapDispatchToProps = {
  set: Events.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DayPicker);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44
  },
  content: {
    padding: 3.5
    // paddingRight: 90
  },
  btnBg: {
    margin: 3.5,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(100,100,100,0.7)"
  },
  selected: {
    backgroundColor: "rgba(0,0,0,0.65)"
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  count: {
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 8,
    minWidth: 20,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center"
  }
});
