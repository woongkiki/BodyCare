import React, {useEffect} from 'react';
import { VStack, HStack, Image, Box } from 'native-base';
import { TouchableOpacity, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { StackActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const HeaderMain = (props) => {

    const {navigation, userInfo} = props;

    //console.log('디바이스 확인::', Platform.OS);

    if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

    useEffect(() => {
   
          messaging().onMessage((remoteMessage) => {
            Toast.show({
              type: 'info', //success | error | info
              position: 'top',
              text1: remoteMessage.notification.title,
              text2: remoteMessage.notification.body,
              visibilityTime: 3000,
             // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
              topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
              style: { backgroundColor: 'red' },
              bottomOffset: 100,
              onShow: () => {},
              onHide: () => {},
              onPress: () => {
                if (remoteMessage.data.intent === 'NoticeView') {
                  navigation.navigate('NoticeView', {
                    wr_id: remoteMessage.data.content_idx,
                    
                  });
                  Toast.hide();
                }else if(remoteMessage.data.intent === 'EventView'){
                    navigation.navigate('EventView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                    Toast.hide();
                }else if(remoteMessage.data.intent === 'PartnersView'){
                    navigation.navigate('PartnersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                    Toast.hide();
                }else if(remoteMessage.data.intent === 'TrainersView'){
                    navigation.navigate('TrainersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                    Toast.hide();
                }else if(remoteMessage.data.intent === 'ShopView'){
                    navigation.navigate('ShopView', {
                        it_id: remoteMessage.data.content_idx,
                        
                    });
                    Toast.hide();
                }
              },
            });
            console.log('실행중 메시지:::',remoteMessage)

          });
          // 포그라운드
          messaging().onNotificationOpenedApp((remoteMessage) => {
            // console.log('onNotificationOpenedApp', remoteMessage);
            if (remoteMessage.data !== null) {
                console.log('포그라운드 메시지:::',remoteMessage)
                if (remoteMessage.data.intent === 'NoticeView') {
                    navigation.navigate('NoticeView', {
                      wr_id: remoteMessage.data.content_idx,
                      
                    });
     
                }else if(remoteMessage.data.intent === 'EventView'){
                    navigation.navigate('EventView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'PartnersView'){
                    navigation.navigate('PartnersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'TrainersView'){
                    navigation.navigate('TrainersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'ShopView'){
                    navigation.navigate('ShopView', {
                        it_id: remoteMessage.data.content_idx,
                        
                    });
                }
                
               
            }
          });
          // 백그라운드
          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
              // console.log('getInitialNotification', remoteMessage);
              console.log('백그라운드 메시지:::',remoteMessage)
              if (remoteMessage?.data !== null) {
                if (remoteMessage.data.intent === 'NoticeView') {
                    navigation.navigate('NoticeView', {
                      wr_id: remoteMessage.data.content_idx,
                      
                    });
                }else if(remoteMessage.data.intent === 'EventView'){
                    navigation.navigate('EventView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'PartnersView'){
                    navigation.navigate('PartnersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'TrainersView'){
                    navigation.navigate('TrainersView', {
                        wr_id: remoteMessage.data.content_idx,
                        
                    });
                }else if(remoteMessage.data.intent === 'ShopView'){
                    navigation.navigate('ShopView', {
                        it_id: remoteMessage.data.content_idx,
                        
                    });
                }
                

              }
            });
            //const unsubscribe = await dynamicLinks().onLink(handleDynamicLink);
            //return () => unsubscribe();
      
      }, []);

    return (
        <HStack py={2} px={5} alignItems='center' justifyContent='space-between' bg='#fff' borderBottomWidth={1} borderBottomColor='#F2F2F2'>
            <Image source={require('../images/appLogoNew12.png')} alt='BodyCare' />
            
            <HStack>
                <TouchableOpacity style={{marginRight:10}} onPress={()=>navigation.navigate('OnlinePt')}>
                    {/* <Image source={require('../images/cartIcon.png')} alt='쇼핑몰' /> */}
                    <Image source={require('../images/onlineIconNew12.png')} alt='tabon' style={{width:19, resizeMode:'contain'}} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:10}} onPress={()=>navigation.navigate('Search')}>
                    <Image source={require('../images/searchIconNew12.png')} alt='검색' />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Mypage')}>
                    <Image source={require('../images/mypageIconNew12.png')} alt='마이페이지' />
                </TouchableOpacity>
            </HStack>
        </HStack>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(HeaderMain);