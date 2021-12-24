import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, Dimensions, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, Text, Image, VStack } from 'native-base';
import { mainTrainer } from '../Utils/DummyData';
import {DefText} from '../common/BOOTSTRAP';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import Api from '../Api';

const {width} = Dimensions.get('window');

const TrainerMain = (props) => {

    const {navigation, lat, lon} = props;


    const [refreshing, setRefreshing] = useState(false);

    const [trainersLoading, setTrainersLoading] = useState(true);

    const [trainerDataMainList, setTrainerDataMainList] = useState([]); 
    const trainerDataMainReceive = async () => {
        Api.send('trainers_list', {'nowlat':lat, 'nowlon':lon}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('트레이너 메인 ::: ', arrItems);
                setTrainersLoading(false);
                setTrainerDataMainList(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

    }

    useEffect(()=>{
        trainerDataMainReceive();
    },[])



  //  console.log('dsdsad',trainerDataMainList);

    //flatlist 렌더링
    const _renderItem = ({item, index}) => {

        //console.log(item);

        //const wr_6s = item.wr_6.split('|');

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
                    
                    {/* <DefText text={textLengthOverCut(wr_6s[1], 10)} style={[styles.blackBoxInnerTextContent]} /> */}
                    <DefText text={textLengthOverCut(item.partners_category, 11)} style={[styles.blackBoxInnerTextContent, {color:'#CA0D3C'}]} />
                </View>
            </TouchableOpacity>
        )
    }


    return (
       <>
        {
            trainersLoading ?
            <Box justifyContent='center' alignItems='center' flex={1}>
                <ActivityIndicator size={'large'} color="#333" />
            </Box>
            :
            <FlatList
                data={trainerDataMainList}
                horizontal={true}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                    <Box py={10} alignItems='center' justifyContent='center' width={width - 40}>
                        <DefText text='주변에 등록된 트레이너가 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
            />
        }
       </>
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

export default TrainerMain;