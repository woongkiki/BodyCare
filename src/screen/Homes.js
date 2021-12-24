import React, { useEffect, useState } from 'react';
import { Text, Box, Image } from 'native-base';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, PermissionsAndroid, RefreshControl, View, ActivityIndicator, FlatList } from 'react-native';
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

const { width } = Dimensions.get('window');

const Homes = (props) => {

    const {navigation, route, userInfo} = props;


    const [refreshing, setRefreshing] = useState(false); //스크롤 리프레시
    //현재위치 좌표
    const [location, setLocation]= useState({latitude:33.450701, longitude:126.570667});

    //로그인시
    useEffect(()=>{
        if(userInfo){
          ToastMessage(userInfo.mb_name+'님 반갑습니다.');

          
        }
    },[]);


    useEffect(()=>{
        console.log('userInfo::::',userInfo);
    },[])
    

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


    let latitudeInfo = location.latitude;
    let longitudeInfo = location.longitude;



    //푸시메시지를 위한 앱 토큰 저장
    const AppTokenSave = async () => {

        const token = await messaging().getToken();
  
        Api.send('token_insert', {'token':token}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
  
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 출력 : ', arrItems);
                console.log('성공쓰 : ', resultItem);
            }else{
                console.log('실패 여부 : ', resultItem);
            }
        });
    }



    useEffect( async()=>{
        await requestUserPermission(); //위치정보가져오기
        await AppTokenSave(); // 토큰저장
    },[])


    const [mainSlideLoading, setMainSlideLoading] = useState(true);
    const [mainBannerDataList, setMainBannerDataList] = useState([]); //메인슬라이드

    const MainBannerData = async () => { //메인배너 가져오기
        Api.send('contents_mainBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                setMainSlideLoading(false);
                //console.log('결과 출력 : ', arrItems);
                setMainBannerDataList(arrItems);
                //setTrainerDataMainList(arrItems);
                

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }


    const mainBanners = mainBannerDataList.map((item, index)=>{ //메인 배너 데이터
        return(
            <TouchableOpacity activeOpacity={1} key={index}>
                <Image source={{uri:item.thumb}} style={{width:width, height:260}} alt={item.wr_subject} />
            </TouchableOpacity>
        )
    })

    //메인배너 끝



    //파트너메인
    const [partnersMainLoading, setPartnersMainLoading] = useState(true);

    const [partnersDataHome, setPartnersDataHome] = useState([]);
    const partnersDataHomeReceive = async() => {
        
        await Api.send('contents_partners', {'nowlat':latitudeInfo, 'nowlon':longitudeInfo}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 출력 : ', arrItems);
                
                setPartnersDataHome(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
        await setPartnersMainLoading(false);
    }

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
                        width={116}
                        height={163}
                        borderRadius={5}
                        overflow='hidden'
                        
                    />
                    :
                    <Image
                        source={require('../images/noImage.png')}
                        alt={item.wr_subject}
                        width={116}
                        height={163}
                        borderRadius={5}
                        overflow='hidden'
                        resizeMode='contain'
                    />
                }
                <DefText text={item.wr_subject} style={{fontSize:16, textAlign:'center'}} />
            </TouchableOpacity>
        )
    }

    //파트너사 끝


    //트레이너 메인
    const [trainersLoading, setTrainersLoading] = useState(true);
    const [trainerDataMainList, setTrainerDataMainList] = useState([]); 

    const trainerDataMainReceive = async() => {
        await Api.send('contents_trainers', {'nowlat':latitudeInfo, 'nowlon':longitudeInfo}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                
                setTrainerDataMainList(arrItems);
                //console.log('트레이너 메인 ::: ', arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
        await setTrainersLoading(false);
    }

    const _renderItemTrainers = ({item, index}) => {

        //console.log('트레이너:::::',item);

        const wr_6s = item.wr_6.split('|');

        return (
            <TouchableOpacity style={[styles.trainerListBtn, index===0 ? {marginLeft:0} : {marginLeft:15}]} onPress={()=>{navigation.navigate('TrainersView', item)}}>
                <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:156, height:178}}  />
                <View style={[styles.blackBox]}>
                    <DefText text={item.wr_subject + ' 선생님'} style={[{color:'#fff',fontSize:16}]} />
                    <DefText text={textLengthOverCut(item.wr_6b_r, 10)} style={[styles.blackBoxInnerTextContent, {color:'#CA0D3C'}]} />
                    {
                        item.gym_title ?
                        <DefText text={item.gym_title} style={[styles.blackBoxInnerTextContent ]} />
                        :
                        <></>
                    }
                    
                    <DefText text={textLengthOverCut(wr_6s[1], 10)} style={[styles.blackBoxInnerTextContent]} />
                    <DefText text={textLengthOverCut(item.partners_category, 11)} style={[styles.blackBoxInnerTextContent, {color:'#CA0D3C'}]} />
                </View>
            </TouchableOpacity>
        )
    }


    useEffect(()=>{
         MainBannerData();
    },[])

    useEffect(()=>{
        partnersDataHomeReceive();
    }, [partnersMainLoading, location])

    useEffect(()=>{
    
        trainerDataMainReceive();
   
    }, [trainersLoading, location])

    const refreshList = () =>{
        MainBannerData();
        partnersDataHomeReceive();
        trainerDataMainReceive();
    }
    

    return (
        <Box flex={1} bg='#F2F2F2'>
             <HeaderMain navigation={navigation} />
             <ScrollView
                 refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                }
            >
                <Box height='260px' paddingY='20px' bg='#fff'>
                    {
                        mainSlideLoading ? 
                        <Box justifyContent='center' alignItems='center' height={240}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <Swiper loop={true}
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
                                backgroundColor: '#fff',
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 10,
                                }}
                            />
                            }
                            paginationStyle={{
                                bottom: 15,
                                
                            }}
                        >
                            {mainBanners}
                        </Swiper>
                    }
                
                </Box>

                <Box px={4} py={5} bg='#fff' mt={2}>
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

                <Box py={4} bg='#fff' mt={2}>
                    <Image source={require('../images/middleBanner_mmm.png')} alt='광고배너'  />
                </Box>
                <Box px={4} py={5} bg='#fff' mt={2}>
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
                                <Box py={10} alignItems='center' justifyContent='center' width={width - 40}>
                                    <DefText text='주변에 등록된 트레이너가 없습니다.' style={{color:'#666'}} />
                                </Box>                
                            }
                        />
                    }
                </Box>
             </ScrollView>
             <Box position='absolute' bottom={5} right={5}>
              <TouchableOpacity onPress={()=>{navigation.navigate('Map', {latitudeInfo, longitudeInfo, purposeDatas:'', wishExerDatas:''})}}>
                <Image source={require('../images/spotIconRed.png')} alt='내위치 지도' />
              </TouchableOpacity>
            </Box>
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
  )(Homes);