import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import CalendarItem from "./CalendarItem";
import emitter from "tiny-emitter/instance";
import Emitter from "tiny-emitter";
import { IOS } from "./Constants";
import CalendarListHeader from "./CalendarListHeader";

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
    const y = top !== undefined ? top : 0;
    this._list.getScrollResponder().scrollTo({ x: 0, y, animated: false });
  };

  _emitter = new Emitter();

  _itemsChanged = ({ viewableItems, changed }) => {
    this._emitter.emit("visible", viewableItems);
  };

  _renderItem = data => {
    const key = `${data.item._id}${data.index}`;
    return (
      <CalendarItem
        {...data}
        emitter={this._emitter}
        itemKey={key}
        section={this.props.data}
      />
    );
  };

  _keyExtractor = (item, index) => (item._id || item.title) + index;

  render() {
    const { data } = this.props;

    const containerStyle = {
      paddingBottom: data.data.length ? 110 : 0,
      paddingTop: CalendarListHeader.height + 5
    };

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={containerStyle}
          renderItem={this._renderItem}
          data={data.data}
          style={styles.list}
          ref={this._setRef}
          keyExtractor={this._keyExtractor}
          removeClippedSubviews={this.state.clipSubviews}
          onViewableItemsChanged={this._itemsChanged}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>{data.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(90,90,90,0.45)",
    height: CalendarListHeader.height,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row"
  },
  headerText: {
    fontWeight: "600",
    color: "#fff"
  },
  list: {
    flex: 1
  }
});
