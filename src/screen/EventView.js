import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack } from 'native-base';
import { Dimensions, ScrollView } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Font from '../common/Font';
import Api from '../Api';
import {textLengthOverCut} from '../common/dataFunction';
const EventView = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    //console.log(params);

    const [eventViewData, setEventViewData] = useState([{'wr_content':'내용'}]);
    const eventView = async () => {
        try{
            Api.send('contents_eventView', {'wr_id':params.wr_id}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    console.log('결과 출력', arrItems);
                    //setNoticeViewData(arrItems);
                    setEventViewData(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        eventView();
    },[])

    //console.log('공지사항 뷰 : ',noticeViewData[0]['wr_content'])

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} />
            <ScrollView>
                <VStack>
                    <HStack py={4} px={5} borderBottomWidth={1} borderBottomColor='#f2f2f2' justifyContent='space-between' flexWrap='wrap' alignItems='center'>
                        <DefText text={eventViewData.wr_subject} style={{color:'#191919', fontFamily:Font.RobotoBold, width:'70%'}} />
                        <DefText text={eventViewData.datetime2} style={{fontSize:13, color:'#666'}} />
                    </HStack>
                    <Box px={5} py={4}>
                        {/* <HTML 
                            source={{html:eventViewData[0]['wr_content']}} 
                            tagsStyles={StyleHtml} 
                            contentWidth={Dimensions.get('window').width}  
                        /> */}
                        <HTML 
                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                            ignoredTags={['head', 'script', 'src']}
                            imagesMaxWidth={Dimensions.get('window').width - 40}
                            source={{html: eventViewData.wr_content}} 
                            tagsStyles={StyleHtml} 
                            containerStyle={{ flex: 1, }}
                            contentWidth={Dimensions.get('window').width}  
                        />
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    );
};

export default EventView;