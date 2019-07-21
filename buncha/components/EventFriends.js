import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

export default () => {
  const [users, setUsers] = useState({ photos: [], names: [] });

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(
        "https://uifaces.co/api?limit=4&emotion[]=happiness",
        {
          headers: {
            "X-API-KEY": "dbb9a151ded8ea08ae04287e82d835"
          }
        }
      ).then(res => res.json());

      const users = res.reduce(
        (users, user) => {
          users.photos.push(user.photo);
          users.names.push(user.name.split(" ")[0]);
          return users;
        },
        { photos: [], names: [] }
      );

      setUsers(users);
    };

    getUsers();
  }, []);

  const height = 18;
  const borderWidth = 2;
  const imageHeight = height - borderWidth * 2;

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 5,
        maxWidth: "100%",
        alignItems: "center",
        minHeight: height
      }}
    >
      {users.photos.map((uri, index) => {
        return (
          <View
            key={`${index}`}
            style={{
              borderWidth,
              height: height,
              width: height,
              borderRadius: height / 2,
              borderColor: "#fff",
              marginRight: -6
            }}
          >
            <Image
              style={{
                height: imageHeight,
                width: imageHeight,
                borderRadius: imageHeight / 2
              }}
              source={{ uri }}
            />
          </View>
        );
      })}
      {users.names.length ? (
        <View
          style={{
            marginLeft: 10,
            justifyContent: "center",
            flex: 1
          }}
        >
          <Text style={{ fontSize: 12, color: "#444" }}>
            {users.names.join(", ")} are down tonight
          </Text>
        </View>
      ) : null}
    </View>
  );
};
