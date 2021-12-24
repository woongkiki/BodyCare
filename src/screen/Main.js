import React, {useState, useEffect} from 'react';
import { extendTheme, NativeBaseProvider, Container, Text, View, Box, Image } from 'native-base';
import { TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Platform, Alert, PermissionsAndroid } from 'react-native';
import Theme from '../common/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import Intro from './Intro';
import Home from './Home';
import Partners from './Partners';
import Trainers from './Trainers';
import PartnersView from './PartnersView';
import PartnersReviewUpdate from './PartnersReviewUpdate';
import TrainersView from './TrainersView';
import TrainersReviewUpdate from './TrainersReviewUpdate';
import Mypage from './Mypage';
import MypageInfo from './MypageInfo';
import MypageInfos from './MypageInfos';
import DefaultLogin from './DefaultLogin';
import PartnersLogin from './PartnersLogin';
import TrainersLogin from './TrainersLogin';
import IdLost from './IdLost';
import IdLostResult from './IdLostResult';
import PasswordLost from './PasswordLost';
import PasswordChange from './PasswordChange';
import Register from './Register';
import RegisterMyInfo from './RegisterMyInfo';
import WishArea from './WishArea';
import WishArea2 from './WishArea2';
import WishArea3 from './WishArea3';
import WishAreaInsert1 from './WishAreaInsert1';
import WishAreaInsert2 from './WishAreaInsert2';
import WishAreaInsert3 from './WishAreaInsert3';
import ExercisePurpose from './ExercisePurpose';
import ExercisePurposeInsert from './ExercisePurposeInsert';
import WishExerciseType from './WishExerciseType';
import WishExerciseTypeInsert from './WishExerciseTypeInsert';
import Inquiry from './Inquiry';
import Content from './Content';
import PrivacyPolicy from './PrivacyPolicy';
import TermsContent from './TermsContent';
import Menual from './Menual';
import Faq from './Faq';
import NoticeEvent from './NoticeEvent';
import NoticeView from './NoticeView';
import EventView from './EventView';
import Shop from './Shop';
import ShopView from './ShopView';
import ShopSearch from './ShopSearch';
import ItmeUseForm from './ItmeUseForm';
import Cart from './Cart';
import OnlinePt from './OnlinePt';
import OnlinePtCategory from './OnlinePtCategory';
import OnlinePtView from './OnlinePtView';
import Map from './Map';
import Maps from './Maps';
import MapSetting from './MapSetting';
import ImageDetails from './ImageDetails';
import Search from './Search';
import OrderForm from './OrderForm';
import OrderEnd from './OrderEnd';
import UserStatus from './UserStatus';

import Font from '../common/Font';
import Toast from 'react-native-toast-message';




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const tabBarWidth = screenWidth / 4;

const theme = extendTheme({ Theme });

