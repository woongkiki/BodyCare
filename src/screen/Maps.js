import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Image, Modal } from 'native-base';
import { WebView } from 'react-native-webview';
import { PermissionsAndroid, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, RefreshControl, ScrollView, SafeAreaView, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import HeaderMapSch from '../components/HeaderMapSch';
import ToastMessage from '../components/ToastMessage';
import {DefText} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import Api from '../Api';
import { textLengthOverCut } from '../common/dataFunction';

const {width, height} = Dimensions.get('window');

const heightMap = height * 0.45;

const contentsWidth = width * 0.45;
const hegihts = height - (heightMap + 280);

const hegihtsIos = height - (heightMap + 355);



const buttonWidth = (width-40)*0.23;
const buttonWidthPadding = (width-40)*0.06;
const buttonWidthPaddings = buttonWidthPadding / 3;


const Maps = ( props ) => {


    const { navigation, route } = props;

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
    


    const [ addressInput, setAddressInput ] = useState('');
    const [mapSchTexts, setMapSchTexts] = useState('');
    const [mapPopVisible, setMapPopVisible] = useState(false);
    
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
                {//안나
                     item.imageUrl ?
                     <Image
                        source={{uri:item.imageUrl}}
                        alt={item.wr_id}
                        style={{width:width, height:Platform.OS === 'ios' ? hegihtsIos : hegihts,  borderRadius:10}}
                        
                    />
                    :
                    <Image
                        source={require('../images/noImage.png')}
                        alt={item.wr_subject}
                        width={contentsWidth}
                        height={Platform.OS === 'ios' ? hegihtsIos : hegihts}
                        borderRadius={5}
                        overflow='hidden'
                        resizeMode='contain'
                    />

                }
                
                <Box style={{marginTop:10, textAlign:'center'}}>
                    {
                        item.cate == 'partners' &&
                        <DefText text={textLengthOverCut(item.wr_subject, 12)} style={{textAlign:'center'}} />
                    }
                    {
                        item.cate == 'trainers' &&
                        <DefText text={textLengthOverCut(item.wr_subject + ' 선생님', 12)} style={{textAlign:'center'}} />
                    }
                </Box>
            </TouchableOpacity>
        )
    }
    

    

    useEffect(()=>{
        requestUserPermission();
    },[])

    //console.log(location)서울시 종로구


    const [mapUrl, setMapUrl] = useState('https://enbsport.com/partnersMap.php?mapHeight='+heightMap+'&mapLat='+33.450701+'&mapLon='+126.570667+'&mapcategory=전체&mapaddrs='+mapSchTexts);
    const [mapLoading, setMapLoading] = useState(true);
    const [mapInfos, setMapInfos] = useState('');
    const [mapAddrName, setMapAddrName] = useState('');
    const [nowCategory, setNowCategory] = useState('전체');

    const [areadata, setAreaData] = useState([]);
    const [areadataLoading, setAreaDataLoading] = useState(true);


    const [partners, setPartners] = useState(0);
    const [purpose, setPurpose] = useState(0);

    const [purposeIs, setPurposeIs] = useState(0);
    const [wishDataIs, setWishDataIs] = useState(0);

    const [mapSelectIdx, setMapSelectIdx] = useState('');
    const [mapSelectTitle, setMapSelectTitle] = useState('');

    const [wishExerData, setWishExerData] = useState([]);
    const wishExerDatas = async () => {
        Api.send('contents_wishExer', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

          
                //console.log('결과 출력..',arrItems);
                setWishExerData(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        })
    }

    const [purposeDats, setPurposeDatas] = useState([]);
    const puposeData = async () => {
        Api.send('contents_purpose', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

          
                console.log('결과 출력..',arrItems);
                setPurposeDatas(arrItems);
               // setWishExerData(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        })
    }

    useEffect(()=>{
        wishExerDatas();
        puposeData();
    },[])


    const MapAreaData = async (locationArr) => {

        await Api.send('map_datas', {'startLat':locationArr[0],'endLat':locationArr[1], 'startLon':locationArr[2], 'endLon':locationArr[3], 'nowCategory':nowCategory, 'purposeIdx':purposeIs, 'wishIdx':wishDataIs, 'mapSelectIdx':mapSelectIdx, 'mapSelectTitle':mapSelectTitle, 'partnersId' : partners}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
    
                console.log('맵 정보 :::',resultItem);
                
                //setNowCategory(nowCategory);
                setAreaData(arrItems);
            
            }else{
                console.log('결과 출력 실패!', resultItem);
            }
        })
        await setAreaDataLoading(false);
    }


    const purposeDatas = async() => {
        await setPurposeIs(purpose);
        await setWishDataIs(partners);
        await setMapPopVisible(false);
    }

    //console.log(purposeIs, wishDataIs);


    useEffect( async()=>{
        await setMapLoading(false);
        await setMapUrl('https://enbsport.com/partnersMap.php?mapLat='+location.latitude+'&mapLon='+location.longitude+'&mapcategory='+nowCategory+'&mapaddrs='+mapSchTexts+'&mySpot=yes&purposeIs='+wishDataIs+'&wishDataIs='+purposeIs);


        //console.log(mapUrl);
       
    },[location, mapSchTexts, nowCategory, purposeIs, wishDataIs])


    const mapInfoSave = (e) => {
        setMapInfos(e)
    }

    useEffect( async()=>{
        await setMapAddrName(mapInfos.split(",")[4]);
        await setAreaDataLoading(true);
        await MapAreaData(mapInfos.split(","));

        await setMapSelectIdx(mapInfos.split(",")[5]);
        await setMapSelectTitle(mapInfos.split(",")[6]);

    },[mapInfos, nowCategory, purposeIs, wishDataIs, mapSelectTitle, partners])


    // useEffect(()=>{
    //     console.log(mapSelectTitle, mapSelectIdx);
    // },[mapSelectTitle, mapSelectIdx])
    // useEffect(()=>{
    //     console.log('purposeIs:::',purposeIs);
    // },[purposeIs])서울시 구로구 서울 종로구 진흥로 잠원동

    //console.log(mapInfos);

   

    //목적..

    const MySpotMove = async () => {
        //setMapAddrName('');
        await setAddressInput('');
        await setMapSchTexts('');
        //await setPurposeIs(0);
        //await setWishDataIs(0);
        //await setPartners(0);
        //await setPurpose(0);
        await setNowCategory('전체');
        await setMapLoading(true);
        await setMapUrl('https://enbsport.com/partnersMap.php?mapLat='+location.latitude+'&mapLon='+location.longitude+'&mapcategory=전체'+'&mapaddrs=&mySpot=yes&purposeIs='+wishDataIs+'&wishDataIs='+purposeIs);
        await setMapLoading(false);
        await setAreaDataLoading(true);
        await MapAreaData(mapInfos.split(","));
    }
    

    const partnersDatas = wishExerData.map((item, index)=>{
        return(
            <TouchableOpacity
                onPress={()=>{setPartners(item.wr_id)}}
                key={index} 
                style={[
                    styles.settingButton,
                    {marginTop:10, marginRight:buttonWidthPaddings},
                    item.wr_id === partners ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#fff'}
                ]}
            >
                <DefText 
                    text={item.wr_subject} 
                    style={[
                        styles.settingButtonText,
                        item.wr_id === partners ? {color:'#fff'} : {color:'#333'}
                    ]} 
                />
            </TouchableOpacity>
        )
    });


    


    const typeDatas = purposeDats.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={index} 
                style={[
                    styles.settingButton, 
                    {marginTop:10}, item.idx % 4 === 0 ? {marginRight:0} : {marginRight:buttonWidthPaddings},
                    item.wr_id === purpose ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#fff'}
                ]}
                onPress={()=>setPurpose(item.wr_id)}
            >
                <DefText 
                    text={item.wr_subject}
                    style={[
                        styles.settingButtonText,
                        item.wr_id === purpose ? {color:'#fff'} : {color:'#333'}
                    ]} 
                />
            </TouchableOpacity>
        )
    });

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMapSch navigation={navigation} inputValue={addressInput} onChangeMapText={_schInputChange} mapOnpree={_handleMapSchBtn} onSubmitEditing={_handleMapSchBtn} />
            <Box>
                <HStack px={5} height='40px' justifyContent='space-between' alignItems='center' borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                    {
                        mapAddrName ?
                        <DefText text={'현재위치 : ' + mapAddrName} />
                        :
                        <DefText text='주소 불러오는중..' />
                    }
                    <TouchableOpacity onPress={()=>{setMapPopVisible(true)}}>
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
                        onMessage={e => mapInfoSave(e.nativeEvent.data)}
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
                        <Box mb={5}>
                            
                            <HStack>
                                {
                                    nowCategory == '전체' ?
                                    <DefText text={'주변 트레이너 및 센터 수 : ' } style={{fontSize:16}} /> :
                                    nowCategory == '운동시설' ?
                                    <DefText text={'주변 센터 수 : ' } style={{fontSize:16}} /> :
                                    nowCategory == '트레이너' &&
                                    <DefText text={'주변 트레이너 수 : ' } style={{fontSize:16}} /> 

                                }
                               
                                <DefText text={areadata.length} style={{color:'#CA0241', fontSize:16}} />
                                
                            </HStack>
                            
                        </Box>
                        <FlatList
                            data={areadata}
                            horizontal={true}
                            renderItem={_renderItem}
                            keyExtractor={(item, index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
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
            <Modal isOpen={mapPopVisible} style={{flex:1, backgroundColor:'#fff'}} onClose={() => setMapPopVisible(false)}>
            <SafeAreaView style={{width:'100%', flex:1}}>
                    <HStack justifyContent='flex-end' height='50px' alignItems='center'>
                        <TouchableOpacity style={{paddingRight:20}} onPress={()=>{setMapPopVisible(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <ScrollView>
                        <Box p={5}>
                            <DefText text='업체' style={{fontFamily:Font.RobotoBold}} />
                            <HStack flexWrap='wrap'>
                            {partnersDatas}
                            </HStack>
                        </Box>
                        <Box p={5}>
                            <DefText text='목적' style={{fontFamily:Font.RobotoBold}} />
                            <HStack flexWrap='wrap'>
                            {typeDatas}
                            </HStack>
                        </Box>
                        
                    </ScrollView>
                    <TouchableOpacity 
                            onPress={purposeDatas}
                            style={{
                                justifyContent:'center',
                                alignItems:'center',
                                height:46,
                                backgroundColor:'#CA0D3C'
                            }}
                        >
                            <DefText text='완료' style={{color:'#fff', fontFamily:Font.RobotoBold}} />
                        </TouchableOpacity>
                </SafeAreaView>
            </Modal>
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
    },
    settingButton:{
        width:buttonWidth,
        height:31,
        borderWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    settingButtonText: {
        fontFamily:Font.RobotoMedium
    }
})

export default Maps;