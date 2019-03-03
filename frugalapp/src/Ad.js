import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import { FacebookAds } from "expo";
import { IOS, PLACEMENT_ID } from "./Constants";

export default class Ad extends PureComponent {
  render() {
    const { initialized } = this.props;

    if (IOS && initialized) {
      return (
        <View style={styles.adView} pointerEvents="box-none">
          <View style={styles.adBanner} pointerEvents="none">
            <Text style={styles.adText}>Loading Advertisement...</Text>
            <Text style={styles.adSubtext}>Occasionally fails</Text>
          </View>
          <View style={styles.adContainer} pointerEvents="box-none">
            <FacebookAds.BannerView
              placementId={PLACEMENT_ID}
              type="standard"
              onError={this._hideAd}
            />
          </View>
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  adView: {
    backgroundColor: "#fff",
    height: 50,
    overflow: "hidden"
  },
  adBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingTop: 6,
    paddingLeft: 10
  },
  adText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500"
  },
  adSubtext: {
    marginTop: 1,
    fontSize: 9,
    color: "#555",
    fontWeight: "400"
  },
  adContainer: {
    marginTop: -20,
    height: 70
  }
});
