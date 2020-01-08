import React, { useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Swiper from "react-native-swiper";
import { BLUE, RED } from "../utils/Colors";
import { navigate } from ".";
import { getInset } from "../utils/SafeAreaInsets";
import { HEIGHT, ANDROID, NARROW, WIDTH } from "../utils/Constants";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import UpNextItem, { itemMargin } from "../components/UpNextItem";
import AccountView, {
  FOCUS_ACCOUNT_INPUT,
  BLUR_ACCOUNT_INPUT
} from "../components/AccountView";
import emitter from "tiny-emitter/instance";
import ContactsList from "../components/ContactsList";
import { useSelector } from "react-redux";
import { LOAD_CONTACTS } from "../utils/Contacts";
import { LogoutButton } from "../components/ProfileView";

export default () => {
  const showContacts = useSelector(state => state.user.showContacts);
  const events = JSON.parse(eventsJSON);
  const swiperRef = useRef(null);
  useEffect(() => {
    const onEvent = () => {
      requestAnimationFrame(() => {
        swiperRef.current.scrollTo(4);
        requestAnimationFrame(() => {
          emitter.emit(LOAD_CONTACTS);
        });
      });
    };
    emitter.on("scroll-intro-contacts", onEvent);

    return () => {
      return emitter.off("scroll-intro-contacts", onEvent);
    };
  });
  return (
    <View style={styles.container}>
      <Swiper
        onIndexChanged={index => {
          if (index === 3) {
            emitter.emit(FOCUS_ACCOUNT_INPUT);
          } else {
            emitter.emit(BLUR_ACCOUNT_INPUT);
          }
        }}
        ref={swiperRef}
        loop={false}
        bounces
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        renderPagination={(index, total) => {
          const dots = Array.apply(null, new Array(total)).map((_, i) => i);
          return (
            <View
              style={{
                borderRadius: 5,
                paddingVertical: 2,
                position: "absolute",
                bottom: getInset("bottom") + 13,
                alignSelf: "center",
                flexDirection: "row"
              }}
            >
              {dots.map(i => {
                return (
                  <View
                    key={`${i}`}
                    style={{
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                      backgroundColor: index === i ? "#000" : "rgba(0,0,0,0.2)",
                      marginHorizontal: 2
                    }}
                  />
                );
              })}
            </View>
          );
        }}
      >
        <View
          style={[
            styles.page,
            { justifyContent: "center", paddingBottom: "28%" }
          ]}
        >
          <View style={styles.body}>
            <View
              style={{
                alignItems: "flex-end",
                paddingBottom: "3%"
              }}
            >
              <Image
                source={require("../assets/intro.png")}
                style={{ transform: [{ scale: 0.7 }, { rotate: "6deg" }] }}
              />
            </View>
            <Text style={styles.titleText} allowFontScaling={false}>
              Welcome to Buncha
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Buncha is a curated social calendar featuring the best local
              specials, brunches, game nights, and more.
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.page,
            {
              justifyContent: NARROW
                ? WIDTH <= 320
                  ? "flex-start"
                  : "flex-end"
                : "space-around",
              alignItems: NARROW ? null : "center",
              flexDirection: NARROW ? null : "row"
            }
          ]}
        >
          <View style={{ marginTop: NARROW ? null : -60 }}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Events
            </Text>
            <View style={styles.subtitle}>
              <FontAwesome
                allowFontScaling={false}
                name="star"
                size={18}
                color={"#FFA033"}
              />
              <Text allowFontScaling={false} style={styles.subtitleText}>
                Interested
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subText}>
              Contacts you've selected can see what you're interested in and
              when.
            </Text>
            <View style={styles.subtitle}>
              <Entypo
                allowFontScaling={false}
                name="calendar"
                size={18}
                color={RED}
              />
              <Text allowFontScaling={false} style={styles.subtitleText}>
                Plans
              </Text>
            </View>
            <Text style={styles.subText} allowFontScaling={false}>
              Invite your friends and keep track of who's going. Works even if
              they don't have Buncha.
            </Text>
          </View>
          <View
            style={{
              marginTop: 30
            }}
          >
            <View
              pointerEvents="none"
              style={{
                flexDirection: NARROW ? "row" : "column",
                justifyContent: NARROW ? "flex-start" : "center",
                alignItems: NARROW ? "center" : "flex-start",
                marginRight: NARROW ? null : -220,
                marginHorizontal: NARROW ? -30 : 0,
                paddingLeft: NARROW ? 30 - itemMargin : 0,
                overflow: "hidden"
              }}
            >
              {events.map((item, index) => {
                return (
                  <UpNextItem
                    key={item._id}
                    item={item}
                    index={index}
                    demo
                    style={{
                      height: NARROW ? "100%" : null,
                      width: NARROW ? "60%" : 340,
                      marginHorizontal: NARROW ? 15 : null,
                      marginVertical: 0,
                      marginTop: NARROW ? null : 30
                    }}
                  />
                );
              })}
            </View>
          </View>
        </View>
        <View style={[styles.page, { justifyContent: "center" }]}>
          <View style={styles.body}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Permissions
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              For the best experience, please allow to following permissions
              when prompted.
            </Text>
            <View style={[styles.subtitle, { marginTop: 60 }]}>
              <FontAwesome
                allowFontScaling={false}
                name="location-arrow"
                size={18}
                color={BLUE}
              />
              <Text allowFontScaling={false} style={styles.subtitleText}>
                Location
              </Text>
            </View>
            <Text style={styles.subText} allowFontScaling={false}>
              Used to determine which events are nearby.
            </Text>
            <View style={styles.subtitle}>
              <Ionicons
                allowFontScaling={false}
                name="ios-contacts"
                style={{ marginTop: 1 }}
                size={22}
                color={BLUE}
              />
              <Text allowFontScaling={false} style={styles.subtitleText}>
                Contacts
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subText}>
              Used to send invites and share your interests.
            </Text>
            <View style={styles.subtitle}>
              <Ionicons
                allowFontScaling={false}
                name="md-notifications"
                size={20}
                color={BLUE}
              />
              <Text allowFontScaling={false} style={styles.subtitleText}>
                Notifications
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subText}>
              Used for alerts and reminders.
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <AccountView
            keyboardVerticalOffset={getInset("bottom") + (ANDROID ? 160 : 120)}
            keyboardBottomOffset={getInset("bottom") + 80}
            renderHeader={({ scrollTo }) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    paddingLeft: 30,
                    paddingRight: 30,
                    marginTop: getInset("top") + 0.05 * HEIGHT,
                    maxWidth: 500,
                    width: "100%",
                    alignSelf: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline"
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.titleText}>
                      Account
                    </Text>
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        paddingBottom: 0
                      }}
                      onPress={() => {
                        navigate("UpNext");
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#eee",
                          fontWeight: "700"
                        }}
                      >
                        Skip
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <LogoutButton scrollTo={scrollTo} />
                </View>
              );
            }}
          />
        </View>
        {showContacts ? <ContactsList /> : null}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  page: {
    overflow: "hidden",
    paddingTop: getInset("top") + 0.05 * HEIGHT,
    paddingBottom: getInset("bottom") + 0.08 * HEIGHT,
    paddingHorizontal: 30,
    flex: 1
  },
  body: {
    maxWidth: 500,
    width: "100%",
    alignSelf: "center"
  },
  titleText: {
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center"
  },
  subtitleText: {
    marginLeft: 10,
    fontSize: 19,
    fontWeight: ANDROID ? "700" : "600"
  },
  subText: {
    marginTop: 8,
    fontSize: 19,
    lineHeight: 26,
    color: "#666",
    maxWidth: 400
  }
});

