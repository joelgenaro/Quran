import React, { Component } from 'react'
import { Text, Alert,TouchableOpacity,Image } from 'react-native'
import colors from './../../assets/colors'
import st from './../../assets/styles'

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Button,
  View,
  Spinner
} from 'native-base'

import ArchHeader from './../../components/ArchHeader'

import * as quranService from './../../services/quran'
import { FlatList } from 'react-native-gesture-handler'
import Sound from 'react-native-sound';

const audioTests = [
  {
    title: 'mp3 in bundle',
    url: 'https://download.quranicaudio.com/quran/abdullaah_basfar/001.mp3',
    basePath: Sound.MAIN_BUNDLE,
    img:'https://cdn.islamic.network/quran/images/2_1.png'
  },
];

function setTestState(testInfo, component, status) {
  component.setState({tests: {...component.state.tests, [testInfo.title]: status}});
}

/**
 * Generic play function for majority of tests
 */
function playSound(testInfo, component) {
  setTestState(testInfo, component, 'pending');

  const callback = (error, sound) => {
    if (error) {
      Alert.alert('error', error.message);
      setTestState(testInfo, component, 'fail');
      return;
    }
    setTestState(testInfo, component, 'playing');
    // Run optional pre-play callback
    testInfo.onPrepared && testInfo.onPrepared(sound, component);
    sound.play(() => {
      // Success counts as getting to the end
      setTestState(testInfo, component, 'win');
      // Release when it's done so we're not using up resources
      sound.release();
    });
  };

  // If the audio is a 'require' then the second parameter must be the callback.
  if (testInfo.isRequire) {
    const sound = new Sound(testInfo.url, error => callback(error, sound));
  } else {
    const sound = new Sound(testInfo.url, testInfo.basePath, error => callback(error, sound));
  }
}

class QuranDetail extends Component {
  constructor(props) {
    super(props);
    this.page = 0
    this.pageX = 0

    Sound.setCategory('Playback', true); // true = mixWithOthers

    // Special case for stopping
    this.stopSoundLooped = () => {
      console.log('Stop')
      if (!this.state.loopingSound) {
        return;
      }

      this.state.loopingSound.stop().release();
      this.setState({loopingSound: null, tests: {...this.state.tests, ['mp3 in bundle (looped)']: 'win'}});
    };


    this.state = {
      isLoading: false,
      isLoadingMore: false,
      stopLoadingMore: false,
      title: '',
      ayahs: [],
      surah: {},
      page: 0,
      surahNo:'1',
      play:false,
      loopingSound: undefined,
      tests: {},
    }
  }

  componentDidMount() {
    // console.log(this.props.route.params.surahNo)
    this.init((isSurah, surah, juz) => {
      if (isSurah) {
        this.getAyahsFromSurah(surah.number, false)
        var str = "" + surah.number
        var pad = "000"
        var ans = pad.substring(0, pad.length - str.length) + str
        console.log('Answer',ans)
        this.setState({surahNo:ans})
      } else {
        this.getAyahsFromJuz(juz, false)
      }
    })
  }

  init = (callback) => {
    const params = this.props.navigation.state.params
    console.log('PARAMS',params)
    this.setState({
      title: params.surah ? params.surah.englishName : 'Juz ' + params.juz,
      surah: params.surah,
      juz: params.juz,
    })

    callback(params.isSurah, params.surah, params.juz)
  }

  getAyahsFromJuz = (number, isLoadingMore) => {
    console.log('request send')
    // this.setState({ isLoading: true })
    let formdata = new FormData()
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${this.props.navigation.state.params.juz}`, {
        method: 'GET',
    })
        .then((response) => response.json())

        .then((responsejosn) => {
            console.log('Response',responsejosn)
            this.setState({ ayahs: responsejosn.verses})
            this.setState({ isLoading: false})
        })

    // if (isLoadingMore) { this.setState({ isLoadingMore: true}) } else { this.setState({ isLoading: true}) }

    // const offset = this.page
    // const pageX = this.pageX
    // const limit = 10
    // quranService.getAyahFromJuz(number, pageX, limit).then(res => {
    //   const ayahResult = res.data
      
    //   if (ayahResult.code === 200) {
    //     const ayahs = ayahResult.data.ayahs
        
    //     let ayahWithTranslations = []
    //       ayahs.map((ayah, index) => {
    //         let ayahWithTranslation = {}
    //         ayahWithTranslation.numberInSurah = ayah.number
    //         ayahWithTranslation.textArabic = ayah.text
    //         ayahWithTranslation.translation = ''
    //         ayahWithTranslations.push(ayahWithTranslation)
    //       })

    //       if (ayahWithTranslations.length === 0) this.setState({ stopLoadingMore: true })
    //       this.setState({ ayahs: [...this.state.ayahs, ...ayahWithTranslations] })
    //   } else {
    //     Alert.alert('Error', res.status)
    //   }

    //   this.setState({ isLoading: false})
    // })
  }

  getAyahsFromSurah = (number, isLoadingMore) => {
    // if (isLoadingMore) { this.setState({ isLoadingMore: true}) } else { this.setState({ isLoading: true}) }
    console.log('request send')
    // this.setState({ isLoading: true })
    let formdata = new FormData()
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${this.props.navigation.state.params.surah.id}`, {
        method: 'GET',
    })
        .then((response) => response.json())

