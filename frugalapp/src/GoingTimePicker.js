import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";

export default class TimePicker extends PureComponent {
  state = {
    data: []
  };

  componentDidMount() {
    this._createData(this.props.event);
  }

  componentWillReceiveProps(next) {
    if (
      next.event &&
      (!this.props.event || next.event._id !== this.props.event._id)
    ) {
      this._createData(next.event);
      this._list.getScrollResponder().scrollTo({ x: 0, y: 0, animated: false });
    }
  }

  _createData = event => {
    if (!event) {
      return;
    }

    const { start, end } = event._source.groupedHours[0];

    const startInt = parseInt(start, 10);

    const endInt = parseInt(end, 10);

    // let duration

    // if (startInt < endInt) {
    //   duration =
    // } else {

    // }

    const data = [];

    for (let i = 0; i < 40; i++) {
      data.push({ time: "6:15pm" });
    }

    this.setState({
      data
    });
  };

  _renderItem = data => {
    return (
      <View style={styles.time}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.day}>{data.item.time}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _getItemLayout = () => {};

  _keyExtractor = (item, index) => `${index}`;

  _setListRef = ref => {
    this._list = ref;
  };

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.content}
        data={this.state.data}
        horizontal
        renderItem={this._renderItem}
        style={styles.list}
        ref={this._setListRef}
        // getItemLayout={this._getItemLayout}
        keyExtractor={this._keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#fff",
    height: 48
  },
  content: {
    paddingHorizontal: 10
  },
  time: {
    height: 28,
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#999",
    justifyContent: "center"
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  day: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500"
  }
});
