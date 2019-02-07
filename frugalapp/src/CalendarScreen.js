import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  Text
} from "react-native";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import emitter from "tiny-emitter/instance";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import LocationLists from "./LocationLists";
import CalendarEmpty from "./CalendarEmpty";
import SearchButton from "./SearchButton";
import * as Events from "./store/events";
import { ANDROID, IOS } from "./Constants";
import Ad from "./Ad";

class CalendarScreen extends Component {
  static id = "cal";

  state = {
    clipSubviews: true,
    touchAd: true
  };

  componentDidMount() {
    this.props.restore();
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

  _scrollToTop = () => {
    const y = IOS ? -40 : 0;
    this._list.getScrollResponder().scrollTo({ x: 0, y, animated: false });
  };

  _refresh = () => {
    this.props.fetch();
  };

  _renderInitial = () => {
    const { initialized, listTop } = this.props;

    if (initialized || !listTop) {
      return null;
    }

    const style = [
      styles.initialLoad,
      {
        top: listTop
      }
    ];

    if (ANDROID) {
      return (
        <View style={style}>
          <Text style={styles.initialText}>
            Initial location may take several seconds
          </Text>
        </View>
      );
    }

    return (
      <View style={style}>
        <ActivityIndicator style={styles.loading} size="large" color="#444" />
        <Text style={styles.initialText}>
          Initial location may take several seconds
        </Text>
      </View>
    );
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

    return (
      <Ad key="ad" touchAd={this.state.touchAd} initialized={initialized} />
    );
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

  _itemsChanged = ({ viewableItems, changed }) => {
    Item.emitter.emit("visible", viewableItems);
  };

  _keyExtractor = (item, index) => (item._id || item.title) + index;

  _renderItem = data => {
    const key = `${data.item._id}${data.index}`;
    return <Item {...data} key={key} itemKey={key} />;
  };

  _renderSectionHeader = data => <Header {...data} key={data.index} />;

  _setRef = ref => {
    this._list = ref;
  };

  render() {
    const { refreshing, data } = this.props;

    const dataCount = data.filter(days => days.data.length).length;

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
          onMomentumScrollBegin: this._onScrollEnd,
          onMomentumScrollEnd: this._onScrollEnd
        };

    const listData = dataCount ? data : [];

    return (
      <View style={styles.container}>
        <LocationBox id={CalendarScreen.id} />
        <SectionList
          ref={this._setRef}
          contentContainerStyle={containerStyle}
          onRefresh={this._refresh}
          refreshing={refreshing}
          style={styles.list}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={listData}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={this._renderEmpty}
          {...androidProps}
          ListHeaderComponent={this._renderAd}
          ListFooterComponent={this._renderFooter}
          removeClippedSubviews={this.state.clipSubviews}
          onViewableItemsChanged={this._itemsChanged}
        />
        {this._renderInitial()}
        <SearchButton id={CalendarScreen.id} />
        <LocationLists id={CalendarScreen.id} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.events.initialized,
  listTop: state.location.listTop,
  refreshing: state.events.refreshing,
  data: state.events.calendar
});

const mapDispatchToProps = {
  fetch: Events.actions.set.bind(null, { refreshing: true, queryType: null }),
  restore: Events.actions.restore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  list: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  initialLoad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  initialText: {
    width: 220,
    marginTop: ANDROID ? 100 : 25,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    color: "#444"
  },
  loading: {
    marginTop: 15,
    transform: [{ scale: 0.8 }]
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