/* 바텀 탭바 커스텀 */
function CustomTabBar(props){

   const {state, descriptors, navigation} = props;
   
   //const focusedOptions = descriptors[state.routes[state.index].key];

   const screenName = state.routes[state.index].name;

   //console.log(state);


   


    const navigateToHome=()=>{
        props.navigation.navigate('Home');
    }

    const navigateToParteners=()=>{
        props.navigation.navigate('Partners');
    }

    const navigateToTrainers=()=>{
        props.navigation.navigate('Trainers');
    }

    const navigateToOnlinePt = () => {
        props.navigation.navigate('Shop');
    }

    return(
        <View style={styles.TabBarMainContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={navigateToHome} style={styles.button}>
                {
                    screenName === 'Home' ?
                    <>
                        <Image source={require('../images/homeIconBigOn.png')} alt='tabon' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#CA0D3C', marginTop:5,fontSize:14 , fontFamily:Font.RobotoMedium}}>
                            홈
                        </Text>
                    </>
                    :
                    <>
                        <Image source={require('../images/homeIconBig.png')} alt='taboff' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#333', marginTop:5,fontSize:14 , fontFamily:Font.RobotoMedium}}>
                            홈
                        </Text>
                    </>
                }
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={navigateToParteners} style={styles.button}>
                {
                    screenName === 'Partners' ?
                    <>
                        <Image source={require('../images/partnersBigImageOn.png')} alt='tabon' style={{height:17, resizeMode:'contain'}} />
                        <Text style={{color:'#CA0D3C', marginTop:5, fontSize:14 ,fontFamily:Font.RobotoMedium}}>
                            시설
                        </Text>
                    </>
                    :
                    <>
                        <Image source={require('../images/partnersBigImage.png')} alt='tabon' style={{height:17, resizeMode:'contain'}} />
                        <Text style={{color:'#333', marginTop:5, fontSize:14 , fontFamily:Font.RobotoMedium}}>
                            시설
                        </Text>
                    </>
                }
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={navigateToTrainers} style={styles.button}>
                {
                    screenName === 'Trainers' ?
                    <>
                        <Image source={require('../images/trainerBigImageOn.png')} alt='tabon' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#CA0D3C', marginTop:5, fontSize:14 , fontFamily:Font.RobotoMedium}}>
                            트레이너
                        </Text>
                    </>
                    :
                    <>
                        <Image source={require('../images/trainerBigImage.png')} alt='tabon' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#333', marginTop:5,fontSize:14 , fontFamily:Font.RobotoMedium}}>
                            트레이너
                        </Text>
                    </>
                }
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={navigateToOnlinePt} style={styles.button}>
            {
                    screenName === 'Shop' ?
                    <>
                        {/* <Image source={require('../images/newtab04_onRed.png')} alt='tabon' /> */}
                        <Image source={require('../images/shopIconBigOn.png')} alt='쇼핑몰' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#CA0D3C', marginTop:5, fontSize:14 ,fontFamily:Font.RobotoMedium}}>
                            쇼핑몰
                        </Text>
                    </>
                    :
                    <>
                        {/* <Image source={require('../images/newtab04_off.png')} alt='tabon' /> */}
                        <Image source={require('../images/shopIconBig.png')} alt='쇼핑몰' style={{height:21, resizeMode:'contain'}} />
                        <Text style={{color:'#333', marginTop:5, fontSize:14 ,fontFamily:Font.RobotoMedium}}>
                            쇼핑몰
                        </Text>
                    </>
                }
            </TouchableOpacity>
        </View>
    )

}

function Tab_Navigation(props){

    return(
        <Tab.Navigator initialRouteName={Home} tabBar={ (props) => <CustomTabBar {...props} /> }>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Partners" component={Partners} />
            <Tab.Screen name="Trainers" component={Trainers} />
            <Tab.Screen name="Shop" component={Shop} />
        </Tab.Navigator>
    )
}

const Main = (props) => {


async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}



    //푸시 메세지 제어
  useEffect(async() => {


    await requestUserPermission();
    //await meesageChanges();

    
  }, []);

  


    const toastConfig = {
        custom_type: (internalState) => (
          <View
            style={{
              backgroundColor: '#000000e0',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              opacity: 0.8,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 15,
                lineHeight: 22,
                fontFamily: Font.NotoRegular,
                letterSpacing: -0.38,
              }}
            >
              {internalState.text1}
            </Text>
          </View>
        ),
      };

      
    //   if(Platform.OS==='android'){
    //      StatusBar.setTranslucent(false)
    //      StatusBar.setBackgroundColor("#fff")
    //   }
    //   StatusBar.setBarStyle("dark-content");


    return (
        <Provider store={store}>
            <PaperProvider>
                <NativeBaseProvider theme={theme}>  
                    <NavigationContainer>
                     
                        <SafeAreaView style={{flex:1}}>
                            <Stack.Navigator
                                initialRouteName="Intro"
                                screenOptions={{
                                    headerShown:false,
                                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                    
                                }}
                                
                            
                            >
                                <Stack.Screen name="Intro" component={Intro} />
                                <Stack.Screen name="Tab_Navigation" component={Tab_Navigation}/>
                                <Stack.Screen name="OnlinePt" component={OnlinePt}/>
                                <Stack.Screen name="PartnersView" component={PartnersView}/>
                                <Stack.Screen name="PartnersReviewUpdate" component={PartnersReviewUpdate} />
                                <Stack.Screen name="TrainersView" component={TrainersView} />
                                <Stack.Screen name="TrainersReviewUpdate" component={TrainersReviewUpdate} />
                                <Stack.Screen name="Mypage" component={Mypage} />
                                <Stack.Screen name="MypageInfo" component={MypageInfo}/>
                                <Stack.Screen name="MypageInfos" component={MypageInfos}/>
                                <Stack.Screen name="DefaultLogin" component={DefaultLogin} />
                                <Stack.Screen name="PartnersLogin" component={PartnersLogin} />
                                <Stack.Screen name="TrainersLogin" component={TrainersLogin} />
                                <Stack.Screen name="IdLost" component={IdLost} />
                                <Stack.Screen name="IdLostResult" component={IdLostResult} />
                                <Stack.Screen name="PasswordLost" component={PasswordLost} />
                                <Stack.Screen name="PasswordChange" component={PasswordChange} />
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="RegisterMyInfo" component={RegisterMyInfo} />
                                <Stack.Screen name="WishArea" component={WishArea} />
                                <Stack.Screen name="WishArea2" component={WishArea2} />
                                <Stack.Screen name="WishArea3" component={WishArea3} />
                                <Stack.Screen name="WishAreaInsert1" component={WishAreaInsert1} />
                                <Stack.Screen name="WishAreaInsert2" component={WishAreaInsert2} />
                                <Stack.Screen name="WishAreaInsert3" component={WishAreaInsert3} />
                                <Stack.Screen name="ExercisePurpose" component={ExercisePurpose} />
                                <Stack.Screen name="ExercisePurposeInsert" component={ExercisePurposeInsert} />
                                <Stack.Screen name="WishExerciseType" component={WishExerciseType} />
                                <Stack.Screen name="WishExerciseTypeInsert" component={WishExerciseTypeInsert} />
                                <Stack.Screen name="Inquiry" component={Inquiry} />
                                <Stack.Screen name="Content" component={Content} />
                                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                                <Stack.Screen name="TermsContent" component={TermsContent} />
                                <Stack.Screen name="Menual" component={Menual} />
                                <Stack.Screen name="Faq" component={Faq} />
                                <Stack.Screen name="NoticeEvent" component={NoticeEvent} />
                                <Stack.Screen name="NoticeView" component={NoticeView} />
                                <Stack.Screen name="EventView" component={EventView} />
                                <Stack.Screen name="Shop" component={Shop} />
                                <Stack.Screen name="ShopView" component={ShopView} />
                                <Stack.Screen name="ShopSearch" component={ShopSearch} />
                                <Stack.Screen name="ItmeUseForm" component={ItmeUseForm} />
                                <Stack.Screen name="Cart" component={Cart} />
                                <Stack.Screen name="OnlinePtCategory" component={OnlinePtCategory} />
                                <Stack.Screen name="OnlinePtView" component={OnlinePtView} />
                                <Stack.Screen name="Map" component={Map} />
                                <Stack.Screen name="Maps" component={Maps} />
                                <Stack.Screen name="MapSetting" component={MapSetting} />
                                <Stack.Screen name="ImageDetails" component={ImageDetails} />
                                <Stack.Screen name="Search" component={Search} />
                                <Stack.Screen name="OrderForm" component={OrderForm} />
                                <Stack.Screen name="OrderEnd" component={OrderEnd} />

                                <Stack.Screen name="UserStatus" component={UserStatus} />

                            </Stack.Navigator>
                        </SafeAreaView>
                        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />    
                    </NavigationContainer>
                    
                </NativeBaseProvider>   
              
            </PaperProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    TabBarMainContainer: {
        justifyContent:'space-between',
        height: 60,
        flexDirection:'row',
        width:'100%',
        
      },
      button:{
        width:tabBarWidth,
        height: 60,
        justifyContent:'center',
        backgroundColor:'#fff',
        alignItems:'center',
        flexGrow:1,
        borderTopWidth:1,
        borderTopColor:'#e3e3e3'
      },
      TextStyle:{
        color:'#fff',
        textAlign:'center',
        fontSize:20,
      }
})

export default Main;