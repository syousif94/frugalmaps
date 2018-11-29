import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageGallery from "./ImageGallery";
import { timeRemaining } from "./Time";
import { WIDTH } from "./Constants";
import NotifyButton from "./NotifyButton";

class CalendarItem extends Component {
  state = {
    time: Date.now()
  };

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const {
      item: { _source: item },
      section: { data, iso },
      index
    } = this.props;

    const containerStyle = [
      styles.container,
      { marginBottom: index + 1 === data.length ? 10 : 5 }
    ];

    return (
      <View style={containerStyle}>
        <View style={styles.info}>
          <View style={styles.event}>
            <View>
              <Text style={styles.titleText}>{item.title}</Text>
              <View style={styles.hours}>
                {item.groupedHours.map((hours, index) => {
                  const { remaining, ending } = timeRemaining(hours, iso);

                  const countdownStyle = [styles.countdownText];

                  if (ending) {
                    countdownStyle.push(styles.ending);
                  }

                  return (
                    <View style={styles.hour} key={index}>
                      <View style={styles.days}>
                        {hours.days.map(day => {
                          return (
                            <View style={styles.day} key={day}>
                              <Text style={styles.dayText}>{day}</Text>
                            </View>
                          );
                        })}
                      </View>
                      <Text style={styles.subText}>{hours.hours}</Text>
                      <Text style={countdownStyle}>{remaining}</Text>
                    </View>
                  );
                })}
              </View>
              <NotifyButton {...this.props} />
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.subText}>{item.city}</Text>
        </View>

        <ImageGallery width={WIDTH - 30} doc={this.props.item} height={150} />
      </View>
    );
  }
}

export default CalendarItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 4,
    padding: 5
  },
  info: {
    padding: 10
  },
  event: {
    marginBottom: 6
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000"
  },
  descriptionText: {
    marginTop: 2,
    color: "#000",
    fontSize: 12
  },
  hours: {
    marginTop: 2,
    marginBottom: 3
  },
  hour: {
    flexDirection: "row",
    alignItems: "center"
  },
  subText: {
    color: "#444",
    fontSize: 12
  },
  countdownText: {
    marginLeft: 4,
    color: "#18AB2E",
    fontSize: 12
  },
  ending: {
    color: "#E3210B"
  },
  days: {
    flexDirection: "row",
    marginRight: 3
  },
  day: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: "#18AB2E",
    marginRight: 2
  },
  dayText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
