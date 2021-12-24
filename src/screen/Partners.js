import React, {useState, useEffect} from 'react';
import { Box, Text, Image, HStack, VStack } from 'native-base';
import { TouchableOpacity, PermissionsAndroid, FlatList, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import HeaderSearch from '../components/HeaderSearch';
import PartnersList from '../components/PartnersList';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Geolocation from 'react-native-geolocation-service';
import {DefText} from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/dataFunction';
import Font from '../common/Font';

import messaging from '@react-native-firebase/messaging';
import Api from '../Api';

const {width} = Dimensions.get('window');
const imgSize = width * 0.4;


const Partners = ( props ) => {

    const {navigation, userInfo, route} = props;

    const [memberbId, setMemberId] = useState('');
    const [loginId, setLoginId] = useState('');

    useEffect(()=>{
        if(userInfo){
            setMemberId(userInfo.mb_id);
        }
    },[])

    useEffect(()=>{
        setLoginId(memberbId);
    },[memberbId])

    const [location, setLocation]= useState({latitude:0, longitude:0});

  //permission
  const permissionGeo = async() => {
      if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization('whenInUse');
          getGeoLocation();

      } else {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "위치정보 이용",
                message: "고객님의 위치정보를 활용해 주소를 확인합니다.",
                buttonPositive: "확인"
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getGeoLocation();
        } else {
            console.log("GPS permission denied") // permission denied
        }
      }
  }
  const getGeoLocation = async () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({
              latitude,
              longitude
          })
        },
        error => {
            console.log("err", error.code, error.message);
        },
        {showLocationDialog: true, enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
  }

  const requestUserPermission = async() => {
      permissionGeo();
  }

    const [partnersSchText, setPartnersSchText] = useState('');

    const [partnersInput, setPartnersInput] = useState('');
    const _partnersInputChange = (text) => {
      setPartnersInput(text);
    }
    const _partnersSchButton = () => {

        setPartnersSchText(partnersInput);
        //console.log('dd?',partnersSchText);
    }


    const [refreshing, setRefreshing] = useState(false);

    const [partnersLoading, setPartnersLoading] = useState(true);



    const [partnersRealData, setPartnersRealData] = useState([]);
    const partnersDataReceive = async () => {
        
            await Api.send('contents_partners', {'partnersSch':partnersSchText, 'nowlat':location.latitude, 'nowlon':location.longitude, 'loginId':loginId}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    console.log('결과 출력 파트너스 리스트 : ', resultItem);
                    
                    setPartnersRealData(arrItems);
                }else{
                    console.log('결과 출력 실패!');
                }
            });
            await setPartnersLoading(false);
    }


    const [mapMoveButton, setMapMoveButton] = useState(false);

    useEffect(()=>{
        requestUserPermission();
    },[])

    //console.log(location);


    useEffect(async()=>{
        if(location.latitude > 0 && location.longitude > 0){
            await setPartnersLoading(true);
            await partnersDataReceive();
            await setMapMoveButton(true);
        }
    },[location, partnersSchText, loginId])


    const refreshList = async () => {
        await setPartnersLoading(true);
        await partnersDataReceive();
    }


    function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) { 
        function deg2rad(deg) { 
            return deg * (Math.PI/180) 
        } 
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1); // deg2rad below
        var dLon = deg2rad(lng2-lng1); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km 
        return d; 
    }


    const _renderItem = ({item, index}) => {

        const wr_6s = item.wr_6.split('|');

        const distance = getDistanceFromLatLonInKm(location.latitude, location.longitude, item.wr_8, item.wr_9);

        const distance_km = distance.toFixed(2); 
        //console.log(distance);

        return(
            <TouchableOpacity 
                style={[{paddingHorizontal:20, marginBottom:20}, index === 0 ? {marginTop:20} : {marginTop:0}]}
                onPress={()=>{navigation.navigate('PartnersView', item)}}
            >
                <HStack justifyContent='space-between'>
                    {
                        item.thumb ?
                        <Image
                            source={{uri:item.thumb}}
                            alt={item.wr_subject}
                            width={imgSize}
                            height={imgSize}
                            borderRadius={10}
                            overflow='hidden'
                            
                        />
                        :
                        <Image
                            source={require('../images/noImage.png')}
                            alt={item.wr_subject}
                            width={imgSize}
                            height={imgSize}
                            borderRadius={10}
                            overflow='hidden'
                            
                        />
                    }
                    
                    <VStack justifyContent='space-around'  width='52%'>
                        <Box>
                            {
                                item.wr_subject ? 
                                <DefText text={textLengthOverCut(item.wr_subject, 10)} style={{marginBottom:10, fontSize:16, fontFamily:Font.RobotoBold}} />
                                :
                                <DefText text='' />
                            }
                            {
                                wr_6s[1] ? 
                                <>
                                    <DefText text={textLengthOverCut(wr_6s[1], 15)} style={{color:'#666'}} />
                                    <DefText text={distance_km + 'km'} style={{color:'#666', marginTop:5,fontFamily:Font.RobotoMedium}}  />
                                </>
                                :
                                <DefText text=''  />
                            }
                        </Box>
                        {
                            item.wr_6b_r ? 
                            <DefText text={textLengthOverCut(item.wr_6b_r,16)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                            :
                            <DefText text='' />
                        }
                        
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }




    return (
        <Box flex={1} bg='#fff' >
            <HeaderSearch navigation={navigation} inputValue={partnersInput} inputChnage={_partnersInputChange} onPress={_partnersSchButton} onSubmitEditing={_partnersSchButton} latitudeInfo={location.latitude} longitudeInfo={location.longitude} />
            {
                partnersLoading ?
                <Box justifyContent='center' alignItems='center' flex={1}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                :
                <FlatList
                   data={partnersRealData}
                   nestedScrollEnabled
                   renderItem={_renderItem}
                   keyExtractor={(item, index)=>index.toString()}
                   showsVerticalScrollIndicator={false}
                   refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                   ListEmptyComponent={
                       <Box py={10} alignItems='center'>
                           <DefText text='주변에 등록된 시설이 없습니다.' style={{color:'#666'}} />
                       </Box>                
                   }
               />
            }
            {
                parseInt(location.latitude)>0 && parseInt(location.longitude)>0 && mapMoveButton &&
                <Box position='absolute' bottom={5} right={5}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Maps')}}>
                        <Image source={require('../images/spotIconRed.png')} alt='내위치 지도' />
                    </TouchableOpacity>
                </Box>
            }
            
        </Box>
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
)(Partners);