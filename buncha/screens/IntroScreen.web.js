import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import { BLUE, RED } from "../utils/Colors";
import * as Cities from "../store/cities";
import * as Events from "../store/events";
import { FontAwesome } from "@expo/vector-icons";
import { enableLocation } from "../store/permissions";
import { getHistory } from ".";

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
        <BackgroundView
          style={{
            width: 520,
            marginTop: -100,
            height: 250,
            opacity: 0.2
          }}
        />
        <View
          style={{
            marginTop: -45,
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
            We're a curated local calendar for happy hours, brunches, game
            nights, and more.
          </Text>
          <Text
            style={{
              marginTop: 30,
              fontSize: 14,
              fontWeight: "300",
              color: "#444"
            }}
          >
            Select a city or enable location access to get started.
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

const BackgroundView = ({ style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 200">
    <defs>
      <filter
        x="-3.7%"
        y="-1.3%"
        width="109.9%"
        height="102.6%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="2"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter
        x="-3.7%"
        y="-1.3%"
        width="109.9%"
        height="102.6%"
        filterUnits="objectBoundingBox"
        id="b"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="2"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter
        x="-3.6%"
        y="-1.3%"
        width="109.7%"
        height="102.6%"
        filterUnits="objectBoundingBox"
        id="c"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="2"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter
        x="-3.7%"
        y="-1.4%"
        width="109.9%"
        height="102.7%"
        filterUnits="objectBoundingBox"
        id="d"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="2"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      fill="#000"
      fill-rule="evenodd"
      font-family="EmojiOneColor, EmojiOne"
      font-size="48"
      opacity=".6"
    >
      <g filter="url(#a)" transform="translate(712 107)">
        <text>
          <tspan x="141.537" y="84.233">
            🎉
          </tspan>
        </text>
        <text>
          <tspan x="201.482" y="41.013">
            🌺
          </tspan>
        </text>
        <text>
          <tspan x="32.47" y="81.724">
            🔥
          </tspan>
        </text>
        <text>
          <tspan x="251.445" y="82.216">
            🍑
          </tspan>
        </text>
      </g>
      <g filter="url(#b)" transform="translate(653 -647)">
        <text>
          <tspan x="206.477" y="673.1">
            💜
          </tspan>
        </text>
        <text>
          <tspan x="41.628" y="658.924">
            🙈
          </tspan>
        </text>
        <text>
          <tspan x="141.537" y="595.548">
            🌈
          </tspan>{" "}
          <tspan x="141.537" y="643.548">
            ✨
          </tspan>
        </text>
        <text>
          <tspan x="114.062" y="679.771">
            🍕
          </tspan>
        </text>
        <text>
          <tspan x="65.773" y="753.987">
            🍣
          </tspan>
        </text>
        <text>
          <tspan x="295.562" y="706.455">
            🥑
          </tspan>
        </text>
        <text>
          <tspan x="164.849" y="743.98">
            😁{" "}
          </tspan>{" "}
          <tspan x="164.849" y="791.98">
            👓
          </tspan>
        </text>
      </g>
      <g filter="url(#c)" transform="translate(341 -136)">
        <text>
          <tspan x="331.037" y="292.847">
            💚
          </tspan>
        </text>
        <text>
          <tspan x="270.073" y="167.764">
            💙
          </tspan>
        </text>
        <text>
          <tspan x="67.628" y="280.362">
            🥗
          </tspan>
        </text>
        <text>
          <tspan x="245.445" y="317.023">
            🎂
          </tspan>
        </text>
        <text>
          <tspan x="68.592" y="186.429">
            🤞
          </tspan>
        </text>
        <text>
          <tspan x="132.546" y="202.449">
            🍾 🤘
          </tspan>{" "}
          <tspan x="132.546" y="298.449">
            😎
          </tspan>
        </text>
        <text>
          <tspan x="268.417" y="246.15">
            🍦
          </tspan>
        </text>
        <text>
          <tspan x="0" y="223.983">
            😂
          </tspan>{" "}
          <tspan x="0" y="319.983">
            😈
          </tspan>
        </text>
        <text>
          <tspan x="199.537" y="262.007">
            😅
          </tspan>
        </text>
      </g>
      <g filter="url(#d)" transform="translate(-51 -533)">
        <text>
          <tspan x="247.477" y="700.1">
            💜
          </tspan>
        </text>
        <text>
          <tspan x="34.968" y="548.85">
            🖤
          </tspan>
        </text>
        <text>
          <tspan x="317.39" y="590.565">
            🍔
          </tspan>
        </text>
        <text>
          <tspan x="41.628" y="658.924">
            🙈
          </tspan>
        </text>
        <text>
          <tspan x="81.592" y="584.85">
            🍸
          </tspan>
        </text>
        <text>
          <tspan x="225.537" y="586.548">
            🌈
          </tspan>{" "}
          <tspan x="225.537" y="634.548">
            ✨
          </tspan>
        </text>
        <text>
          <tspan x="157.537" y="563.99">
            🌟
          </tspan>{" "}
          <tspan x="157.537" y="611.99">
            🙊
          </tspan>
        </text>
        <text>
          <tspan x="123.062" y="679.771">
            🍕
          </tspan>
        </text>
        <text>
          <tspan x="65.773" y="720.987">
            🍣
          </tspan>
        </text>
        <text>
          <tspan x="315.562" y="697.455">
            🥑
          </tspan>
        </text>
        <text>
          <tspan x="185.849" y="718.98">
            😁{" "}
          </tspan>{" "}
          <tspan x="185.849" y="766.98">
            👓
          </tspan>
        </text>
      </g>
    </g>
  </svg>
);
