import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, Dimensions, StyleSheet, View, PermissionsAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, Text, Image, VStack } from 'native-base';
import { mainPartners } from '../Utils/DummyData';
import {DefText} from '../common/BOOTSTRAP';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import Api from '../Api';
import Geolocation from 'react-native-geolocation-service';

const {width} = Dimensions.get('window');

const PartnerMain = ( props ) => {

    const {navigation, lat, lon} = props;

    //console.log('latlatlat::',lat);
    //console.log('latlatlat::',lon);
    const [refreshing, setRefreshing] = useState(false);
    //console.log(lat);
    const [partnersMainLoading, setPartnersMainLoading] = useState(true);

    const [partnersDataHome, setPartnersDataHome] = useState([]);
    const partnersDataHomeReceive = async () => {
        
        Api.send('contents_partners', {'nowlat':lat, 'nowlon':lon}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 출력 : ', arrItems);
                setPartnersMainLoading(false);
                setPartnersDataHome(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

    }

    useEffect(()=>{
        partnersDataHomeReceive();
    },[partnersMainLoading])

    const refreshList = () => {
        partnersDataHomeReceive();
    }

    //console.log('파트너스 데이터 : ' , partnersDataHome);

    //flatlist 렌더링
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
                
            </TouchableOpacity>
        )
    }

    return (
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                    ListEmptyComponent={
                        <Box py={10} alignItems='center' justifyContent='center' width={width - 40}>
                            <DefText text='주변에 등록된 시설이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                />
            }
        </Box>
    );
};

export default PartnerMain;