import React, { Component } from 'react'
import { View, Image, TouchableHighlight, Text, StyleSheet } from 'react-native'
import {
  Card,
  CardItem,
  Title,
} from 'native-base'
import st from './../assets/styles'
import colors from './../assets/colors'

class ArchMenuButton extends Component {
  getIcon = (icon) => {
    switch(icon) {
      case "broadcast":
        return <Image source={require('./../assets/images/icons/live-streaming.png')} resizeMode={'contain'} style={style.icon} />;
      break;
      case "prayer":
        return <Image source={require('./../assets/images/icons/praying-mat.png')} resizeMode={'contain'} style={style.icon} />;
      break;
      case "qibla":
        return <Image source={require('./../assets/images/icons/kaaba.png')} resizeMode={'contain'} style={style.icon} />;
      break;
      case "masjid":
        return <Image source={require('./../assets/images/icons/mosque.png')} resizeMode={'contain'}  style={style.icon} />;
      break;
      case "quran":
        return <Image source={require('./../assets/images/icons/quran.png')} resizeMode={'contain'} style={style.icon} />;
      break;
      default:
        return <Image source={require('./../assets/images/icons/event.png')} resizeMode={'contain'} style={style.icon} />;
    }
  }

  getText = (icon) => {
    switch(icon) {
      case "broadcast":
        return 'Broadcasting';
      break;
      case "prayer":
        return 'Prayer Schedule';
      break;
      case "qibla":
        return 'Qibla Direction';
      break;
      case "masjid":
        return 'Masjid Finder';
      break;
      case "quran":
        return 'Quran';
      break;
      default:
        return 'Events';
    }
  }

  render() {
    return (
      <TouchableHighlight
        style={style.highButton}
        onPress={() => this.props.onPress(this.props.icon)}
        underlayColor='transparent'
        backgroundColor='transparent'
      >
        <View style={{ flex: 1 }}>
          <View style={style.iconButton}>
            {this.getIcon(this.props.icon)}
          </View>
          <Text style={style.menuText} numberOfLines={1}>{this.getText(this.props.icon)}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const style = {
  highButton: {
    flex: 1,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0002',
    width:100,
    height:100,
    padding: 15,
    borderRadius:50,
    borderwidth:10
  },
  icon: {
    flex: 1,
    width: 45,
    height: undefined,
  },
  menuText: {
    alignSelf: 'center',
    fontSize: 15,
    marginTop: 10,
    color: '#1aae72'
  }
}

export default ArchMenuButton