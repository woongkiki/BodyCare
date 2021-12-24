import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, FlatList, Platform, Dimensions, ScrollView, Share } from 'react-native';
import YouTube from 'react-native-youtube';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { onlinePtData } from '../Utils/DummyData';
import {textLengthOverCut } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';

const {width} = Dimensions.get('window');

const OnlinePtView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log(params);

     //좋아요
     const [onlinePtHeart, setOnlinePtHeart] = useState(false);

     //공유
    const onShare = async () => {
        try{
            const result = await Share.share({
                message:'https://www.youtube.com/watch?v=' + params.wr_1,
            })
            if(result.action === Share.sharedAction) {
                if(result.activityType){

                }else{

                }
            }else if(result.action === Share.dismissedAction){

            }
        }catch(error){
            ToastMessage(error.message);
        }
    }

    const [onlineRelatedDatas, setOnlineRelatedDatas] = useState([]);
    const OnlineRelatedData = async () => {
        Api.send('contents_onlineRelate', {'categorys':params.ca_name, 'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                //console.log('결과', arrItems);
                setOnlineRelatedDatas(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
    }

    useEffect(()=>{
        OnlineRelatedData();
    },[])


    
    //연관동영상
    const onlinePtDataComponents = onlineRelatedDatas.map((item, index)=>{ // 게시글로 불러올 onlinePtData map함수로 컴포넌화
        return(
            <TouchableOpacity
                 key={index} 
                 style={[index===0?{marginTop:0}:{marginTop:20}]}
                 onPress={()=>{navigation.navigate('OnlinePtView', item)}}
            >
                <HStack>
                    <Image
                        source={{uri:item.imageUrl}}
                        alt={item.wr_subject}
                        style={{
                            width:width*0.4,
                            height:100,
                            borderRadius:5
                        }}
                    />
                    <Box style={{width:width*0.6, paddingLeft:15, paddingTop:10}}>
                        <DefText text={textLengthOverCut(item.wr_subject, 15)} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                        <DefText text={item.datetime2} style={{fontFamily:Font.RobotoMedium, color:'#666', marginTop:15}} />
                    </Box>
                </HStack>
                
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef  navigation={navigation} />
            <ScrollView>
                <Box>
                    <YouTube
                        videoId={params.wr_1}
                        apiKey="AIzaSyAiRHxKjYayEw9rpMwL8D64EDZ3fTX67aU"
                        play={false}
                        fullscreen={false}
                        loop={false}
                        onReady={(e) => console.log('onReady')}
                        onChangeState={(e) => console.log('onChangeState:', e.state)}
                        onChangeQuality={(e) => console.log('onChangeQuality: ', e.quality)}
                        onError={(e) => console.log('onError: ', e.error)}
                        style={{width: width, height: 230}}
                    />
                    <Box p={5} borderBottomWidth={1} borderBottomColor='#f2f2f2'>
                        <DefText text={textLengthOverCut(params.wr_subject)} style={[{fontSize:16, fontFamily:Font.RobotoBold}]} />
                        <DefText text={params.datetime2} style={{marginTop:10}} />
                        <Box position='absolute' top={5} right={5} zIndex={100}>
                            <HStack>
                                <TouchableOpacity onPress={()=>{setOnlinePtHeart(!onlinePtHeart)}}>
                                    {
                                        onlinePtHeart ?
                                        <Image 
                                            source={require('../images/viewpageHeartOn.png')} 
                                            alt='좋아요'
                                            mr={2}
                                        />
                                        :
                                        <Image 
                                            source={require('../images/viewpageHeart.png')} 
                                            alt='좋아요'
                                            mr={2}
                                        />
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{onShare()}}>
                                    <Image 
                                        source={require('../images/viewpageShare.png')} 
                                        alt='공유하기'
                                    />
                                </TouchableOpacity>                                     
                            </HStack>
                        </Box>
                    </Box>
                    <Box p={5} borderBottomWidth={1} borderBottomColor='#f2f2f2'>
                        <DefText text='소개' style={[{fontSize:16, fontFamily:Font.RobotoBold}]} />
                        <Box mt={2.5}>
                            <HTML 
                                source={{html:params.wr_content}} 
                                tagsStyles={StyleHtml} 
                                contentWidth={Dimensions.get('window').width}  
                            />
                        </Box>
                    </Box>
                    <Box p={5}>
                        <DefText text='연관 동영상' style={{marginBottom:20}} />
                        <Box>
                            {
                                onlineRelatedDatas.length > 0 ?
                                onlinePtDataComponents
                                :
                                <Box py={5} alignItems='center'>
                                    <DefText text='등록된 영상이 없습니다.' style={{color:'#666'}} />
                                </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default OnlinePtView;