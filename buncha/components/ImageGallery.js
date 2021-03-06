import React, { memo, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { AWSCF } from "../utils/Constants";

const ImageItem = ({ item, height, width }) => {
  if (!item.thumb) {
    return null;
  }

  const uri = `${AWSCF}${item.thumb.key}`;

  const source = {
    uri
  };

  return (
    <Image
      key={uri}
      source={source}
      style={{
        width,
        height,
        backgroundColor: "#e0e0e0"
      }}
    />
  );
};

const ImageGallery = ({ photos, height = 170, width }) => {
  const images = [];

  let i = 0;
  let totalWidth = 0;

  while (i < photos.length && totalWidth < width) {
    const photo = photos[i];
    const imageWidth = (height / photo.thumb.height) * photo.thumb.width;
    images.push(
      <React.Fragment key={`${i}`}>
        {i ? <View style={styles.divider} /> : null}
        <ImageItem item={photo} height={height} width={imageWidth} />
      </React.Fragment>
    );
    i += 1;
    totalWidth += imageWidth + 1;
  }

  return (
    <View
      style={{
        height,
        width: "100%",
        flexDirection: "row",
        overflow: "hidden"
      }}
    >
      {images}
    </View>
  );
};

export default memo(ImageGallery);

const styles = StyleSheet.create({
  divider: {
    width: 1
  }
});
