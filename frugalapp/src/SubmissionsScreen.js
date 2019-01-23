import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { IOS } from "./Constants";
import SubmissionItem from "./SubmissionItem";
import * as Submissions from "./store/submissions";
import DeleteSubmissions from "./DeleteSubmissions";

const mapStateToProps = state => ({
  data: state.submissions.data,
  newData: state.submissions.newData,
  refreshing: state.submissions.refreshing
});

const mapDispatchToProps = {
  set: Submissions.actions.set,
  reload: Submissions.actions.reload
};

class SubmissionsScreen extends Component {
  componentDidMount() {
    this.props.reload({
      data: this.props.newData
    });
  }

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

  _renderEmpty = () => {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No submissions currently awaiting review
        </Text>
      </View>
    );
  };

  render() {
    const { data, refreshing } = this.props;
    const SafeView = IOS ? SafeAreaView : View;
    return (
      <View style={styles.container}>
        <SafeView>
          <View style={styles.title}>
            <Text style={styles.titleText}>Submissions</Text>
          </View>
        </SafeView>
        <View style={styles.divider} />
        <FlatList
          refreshing={refreshing}
          onRefresh={this._onRefresh}
          data={data}
          renderItem={this._renderItem}
          style={styles.list}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={this._renderEmpty}
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
)(SubmissionsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: IOS ? 5 : 10,
    paddingBottom: 10
  },
  titleText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000"
  },
  list: {
    flex: 1,
    backgroundColor: "#fff"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  empty: {
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    fontSize: 12,
    color: "#444"
  }
});
