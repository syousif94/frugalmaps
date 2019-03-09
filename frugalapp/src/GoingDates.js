import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";
import moment from "moment";

export default class GoingDates extends PureComponent {
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

    const days = event._source.groupedHours
      .reduce((days, hours) => {
        return [...hours.days, ...days];
      }, [])
      .sort((a, b) => a.daysAway - b.daysAway);

    const data = [];

    for (let i = 0; i < 40; i++) {
      const index = i % days.length;

      const day = days[index];

      const daysAway = day.daysAway + Math.floor(i / days.length) * 7;

      const date = moment().add(daysAway, "d");

      data.push({ ...day, date, daysAway });
    }

    this.setState({
      data
    });
  };

  _renderItem = data => {
    return (
      <View style={styles.date}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.day}>{data.item.text}</Text>
          <Text style={styles.day}>{data.item.date.format("M/D")}</Text>
          <Text style={styles.day}>{data.item.daysAway}</Text>
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
    height: 100
  },
  content: {
    padding: 10
  },
  date: {
    height: 60,
    width: 60,
    borderRadius: 30,
    margin: 10,
    backgroundColor: "#999"
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  day: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  }
});
