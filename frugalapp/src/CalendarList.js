import React, { PureComponent } from "react";
import { Animated, StyleSheet, View, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";
import Emitter from "tiny-emitter";
import Item from "./CalendarItem";
import * as Events from "./store/events";
import Ad from "./Ad";
import { ANDROID, IOS, HEIGHT } from "./Constants";
import CalendarEmpty from "./CalendarEmpty";
import { Entypo } from "@expo/vector-icons";
import Header from "./CalendarListHeader";
import CalendarListHeader from "./CalendarListHeader";
import DayPicker from "./CalendarDayPicker";

class CalendarList extends PureComponent {
  static emitter = new Emitter();

  state = {
    clipSubviews: true,
    position: new Animated.Value(0)
  };

  _expanded = false;

  componentDidMount() {
    emitter.on("calendar-top", this._scrollToTop);

    if (IOS) {
      emitter.on("toggle-map", this._toggleMap);
      emitter.on("reclip-calendar", this._reclip);
    }
  }

  componentWillUnmount() {
    emitter.off("calendar-top", this._scrollToTop);

    if (IOS) {
      emitter.off("toggle-map", this._toggleMap);
      emitter.off("reclip-calendar", this._reclip);
    }
  }

  _toggleMap = () => {
    const toValue = this._expanded ? 0 : 1;
    this._expanded = !this._expanded;

    Animated.timing(
      this.state.position,
      { toValue, duration: 350 },
      { useNativeDriver: true }
    ).start(() => {
      if (!this._expanded) {
        requestAnimationFrame(() => {
          this._reclip();
        });
      }
    });
  };

  _reclip = () => {
    this.setState(
      {
        clipSubviews: false
      },
      () => {
        this.setState({
          clipSubviews: true
        });
      }
    );
  };

  _scrollToTop = (top, animated = false) => {
    const y = top !== undefined ? top : 0;
    this._list.getScrollResponder().scrollTo({ x: 0, y, animated });
  };

  _refresh = () => {
    this.props.fetch();
  };

  _renderEmpty = () => {
    const { initialized, data } = this.props;

    if (!initialized || data.filter(days => days.data.length).length) {
      return null;
    }

    return <CalendarEmpty />;
  };

  _renderFooter = () => {
    const { initialized, data } = this.props;

    if (!initialized || !data.filter(datum => datum.data.length).length) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Buncha gets all of its data from user submissions.
        </Text>
        <Text style={[styles.footerText, { marginTop: 6 }]}>
          If you know of something fun you'd like to share,{"\n"}just tap on{" "}
          <Entypo name="circle-with-plus" size={12} color="#444" /> below
        </Text>
      </View>
    );
  };

  _renderHeader = () => {
    const { initialized } = this.props;
    return <Ad initialized={initialized} />;
  };

  // _onScrollEnd = e => {
  //   const y = e.nativeEvent.contentOffset.y;
  //   if (y > 50 && this._ad && this._ad.state.touchAd) {
  //     emitter.emit("touch-ad", false);
  //   } else if (y < 50 && this._ad && !this._ad.state.touchAd) {
  //     emitter.emit("touch-ad", true);
  //   }
  // };

  _itemsChanged = ({ viewableItems }) => {
    CalendarList.emitter.emit("visible", viewableItems);
  };

  _keyExtractor = (item, index) => (item._id || item.title) + index;

  _renderItem = data => {
    const iso = this.props.data[0].iso;
    const title = this.props.data[0].title;
    const key = `${data.item._id}${data.index}`;
    return (
      <Item
        {...data}
        itemKey={key}
        emitter={CalendarList.emitter}
        iso={iso}
        title={title}
      />
    );
  };

  _renderSectionHeader = data => <Header {...data} />;

  _setRef = ref => {
    this._list = ref;
  };

  render() {
    const { data, day, refreshing } = this.props;

    const contentStyle = {
      paddingBottom: data.length ? 110 : 0
    };

    const androidProps = ANDROID
      ? {
          initialNumToRender: 0
        }
      : {
          // onScrollEndDrag: this._onScrollEnd,
          // onMomentumScrollEnd: this._onScrollEnd
        };

    const listData = data && data[0] ? data[0].data : [];

    const translateY = this.state.position.interpolate({
      inputRange: [0, 1],
      outputRange: [0, HEIGHT * 0.72]
    });

    const containerStyle = [
      styles.container,
      {
        transform: [{ translateY }]
      }
    ];

    return (
      <Animated.View style={containerStyle}>
        <CalendarListHeader section={data && data[0]} />
        <FlatList
          key={day}
          onRefresh={this._refresh}
          refreshing={refreshing}
          ref={this._setRef}
          contentContainerStyle={contentStyle}
          style={styles.list}
          renderItem={this._renderItem}
          data={listData}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={this._renderEmpty}
          {...androidProps}
          // ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          removeClippedSubviews={this.state.clipSubviews}
          onViewableItemsChanged={this._itemsChanged}
        />
        <DayPicker />
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.events.initialized,
  refreshing: state.events.refreshing,
  data: Events.homeList(state),
  day: state.events.day
});

const mapDispatchToProps = {
  fetch: Events.actions.set.bind(null, { refreshing: true })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarList);

const styles = StyleSheet.create({
  container: {
    marginTop: IOS ? HEIGHT * 0.28 : 0,
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  footer: {
    paddingTop: 20,
    paddingHorizontal: 25
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#444"
  }
});
