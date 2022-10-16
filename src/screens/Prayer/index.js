import React, { Component } from 'react'
import { View, Text, Alert, StatusBar,Image, ImageBackground } from 'react-native'
import colors from './../../assets/colors'
import st from './../../assets/styles'
import moment from 'moment'
import Geocoder from 'react-native-geocoding'

import * as locationService from './../../services/location'
import * as calendarService from './../../services/calendar'
import { SliderBox } from "react-native-image-slider-box";
import Carousel from 'react-native-snap-carousel';

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Spinner,
} from 'native-base'

import ArchHeader from './../../components/ArchHeader'
import ArchHero from './../../components/ArchHero'

class Prayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isListLoading: false,
      nowDate: moment().format('DD MMMM YYYY'),
      timings: {},
      cityName: '',
      date:'',
      hijridate:'',
      hijrimonth:'',
      fixDate:'',
      nextprayer:'',
      nexttime:'',
      images: [
        {
          title:"Item 1",
          text: "Text 1",
          img: require('../../assets/quran-verses.png')
      },
      {
          title:"Item 2",
          text: "Text 2",
          img: require('../../assets/quranic-ayah-min.png')
      },
      ]
    }
  }

  getDate = () => {
    // console.log('request send')
    // let formdata = new FormData()
    // fetch('https://api.quran.com/api/v4/chapters?language=en', {
    //     method: 'GET',
    // })
    //     .then((response) => response.json())

    //     .then((responsejosn) => {
    //         console.log('Response',responsejosn)
    //     })
}

  getNextTime = () => {
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current Minutes
    var sec = new Date().getSeconds();
    console.log(hours)
    console.log(min)
    console.log(sec)
    var startTime = moment()
        .utcOffset('+05:30')
        .format('HH:mm a');
        console.log('time',startTime)
    var startTime1 = moment(startTime, "HH:mm a");
    var Fajr = moment(this.state.timings.Fajr, "HH:mm a");
    var Dhuhr = moment(this.state.timings.Dhuhr, "HH:mm a");
    var Asr = moment(this.state.timings.Asr, "HH:mm a");
    var Maghrib = moment(this.state.timings.Maghrib, "HH:mm a");
    var Isha = moment(this.state.timings.Isha, "HH:mm a");
    console.log('startTime',startTime1)
    console.log('Fajr',Fajr)
    console.log('Dhuhr',Dhuhr)
    console.log('Asr',Asr)

    if (startTime1.isAfter(Fajr)){
      this.setState({nextprayer:'Dhuhr',nexttime:this.state.timings.Dhuhr})
      } 
    else if (startTime1.isAfter(Dhuhr)){
      this.setState({nextprayer:'Asr',nexttime:this.state.timings.Asr})
    }
    else if (startTime1.isAfter(Asr)){
      this.setState({nextprayer:'Maghrib',nexttime:this.state.timings.Maghrib})
    }
    else if (startTime1.isAfter(Maghrib)){
      this.setState({nextprayer:'Isha',nexttime:this.state.timings.Isha})
    }
    else if (startTime1.isAfter(Isha)){
      this.setState({nextprayer:'Fajr',nexttime:this.state.timings.Fajr})
    }
  }

  componentDidMount() {
    this.getDate();
    this.getNextTime()
    var date = moment()
                  .utcOffset('+05:30')
                  .format('ddd,DD,MMM');
                  console.log('date',date)
                  this.setState({date:date})
    var Date = moment()
                  .utcOffset('+05:30')
                  .format('DD-MM-YYYY');
                  console.log('date',Date)
      fetch(`http://api.aladhan.com/v1/gToH?date=${Date}`, {
        method: 'GET',
    })
        .then((response) => response.json())

        .then((responsejosn) => {
            console.log('response',responsejosn.data.hijri.month.en)
            this.setState({hijridate:responsejosn.data.hijri.day})
            this.setState({hijrimonth:responsejosn.data.hijri.month.en})
            console.log('Hijri',this.state.hijridate)
        })
                locationService.requestLocationPermission(isGranted => {
      if (isGranted) {
        this.setState({ isLoading: true })
        locationService.getLocation(coords => {
          if (coords != null) {
            this.getCity(coords.latitude, coords.longitude)
            this.getPrayerTimes(coords.latitude, coords.longitude)
          }
        })
      }
    })
  }

  getCity = (lat, long) => {
    Geocoder.from(lat, long).then(res => {
      let addressComponent = res.results[0].address_components[4]
      this.setState({
        cityName: addressComponent.long_name
      })
    }).catch(error => {
      console.log(error)
    })
  }
  getPrayerTimes = (lat, long) => {
    this.setState({ isListLoading: true })
    calendarService.getPrayerTimes(null, lat, long).then(res => {
      const response = res.data
      if (response.code === 200) {
        this.setState({
          timings: response.data.timings,
          isListLoading: false
        })
        this.getNextTime()
      } else {
        Alert.alert('Error', response.status)
      }

      this.setState({ isLoading: false, isListLoading: false })
    }).catch(error => {
      if (!error.status) {
        Alert.alert('Error', 'Network Error')
      }

      this.setState({ isLoading: false, isListLoading: false})
    })
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={{
        // backgroundColor:'floralwhite',
        borderRadius: 5,
        height: 220,
        // padding: 50,
        width:'100%',
        // marginLeft: 15,
        marginRight: -5,
         }}>
         <Image
         source={item.img}
           style={{
             height:200,
             width:'100%'
           }}
         />
    </View>
    );
}

  render() {
    const getTiming = (name, time) => {
      if (!this.state.isListLoading) {
        return (
          <ListItem icon noBorder style={{ marginTop: 5, marginBottom: 10 }}>
            <Left style={{ borderLeftWidth: 3, borderLeftColor: colors.backgroundColor }} />
            <Body>
              <Text style={[st.txtBoldLarge, { color: '#000'}]}>{name}</Text>
            </Body>
            <Right>
              <View style={{ width: 100, alignItems: 'flex-end' }}>
                <Text style={[st.txtBoldLarge, { color: '#000'}]}>{time}</Text>
              </View>
            </Right>
          </ListItem>
        )
      } else {
        return <View />
      }
    }

    return (
      <Container style={{ backgroundColor: '#1aae72'}}>
       <StatusBar translucent backgroundColor="transparent" />
        <View
        style={{
          height:'50%',
          width:'100%',
          // backgroundColor:'#ada'
        }}
        >
          <ImageBackground
          source={require('../../assets/BG123.png')}
            style={{
              height:'100%',
              width:'100%',
            }}
          >
          <ImageBackground
          source={require('../../assets/123.png')}
            style={{
              height:'100%',
              width:'100%',
              // marginTop:-320
            }}
          >
          <View
          style={{
            height:'15%',
            width:'100%',
            alignItems:'center',
            // justifyContent:'center',
            flexDirection:'row',
            marginTop:30
          }}
          >
          <View
          style={{
            height:'100%',
            width:'20%',
            alignItems:'center',
            justifyContent:'flex-end',
            // backgroundColor:'#ada'
          }}
          >
            <Image
            source={require('../../assets/icon.png')}
            style={{
              height:'60%',
              width:'60%',
              resizeMode:'contain'
              // marginTop:-320
            }}
            />
          </View>
          <View
          style={{
            height:'100%',
            width:'60%',
            alignItems:'center',
            justifyContent:'flex-end',
            // backgroundColor:'#ada'
          }}
          >
            <Text style={{fontSize:20,color:'#fff'}}>{this.state.date}</Text>
            <View 
            style={{
              flexDirection:'row'
            }}
            >
            <Text style={{fontSize:13,color:'#fff'}}>{this.state.hijridate}</Text>
            <Text style={{fontSize:13,color:'#fff'}}> {this.state.hijrimonth}</Text>
            </View>
          </View>
          </View>
          <View
          style={{
            height:'60%',
            width:'100%',
            // backgroundColor:'#fff',
            alignItems:'center',
            justifyContent:'flex-end'
          }}
          >
            <Text style={{color:'#fff',fontSize:15}}>Next Prayer {this.state.nextprayer}</Text>
            <Text style={{color:'#fff',fontSize:60}}>{this.state.nexttime}</Text>
          </View>
          </ImageBackground>
          </ImageBackground>
        </View>
        <Content style={{ backgroundColor: '#fff' }}>
          {/* <ArchHero for='prayer' currentDate={this.state.nowDate} timings={this.state.timings} /> */}
          <Content>
  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.images}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>
            <View style={{ marginVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[st.txtBoldLarge, { color: '#000'}]}>{this.state.date}</Text>
              <View 
            style={{
              flexDirection:'row'
            }}
            >
            <Text style={{fontSize:13,color:'#000'}}>{this.state.hijridate}</Text>
            <Text style={{fontSize:13,color:'#000'}}> {this.state.hijrimonth}</Text>
            </View>
            </View>
            {this.state.isListLoading ? <Spinner color='white' /> : (
              <List>
                {getTiming('Fajr', this.state.timings.Fajr)}
                {getTiming('Sunrise', this.state.timings.Sunrise)}
                {getTiming('Dhuhr', this.state.timings.Dhuhr)}
                {getTiming('Asr', this.state.timings.Asr)}
                {getTiming('Maghrib', this.state.timings.Maghrib)}
                {getTiming('Isha', this.state.timings.Isha)}
                {getTiming('Imsak', this.state.timings.Imsak)}
              </List>
            )}
          </Content>
        </Content>
      </Container>
    );
  }
}

export default Prayer