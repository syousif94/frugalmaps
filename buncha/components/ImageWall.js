import React, { memo, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { AWSCF } from "../utils/Constants";

const ImageItem = memo(({ item, width }) => {
  if (!item.thumb) {
    return null;
  }

  let uri = `${AWSCF}${item.thumb.key}`;
  let imageWidth = item.thumb.width;
  let height = item.thumb.height;

  const source = {
    uri
  };

  const imageHeight = (width / imageWidth) * height;
  return (
    <Image
      key={uri}
      source={source}
      style={{
        width,
        height: imageHeight,
        backgroundColor: "#e0e0e0",
        marginBottom: 2
      }}
    />
  );
});

const SpacerView = () => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 2,
          backgroundColor: "#f2f2f2"
        }}
      />
    </View>
  );
};

const ImageWall = ({ photos }) => {
  const [width, setWidth] = useState(0);
  const leftRow = [];
  const rightRow = [];
  photos.forEach((photo, index) => {
    if (index % 2 === 0) {
      leftRow.push(photo);
    } else {
      rightRow.push(photo);
    }
  });
  return (
    <View
      style={styles.container}
      onLayout={e => {
        const layout = e.nativeEvent.layout;
        setWidth((layout.width - 2) / 2);
      }}
    >
      <View>
        {leftRow.map((photo, index) => {
          return <ImageItem item={photo} key={`${index}`} width={width} />;
        })}
        <SpacerView />
      </View>
      <View>
        {rightRow.map((photo, index) => {
          return <ImageItem item={photo} key={`${index}`} width={width} />;
        })}
        <SpacerView />
      </View>
    </View>
  );
};

export default memo(ImageWall);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
