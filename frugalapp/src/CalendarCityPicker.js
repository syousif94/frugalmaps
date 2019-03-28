import React, { PureComponent } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as Events from "./store/events";
import * as Location from "./store/location";
import emitter from "tiny-emitter/instance";
import { ANDROID, HEIGHT } from "./Constants";
import CalendarItem from "./CalendarItem";

class CityPicker extends PureComponent {
  _onPress = item => {
    const { setLocation, setEvents } = this.props;

    const bounds = item._source.bounds;
    const text = item._source.name;

    setEvents({
      refreshing: true,
      bounds,
      queryType: "City"
    });

    // setLocation({
    //   lastQuery: text,
    //   text,
    //   bounds: null
    // });

    emitter.emit("fit-bounds", bounds);
    emitter.emit("hide-callouts", bounds);
    emitter.emit("calendar-top", 0, true);
  };

  _scrollTo = (offset, animated = false) => {
    const x = offset !== undefined ? offset : 0;
    this._list.getScrollResponder().scrollTo({ x, y: 0, animated });
  };

  _lastPosition;

  _onScrollEnd = e => {
    this._lastPosition = e.nativeEvent.contentOffset.x;
  };

  _setRef = ref => {
    this._list = ref;
  };
  render() {
    const { data } = this.props;

    if (!data || !data.length) {
      return null;
      // return (
      //   <View style={styles.loading}>
      //     <Text style={styles.btnText}>Locating</Text>
      //     <ActivityIndicator
      //       style={styles.loadingIndicator}
      //       size="small"
      //       color="#fff"
      //     />
      //   </View>
      // );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          ref={this._setRef}
          style={styles.scroll}
          onScrollEndDrag={this._onScrollEnd}
          onMomentumScrollEnd={this._onScrollEnd}
          horizontal
          alwaysBounceHorizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {data.map((item, index) => {
            let name = `${index + 1}. `;
            let addressText = "";
            const [city, state] = item._source.name.split(", ");
            name += city;
            addressText = state;
            const btnStyle = [styles.btnBg];

            if (item.sort && item.sort[item.sort.length - 1]) {
              const miles = `${item.sort[item.sort.length - 1].toFixed(2)} mi`;
              addressText = `${addressText} · ${miles}`;
            }

            const onPress = this._onPress.bind(null, item);
            return (
              <View style={btnStyle} key={name}>
                <TouchableOpacity style={styles.btn} onPress={onPress}>
                  <View>
                    <Text style={styles.cityText}>{name}</Text>
                    <Text style={styles.addressText}>{addressText}</Text>
                  </View>
                  <View style={styles.count}>
                    <Text style={styles.btnText}>{item._source.count}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => ({
  data: Location.makeData(state, props)
});

const mapDispatchToProps = {
  setEvents: Events.actions.set,
  setLocation: Location.actions.set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CityPicker);

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    bottom: CalendarItem.height,
    left: 7,
    paddingRight: 4,
    paddingLeft: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(100,100,100,0.7)",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingIndicator: {
    marginLeft: 6,
    transform: [{ scale: 0.8 }]
  },
  container: {
    position: "absolute",
    bottom: CalendarItem.height,
    left: 0,
    right: 0
  },
  scroll: {
    height: 44
  },
  content: {
    padding: 3.5
    // paddingRight: 90
  },
  btnBg: {
    margin: 3.5,
    height: 30,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "rgba(100,100,100,0.7)"
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  cityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  addressText: {
    fontSize: 10,
    color: "#e0e0e0"
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
