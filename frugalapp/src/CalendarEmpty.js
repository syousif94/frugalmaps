import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, StyleSheet } from "react-native";

class CalendarEmpty extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../assets/sadCalendarLarge.png")} />
        <Text style={styles.headerText}>Nothing Found</Text>
        <Text style={styles.subText}>
          Either something went wrong or there's no data for {this.props.text}{" "}
          yet.
        </Text>
        <Text style={styles.subText}>We'll notify you of nearby data.</Text>
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
    paddingVertical: 50,
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
    width: 280,
    color: "#555",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  }
});
