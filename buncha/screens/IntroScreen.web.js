import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import { BLUE } from "../utils/Colors";
import * as Cities from "../store/cities";
import * as Events from "../store/events";
import { FontAwesome } from "@expo/vector-icons";
import { enableLocation } from "../store/permissions";
import { getHistory } from ".";
import UpNextItem from "../components/UpNextItem";

export default ({ onComplete }) => {
  const dispatch = useDispatch();
  const cities = useSelector(state => state.cities.popular);
  const [opacity, setOpacity] = useState(location.pathname !== "/" ? 0 : 1);

  useEffect(() => {
    const history = getHistory();

    const unlisten = history.listen(location => {
      const home = location.pathname === "/";
      setOpacity(home ? 1 : 0);
    });

    return () => unlisten();
  }, []);

  useEffect(() => {
    dispatch(Cities.get());
  }, []);

  const events = JSON.parse(eventsJSON);

  return (
    <ScrollView
      pointerEvents={opacity ? "auto" : "none"}
      style={styles.container}
      contentContainerStyle={{
        flex: 1,
        maxWidth: 520,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: 10,
        paddingTop: 70,
        opacity
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.98)",
          borderRadius: 8,
          paddingBottom: 17,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            paddingTop: 30,
            paddingHorizontal: 20
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            Welcome to Buncha
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "300",
              lineHeight: 25
            }}
          >
            Buncha is a curated calendar of nearby happy hours, brunches, game
            nights, and more.
          </Text>

          <View style={{ flexDirection: "row", marginTop: 20, marginLeft: -8 }}>
            {events.map((item, index) => {
              return (
                <UpNextItem
                  key={item._id}
                  item={item}
                  index={index}
                  containerStyle={{
                    width: "60%",
                    paddingTop: 10,
                    paddingBottom: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#f4f4f4",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    borderTopLeftRadius: 11,
                    borderTopRightRadius: 11,
                    marginRight: 15
                  }}
                  style={{
                    width: "100%",
                    marginLeft: 0,
                    paddingVertical: 0
                  }}
                />
              );
            })}
          </View>

          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              fontWeight: "300",
              color: "#444"
            }}
          >
            To get started, select a city or enable location access.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 17,
            marginTop: 9
          }}
        >
          <View style={{ backgroundColor: BLUE, margin: 3, borderRadius: 5 }}>
            <TouchableOpacity
              style={{
                paddingVertical: 5,
                paddingHorizontal: 8,
                flexDirection: "row"
              }}
              onPress={() => {
                dispatch(enableLocation());
                onComplete();
              }}
            >
              <FontAwesome name="location-arrow" size={16} color="#fff" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontWeight: "700",
                  marginLeft: 8
                }}
              >
                My Location
              </Text>
            </TouchableOpacity>
          </View>
          {!cities.length ? (
            <View>
              <Text>Loading Cities</Text>
            </View>
          ) : (
            cities.map(city => {
              const onPress = () => {
                dispatch(Events.getCity(city));
                onComplete();
              };
              return (
                <View
                  style={{
                    backgroundColor: "#f2f2f2",
                    margin: 3,
                    borderRadius: 5,
                    overflow: "hidden"
                  }}
                  key={city._id}
                >
                  <TouchableOpacity
                    onPress={onPress}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: "rgba(0,0,0,0.05)"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#666",
                          fontWeight: "700"
                        }}
                      >
                        {city._source.count}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginHorizontal: 8,
                        fontSize: 16,
                        color: "#000",
                        fontWeight: "600"
                      }}
                    >
                      {city._source.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </View>
      <View style={{ height: 25 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});

const eventsJSON = `[{"_index":"events","_type":"_doc","_id":"oQT3d2wBhl8j4SL5AlXj","_score":null,"_source":{"updatedAt":1548071744215,"title":"Happy Hour","description":"Special food menu, half off select beer, wine, and boozy slushees.","days":[2,3,4,0,1],"start":"1400","end":"1700","url":"https://maps.google.com/?cid=13539345899590166404","rating":4.5,"periods":[{"close":{"day":0,"time":"2200"},"open":{"day":0,"time":"1100"}},{"close":{"day":1,"time":"2200"},"open":{"day":1,"time":"1100"}},{"close":{"day":2,"time":"2200"},"open":{"day":2,"time":"1100"}},{"close":{"day":3,"time":"2200"},"open":{"day":3,"time":"1100"}},{"close":{"day":4,"time":"2200"},"open":{"day":4,"time":"1100"}},{"close":{"day":5,"time":"2300"},"open":{"day":5,"time":"1100"}},{"close":{"day":6,"time":"2300"},"open":{"day":6,"time":"1100"}}],"hours":["Monday: 11:00 AM \u2013 10:00 PM","Tuesday: 11:00 AM \u2013 10:00 PM","Wednesday: 11:00 AM \u2013 10:00 PM","Thursday: 11:00 AM \u2013 10:00 PM","Friday: 11:00 AM \u2013 11:00 PM","Saturday: 11:00 AM \u2013 11:00 PM","Sunday: 11:00 AM \u2013 10:00 PM"],"placeid":"ChIJH3w8zB61RIYRhKc2dFxr5bs","location":"Loro","address":"2115 S Lamar Blvd, Austin, TX 78704, USA","coordinates":[-97.771277,30.24778989999999],"viewport":{"northeast":{"lat":30.2492637302915,"lng":-97.76997456970848},"southwest":{"lat":30.2465657697085,"lng":-97.7726725302915}},"photos":[{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipPRah4lhmvm_fLQvjmkNCByYLnAfBmxJhfs5zcD=s1600-h800","height":4000,"width":3000},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/7-400.jpg","height":400,"width":300},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/7-800.jpg","height":800,"width":600}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipOjMFmFpw8NXyLsKEOySCHQpe2wH7UqmyCQusBr=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/9-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/9-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipMsnVqp-fIIS4g_E0_nGNFdTsxyoH-taRPu4sze=s1600-h800","height":3036,"width":4048},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/3-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/3-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipMd32d-KYFbZem5XZ6qug8o62j6XKDb84xNh0w=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/2-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/2-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipP6RrALdANC41kZTWbeFU2m5DieoWjIM3McvsUj=s1600-h800","height":3024,"width":3024},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/1-400.jpg","height":400,"width":400},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/1-800.jpg","height":800,"width":800}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipNWwPWUH0fLIK7haDCJkSg-N7e_skvGQmEiXP_R=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/0-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/0-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipN1XsTL9dJif5reQu8LZipNNEaMalAa40eTeR-q=s1600-h800","height":1280,"width":960},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/6-400.jpg","height":400,"width":300},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/6-800.jpg","height":800,"width":600}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipOkiBmeFmOBDJiustwJGuDM6wt8qQXtEEWlY7Ie=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/4-400.jpg","height":400,"width":534},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/4-800.jpg","height":800,"width":1067}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipPy2oPM56d_ld28hLpGuvvr_VPfg-mG_LL15oTk=s1600-h800","height":2268,"width":4032},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/5-400.jpg","height":400,"width":711},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/5-800.jpg","height":800,"width":1422}},{"full":{"url":"https://lh3.googleusercontent.com/p/AF1QipNzI-71NWXew4-2PZeSLkve3ydF8M81SoNk8GuX=s1600-h800","height":2160,"width":3840},"thumb":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/8-400.jpg","height":400,"width":711},"mid":{"key":"img/ChIJH3w8zB61RIYRhKc2dFxr5bs/8-800.jpg","height":800,"width":1422}}],"phone":"+1 512-916-4858","website":"http://loroaustin.com/","neighborhood":"South Lamar, Austin, Texas","city":"Austin, Texas","state":"Texas","shortState":"TX","tags":["food","happy hour","beer","wine"],"groupedHours":[{"iso":3,"today":true,"days":[{"text":"Wed","iso":3,"daysAway":0},{"text":"Thu","iso":4,"daysAway":1},{"text":"Fri","iso":5,"daysAway":2},{"text":"Mon","iso":1,"daysAway":5},{"text":"Tue","iso":2,"daysAway":6}],"hours":"2:00pm - 5:00pm","start":"1400","end":"1700","duration":3}]},"sort":[2.150922130922101]},{"_index":"events","_type":"_doc","_id":"sQT3d2wBhl8j4SL5AlXk","_score":8.853615,"_source":{"updatedAt":1549397433400,"title":"Trivia Night","description":"Grab some friends and head to Mutt Lynch\u2019s for ultimate trivia night! Beer and wine only, great bar bites and a paper airplane toss. Get your trivia on, winners get prizes!","days":[2],"start":"2000","end":"2200","url":"https:\/\/maps.google.com\/?cid=13072531280360743059","rating":4.5,"priceLevel":2,"periods":[{"close":{"day":1,"time":"0000"},"open":{"day":0,"time":"0700"}},{"close":{"day":2,"time":"0000"},"open":{"day":1,"time":"0700"}},{"close":{"day":3,"time":"0000"},"open":{"day":2,"time":"0700"}},{"close":{"day":4,"time":"0000"},"open":{"day":3,"time":"0700"}},{"close":{"day":5,"time":"0000"},"open":{"day":4,"time":"0700"}},{"close":{"day":6,"time":"0130"},"open":{"day":5,"time":"0700"}},{"close":{"day":0,"time":"0130"},"open":{"day":6,"time":"0700"}}],"hours":["Monday: 7:00 AM \u2013 12:00 AM","Tuesday: 7:00 AM \u2013 12:00 AM","Wednesday: 7:00 AM \u2013 12:00 AM","Thursday: 7:00 AM \u2013 12:00 AM","Friday: 7:00 AM \u2013 1:30 AM","Saturday: 7:00 AM \u2013 1:30 AM","Sunday: 7:00 AM \u2013 12:00 AM"],"placeid":"ChIJYVhBRv8f3YARk6AVMfD1arU","location":"Mutt Lynch's","address":"2300 W Oceanfront, Newport Beach, CA 92663, USA","coordinates":[-117.9299236,33.6097373],"viewport":{"northeast":{"lat":33.6111401302915,"lng":-117.9284831197085},"southwest":{"lat":33.6084421697085,"lng":-117.9311810802915}},"photos":[{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNxDgObqZHufpoyLt-3vEp8ZGQkQVJLN9ccvM4y=s1600-h800","height":3264,"width":2448},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/8-400.jpg","height":400,"width":300},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/8-800.jpg","height":800,"width":600}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNHt7S6ksiiVqLY2aiXdekpxBUuwIo4uZkiwhIL=s1600-h800","height":3006,"width":5344},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/7-400.jpg","height":400,"width":711},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/7-800.jpg","height":800,"width":1422}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipMbK_D1P6LwjApZaMCAxF9ND4qU3j1lncpXyXJ9=s1600-h800","height":1960,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/3-400.jpg","height":400,"width":823},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/3-800.jpg","height":800,"width":1645}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNXk47TEy-eM1S_8uR5N86oPs-BpQcldKssXYv5=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/0-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/0-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipMX92d_wyxvhIaZtwVKCfQWaVDdx-nQMwloI1ra=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/4-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/4-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipPCNN1aaaJ4sOwTSvyG0FjyxNw2g6ySmaIr39iV=s1600-h800","height":1960,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/9-400.jpg","height":400,"width":823},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/9-800.jpg","height":800,"width":1645}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipPm5GEx5Ietnhw8jDzh4yKoazEbBpQhB7zS0KX1=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/5-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/5-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNtZ6HXBPsxzcLtQsPwXsk7vtFJWi8R4gyZyP8=s1600-h800","height":3024,"width":4032},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/6-400.jpg","height":400,"width":534},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/6-800.jpg","height":800,"width":1067}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipO2YShkBmXiFCqEviTw7tMG6SYycYFNcRGoNTPy=s1600-h800","height":4048,"width":3036},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/2-400.jpg","height":400,"width":300},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/2-800.jpg","height":800,"width":600}},{"full":{"url":"https:\/\/lh3.googleusercontent.com\/p\/AF1QipNbw-FK3sL_ee8ogvO5CSjdrQOdMpN4JbxVg8Ko=s1600-h800","height":2358,"width":4191},"thumb":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/1-400.jpg","height":400,"width":711},"mid":{"key":"img\/ChIJYVhBRv8f3YARk6AVMfD1arU\/1-800.jpg","height":800,"width":1422}}],"phone":"+1 949-675-1556","website":"http:\/\/www.muttlynchs.com\/","neighborhood":"Balboa Peninsula, Newport Beach, California","city":"Newport Beach, California","state":"California","shortState":"CA","tags":["happy hour","trivia","beer","wine"],"groupedHours":[{"iso":3,"today":true,"days":[{"text":"Wed","iso":3,"daysAway":0}],"hours":"8:00pm - 10:00pm","start":"2000","end":"2200","duration":2}]}}]`;
