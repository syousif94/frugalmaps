import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, StyleSheet } from "react-native";

class CalendarEmpty extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../assets/sadCalendarLarge.png")} />
        <Text style={styles.headerText}>No Specials Found</Text>
        <Text style={styles.subText}>
          We don't have any data for {this.props.text} yet.
        </Text>
        <Text style={styles.subText}>
          You can submit some yourself or browse trending cities and recently
          added specials by tapping on the search bar.
        </Text>
        <Text style={styles.subText}>
          If notifications are enabled, we'll let you know when nearby specials
          are added.
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  text: state.location.text
});

export default connect(mapStateToProps)(CalendarEmpty);

const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    alignItems: "center"
  },
  headerText: {
    marginTop: 35,
    color: "#333",
    fontSize: 16,
    fontWeight: "500"
  },
  subText: {
    marginTop: 15,
    width: 220,
    color: "#555",
    fontSize: 14,
    lineHeight: 18
  }
});
