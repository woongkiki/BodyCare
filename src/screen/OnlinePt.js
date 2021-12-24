import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, FlatList, StyleSheet, Dimensions, ScrollView, Alert, ActivityIndicator, PermissionsAndroid } from 'react-native';

import { DefText } from '../common/BOOTSTRAP';
import HeaderOnline from '../components/HeaderOnline';
import { onlinePtCategory, onlinePtData } from '../Utils/DummyData';
import Font from '../common/Font';
import { textLengthOverCut } from '../common/dataFunction';
import Api from '../Api';
import Geolocation from 'react-native-geolocation-service';

const OnlinePt = (props) => {

    const {navigation, route} = props;

    //console.log('onlinePt::::',route);

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
  
      console.log('현재 위도', latitudeInfo);
      console.log('현재 경도', longitudeInfo);

    const {width} = Dimensions.get('window');

    const [onlineLoading, setOnlineLoading] = useState(true);

    const [categoryName, setCategoryName] = useState('전체'); //선택된 카테고리 값 (전체가 default)
    const [orderCategory, setOrderCategory] = useState('기본순'); // 정렬순서 기본순이 default
    const [orderSchName, setOrderSchName] = useState('');

    const [onlinePtSearch, setOnlinePtSearch] = useState('');
    const _onlinePtTextChange = (text) => {
        setOnlinePtSearch(text);
    }
    const _onlinePtSchButton = () => {

        setOrderSchName(onlinePtSearch);
        //console.log('dd?',orderSchName);
    }

    let params; // 넘어오는 파라미터값 저장할 변수선언
    let selectCategorys; // 넘어오는 파라미터값중 selectCategorys만 저장



    if(route.params){ // 파라미터 값이 있다면
        params = route.params;
        selectCategorys = params.selectCategory;

        //latitudeInfo = params.latitudeInfo;
       // longitudeInfo = params.longitudeInfo;

    }else{ 
        params = '';
        selectCategorys = '전체'
    }

    const selectCates = selectCategorys; // useEffect 사용위해 변수에 저장

    useEffect(()=>{ // selectCates 변수에 값 변화가 생기면 작동
        setCategoryName(selectCates);
    },[selectCates])


   // console.log
 

    const [onlineCategory, setOnlineCategory] = useState([]);
    const OnlinePtCategoryList = async () => {
        Api.send('contents_onlineCategory', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                setOnlineCategory(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
    }

    const [onlineData, setOnlineData] = useState([]);
    const OnlineDataList = async () => {
        Api.send('contents_online', {'categorys':categoryName, 'orders':orderCategory, 'onlinePTname':orderSchName}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                //setOnlineCategory(arrItems);
                //console.log('온라인 영상 리스트123..', resultItem);
                setOnlineLoading(false);
                setOnlineData(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
    }

    useEffect(()=>{
        OnlinePtCategoryList();
    },[])

    useEffect(()=>{
        OnlineDataList();
    },[categoryName, orderCategory,orderSchName]);

    
    const [mapMoveButton, setMapMoveButton] = useState(false);
   useEffect(()=>{
       console.log(location)
       if(location.latitude>0 && location.longitude>0){
            setMapMoveButton(true);
       }
   },[location])

    //console.log(onlineData);

    const _renderItem = ({item, index})=> { // Flatlist로 불러올 카테고리 컴포넌트
        return(
            <TouchableOpacity style={[ {justifyContent:'center', marginLeft:20}]} onPress={()=>{setCategoryName(item)}}>
                <DefText text={item} style={[{fontSize:15, color:'#999999'}, categoryName === item && {color:'#CA0D3C'}]} />
            </TouchableOpacity>
        )
    }


    const onlinePtDataComponents = onlineData.map((item, index)=>{ // 게시글로 불러올 onlinePtData map함수로 컴포넌화

        console.log('item:::::',item);
        return(
            <TouchableOpacity
                 key={index} 
                 style={[index===0?{marginTop:0}:{marginTop:20}]}
                 onPress={()=>{navigation.navigate('OnlinePtView', item)}}
            >
                <HStack flexWrap='wrap'>
                    {
                        item.wr_1 ? 
                        <Box width={width*0.3}>
                            <Image
                                source={{uri:item.imageUrl}}
                                alt={item.wr_id}
                                style={{
                                    width:width*0.3,
                                    height:100,
                                    borderRadius:5
                                }}
                            />
                        </Box>
                        :
                        <Box width={width*0.3} >
                            <Image
                                source={require('../images/logoTextNo.png')}
                                alt={item.wr_id}
                                style={{
                                    width:width*0.3,
                                    height:100,
                                    borderRadius:5,
                                    resizeMode:'contain'
                                }}
                            />
                        </Box>
                    }
                    
                    <Box  style={{width:width*0.55, paddingLeft:15, paddingTop:10}}>
                        <DefText text={textLengthOverCut(item.wr_subject, 15)} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                        <DefText text={item.datetime2} style={{fontFamily:Font.RobotoMedium, color:'#666', marginTop:15}} />
                    </Box>
                </HStack>
                
            </TouchableOpacity>
        )
    })

    //console.log('아오',onlinePtSearch);

    return (
        <Box flex={1} bg='#fff'>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':''}>
                <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss}>
                    <Box pb='220px'>
                        <HeaderOnline navigation={navigation} inputValue={onlinePtSearch} inputChnage={_onlinePtTextChange} onPress={_onlinePtSchButton}  />
                        <Box borderBottomWidth={1} borderBottomColor='#f2f2f2' paddingRight={46}>
                            <FlatList
                                nestedScrollEnabled
                                data={onlineCategory}
                                horizontal={true}
                                renderItem={_renderItem}
                                keyExtractor={(item, index)=>index.toString()}
                                showsHorizontalScrollIndicator={false}
                                style={{height:46}}
                            />
                            <TouchableOpacity
                                style={{position:'absolute', top:0, right:0}}
                                onPress={()=>{navigation.navigate('OnlinePtCategory', {categoryName} )}}
                            >
                                <Image source={require('../images/onlinePtListBtn.png')} alt='목록보기' />
                            </TouchableOpacity>
                        </Box>
                        <ScrollView>
                            
                            
                            <Box px={5} py={4} borderBottomWidth={1} borderBottomColor='#f2f2f2' alignItems='flex-end'>
                                <HStack>
                                    <TouchableOpacity style={{marginRight:15}} onPress={()=>{setOrderCategory('기본순')}}>
                                        <DefText text='기본순' style={[styles.onlinePtOrderCategory, orderCategory === '기본순' && {color:'#666666', fontFamily:Font.RobotoBold}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginRight:15}} onPress={()=>{setOrderCategory('인기순')}}>
                                        <DefText text='인기순' style={[styles.onlinePtOrderCategory, orderCategory === '인기순' && {color:'#666666', fontFamily:Font.RobotoBold}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{setOrderCategory('최신순')}}>
                                        <DefText text='최신순' style={[styles.onlinePtOrderCategory, orderCategory === '최신순' && {color:'#666666', fontFamily:Font.RobotoBold}]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box p={5} >
                                {
                                    onlineLoading ?
                                    <Box justifyContent='center' alignItems='center' height={300}>
                                        <ActivityIndicator size={'large'} color="#333" />
                                    </Box>
                                    :
                                    onlineData.length > 0 ?
                                        onlinePtDataComponents
                                        :
                                        <Box py={5} alignItems='center'>
                                            <DefText text='등록된 영상이 없습니다.' style={{color:'#666'}} />
                                        </Box>
                                }
                            </Box>
                        </ScrollView>
                        
                    </Box>
                        
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
           
            
        </Box>
    );
};

const styles = StyleSheet.create({
    onlinePtOrderCategory: {
        fontSize:14,
        color:'#C4C4C4'
    }
})

export default OnlinePt;