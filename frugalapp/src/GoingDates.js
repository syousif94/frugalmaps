import React, { PureComponent } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";

export default class GoingDates extends PureComponent {
  state = {
    data: []
  };

  componentDidMount() {
    this._createData();
  }

  componentDidUpdate(_, prev) {
    if (prev.event._id !== this.props.event._id) {
      this._createData();
      this._list.getScrollResponder().scrollTo({ x: 0, y: 0, animated: false });
    }
  }

  _createData = () => {};

  _renderItem = data => {};

  _getItemLayout = () => {};

  _keyExtractor = (item, index) => `${index}`;

  _setListRef = ref => {
    this._list = ref;
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        horizontal
        renderItem={this._renderItem}
        style={styles.list}
        getItemLayout={this._getItemLayout}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    height: 80
  }
});
