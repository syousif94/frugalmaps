import React, { Component } from "react";
import { StyleSheet, View, SectionList, ActivityIndicator } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import LocationList from "./LocationList";
import CalendarEmpty from "./CalendarEmpty";
import * as Events from "./store/events";

class CalendarScreen extends Component {
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

    return (
      <View style={style}>
        <ActivityIndicator style={styles.loading} size="large" color="#444" />
      </View>
    );
  };

  _renderEmpty = () => {
    const { initialized, data } = this.props;

    if (!initialized || data.length) {
      return null;
    }

    return <CalendarEmpty />;
  };

  render() {
    const { refreshing, data } = this.props;

    const containerStyle = {
      paddingBottom: data.length ? 200 : 0
    };

    return (
      <View style={styles.container}>
        <LocationBox />
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
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          sections={data}
          keyExtractor={(item, index) => item + index}
          ListEmptyComponent={this._renderEmpty}
        />
        {this._renderInitial()}
        <LocationList />
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
  divider: {
    height: 1,
    backgroundColor: "#f2f2f2"
  },
  initialLoad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  loading: {
    marginTop: 15,
    transform: [{ scale: 0.8 }]
  }
});
