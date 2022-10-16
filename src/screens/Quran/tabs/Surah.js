import React, { Component } from 'react'
import { Text, Alert } from 'react-native'
import st from './../../../assets/styles'
import colors from './../../../assets/colors'

import {
  Content,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Button
} from 'native-base'

class Surah extends Component {
  render() {
    const { isLoading, surahList } = this.props

    const getListOfSurah = () => {
      return surahList.map((surah, index) => (
        <ListItem icon key={index} onPress={() => this.props.goToSurah(surah)}>
          <Left>
            <Button transparent>
              <Text style={{ color: colors.grey }}>{surah.id}</Text>
            </Button>
          </Left>
          <Body>
            <Text style={st.txtBoldPrimary}>{surah.name_simple}</Text>
            {/* <Text note>{surah.englishNameTranslation}</Text> */}
          </Body>
          <Right>
            <Text style={st.txtArabicBoldPrimary}>{surah.name_arabic}</Text>
          </Right>
        </ListItem>
      ))
    }

    return (
      <Content style={{ backgroundColor: colors.backgroundColor }}>
        <List>
          {(!isLoading && surahList.length != 0) &&
            getListOfSurah()
          }
        </List>
      </Content>
    );
  }
}

export default Surah