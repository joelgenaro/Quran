/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export class Dua extends Component {
  state = {
    verticalData: [
      // {
      //   email: 'study@g.com study@g.com study@g.com study@g.com study@g.com',
      //   name: 'After Prayers',
      //   time: '12:00 PM',
      //   img: require('../../assets/Dua/AfterprayersDua.jpg'),
      //   clr: '#faf',
      // },
      // {
      //   email: 'new@g.com',
      //   name: 'Daily Dhikr',
      //   time: '01:00 AM',
      //   img: require('../../assets/Dua/DailyDhikrDua.jpg'),
      //   clr: '#f22',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Faith ',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/Faithdua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Family',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/FamilyDua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Garment',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/Garmentdua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Health',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/Healthdua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Home Entering and Leaving',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/HomeEnteringandLeavingdua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Knowledge',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/Knowledgedua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Mosque Entering',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/MosqueEnteringDua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Mosque Exiting',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/MosqueExitingDua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Sleeping',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/Sleepingdua.jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'Toilet Entering',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/ToiletDu(Entering).jpg'),
      //   clr: '#aaf',
      // },
      // {
      //   email: 'Monday@g.com',
      //   name: 'toilet leaving',
      //   time: '12:46 AM',
      //   img: require('../../assets/Dua/toiletdua(leaving).jpg'),
      //   clr: '#aaf',
      // },
    ],

    cart: [],
    selected: 'First',

    refreshing: false,
  };

  componentDidMount() {
    fetch("https://islamiapp.herokuapp.com/api/duas")
        .then(res => res.json())
        .then(response => {
            this.setState({
              verticalData: response.apiData,
                fetched: true
            })
            console.log(response)
        })
}

  // Vertical
  renderItemDesign = (item, index) => (
    <TouchableOpacity
      delayPressIn={0}
      onPress={() => this.navToShow(item)}
      // onPress={() => {
      //   this.removeByIndex(item);
      // }}
    //   onPress={() => {
    //     this.add(item);
    //   }}
      style={{
        backgroundColor: '#fff',
        height: h('7%'),
        marginBottom: h('1%'),
        // alignItems: 'center',
        // justifyContent: 'center',
        borderWidth: h('0.1'),
        borderColor: '#0004',
        borderRadius: h('1'),
        flexDirection: 'row',
      }}>
      {/* Center view */}
      <View
        style={{
          height: '100%',
          width: '100%',
          // backgroundColor: '#aaf',
          justifyContent: 'center',
          marginLeft:h('3')
        //   alignItems:'center'
        }}>
        <Text
          style={{
            color: '#0009',
            fontSize: h('2.7%'),
          }}>
          {item.nameOfDua}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // navigate to show screen
  navToShow = (item) => {
    this.props.navigation.navigate('ShowItem', {
      navProps: item,
    });
  };


  refresh = () => {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false}, () => {
        console.warn('All done');
      });
    }, 3000);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <SafeAreaView />
        <LinearGradient colors={['#02967c', '#049e6a', '#06a558']} 
            style={{
            height:h('12%'),
            width:'100%',
            // backgroundColor:'#00918A',
            alignItems:'center',
            justifyContent:'flex-end'
        }}
        >
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:20,marginBottom:h('2%')}}>
                Duas
            </Text>
            </LinearGradient>
        <View
          style={{
            margin: h('1%'),
            flex: 1,
          }}>
          <FlatList
            data={this.state.verticalData}
            renderItem={({item, index}) => this.renderItemDesign(item, index)}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            onRefresh={() => this.refresh()}
          />
        </View>
      </View>
    );
  }
}
