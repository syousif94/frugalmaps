import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import SearchHeader from "./SearchHeader";

import SubmissionItem from "./SubmissionItem";
import * as Submissions from "./store/submissions";
import DeleteSubmissions from "./DeleteSubmissions";

const mapStateToProps = state => ({
  data: state.submissions.data,
  newData: state.submissions.newData,
  filter: state.submissions.filter,
  refreshing: state.submissions.refreshing
});

const mapDispatchToProps = {
  set: Submissions.actions.set,
  reload: Submissions.actions.reload
};

class PublishedScreen extends Component {
  componentDidMount() {
    this.props.reload({
      data: this.props.newData
    });
  }

  _onChangeText = text => {
    this.props.set({
      filter: text
    });
  };

  _onRefresh = () => {
    this.props.set({
      refreshing: true
    });
  };

  _renderItem = data => {
    return <SubmissionItem {...data} />;
  };

  _renderSeparator = () => <View style={styles.divider} />;

  _keyExtractor = (item, index) => item.id + index;

  render() {
    const { data, filter, refreshing } = this.props;
    return (
      <View style={styles.container}>
        <SearchHeader
          title="Submissions"
          placeholder="Search"
          onChangeText={this._onChangeText}
          value={filter}
        />
        <View style={styles.divider} />
        <FlatList
          refreshing={refreshing}
          onRefresh={this._onRefresh}
          data={data}
          renderItem={this._renderItem}
          style={styles.list}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={this._renderSeparator}
          contentInsetAdjustmentBehavior="always"
        />
        <DeleteSubmissions />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishedScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: "#fff"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  }
});