const eventsJSON = `[{"_index":"events","_type":"_doc","_id":"oQT3d2wBhl8j4SL5AlXj","_score":null,"_source":{"updatedAt":1548071744215,"title":"Happy Hour","description":"Special food menu, half off select beer, wine, and boozy slushees.","days":[2,3,4,0,1],"start":"1400","end":"1700","url":"https://maps.google.com/?cid=13539345899590166404","rating":4.5,"periods":[{"close":{"day":0,"time":"2200"},"open":{"day":0,"time":"1100"}},{"close":{"day":1,"time":"2200"},"open":{"day":1,"time":"1100"}},{"close":{"day":2,"time":"2200"},"open":{"day":2,"time":"1100"}},{"close":{"day":3,"time":"2200"},"open":{"day":3,"time":"1100"}},{"close":{"day":4,"time":"2200"},"open":{"day":4,"time":"1100"}},{"close":{"day":5,"time":"2300"},"open":{"day":5,"time":"1100"}},{"close":{"day":6,"time":"2300"},"open":{"day":6,"time":"1100"}}],"hours":["Monday: 11:00 AM \u2013 10:00 PM","Tuesday: 11:00 AM \u2013 10:00 PM","Wednesday: 11:00 AM \u2013 10:00 PM","Thursday: 11:00 AM \u2013 10:00 PM","Friday: 11:00 AM \u2013 11:00 PM","Saturday: 11:00 AM \u2013 11:00 PM","Sunday: 11:00 AM \u2013 10:00 PM"],"placeid":"ChIJH3w8zB61RIYRhKc2dFxr5bs","location":"Loro","address":"2115 S Lamar Blvd, Austin, TX 78704, USA","coordinates":[-97.771277,30.24778989999999],"viewport":{"northeast":{"lat":30.2492637302915,"lng":-97.76997456970848},"southwest":{"lat":30.2465657697085,"lng":-97.7726725302915}},"photos":[{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipPRah4lhmvm_fLQvjmkNCByYLnAfBmxJhfs5zcD=s1600-h800","height":4000,"width":3000},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/7-400.jpg","height":400,"width":300},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/7-800.jpg","height":800,"width":600}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipOjMFmFpw8NXyLsKEOySCHQpe2wH7UqmyCQusBr=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/9-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/9-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipMsnVqp-fIIS4g_E0_nGNFdTsxyoH-taRPu4sze=s1600-h800","height":3036,"width":4048},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/3-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/3-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipMd32d-KYFbZem5XZ6qug8o62j6XKDb84xNh0w=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/2-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/2-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipP6RrALdANC41kZTWbeFU2m5DieoWjIM3McvsUj=s1600-h800","height":3024,"width":3024},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/1-400.jpg","height":400,"width":400},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/1-800.jpg","height":800,"width":800}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipNWwPWUH0fLIK7haDCJkSg-N7e_skvGQmEiXP_R=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/0-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/0-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipN1XsTL9dJif5reQu8LZipNNEaMalAa40eTeR-q=s1600-h800","height":1280,"width":960},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/6-400.jpg","height":400,"width":300},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/6-800.jpg","height":800,"width":600}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipOkiBmeFmOBDJiustwJGuDM6wt8qQXtEEWlY7Ie=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/4-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/4-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipPy2oPM56d_ld28hLpGuvvr_VPfg-mG_LL15oTk=s1600-h800","height":2268,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/5-400.jpg","height":400,"width":711},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/5-800.jpg","height":800,"width":1422}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipNzI-71NWXew4-2PZeSLkve3ydF8M81SoNk8GuX=s1600-h800","height":2160,"width":3840},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/8-400.jpg","height":400,"width":711},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/8-800.jpg","height":800,"width":1422}}],"phone":"+1 512-916-4858","website":"http://loroaustin.com/","neighborhood":"South Lamar, Austin, Texas","city":"Austin, Texas","state":"Texas","shortState":"TX","tags":["food","happy hour","beer","wine"],"groupedHours":[{"iso":3,"today":true,"days":[{"text":"Wed","iso":3,"daysAway":0},{"text":"Thu","iso":4,"daysAway":1},{"text":"Fri","iso":5,"daysAway":2},{"text":"Mon","iso":1,"daysAway":5},{"text":"Tue","iso":2,"daysAway":6}],"hours":"2:00pm - 5:00pm","start":"1400","end":"1700","duration":3}]},"sort":[2.150922130922101]},{"_index":"events","_type":"_doc","_id":"sQT3d2wBhl8j4SL5AlXk","_score":8.853615,"_source":{"updatedAt":1549397433400,"title":"Trivia Night","description":"Grab some friends and head to Mutt Lynch\u2019s for ultimate trivia night! Beer and wine only, great bar bites and a paper airplane toss. Get your trivia on, winners get prizes!","days":[2],"start":"2000","end":"2200","url":"https:\/\/maps.google.com\/?cid=13072531280360743059","rating":4.5,"priceLevel":2,"periods":[{"close":{"day":1,"time":"0000"},"open":{"day":0,"time":"0700"}},{"close":{"day":2,"time":"0000"},"open":{"day":1,"time":"0700"}},{"close":{"day":3,"time":"0000"},"open":{"day":2,"time":"0700"}},{"close":{"day":4,"time":"0000"},"open":{"day":3,"time":"0700"}},{"close":{"day":5,"time":"0000"},"open":{"day":4,"time":"0700"}},{"close":{"day":6,"time":"0130"},"open":{"day":5,"time":"0700"}},{"close":{"day":0,"time":"0130"},"open":{"day":6,"time":"0700"}}],"hours":["Monday: 7:00 AM \u2013 12:00 AM","Tuesday: 7:00 AM \u2013 12:00 AM","Wednesday: 7:00 AM \u2013 12:00 AM","Thursday: 7:00 AM \u2013 12:00 AM","Friday: 7:00 AM \u2013 1:30 AM","Saturday: 7:00 AM \u2013 1:30 AM","Sunday: 7:00 AM \u2013 12:00 AM"],"placeid":"ChIJYVhBRv8f3YARk6AVMfD1arU","location":"Mutt Lynch's","address":"2300 W Oceanfront, Newport Beach, CA 92663, USA","coordinates":[-117.9299236,33.6097373],"viewport":{"northeast":{"lat":33.6111401302915,"lng":-117.9284831197085},"southwest":{"lat":33.6084421697085,"lng":-117.9311810802915}},"photos":[{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNxDgObqZHufpoyLt-3vEp8ZGQkQVJLN9ccvM4y=s1600-h800","height":3264,"width":2448},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/8-400.jpg","height":400,"width":300},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/8-800.jpg","height":800,"width":600}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNHt7S6ksiiVqLY2aiXdekpxBUuwIo4uZkiwhIL=s1600-h800","height":3006,"width":5344},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/7-400.jpg","height":400,"width":711},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/7-800.jpg","height":800,"width":1422}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipMbK_D1P6LwjApZaMCAxF9ND4qU3j1lncpXyXJ9=s1600-h800","height":1960,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/3-400.jpg","height":400,"width":823},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/3-800.jpg","height":800,"width":1645}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNXk47TEy-eM1S_8uR5N86oPs-BpQcldKssXYv5=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/0-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/0-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipMX92d_wyxvhIaZtwVKCfQWaVDdx-nQMwloI1ra=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/4-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/4-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipPCNN1aaaJ4sOwTSvyG0FjyxNw2g6ySmaIr39iV=s1600-h800","height":1960,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/9-400.jpg","height":400,"width":823},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/9-800.jpg","height":800,"width":1645}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipPm5GEx5Ietnhw8jDzh4yKoazEbBpQhB7zS0KX1=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/5-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/5-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNtZ6HXBPsxzcLtQsPwXsk7vtFJWi8R4gyZyP8=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/6-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/6-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipO2YShkBmXiFCqEviTw7tMG6SYycYFNcRGoNTPy=s1600-h800","height":4048,"width":3036},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/2-400.jpg","height":400,"width":300},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/2-800.jpg","height":800,"width":600}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNbw-FK3sL_ee8ogvO5CSjdrQOdMpN4JbxVg8Ko=s1600-h800","height":2358,"width":4191},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/1-400.jpg","height":400,"width":711},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/1-800.jpg","height":800,"width":1422}}],"phone":"+1 949-675-1556","website":"http:\/\/www.muttlynchs.com\/","neighborhood":"Balboa Peninsula, Newport Beach, California","city":"Newport Beach, California","state":"California","shortState":"CA","tags":["happy hour","trivia","beer","wine"],"groupedHours":[{"iso":3,"today":true,"days":[{"text":"Wed","iso":3,"daysAway":0}],"hours":"8:00pm - 10:00pm","start":"2000","end":"2200","duration":2}]}}]`;
