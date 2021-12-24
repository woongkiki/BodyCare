import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Image, Text } from 'native-base';
import { TouchableOpacity, FlatList, Dimensions, PermissionsAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import { mainPartners } from '../Utils/DummyData';
import { DefText } from '../common/BOOTSTRAP';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import Api from '../Api';
import Geolocation from 'react-native-geolocation-service';

const {width} = Dimensions.get('window');
const imgSize = width * 0.4;

const PartnersList = (props) => {

    const { navigation , partnersSchText, userInfo, latitudeInfo, longitudeInfo} = props;


    //console.log(props);

    //console.log(props);
    //console.log('파트너스리스트',partnersSchText);

    const [refreshing, setRefreshing] = useState(false);

    const [partnersLoading, setPartnersLoading] = useState(true);

    
    

    const [partnersRealData, setPartnersRealData] = useState([]);
    const partnersDataReceive = async () => {
        
            Api.send('contents_partners', {'partnersSch':partnersSchText, 'nowlat':latitudeInfo, 'nowlon':longitudeInfo}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    console.log('결과 출력 파트너스 리스트 tq : ', resultItem);
                    setPartnersLoading(false);
                    setPartnersRealData(arrItems);
                }else{
                    console.log('결과 출력 실패!');
                }
            });

    }


    useEffect(()=>{
        partnersDataReceive()
    },[partnersLoading])


    const refreshList = () => {
        partnersDataReceive();
    }

    //console.log('저장된 데이터는? ', partnersRealData);

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

    //const lat1s = 37.5029701790983;
    //const lng1s = 126.772492937412;

    const _renderItem = ({item, index}) => {

        const wr_6s = item.wr_6.split('|');

        const distance = getDistanceFromLatLonInKm(latitudeInfo, longitudeInfo, item.wr_8, item.wr_9);

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
                            <DefText text={textLengthOverCut(item.wr_subject, 16)} style={{marginBottom:10, fontSize:16, fontFamily:Font.RobotoBold}} />
                            
                            <DefText text={textLengthOverCut(wr_6s[1], 18)} style={{color:'#666'}} />
                                
                            <DefText text={distance_km + 'km'} style={{color:'#666', marginTop:5,fontFamily:Font.RobotoMedium}}  />
                        </Box>
                        <DefText text={textLengthOverCut(item.wr_6b_r,16)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }

    return (
        <>
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
        </>
     

        
    );
};

export default PartnersList;