import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Image, Text } from 'native-base';
import { TouchableOpacity, FlatList, Dimensions, PermissionsAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import { mainTrainer } from '../Utils/DummyData';
import { DefText } from '../common/BOOTSTRAP';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import Api from '../Api';
import Geolocation from 'react-native-geolocation-service';

const {width} = Dimensions.get('window');
const imgSize = width * 0.4;

const TrainersList = (props) => {

    const {navigation, trainerText, latitudeInfo, longitudeInfo} = props;


    const [refreshing, setRefreshing] = useState(false);
    //console.log(trainerText);
    const [trainerLoading, setTrainerLoading] = useState(true);

    

    //console.log('현재주소',latitudeInfo + ',' + longitudeInfo);


    const [trainerRealData, setTrainerRealData] = useState([]);

    const trainerDataReceive = async () => {
        Api.send('trainers_list', {'trainerSch':trainerText, 'nowlat':latitudeInfo, 'nowlon':longitudeInfo}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 출력 : ', arrItems);
                setTrainerLoading(false);
                setTrainerRealData(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

    }

   

    useEffect(()=>{
        trainerDataReceive();
    },[trainerLoading])

    const refreshList = () => {
        //setRefreshing(true)
        trainerDataReceive();
    }

    //console.log('트레이너 데이터 : ' , trainerRealData);

    const _renderItem = ({item, index}) => {

        //console.log('item:::',item)

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
                            <DefText text={textLengthOverCut(item.wr_subject + ' 선생님', 5)} style={{marginBottom:10, fontSize:16, fontFamily:Font.RobotoBold}} />
                            <DefText text={textLengthOverCut(item.wr_6b_r, 15)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                            <DefText text={item.gym_title} style={{color:'#666',marginTop:5}} />
                            <DefText text={wr_6s[1]} style={{color:'#666', marginTop:5}} />
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

    return (
        <>
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
        </>
        
    );
};

export default TrainersList;