import React, { memo } from "react";
import { View, FlatList, StyleSheet, Image } from "react-native";
import { AWSCF } from "../utils/Constants";

const ImageItem = memo(({ item, height }) => {
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
});

const ImageGallery = ({ photos, height = 170, scrollEnabled = true }) => {
  return (
    <View style={{ height }} pointerEvents={scrollEnabled ? "auto" : "none"}>
      <FlatList
        style={styles.list}
        horizontal
        data={photos}
        renderItem={data => <ImageItem {...data} height={height} />}
        keyExtractor={(item, index) => {
          if (item.thumb) {
            return `${item.thumb.key}${index}`;
          } else {
            return `${item.url}${index}`;
          }
        }}
        getItemLayout={(data, index) => {
          const image = data[index];
          let imageHeight = image.thumb.height;
          let width = image.thumb.width;
          const imageWidth = (height / imageHeight) * width;
          return {
            length: imageWidth,
            offset: (imageWidth + 2) * index,
            index
          };
        }}
        scrollEnabled={scrollEnabled}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default memo(ImageGallery);

const styles = StyleSheet.create({
  divider: {
    width: 2
  }
});
