import React, { useEffect, useState } from 'react';
import { Text, Box, Image } from 'native-base';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, PermissionsAndroid, RefreshControl, View, ActivityIndicator, FlatList, Linking, Platform } from 'react-native';
import HeaderMain from '../components/HeaderMain';
import {DefText} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import Api from '../Api';
import Geolocation from 'react-native-geolocation-service';
import Swiper from 'react-native-swiper';
import { textLengthOverCut } from '../common/dataFunction';
import DeviceInfo from 'react-native-device-info';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const contImgWidth = (width - 40) * 0.4;

const conBannerHeight = width / 1.4;

const conMidBannerHeight = width / 2.3;

console.log(width);

const Home = (props) => {

    const {navigation, route, userInfo} = props;

    //console.log("Home:::", props);

    //console.log('태블릿사이즈 :::', width);
    //console.log('파트너스 이미지 :::', contImgWidth);

    let isTablet = DeviceInfo.isTablet();


    const [refreshing, setRefreshing] = useState(false); //스크롤 리프레시
    //현재위치 좌표
    const [location, setLocation]= useState({latitude:0, longitude:0});


    const [mbIds, setMbIds] = useState('');
    const [loginId, setLoginId] = useState('');

  
   

    //permission
    const permissionGeo = async() => {

        
        try{
            if (Platform.OS === 'ios') {
                return await Geolocation.requestAuthorization('whenInUse');
    
                //console.log('123123', Geolocation.requestAuthorization('whenInUse'))
                getGeoLocation();
    
            } else {
                console.log('안드로이드 작동....');
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
        } catch(e){
            console.log('err', e);
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


    useEffect(()=>{

        if(Platform.OS === 'ios'){
            permissionGeo().then(result=> {

                console.log('ios result',result);

                if(result === 'granted'){
                    Geolocation.getCurrentPosition(
                        position => {
                            //console.log('position::', position);
                            const {latitude, longitude} = position.coords;
                            setLocation({
                                latitude,
                                longitude
                            })

                        
                        },
                        error => {
                            console.log("err", error.code, error.message);
                        },
                        {
                            showLocationDialog: true,
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000
                        },
                    );
                }
            })
        }

        if(Platform.OS === 'android'){
            permissionGeo();
        }
    }, [])


    let latitudeInfo = location.latitude;
    let longitudeInfo = location.longitude;

    //로그인시
    useEffect(()=>{
        if(userInfo){
            //ToastMessage(userInfo.mb_name+'님 반갑습니다.');
            setMbIds(userInfo.mb_id);
        }
    },[]);

    

    useEffect(()=>{

        //console.log('로그인된 아이디', mbIds);
        setLoginId(mbIds);

        if(Platform.OS === 'ios'){
        permissionGeo().then(result=> {

            console.log('로그인 후 좌표...',result);

            if(result === 'granted'){
                Geolocation.getCurrentPosition(
                    position => {
                        console.log('로그인 후 좌표...', position);
                        const {latitude, longitude} = position.coords;
                        setLocation({
                            latitude,
                            longitude
                        })

                    
                    },
                    error => {
                        console.log("err", error.code, error.message);
                    },
                    {
                        showLocationDialog: true,
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    },
                );
            }
            })
        }

        if(Platform.OS === 'android'){
          permissionGeo();
        }
        //requestUserPermission();
    },[mbIds])


    //푸시메시지를 위한 앱 토큰 저장
    const AppTokenSave = async () => {

        const token = await messaging().getToken();

        //console.log('token', token);
  
        Api.send('token_insert', {'token':token}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
  
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 출력 : ', arrItems);
                //console.log('성공쓰 : ', resultItem);
            }else{
                //console.log('실패 여부 : ', resultItem);
            }
        });
    }



    const [mainSlideLoading, setMainSlideLoading] = useState(true);
    const [mainBannerDataList, setMainBannerDataList] = useState([]); //메인슬라이드


    const mainBanners = mainBannerDataList.map((item, index)=>{ //메인 배너 데이터
        return(
            <TouchableOpacity activeOpacity={1} key={index}>
                {
                    isTablet ?
                    <Image source={{uri:item.thumb}} style={{width:width, height:conBannerHeight, resizeMode:'contain'}} alt={item.wr_subject}  />
                    :
                    <Image source={{uri:item.thumb}} style={{width:width, height:conBannerHeight, resizeMode:'stretch'}} alt={item.wr_subject}  />
                }
                
            </TouchableOpacity>
        )
    })

    //메인배너 끝


    const [midBannerLoading, setMidBannerLoading] = useState(true);
    const [midBannerList, setMidBannerList] = useState([]); //메인슬라이드


    const midBanners = midBannerList.map((item, index)=>{ //메인 배너 데이터
        return(
            <TouchableOpacity activeOpacity={1} key={index}>
                {
                    isTablet ?
                    <Image source={{uri:item.thumb}} style={{width:width, height:conMidBannerHeight, resizeMode:'contain'}} alt={item.wr_subject} />
                    :
                    <Image source={{uri:item.thumb}} style={{width:width, height:conMidBannerHeight, resizeMode:'stretch'}} alt={item.wr_subject} />
                }
               
            </TouchableOpacity>
        )
    })



    //파트너메인
    const [partnersMainLoading, setPartnersMainLoading] = useState(true);
    const [partnersDataHome, setPartnersDataHome] = useState([]);

    const _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity
                key={index}
                style={[{borderRadius:5}, index===0 ? {marginLeft:0} : {marginLeft:20}]}
                onPress={()=>{navigation.navigate('PartnersView', item)}}
            >
                {
                    item.thumb ?
                    <Image
                        source={{uri:item.thumb}}
                        alt={item.wr_subject}
                        width={contImgWidth}
                        height={
                            isTablet ?
                            240
                            :
                            165
                        }
                        borderRadius={5}
                        overflow='hidden'
                        resizeMode='stretch'
                    />
                    :
                    <Image
                        source={require('../images/noImage.png')}
                        alt={item.wr_subject}
                        width={contImgWidth}
                        height={163}
                        borderRadius={5}
                        overflow='hidden'
                        resizeMode='contain'
                    />
                }
                {
                    item.wr_subject ?
                    <DefText text={textLengthOverCut(item.wr_subject, 7)} style={{textAlign:'center', marginTop:10}} />
                    :
                    <DefText />
                }
                
            </TouchableOpacity>
        )
    }

    //파트너사 끝


    //트레이너 메인
    const [trainersLoading, setTrainersLoading] = useState(true);
    const [trainerDataMainList, setTrainerDataMainList] = useState([]); 

    const _renderItemTrainers = ({item, index}) => {

      //console.log('트레이너:::::',item);

      const wr_6s = item.wr_6.split('|');

      return (
          <TouchableOpacity style={[styles.trainerListBtn, index===0 ? {marginLeft:0} : {marginLeft:15}]} onPress={()=>{navigation.navigate('TrainersView', item)}}>
              <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:contImgWidth, height: isTablet ? 250 : 178}}  />
              <View style={[styles.blackBox]}>
                  {
                      item.wr_subject ? 
                      <DefText text={textLengthOverCut(item.wr_subject + ' 선생님', 10)} style={[{color:'#fff',fontSize:16}]} />
                      :
                      <DefText text='' />
                  }
                 
                  {
                      item.wr_6b_r ? 
                      <DefText text={textLengthOverCut(item.wr_6b_r, 10)} style={[styles.blackBoxInnerTextContent, {color:'#CA0D3C'}]} />
                      :
                      <DefText text='' />
                  }
                  
                  {
                      item.gym_title ?
                      <DefText text={item.gym_title} style={[styles.blackBoxInnerTextContent ]} />
                      :
                      <></>
                  }
                  
                  <DefText text={textLengthOverCut(wr_6s[1], 10)} style={[styles.blackBoxInnerTextContent]} />
                  {
                    item.partners_category ?
                    <DefText text={textLengthOverCut(item.partners_category, 15)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                    :
                    <Text></Text>
                }
              </View>
          </TouchableOpacity>
      )
  }

  //고정배너
  const [fixBannerLoading, setFixBannerLoading] = useState(true);
  const [fixBanner, setFixBanner] = useState(''); 

  //로고배너
  const [logoBanner, setLogoBanner] = useState('');

  const MainBannerRecevie = async () => {
        await setMainSlideLoading(true);

        await Api.send('contents_mainBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               // console.log('메인배너 결과 출력 : ', arrItems);
                setMainBannerDataList(arrItems);
                //setTrainerDataMainList(arrItems);
                

            }else{
                console.log('결과 출력 실패!');
            }
        });
        await setMainSlideLoading(false);
  }

  const FixBannerReceive = async () => {
        await setFixBannerLoading(false);
        await Api.send('contents_fixBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                //console.log('결과 출력 고정배너 : ', arrItems);
                setFixBanner(arrItems);
                //setTrainerDataMainList(arrItems);
                

            }else{
                console.log('결과 출력 실패!');
            }
        });
        await setFixBannerLoading(true);

  }

  const LogoBannerReceive =  ()=> {
     Api.send('contents_logoBanner', {}, (args)=>{
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if(resultItem.result === 'Y' && arrItems) {
            
            //console.log('결과 출력 로고배너:::::: ', arrItems);
            setLogoBanner(arrItems);
            //setTrainerDataMainList(arrItems);
            

        }else{
            console.log('결과 출력 실패!');
        }
    });
  }

  const MidBannerReceive = async () => {
         await setMidBannerLoading(true);
        await Api.send('contents_midBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
            // console.log('결과 출력 : ', arrItems);
                setMidBannerList(arrItems);
                //setTrainerDataMainList(arrItems);
                

            }else{
                console.log('결과 출력 실패!');
            }
        });
        await setMidBannerLoading(false);
  }

  const PartnersReceive =  async () => {
       
    await setPartnersMainLoading(true);
    await Api.send('contents_partners', {'nowlat':location.latitude, 'nowlon':location.longitude, 'mainPartners':1, 'loginId':loginId}, (args)=>{
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if(resultItem.result === 'Y' && arrItems) {
           // console.log('결과 출력 파트너스.. : ', resultItem);
           //console.log('파트너스 출력/....',resultItem);
            setPartnersDataHome(arrItems);
        }else{
            console.log('결과 출력 실패!');
        }
    });
    await setPartnersMainLoading(false);
  }

  const TrainersReceive = async () => {
    await setTrainersLoading(true);
    await Api.send('trainers_list', {'nowlat':location.latitude, 'nowlon':location.longitude, 'mainTrainers':1, 'loginId':loginId}, (args)=>{
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if(resultItem.result === 'Y' && arrItems) {
            
            
            setTrainerDataMainList(arrItems);
            //console.log('트레이너 메인 ::: ', resultItem);
        }else{
            console.log('결과 출력 실패!');
        }
    });
    await setTrainersLoading(false);
  }

    
    useEffect( async()=>{
        //await requestUserPermission(); //위치정보가져오기
        await AppTokenSave(); // 토큰저장
        // await HomeDataReceive();
    },[])


    const [mapMoveButton, setMapMoveButton] = useState(false);

    useEffect( async()=>{

        console.log('좌표 값 변화::::', location);

        if(location.latitude>0 && location.longitude > 0) {
          //  await setTrainersLoading(true);
          //  await setPartnersMainLoading(true)
            //await HomeDataReceive();
            await setMapMoveButton(true)
            await PartnersReceive();
            await TrainersReceive();
        }
      //console.log(location)
    },[location, loginId])

    useEffect(async()=>{
        await MainBannerRecevie();
        await FixBannerReceive();
        await LogoBannerReceive();
        await MidBannerReceive();
    }, [])


    const refreshList = async() =>{
        //await requestUserPermission();
        //await HomeDataReceive();
        await MainBannerRecevie();
        await FixBannerReceive();
        await LogoBannerReceive();
        await MidBannerReceive();

        if(Platform.OS === 'ios'){
            await permissionGeo().then(result=> {

                console.log('포커스 result',result);

                if(result === 'granted'){
                    Geolocation.getCurrentPosition(
                        position => {
                            console.log('position::', position);
                            const {latitude, longitude} = position.coords;
                            setLocation({
                                latitude,
                                longitude
                            })

                        
                        },
                        error => {
                            console.log("err", error.code, error.message);
                        },
                        {
                            showLocationDialog: true,
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000
                        },
                    );
                }
            })
        }


        if(Platform.OS === 'android'){
            await permissionGeo();
        }
        

    }

    const isFocused = useIsFocused();

    useEffect( async () => {
      
        if (isFocused){
          console.log('포커스온123123');
          //await requestUserPermission();
          //await HomeDataReceive();
          await MainBannerRecevie();
          await FixBannerReceive();
          await LogoBannerReceive();
          await MidBannerReceive();


          if(Platform.OS === 'ios'){
                await permissionGeo().then(result=> {

                    console.log('포커스 result',result);

                    if(result === 'granted'){
                        Geolocation.getCurrentPosition(
                            position => {
                                console.log('position::', position);
                                const {latitude, longitude} = position.coords;
                                setLocation({
                                    latitude,
                                    longitude
                                })

                            
                            },
                            error => {
                                console.log("err", error.code, error.message);
                            },
                            {
                                showLocationDialog: true,
                                enableHighAccuracy: true,
                                timeout: 15000,
                                maximumAge: 10000
                            },
                        );
                    }
                })
            }
         
        }
        if(Platform.OS === 'android'){
            await permissionGeo();

        }
          
      }, [isFocused]);

    //console.log(props);
    //console.log('위치정보::::', location);
    const mapMoving = (user) => {
        //console.log('user',user);
        if(user != null){
            navigation.navigate('Maps');
        }else{
            ToastMessage("로그인 후 이용가능합니다.");
        }
    }

    return (
        <Box flex={1} bg='#F2F2F2'>
             <HeaderMain navigation={navigation} />
             <ScrollView
                 refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                }
            >
                <Box bg='#fff' >
                    {
                        mainSlideLoading ? 
                        <Box justifyContent='center' alignItems='center' height={260}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <Swiper 
                            loop={true}
                            autoplay={true}
                            autoplayTimeout={3}
                            height={
                                isTablet ?
                                conBannerHeight :
                                conBannerHeight
                            }
                            dot={
                                <View
                                style={{
                                    backgroundColor: '#C1C1C1',
                                    width: 5,
                                    height: 5,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                }}
                                />
                            }
                            activeDot={
                            <View
                                style={{
                                backgroundColor: '#CA0D3C',
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 10,
                                }}
                            />
                            }
                            paginationStyle={{
                                bottom: '10%',
                                
                            }}
                        >
                            {mainBanners}
                        </Swiper>
                    }
                
                </Box>
                {

                    fixBanner != '' &&
                    <Box>
                        <Image source={{uri:fixBanner.thumb}} style={{width:width, height:width / 2}} alt='123123' resizeMode='stretch' />
                        
                    </Box>
                   
                }

                <Box  bg='#fff'>
                    {
                        midBannerLoading ? 
                        <Box justifyContent='center' alignItems='center' height={240}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <Swiper loop={true}
                            autoplay={true}
                            autoplayTimeout={3}
                            height={
                                isTablet ?
                                conMidBannerHeight :
                                conMidBannerHeight
                            }
                            dot={
                                <View
                                style={{
                                    backgroundColor: '#C1C1C1',
                                    width: 5,
                                    height: 5,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                }}
                                />
                            }
                            activeDot={
                            <View
                                style={{
                                backgroundColor: '#CA0D3C',
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 10,
                                }}
                            />
                            }
                            paginationStyle={{
                                bottom: '10%',
                                
                            }}
                        >
                            {midBanners}
                        </Swiper>
                    }
                
                </Box>

                <Box px={4} bg='#fff' pt={5}>
                    <DefText text='우수 파트너사' style={{fontSize:18, marginBottom:15, fontFamily:Font.RobotoBold}} />
                    {
                        partnersMainLoading ? 
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <FlatList
                            data={partnersDataHome}
                            horizontal={true}
                            renderItem={_renderItem}
                            keyExtractor={(item, index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={
                                <Box py={10} alignItems='center' justifyContent='center' width={width - 40}>
                                    <DefText text='주변에 등록된 시설이 없습니다.' style={{color:'#666'}} />
                                </Box>                
                            }
                        />
                    }
                </Box>

                
                <Box px={4} py={5} bg='#fff'>
                    <DefText text='추천 트레이너' style={{fontSize:18, marginBottom:15, fontFamily:Font.RobotoBold}} />
                    {
                        trainersLoading ?
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <FlatList
                            data={trainerDataMainList}
                            horizontal={true}
                            renderItem={_renderItemTrainers}
                            keyExtractor={(item, index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={
                                <Box py={10} alignItems='center' justifyContent='center' width={width - 40} height={180}>
                                    <DefText text='주변에 등록된 트레이너가 없습니다.' style={{color:'#666'}} />
                                </Box>                
                            }
                        />
                    }
                </Box>
                {
                    logoBanner != '' && 
                    <Box backgroundColor='#fff' py={2.5} px={5}>
                        {
                            logoBanner.length > 0 &&
                            <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            >
                                {
                                    logoBanner.map((item, index)=> {
                                        return(
                                            <Box key={index} style={[ {alignItems:'center', justifyContent:'center'}, index!=0 && {marginLeft:20} ]}>
                                                <TouchableOpacity
                                                    onPress={
                                                        item.wr_2 != '' ?
                                                        ()=>Linking.openURL(item.wr_2)
                                                        :
                                                        ()=> console.log('url 없음')
                                                    }
                                                >
                                                    <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:100, height:50, resizeMode:'contain'}} />
                                                </TouchableOpacity>
                                            </Box>
                                        )
                                    })
                                }
                            </ScrollView>
                        }
                    </Box>
                }
             </ScrollView>
             {
               parseInt(location.latitude)>0 && parseInt(location.longitude)>0 && mapMoveButton &&
               <Box position='absolute' bottom='50px' right={5}>
                <TouchableOpacity onPress={()=>mapMoving(userInfo)}>
                  <Image source={require('../images/spotIconRed.png')} alt='내위치 지도' />
                </TouchableOpacity>
              </Box>
             }
             
        </Box>
    );
};

const styles = StyleSheet.create({
    blackBox: {
        position: 'absolute',
        top:0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'rgba(0,0,0,0.6)',
        paddingLeft:10,
        paddingVertical:20,
        justifyContent:'space-between'
    },
    trainerListBtn : {
        borderRadius:5,
        overflow: 'hidden'
    },
    blackBoxInnerTextContent:{
        fontSize:14,
        color:'#fff',
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(Home);