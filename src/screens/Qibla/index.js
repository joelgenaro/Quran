import React, { Component } from 'react'
import colors from './../../assets/colors'

import {
  Container,
  Content,
} from 'native-base'

import ArchHeader from './../../components/ArchHeader'
import { View, Text, Alert, StatusBar,Image, ImageBackground, StyleSheet } from 'react-native'
import moment from 'moment'
import CompassHeading from 'react-native-compass-heading';
import Geocoder from 'react-native-geocoding'
import * as locationService from './../../services/location'
import * as calendarService from './../../services/calendar'

class Qibla extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      date:'',
      compassHeading:0,
      hijridate:'',
      hijrimonth:'',
      fixDate:'',
      nextprayer:'',
      nexttime:'',
      nowDate: moment().format('DD MMMM YYYY'),
      timings: {},
      cityName: '',
    }
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


  getDate = () => {
    console.log('request send')
    let formdata = new FormData()
    // formdata.append('number', number)
    formdata.append('number', this.state.profile.phone)
    // formdata.append('request', 'sms')
    fetch(' http://api.aladhan.com/v1/gToH', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        body: formdata
    })
        .then((response) => response.json())

        .then((responsejosn) => {
            console.log('response',responsejosn)
        })
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

  componentDidMount(){
    this.getNextTime()
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
    var date = moment()
    .utcOffset('+05:30')
    .format('ddd,DD,MMM');
    console.log('date1',date)
    this.setState({date:date})
    const degree_update_rate = 3;
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

    CompassHeading.start(degree_update_rate, degree => {
      // setCompassHeading(degree);
      this.setState({compassHeading:degree});
    });
    return () => {
      CompassHeading.stop();
    };
  }

  render() {
    return (
      <Container>
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
        <Image
      style={[
        styles.image,
        {transform: [{rotate: `${360 - this.state.compassHeading}deg`}]},
      ]}
      resizeMode="contain"
      source={require('../../assets/qibla.png')}
    />
        {/* <ArchHeader title="Qibla Direction" isLoading={this.state.isLoading} /> */}
        <Content style={{ backgroundColor: colors.backgroundColor }}>
          
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    // marginTop:50,
    width: '50%',
    height:'50%',
    resizeMode:'contain',
    // flex: 1,
    alignSelf: 'center',
  },
});

export default Qibla
