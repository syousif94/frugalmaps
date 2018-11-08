import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { MapView } from "expo";
import { connect } from "react-redux";
import ImageGallery from "./ImageGallery.ios";
import { INITIAL_REGION } from "./Constants";
import MapMarker from "./MapMarker";

class InfoScreen extends Component {
  state = {
    mapType: "standard"
  };

  componentDidMount() {
    if (!this.props.event.data) {
    }
  }

  _focusAnnotation = () => {
    const viewport = this.props.event.data._source.viewport;

    const coords = [
      {
        latitude: viewport.northeast.lat,
        longitude: viewport.northeast.lng
      },
      {
        latitude: viewport.southwest.lat,
        longitude: viewport.southwest.lng
      }
    ];

    this._map.fitToCoordinates(coords, { animated: false });
  };

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

    return (
      <View style={[styles.info, styles.loaded]}>
        <Text style={styles.boldText}>{item.title}</Text>
        <Text style={styles.infoText}>{item.description}</Text>
        <Text style={styles.infoText}>{item.location}</Text>
      </View>
    );
  };

  render() {
    const {
      event: { data }
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.map}>
          <MapView
            ref={ref => (this._map = ref)}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            mapType={this.state.mapType}
            onMapReady={this._focusAnnotation}
          >
            <MapMarker data={data} key={data._id} disabled />;
          </MapView>
        </View>
        <ImageGallery doc={data} disabled height={160} />
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
    height: 300
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  loaded: {
    padding: 20
  }
});
