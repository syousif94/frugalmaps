import React, { PureComponent } from "react";
import { StyleSheet, View, SectionList, Text } from "react-native";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";
import Emitter from "tiny-emitter";
import Item from "./CalendarItem";
import * as Events from "./store/events";
import Ad from "./Ad";
import { ANDROID, IOS } from "./Constants";
import CalendarEmpty from "./CalendarEmpty";
import { Entypo } from "@expo/vector-icons";
import Header from "./CalendarListHeader";

class CalendarList extends PureComponent {
  static emitter = new Emitter();

  state = {
    clipSubviews: true,
    touchAd: true
  };

  componentDidMount() {
    emitter.on("calendar-top", this._scrollToTop);
    if (IOS) {
      emitter.on("reclip-calendar", this._reclip);
    }
  }

  componentWillUnmount() {
    emitter.off("calendar-top", this._scrollToTop);
    if (IOS) {
      emitter.off("reclip-calendar", this._reclip);
    }
  }

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
    const y = top !== undefined ? top : IOS ? -40 : 0;
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

  _renderAd = () => {
    const { initialized } = this.props;

    return <Ad touchAd={this.state.touchAd} initialized={initialized} />;
  };

  _onScrollEnd = e => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 50 && this.state.touchAd) {
      this.setState({
        touchAd: false
      });
    } else if (y < 50 && !this.state.touchAd) {
      this.setState({
        touchAd: true
      });
    }
  };

  _itemsChanged = ({ viewableItems }) => {
    CalendarList.emitter.emit("visible", viewableItems);
  };

  _keyExtractor = (item, index) => (item._id || item.title) + index;

  _renderItem = data => {
    const key = `${data.item._id}${data.index}`;
    return <Item {...data} itemKey={key} emitter={CalendarList.emitter} />;
  };

  _renderSectionHeader = data => <Header {...data} />;

  _setRef = ref => {
    this._list = ref;
  };

  render() {
    const { refreshing, data, day } = this.props;

    const containerStyle = {
      paddingBottom: data.length ? 110 : 0
    };

    const androidProps = ANDROID
      ? {
          initialNumToRender: 8,
          maxToRenderPerBatch: 5
        }
      : {
          onScrollEndDrag: this._onScrollEnd,
          onMomentumScrollEnd: this._onScrollEnd
        };

    return (
      <SectionList
        key={day}
        ref={this._setRef}
        contentContainerStyle={containerStyle}
        onRefresh={this._refresh}
        refreshing={refreshing}
        style={styles.list}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={data}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={this._renderEmpty}
        {...androidProps}
        ListHeaderComponent={this._renderAd}
        ListFooterComponent={this._renderFooter}
        removeClippedSubviews={this.state.clipSubviews}
        onViewableItemsChanged={this._itemsChanged}
      />
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
  fetch: Events.actions.set.bind(null, {
    refreshing: true,
    queryType: null,
    day: "All"
  }),
  restore: Events.actions.restore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarList);

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  footer: {
    paddingHorizontal: 25
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#444"
  }
});
