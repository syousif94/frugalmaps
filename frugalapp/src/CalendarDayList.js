import React, { Component } from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import CalendarItem from "./CalendarItem";
import emitter from "tiny-emitter/instance";
import Emitter from "tiny-emitter";
import { IOS } from "./Constants";
import Header from "./CalendarListHeader";

export default class DayList extends Component {
  state = {
    clipSubviews: true
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

  _scrollToTop = top => {
    const y = top !== undefined ? top : IOS ? -40 : 0;
    if (this._list && this._list.getScrollResponder) {
      this._list.getScrollResponder().scrollTo({ x: 0, y, animated: false });
    }
  };

  _emitter = new Emitter();

  _itemsChanged = ({ viewableItems, changed }) => {
    this._emitter.emit("visible", viewableItems);
  };

  _renderItem = data => {
    const key = `${data.item._id}${data.index}`;
    return <CalendarItem {...data} emitter={this._emitter} itemKey={key} />;
  };

  _renderSectionHeader = data => <Header {...data} />;

  _keyExtractor = (item, index) => (item._id || item.title) + index;

  _refresh = () => {};

  render() {
    const { data } = this.props;

    const containerStyle = {
      paddingBottom: data.data.length ? 110 : 0
    };

    return (
      <View style={styles.container}>
        <SectionList
          onRefresh={this._refresh}
          contentContainerStyle={containerStyle}
          renderItem={this._renderItem}
          refreshing={this.props.refreshing}
          renderSectionHeader={this._renderSectionHeader}
          sections={[data]}
          style={styles.list}
          ref={this._setRef}
          keyExtractor={this._keyExtractor}
          removeClippedSubviews={this.state.clipSubviews}
          onViewableItemsChanged={this._itemsChanged}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  }
});
