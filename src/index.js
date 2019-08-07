import React, {Component} from 'react';
import {
  Animated,
  View,
  Dimensions,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';


const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const DIVIDER_LINE = 20;

export default class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positionX: this.props.position.x,
      positionY: this.props.position.y,
      width: this.props.size.width,
      height: this.props.size.height,
      childComponent: null,
      containerStyle: this.props.containerStyle,
    };
  
    this.animatedValue = new Animated.Value(0);
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
  }
  
  show(options = {}) {
    const {
      position,
      size,
      message,
      component,
      containerStyle,
      messageContainerStyle,
      messageTextStyle,
      fadeInDuration,
      fadeOutDuration,
      visibleDuration,
    } = options;

    let childComponentProps;

    const componentProps = React.isValidElement(component) ? component : 
      (React.isValidElement(this.props.children)) ? this.props.children : null;

    childComponentProps = (typeof message === 'string' || componentProps === null) ? 
      this.renderMessage(message, messageContainerStyle, messageTextStyle) : componentProps;

    const positionX = (position && typeof position.x === 'number') ? position.x : this.props.position.x;
    const positionY = (position && typeof position.y === 'number') ? position.y : this.props.position.y;
    const width = (size && typeof size.width === 'number') ? size.width : this.props.size.width;
    const height = (size && typeof size.height === 'number') ? size.height : this.props.size.height;
    const containerStyleProps = (containerStyle && typeof containerStyle === 'object') ? 
      containerStyle : this.props.containerStyle;

    const fadeInDurationProps = (typeof fadeInDuration === 'number') ? 
      fadeInDuration : this.props.fadeInDuration;
    const visibleDurationProps = (typeof visibleDuration === 'number') ?
      visibleDuration : this.props.visibleDuration;

    this.setState({
      positionX: positionX,
      positionY: positionY,
      width: width,
      height: height,
      childComponent: childComponentProps,
      containerStyle: containerStyleProps,
    }, () => {
      Animated.timing(
        this.animatedValue,
        {
          toValue: 1,
          duration: fadeInDurationProps,
        }
      ).start(() => {
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
          this.hide(fadeOutDuration);
        }, visibleDurationProps);
      });
    });
  }
  
  hide(fadeOutDuration = this.props.fadeOutDuration) {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: fadeOutDuration,
      }
    ).start();
  }

  renderMessage(
    message = this.props.message,
    messageContainerStyle = this.props.messageContainerStyle,
    messageTextStyle = this.props.messageTextStyle,
  ) {
    return (
      <View style={messageContainerStyle}>
        <Text style={messageTextStyle}>
          {message}
        </Text>
      </View>
    );
  }
  
  render() {
    const {      
      deviceWidth,
      deviceHeight,
    } = this.props;
    const {
      positionX, 
      positionY,
      width,
      height,
      childComponent,
      containerStyle,
    } = this.state;

    const top = (positionX) * (deviceHeight / DIVIDER_LINE);
    const left = (positionY * (deviceWidth / DIVIDER_LINE)) - (width / 2);
    const right = ((DIVIDER_LINE - positionY) * (deviceWidth / DIVIDER_LINE)) + (width / 2);

    const positionStyle = {
      position: 'absolute',
      top: top,
      left: left,
      right: right,      
    };
    const toastStyle = [positionStyle, containerStyle];

    return (
      <Animated.View
        style={[
          toastStyle,
          {
            width: width,
            height: height,
            opacity: this.animatedValue,
          },
        ]}
      >
        {childComponent}
      </Animated.View>
    );
  }
}

Toast.propTypes = {
  position: PropTypes.object,
  size: PropTypes.object,
  containerStyle: PropTypes.any,
  message: PropTypes.string,
  deviceWidth: PropTypes.number,
  deviceHeight: PropTypes.number,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  visibleDuration: PropTypes.number,
};

Toast.defaultProps = {
  position: {
    x: DIVIDER_LINE / 2,
    y: DIVIDER_LINE / 2,
  },
  size: {
    width: 100,
    height: 30,
  },
  containerStyle: {
    justifyContent:  'center',
    alignItems: 'center',
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  messageContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTextStyle: {
    marginTop: 7,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  },
  message: 'hello!',  
  deviceWidth: DEVICE_WIDTH,
  deviceHeight: DEVICE_HEIGHT,
  fadeInDuration: 500,
  fadeOutDuration: 500,
  visibleDuration: 2000,
};