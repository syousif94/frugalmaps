import React, { PureComponent } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { connect } from "react-redux";
import emitter from "tiny-emitter/instance";
import Emitter from "tiny-emitter";
import Item from "./CalendarItem";
import * as Events from "./store/events";
import { ANDROID, IOS } from "./Constants";
import CalendarEmpty from "./CalendarEmpty";
import CalendarItem from "./CalendarItem";
import _ from "lodash";
import { getInset } from "./SafeAreaInsets";

const bottomInset = getInset("bottom");

class CalendarList extends PureComponent {
  static emitter = new Emitter();
  static bottom = (bottomInset > 0 ? bottomInset + 38 : 40) + 10 - 17;

  constructor(props) {
    super(props);
    this._handleScroll = _.debounce(this._handleScroll, 40);
  }

  state = {
    clipSubviews: true
  };

  componentDidMount() {
    emitter.on("calendar-top", this._scrollToTop);
    emitter.on("scroll-to-item", this._scrollToItem);

    if (IOS) {
      emitter.on("reclip-calendar", this._reclip);
    }
  }

  componentWillUnmount() {
    emitter.off("calendar-top", this._scrollToTop);
    emitter.off("scroll-to-item", this._scrollToItem);

    if (IOS) {
      emitter.off("reclip-calendar", this._reclip);
    }
  }

  componentDidUpdate(_, prev) {
    if (
      prev.data !== this.props.data &&
      this.props.data &&
      this.props.data[0] &&
      this.props.data[0].data.length
    ) {
      setTimeout(() => {
        if (
          this.props.data &&
          this.props.data[0] &&
          this.props.data[0].data.length
        ) {
          emitter.emit("fit-marker", this.props.data[0].data[0]);
        }
      }, 600);
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

  _setRef = ref => {
    this._list = ref;
  };

  _currentIndex = 0;

  _handleScroll = x => {
    const scrollProgress = (x + 25) / CalendarItem.width;
    const index = Math.ceil(scrollProgress - 0.2);
    if (index !== this._currentIndex) {
      this._currentIndex = index;
      emitter.emit("fit-marker", this.props.data[0].data[this._currentIndex]);
    }
  };

  _onScroll = e => {
    this._handleScroll(e.nativeEvent.contentOffset.x);
  };

  _scrollToItem = placeid => {
    const index = this.props.data[0].data.findIndex(val => {
      return val._source.placeid === placeid;
    });

    if (index > -1) {
      const x = index * CalendarItem.width;
      this._list.getScrollResponder().scrollTo({ x, y: 0, animated: true });
    }
  };

  _getItemLayout = (data, index) => {
    return {
      length: CalendarItem.width,
      offset: 25 + CalendarItem.width * index,
      index
    };
  };

  render() {
    const { data, day, refreshing } = this.props;

    const androidProps = ANDROID
      ? {
          initialNumToRender: 0
        }
      : {
          // onScrollEndDrag: this._onScrollEnd,
          // onMomentumScrollEnd: this._onScrollEnd
        };

    const listData = data && data[0] ? data[0].data : [];

    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          key={day}
          onRefresh={this._refresh}
          refreshing={refreshing}
          ref={this._setRef}
          style={styles.list}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
          onScroll={this._onScroll}
          scrollEventThrottle={32}
          data={listData}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={styles.content}
          // ListEmptyComponent={this._renderEmpty}
          {...androidProps}
          removeClippedSubviews={this.state.clipSubviews}
          onViewableItemsChanged={this._itemsChanged}
          showsHorizontalScrollIndicator={false}
        />
      </View>
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
    height: CalendarItem.height,
    position: "absolute",
    bottom: CalendarList.bottom,
    left: 0,
    right: 0
  },
  list: {
    height: CalendarItem.height
  },
  content: {
    paddingHorizontal: 25
  }
});
