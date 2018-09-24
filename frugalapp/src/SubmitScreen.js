import React, { Component } from "react";
import Swiper from "react-native-swiper";
import RestaurantPicker from "./RestaurantPicker";
import EditSpecial from "./EditSpecial";

export default class SubmitScreen extends Component {
  state = {
    place: null
  };

  _onChangeText = field => text => {
    this.setState({
      [field]: text
    });
  };

  _selectRestaurant = place => {
    this.setState({
      place
    });
    this._swiper.scrollBy(1, true);
  };

  _submitForm = () => {};

  render() {
    const pickerProps = {
      value: this.state.restaurant,
      onChangeText: this._onChangeText("restaurant"),
      select: this._selectRestaurant
    };
    return (
      <Swiper
        bounces
        showsPagination={false}
        alwaysBounceHorizontal
        ref={ref => (this._swiper = ref)}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        loop={false}
      >
        <RestaurantPicker {...pickerProps} />
        <EditSpecial />
      </Swiper>
    );
  }
}
