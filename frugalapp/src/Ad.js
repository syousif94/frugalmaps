import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import { FacebookAds } from "expo";
import { IOS, PLACEMENT_ID } from "./Constants";

export default class Ad extends PureComponent {
  render() {
    const { touchAd, initialized } = this.props;

    const pointerEvents = touchAd ? "auto" : "none";

    if (initialized && IOS) {
      return (
        <View style={styles.adView} pointerEvents="box-none" key="ad">
          <View style={styles.adBanner} pointerEvents="none">
            <Text style={styles.adText}>Loading Advertisement...</Text>
            <Text style={styles.adSubtext}>Occasionally fails</Text>
          </View>
          <View style={styles.adContainer} pointerEvents="box-none">
            <FacebookAds.BannerView
              style={styles.ad}
              pointerEvents={pointerEvents}
              placementId={PLACEMENT_ID}
              type="standard"
              onError={err => console.log("error", err)}
              onPress={() => console.log("hi")}
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
    maxHeight: 50,
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
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: 70
  },
  ad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50
  }
});
