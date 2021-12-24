import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image, Text } from 'native-base';
import { TouchableOpacity, PermissionsAndroid, FlatList, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import { DefText } from '../common/BOOTSTRAP';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import HeaderSearch from '../components/HeaderSearch';
import TrainersList from '../components/TrainersList';
import Geolocation from 'react-native-geolocation-service';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import Api from '../Api';
const {width} = Dimensions.get('window');
const imgSize = width * 0.4;

const Trainers = (props) => {

    const {navigation, userInfo, route} = props;


    const [memberbId, setMemberId] = useState('');
    const [loginId, setLoginId] = useState('');

    useEffect(()=>{
        if(userInfo){
            setMemberId(userInfo.mb_id);
        }
    },[])

   // console.log('회원정보:', userInfo);

    useEffect(()=>{
        setLoginId(memberbId);
    },[memberbId])
    //console.log('props::',props);

    const [trainerText, setTrainerText] = useState('');

    const [trainerInput, setTrainerInput] = useState('');
    const _trainersInputChange = (text) => {
      setTrainerInput(text);
    }
    const _trainersSchButton = () => {

        setTrainerText(trainerInput);
        //console.log('dd?',trainerText);
    }

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


  useEffect(()=>{
      requestUserPermission();
  },[])

  let latitudeInfo = location.latitude;
  let longitudeInfo = location.longitude;

   // console.log('현재 위도', latitudeInfo);
   // console.log('현재 경도', longitudeInfo);

   const [refreshing, setRefreshing] = useState(false);
    //console.log(trainerText);
    const [trainerLoading, setTrainerLoading] = useState(true);

    

    //console.log('현재주소',latitudeInfo + ',' + longitudeInfo);

    const [mapMoveButton, setMapMoveButton] = useState(false);
    const [trainerRealData, setTrainerRealData] = useState([]);

    const trainerDataReceive = async () => {
        await Api.send('trainers_list', {'trainerSch':trainerText, 'nowlat':location.latitude, 'nowlon':location.longitude, 'loginId':loginId}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('트레이너 결과 출력 ㅇㅇ : ', resultItem);
               // console.log('결과 출력 msg : ', resultItem);
                
                setTrainerRealData(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

        await setTrainerLoading(false);

    }


    


    useEffect(async()=>{
        if(location.latitude > 0 && location.longitude > 0){
            await setTrainerLoading(true)
            await trainerDataReceive();
            await setMapMoveButton(true);
        }
   
    },[location, trainerText, loginId])


    const refreshList = async () => {
        await setTrainerLoading(true);
        await trainerDataReceive();
    }


    const _renderItem = ({item, index}) => {

        //console.log('item:::',item)

        //console.log(item);

        const wr_6s = item.wr_6.split('|');

        return(
            <TouchableOpacity 
                style={[{paddingHorizontal:20, marginBottom:20}, index === 0 ? {marginTop:20} : {marginTop:0}]}
                onPress={()=>{navigation.navigate('TrainersView', item)}}
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
                                <DefText text={textLengthOverCut(item.wr_subject + ' 선생님', 15)} style={{marginBottom:10, fontSize:16, fontFamily:Font.RobotoBold}} />
                                :
                                <DefText text='' />
                                
                            }
                            {
                                item.wr_6b_r ? 
                                <DefText text={textLengthOverCut(item.wr_6b_r, 10)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                                :
                                <DefText text='' />
                            }
                            {
                                item.gym_title ? 
                                <DefText text={item.gym_title} style={{color:'#666',marginTop:5}} />
                                :
                                <DefText />
                            }
                            {
                                wr_6s[1] ? 
                                <DefText text={wr_6s[1]} style={{color:'#666', marginTop:5}} />
                                :
                                <DefText text='' />
                            }
                        </Box>
                        {
                            item.partners_category ?
                            <DefText text={textLengthOverCut(item.partners_category, 15)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                            :
                            <Text></Text>
                        }
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }


   

   //console.log('location::::', location);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderSearch navigation={navigation} inputValue={trainerInput} inputChnage={_trainersInputChange} onPress={_trainersSchButton} onSubmitEditing={_trainersSchButton} latitudeInfo={location.latitude} longitudeInfo={location.longitude} />
            {
                trainerLoading ?
                <Box justifyContent='center' alignItems='center' flex={1}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                :
                <FlatList
                    nestedScrollEnabled
                    data={trainerRealData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='주변에 등록된 트레이너가 없습니다.' style={{color:'#666'}} />
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

//export default Trainers;
export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(Trainers);