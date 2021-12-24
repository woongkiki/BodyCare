import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import HeaderMapSch from '../components/HeaderMapSch';
import {DefText} from '../common/BOOTSTRAP';
import { WebView } from 'react-native-webview';
import { FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import Font from '../common/Font';
import Api from '../Api';
import { getStatusBarHeight } from "react-native-status-bar-height";
import ToastMessage from '../components/ToastMessage';
import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('window');

const heightMap = height * 0.45;

const contentsWidth = width * 0.45;
const hegihts = height - (heightMap + 90 + 60 + 60 + getStatusBarHeight());

const Map = (props) => {

    const { navigation, route } = props;

    const { params } = route;

    const { purposeDatas, wishExerDatas } = params;

    
   //console.log('맵 정보:::',latitudeInfo,longitudeInfo)



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
    //console.log("상태바 높이 ", getStatusBarHeight()); 

    const [refreshing, setRefreshing] = useState(false);

    const [purposeIs, setPurposeIs] = useState('');
    const [wishDataIs, setWishDataIs] = useState('');

    //console.log(params);

    const purposeSend = (data) => {
        setPurposeIs(data);
    }

    const wishDataSend = (data) => {
        setWishDataIs(data);
    }


    useEffect(()=>{
        let purposeDatas2;
        if(purposeDatas){
            purposeDatas2 = params.purposeDatas;
            purposeSend(purposeDatas2);
    
        }else{
            purposeDatas2 = '';
            purposeSend(purposeDatas2);
        }
    
        let wishDatas2;
        if(wishExerDatas){
            wishDatas2 = wishExerDatas;
            wishDataSend(wishDatas2)
        }else{
            wishDatas2 = '';
            wishDataSend(wishDatas2)
        }
        
    })

    //console.log('purposeIs:::',purposeIs);

    /* 현재 주소 가져오기 */
    const [nowCategory, setNowCategory] = useState('전체');
    
    const [mapLoading, setMapLoading] = useState(true);
    //const [location, setLocation]= useState({latitude:null, longitude:null});
    //const [locationReal, setLoacationReal] = useState();
    const [mapInfos, setMapInfos] = useState('');

    const [mapAddrName, setMapAddrName] = useState('');

    const [ addressInput, setAddressInput ] = useState('');
    const [mapSchTexts, setMapSchTexts] = useState('');
    
    const _schInputChange = text => {
        setAddressInput(text);
    }
   
    const _handleMapSchBtn = () => {
        if(!addressInput){
            ToastMessage('검색하실 주소를 정확하게 입력하세요.');
            return false;
        }

        setMapSchTexts(addressInput);
    }

    const [areadata, setAreaData] = useState([]);
    const [areadataLoading, setAreaDataLoading] = useState(true);
    const MapAreaData = async (locationArr) => {

        await Api.send('map_datas', {'startLat':locationArr[0],'endLat':locationArr[1], 'startLon':locationArr[2], 'endLon':locationArr[3], 'nowCategory':nowCategory, 'purposeIdx':purposeIs, 'wishIdx':wishDataIs}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
    
                //console.log('맵 출력13..',resultItem);
                
                //setNowCategory(nowCategory);
                setAreaData(arrItems);
            
            }else{
                console.log('결과 출력 실패!', resultItem);
            }
        })
        await setAreaDataLoading(false);
    }


    const navigateGo = (item) => {
        //console.log(item.cate);
        if(item.cate=='partners'){
            navigation.navigate('PartnersView', item)
        }else if(item.cate=='trainers'){
            navigation.navigate('TrainersView', item)
        }
    }

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity
                key={index}
                style={[{width:contentsWidth, overflow:'hidden'}, index === 0 ? {marginLeft:0} : {marginLeft:20} ]}
                onPress={ ()=> {navigateGo(item)} }
            >
                {
                     item.imageUrl ?
                     <Image
                        source={{uri:item.imageUrl}}
                        alt={item.wr_id}
                        style={{width:contentsWidth, height:hegihts,  borderRadius:10}}
                    />
                    :
                    <Image
                        source={require('../images/noImage.png')}
                        alt={item.wr_subject}
                        width={contentsWidth}
                        height={hegihts}
                        borderRadius={5}
                        overflow='hidden'
                        resizeMode='contain'
                    />

                }
                
                <Box style={{marginTop:10}}>
                    {
                        item.cate == 'partners' &&
                        <DefText text={item.wr_subject} />
                    }
                    {
                        item.cate == 'trainers' &&
                        <DefText text={item.wr_subject + ' 선생님'} />
                    }
                </Box>
            </TouchableOpacity>
        )
    }

    useEffect(()=>{
        requestUserPermission();
    },[])


    //console.log('우치정보:::', location);

    const [mapUrl, setMapUrl] = useState('https://enbsport.com/partnersMap.php?mapWidth='+width+'&mapHeight='+heightMap+'&mapLat='+0+'&mapLon='+0+'&mapcategory='+nowCategory+'&mapaddrs='+mapSchTexts);

    useEffect( async()=>{
        await setMapLoading(false);
        await setMapUrl('https://enbsport.com/partnersMap.php?mapWidth='+width+'&mapHeight='+heightMap+'&mapLat='+location.latitude+'&mapLon='+location.longitude+'&mapcategory='+nowCategory+'&mapaddrs='+mapSchTexts);
        
    },[location, nowCategory])
 

    useEffect(async()=>{
        //console.log('mapInfos::', mapInfos);
        if(mapInfos != "") {
            await setMapAddrName(mapInfos.split(",")[4]);
          //  await setAreaDataLoading(true);
            await MapAreaData(mapInfos.split(","));
        }
    },[mapUrl, mapInfos]);

     useEffect(()=>{
         MapAreaData(mapInfos.split(","));
     },[purposeIs, wishDataIs])

    const MySpotMove = async () => {
        //setMapAddrName('');
        await setMapSchTexts('');
        await setAreaDataLoading(true);
        await MapAreaData(mapInfos.split(","));
    }

    const refreshList = () => {
        MapAreaData(mapInfos.split(","));
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMapSch navigation={navigation} inputValue={addressInput} onChangeMapText={_schInputChange} mapOnpree={_handleMapSchBtn} onSubmitEditing={_handleMapSchBtn} />
            <VStack>
                <Box>
                    <HStack px={5} height='40px' justifyContent='space-between' alignItems='center' borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                        {
                            mapAddrName ?
                            <DefText text={'현재위치 : ' + mapAddrName} />
                            :
                            <DefText text='주소 불러오는중..' />
                        }
                        <TouchableOpacity onPress={()=>{navigation.navigate('MapSetting', {purposeIs, wishDataIs})}}>
                            <Image source={require('../images/mapInfoMenu.png')} alt='상세설정'/>
                        </TouchableOpacity>
                    </HStack>
                </Box>
                <Box>
                    <HStack px={5} height='50px' alignItems='center'>
                        <TouchableOpacity 
                            style={[styles.mapCategoryButton, nowCategory === '전체' && {backgroundColor:'#CA0D3C'}, {marginRight:10}]}
                            onPress={()=>{setNowCategory('전체')}}
                        >
                            <DefText text='전체' style={[styles.mapCategoryText, nowCategory === '전체' && {color:'#fff'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.mapCategoryButton, nowCategory === '운동시설' && {backgroundColor:'#CA0D3C'}, {marginRight:10}]}
                            onPress={()=>{setNowCategory('운동시설')}}
                        >
                            <DefText text='운동시설' style={[styles.mapCategoryText, nowCategory === '운동시설' && {color:'#fff'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.mapCategoryButton, nowCategory === '트레이너' && {backgroundColor:'#CA0D3C'}]}
                            onPress={()=>{setNowCategory('트레이너')}}
                        >
                            <DefText text='트레이너' style={[styles.mapCategoryText, nowCategory === '트레이너' && {color:'#fff'}]} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
                <Box style={{height:heightMap}}>
                    {
                        mapLoading ? 
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <>
                            <WebView
                                source={{
                                    uri:mapUrl
                                }}
                                onMessage={(e)=>setMapInfos(e.nativeEvent.data)}
                            />
                            <TouchableOpacity style={[{position:'absolute', bottom:20, right:20}]} onPress={MySpotMove}>
                                <Image source={require('../images/my_spot_imgs.png')} alt='내위치로' />
                            </TouchableOpacity>
                        </>
                    }
                </Box>
                <Box>
                    {
                        areadataLoading ?
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        <Box p={5}>
                            <FlatList
                                data={areadata}
                                horizontal={true}
                                renderItem={_renderItem}
                                keyExtractor={(item, index)=>index.toString()}
                                showsHorizontalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                                }
                                ListEmptyComponent={
                                    <Box py={10} alignItems='center' justifyContent='center' width={width-40} height={hegihts} >
                                        {
                                            nowCategory == '전체' && 
                                            <DefText text='주변에 등록된 시설 및 트레이너가 없습니다.' style={{color:'#666'}} />
                                        }
                                        {
                                            nowCategory == '운동시설' && 
                                            <DefText text='주변에 등록된 운동시설이 없습니다.' style={{color:'#666'}} />
                                        }
                                        {
                                            nowCategory == '트레이너' && 
                                            <DefText text='주변에 등록된 운동시설이 없습니다.' style={{color:'#666'}} />
                                        }
                                    </Box>                
                                }
                            />
                        </Box>
                    }
                </Box>
            </VStack>
        </Box>
    );
};

const styles = StyleSheet.create({
    mapCategoryButton : {
        backgroundColor:'#fff',
        width:78,
        height: 31,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:3,
        borderWidth:1,
        borderColor:'#F2F2F2'
    },
    mapCategoryText:{
        fontSize:14,
        fontFamily:Font.RobotoMedium,
        color:'#000000'
    }
})

export default Map;