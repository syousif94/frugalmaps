import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  Text
} from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";
import { FacebookAds } from "expo";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import LocationLists from "./LocationLists";
import CalendarEmpty from "./CalendarEmpty";
import SearchButton from "./SearchButton";
import * as Events from "./store/events";
import { ANDROID, IOS, PLACEMENT_ID } from "./Constants";

class CalendarScreen extends Component {
  static id = "cal";

  componentDidMount() {
    this.props.fetch();
    emitter.on("calendar-top", this._scrollToTop);
  }

  componentWillUnmount() {
    emitter.off("calendar-top", this._scrollToTop);
  }

  _scrollToTop = () => {
    this._list.getScrollResponder().scrollTo({ x: 0, y: 0, animated: false });
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

  _renderAd = () => {
    const { initialized } = this.props;

    if (initialized && IOS) {
      return (
        <View style={styles.adView} pointerEvents="box-none">
          <View style={styles.adBanner} pointerEvents="none">
            <Text style={styles.adText}>Advertisement</Text>
          </View>
          <View style={styles.adContainer} pointerEvents="box-none">
            <FacebookAds.BannerView
              style={styles.ad}
              placementId={PLACEMENT_ID}
              type="standard"
              onPress={() => console.log("click")}
              onError={err => console.log("error", err)}
            />
          </View>
        </View>
      );
    }

    return null;
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
      : {};

    const listData = dataCount ? data : [];

    return (
      <View style={styles.container}>
        <LocationBox id={CalendarScreen.id} />
        <SectionList
          ref={ref => {
            this._list = ref;
          }}
          contentContainerStyle={containerStyle}
          onRefresh={this._refresh}
          refreshing={refreshing}
          style={styles.list}
          renderItem={data => <Item {...data} key={data.index} />}
          renderSectionHeader={data => <Header {...data} key={data.index} />}
          sections={listData}
          keyExtractor={(item, index) => item + index}
          ListEmptyComponent={this._renderEmpty}
          {...androidProps}
          ListHeaderComponent={this._renderAd}
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
  fetch: Events.actions.set.bind(null, { refreshing: true })
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
  adView: {
    backgroundColor: "#fff"
  },
  adBanner: {
    height: 24,
    backgroundColor: "#B5B5B5",
    justifyContent: "center",
    paddingLeft: 10
  },
  adText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600"
  },
  adContainer: {
    height: 50,
    overflow: "hidden"
  },
  ad: {
    marginTop: IOS ? -20 : 0
  }
});
