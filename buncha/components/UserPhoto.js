import React from "react";
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

export default () => {
  const dispatch = useDispatch;
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
      onPress={openPicker.bind(null, dispatch)}
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
      {uploadingPhoto ? (
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 125,
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

async function openPicker(dispatch) {
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
}
