import React, { useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AWSCF } from "../utils/Constants";
import * as User from "../store/user";

export default () => {
  const dispatch = useDispatch();
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const photo = useSelector(state => {
    if (state.user.localPhoto) {
      return { uri: state.user.localPhoto };
    }
    if (state.user.photo) {
      const uri = `${AWSCF}profile/${state.user.photo}.jpg`;
      return { uri };
    }
    return null;
  }, shallowEqual);
  const uploadingPhoto = useSelector(
    state => state.user.localPhoto && !state.user.photo
  );
  return (
    <TouchableOpacity
      disabled={uploadingPhoto}
      style={{ alignSelf: "center", marginBottom: 30, marginTop: 20 }}
      onPress={async () => {
        try {
          const { canceled, uri } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4
          });

          if (!canceled) {
            dispatch(User.uploadPhoto(uri));
          }
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {photo ? (
        <Image
          source={photo}
          style={{
            height: 250,
            width: 250,
            borderRadius: 125,
            backgroundColor: "#ccc"
          }}
          onLoadStart={() => {
            setLoadingPhoto(true);
          }}
          onLoadEnd={() => {
            setLoadingPhoto(false);
          }}
        />
      ) : (
        <View
          style={{
            height: 250,
            width: 250,
            borderRadius: 125,
            backgroundColor: "#ccc"
          }}
        />
      )}
      {uploadingPhoto || loadingPhoto ? (
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 125,
            backgroundColor: loadingPhoto ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.5)"
          }}
        >
          <ActivityIndicator
            size="large"
            color={loadingPhoto ? "#000" : "#fff"}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