        .then((responsejosn) => {
            console.log('Response',responsejosn)
            this.setState({ ayahs: responsejosn.verses})
            this.setState({ isLoading: false})
        })
    
    // const offset = this.page
    // const pageX = this.pageX
    // const limit = 10
    // quranService.getAyahFromSurahID(number, pageX, limit).then(res => {
    //   const ayahResult = res.data
    //   quranService.getTranslationFromSurah(number, pageX, limit).then(res => {
    //     const transResult = res.data

    //     if (transResult.code === 200) {
    //       let ayahs = ayahResult.data
    //       let translations = transResult.data.ayahs

    //       let ayahWithTranslations = []
    //       ayahs.map((ayah, index) => {
    //         let ayahWithTranslation = {}
    //         ayahWithTranslation.numberInSurah = ayah.aya_number
    //         ayahWithTranslation.textArabic = ayah.aya_text
    //         ayahWithTranslation.translation = translations[index].text
    //         ayahWithTranslations.push(ayahWithTranslation)
    //       })
          
    //       if (ayahWithTranslations.length === 0) this.setState({ stopLoadingMore: true })
    //       this.setState({ ayahs: [...this.state.ayahs, ...ayahWithTranslations] })
    //     } else {
    //       Alert.alert('Error', response.status)
    //     }

    //     this.setState({ isLoading: false, isLoadingMore: false})
    //   })
    // }).catch(error => {
    //   if (!error.status) {
    //     Alert.alert('Error', 'Network Error')
    //   }
      
    //   this.setState({ isLoading: false})
    // })
  }

  _handleLoadMore = () => {
    if (this.state.stopLoadingMore) {
      return null
    }

    this.page = this.page + 1
    this.pageX = this.pageX + 10
    this.setState({
      isLoadingMore: true,
    })
    
    this.init((isSurah, surah, juz) => {
      if (isSurah) {
        this.getAyahsFromSurah(surah.number, true)
      } else {
        this.getAyahsFromJuz(juz, true)
      }
    })
  }

  render() {
    const bismillah = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم'
    console.log('SuraNo',this.state.surahNo)
    const getFooter = () => {
      if (!this.state.isLoadingMore) return null

      return <Spinner color={colors.primaryColor} />
    }
    const audio = [
      {
        url: `https://download.quranicaudio.com/quran/abdullaah_basfar/${this.state.surahNo}.mp3`,
      },
    ]

    return (
      <Container>
        <ArchHeader title={this.state.title} isLoading={this.state.isLoading} />
        <View style={{ backgroundColor: colors.backgroundColor, marginTop: 10, width:'100%', height:'100%' }}>
          {this.state.surah && this.state.surah.number != 1 &&
            <View style={{
              flexDirection: 'column',
              padding: 10,
              alignItems: 'center',
              alignContent: 'center',
            }}>
              <Text style={st.txtArabicBold}>{bismillah}</Text>
            </View>
          }

          {(!(this.state.isLoadingMore && this.state.isLoading) && this.state.ayahs.length != 0) ? (
            <View style={{height:'100%',
            // backgroundColor:'#ada'
            }}
            >
            <View style={{height:'90%'}}>
            <FlatList
              data={this.state.ayahs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={{
                  flexDirection: 'row',
                  padding: 20,
                  alignItems: 'center',
                }}>
                  <View style={{ width: '10%' }}>
                    <Button transparent>
                      <Text style={{ color: colors.grey }}>{item.verse_key}</Text>
                    </Button>
                  </View>
                  <View style={{width: '90%'}}>
                    <Text style={st.txtArabicBold}>{item.text_uthmani}</Text>
                    <Text note>{item.translation}</Text>
                  </View>
                </View>
              )}
              // onEndReachedThreshold={0.4}
              // onEndReached={() => this._handleLoadMore()}
              // ListFooterComponent={() => getFooter()}
            />
            </View>
              <View
            style={{
              height:'10%',
              width:'100%',
              // backgroundColor:'#0003',
              marginTop:-200,
              alignItems:'flex-end'
            }}
            >
            {audio.map(testInfo => {
            return (
              <View
                style={{
                  height:'100%',
                  width:'50%',
                  // backgroundColor:'#ada',
                  alignItems:'center',
                  justifyContent:'center'
                }}
              >
              {this.state.play === false ? (
              <TouchableOpacity
              onPress={() => {
                this.setState({play:true},()=> {
                  return playSound(testInfo, this)
                  })
                }}
                style={{
                  height:'100%',
                  width:'50%',
                  // backgroundColor:'#ada',
                  alignItems:'center',
                  justifyContent:'center'
                }}
              >
                <Image style={{height:'200%',width:'100%'}} source={require('../../assets/play.png')}/>
              </TouchableOpacity>
              ) : 
              <TouchableOpacity
                onPress={this.stopSoundLooped}
                style={{
                  height:'100%',
                  width:'50%',
                  // backgroundColor:'#ada',
                  alignItems:'center',
                  justifyContent:'center'
                }}
              >
              {/* <Text>Hello</Text> */}
                <Image style={{height:'200%',width:'100%'}} source={require('../../assets/play.png')}/>
              </TouchableOpacity>
              }
              </View>
            );
          })}
            </View>
            </View>
          ) : (
            <Spinner color={colors.primaryColor} />
          )} 
        </View>
      </Container>
    );
  }
}

export default QuranDetail