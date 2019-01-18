import * as _ from "lodash";
import React, { Component } from "react";
import { Image as RNImage, StyleSheet, View } from "react-native";

import CacheManager from "./CacheManager";

export default class Image extends Component {
  mounted = true;

  state = {
    uri: undefined
  };

  async load({ uri, options = {} }) {
    if (uri) {
      const path = await CacheManager.get(uri, options).getPath();
      if (this.mounted) {
        this.setState({ uri: path });
      }
    }
  }

  componentDidMount() {
    this.load(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.uri !== prevProps.uri) {
      this.load(this.props);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { preview, style, defaultSource, ...otherProps } = this.props;
    const { uri } = this.state;
    const hasDefaultSource = !!defaultSource;
    const hasPreview = !!preview;
    const isImageReady = !!uri;
    const computedStyle = [
      StyleSheet.absoluteFill,
      _.transform(
        _.pickBy(
          StyleSheet.flatten(style),
          (value, key) => propsToCopy.indexOf(key) !== -1
        ),
        (result, value, key) =>
          Object.assign(result, { [key]: value - (style.borderWidth || 0) })
      )
    ];
    return (
      <View {...{ style }}>
        {hasDefaultSource && !hasPreview && !isImageReady && (
          <RNImage
            source={defaultSource}
            style={computedStyle}
            {...otherProps}
          />
        )}
        {hasPreview && (
          <RNImage source={preview} resizeMode="cover" style={computedStyle} />
        )}
        {isImageReady && (
          <RNImage source={{ uri }} style={computedStyle} {...otherProps} />
        )}
      </View>
    );
  }
}

const propsToCopy = [
  "borderRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius"
];
