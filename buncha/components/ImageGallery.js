import React, { memo } from "react";
import { View, StyleSheet, Image } from "react-native";
import { AWSCF } from "../utils/Constants";

const ImageItem = ({ item, height }) => {
  if (!item.thumb) {
    return null;
  }

  let uri = `${AWSCF}${item.thumb.key}`;
  let imageHeight = item.thumb.height;
  let width = item.thumb.width;

  const source = {
    uri
  };

  const imageWidth = (height / imageHeight) * width;
  return (
    <Image
      key={uri}
      source={source}
      style={{
        width: imageWidth,
        height,
        backgroundColor: "#e0e0e0"
      }}
    />
  );
};

const ImageGallery = ({ photos, height = 170 }) => {
  return (
    <View
      style={{
        height,
        width: "100%",
        flexDirection: "row",
        overflow: "hidden"
      }}
    >
      {photos.map((photo, index) => {
        return (
          <React.Fragment key={`${index}`}>
            {index ? <View style={styles.divider} /> : null}
            <ImageItem item={photo} height={height} />
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default memo(ImageGallery);

const styles = StyleSheet.create({
  divider: {
    width: 2
  }
});
