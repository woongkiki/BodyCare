import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Input, Image, Modal,  } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, Alert, Animated, RefreshControl } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Font from '../common/Font';
import {noticeDataList, eventDataList} from '../Utils/DummyData';

import Api from '../Api';

const initialLayout = { width: Dimensions.get('window').width };

const NoticeEvent = (props) => {

    const {navigation} = props;


    const [noticeRefresh, setNoticeRefresh] = useState(false);
    const [eventRefresh, setEvenetReferesh] = useState(false);
    

    const [noticeDataReal, setNoticeDataReal] = useState([]);
    const noticeDataReceive = async () => {
        try{
            Api.send('contents_notice', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                   // console.log('결과 출력', arrItems);
                    setNoticeDataReal(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        noticeDataReceive();
    },[])

    const noticeRefreshOn = () => {
        noticeDataReceive();
    }

    //console.log('공지사항 데이터', noticeDataReal);

    const FirstRoute = () => {

        const noticeDatas = noticeDataReal.map((item, index)=>{
            return(
                <TouchableOpacity 
                    key={index} 
                    style={{paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}
                    onPress={()=>{navigation.navigate('NoticeView', item)}}
                >
                    <HStack alignItems='center' justifyContent='space-between' flexWrap='wrap'>
                        <VStack width='80%'>
                            <DefText text={item.datetime2} style={{fontSize:13, color:'#666'}} />
                            <DefText text={item.wr_subject} style={{color:'#191919', fontFamily:Font.RobotoBold, marginTop:5}} />
                        </VStack>
                        <Image
                            source={require('../images/buttonArrRightG.png')}
                            alt='화살표'
                        />
                    </HStack>
                </TouchableOpacity>
            )
        })
    
        return(
            <Box>
                <Box mt={5} borderTopWidth={1} borderTopColor='#f2f2f2'>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={noticeRefresh} onRefresh={noticeRefreshOn} />
                        }
                    >
                        {noticeDatas}
                    </ScrollView>
                </Box>
            </Box>
        )
    }

    const [eventDataReal, setEventDataReal] = useState([]);
    const EventDataReceive = async () => {
        try{
            Api.send('contents_event', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setEventDataReal(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        EventDataReceive();
    },[])


    const eventRefreshOn = () => {
        EventDataReceive();
    }

    //console.log('이벤트 리스트', eventDataReal);

    const SecondRoute = () => {

    const eventDatas = eventDataReal.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={index} 
                style={{paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}
                onPress={()=>{navigation.navigate('EventView', item)}}
            >
                <HStack alignItems='center' justifyContent='space-between' flexWrap='wrap'>
                    <VStack width='80%'>
                        <DefText text={item.datetime2} style={{fontSize:13, color:'#666'}} />
                        <DefText text={item.wr_subject} style={{color:'#191919', fontFamily:Font.RobotoBold, marginTop:5}} />
                    </VStack>
                    <Image
                        source={require('../images/buttonArrRightG.png')}
                        alt='화살표'
                    />
                </HStack>
            </TouchableOpacity>
        )
    })


    return(
            <Box>
                <Box mt={5} borderTopWidth={1} borderTopColor='#f2f2f2'>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={eventRefresh} onRefresh={eventRefreshOn} />
                        }
                    >
                        {eventDatas}
                    </ScrollView>
                </Box>
            </Box>
        )
    }
    

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key : 'first',
            title : '공지사항',
       
        },
        {
            key : 'second',
            title : '이벤트',
   
        }
    ])

    const _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x,i)=>i);

        return(
            <Box>
                <HStack>
                {props.navigationState.routes.map((route, i)=>{
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange:inputRange.map((inputIndex)=>
                            inputIndex === i ? 1 : 0.5
                        )
                    });
         

                    return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setIndex(i)}
                          style={[styles.tabButton, index === i ? { backgroundColor:'#CA0D3C', borderWidth:0} : { backgroundColor:'#fff', borderWidth:1}]}
                        >
                          <Animated.Text style={[ {fontSize:15, fontFamily:Font.RobotoMedium}, index === i ? { color:'#fff'} : { color:'#191919'} ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                      );
                })}
                </HStack>
            </Box>
        )
    }

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='공지사항 &amp; 이벤트' />
            
                <TabView
                    navigation={navigation}
                    navigationState={{index, routes}}
                    renderScene={renderScene}
                    renderTabBar={_renderTabBar}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                />
   
        </Box>
    );
};

const styles = StyleSheet.create({
    tabButton:{
        paddingVertical:15,
        width:'50%',
        borderWidth:1,
        borderColor:'#f2f2f2',
        alignItems:'center'
    }
})


export default NoticeEvent;