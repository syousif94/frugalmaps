import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";

class InfoScreen extends Component {
  componentDidMount() {
    if (!this.props.event.data) {
    }
  }

  _renderInfo = () => {
    const {
      event: { data }
    } = this.props;

    if (!data) {
      return (
        <View style={[styles.info, styles.loading]}>
          <ActivityIndicator style={styles.loading} size="large" color="#444" />
        </View>
      );
    }

    const { _source: item } = data;

    console.log({ data });

    return (
      <View style={[styles.info, styles.loaded]}>
        <Text style={styles.boldText}>{item.title}</Text>
        <Text style={styles.infoText}>{item.description}</Text>
        <Text style={styles.infoText}>{item.location}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.map}>
          <MapView
            ref={ref => (this._map = ref)}
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
        {this._renderInfo()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  event: state.events.selectedEvent
});

export default connect(mapStateToProps)(InfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    flex: 1
  },
  info: {
    height: 220
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  loaded: {
    padding: 20
  }
});
