import React, { Component } from "react";
import { StyleSheet, View, SectionList } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";

import Item from "./CalendarItem";
import LocationBox from "./LocationBox";
import Header from "./CalendarListHeader";
import LocationList from "./LocationList";
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

  render() {
    const { refreshing, data } = this.props;

    return (
      <View style={styles.container}>
        <LocationBox />
        <SectionList
          ref={ref => {
            this._list = ref;
          }}
          onRefresh={this._refresh}
          refreshing={refreshing}
          style={styles.list}
          renderItem={data => <Item {...data} key={data.index} />}
          renderSectionHeader={data => <Header {...data} key={data.index} />}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          sections={data}
          keyExtractor={(item, index) => item + index}
        />
        <LocationList />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  refreshing: state.events.refreshing,
  data: state.events.data
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
    backgroundColor: "#fefefe"
  },
  list: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#f2f2f2"
  }
});
