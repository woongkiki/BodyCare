import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Input, Image, Modal } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, Alert, RefreshControl, ActivityIndicator } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { faqDataList } from '../Utils/DummyData';
import { DefText } from '../common/BOOTSTRAP';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Font from '../common/Font';

import Api from '../Api';

const Faq = (props) => {

    const {navigation} = props;


    const [faqRefresh, setFaqRefresh] = useState(false);
    const [faqLoading, setFaqLoading] = useState(true);

    const [faqSelectNumber, setFaqSelectNumber] = useState('');
    const [index, setIndex] = useState('');
   

    const _faqSelects =  (number) => {

        setFaqSelectNumber(number);
    
    }

    const [faqDataReal, setFaqDataReal] = useState([]);
    const faqDataReceive = async () => {
        try{
            Api.send('contents_faq', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setFaqLoading(false);
                    setFaqDataReal(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }

            })
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        faqDataReceive();
    },[])

    const faqRefreshOn = () => {
        setFaqLoading(true);
        faqDataReceive();
    }


    const faqDatas = faqDataReal.map((item, index)=>{
        return(
            <Box key={index}>
                <TouchableOpacity 
                    style={[styles.faqButtons]}
                    onPress={()=>{_faqSelects(index)}}
                    activeOpacity={0.9}
                >
                    <HStack alignItems='center' justifyContent='space-between' flexWrap='wrap'>
                         <DefText text={item.wr_subject} style={[styles.faqButtonTitle, {width:'80%'}]} />
                         {
                             index === faqSelectNumber ?
                            <Image source={require('../images/faqArrUp.png')} alt='화살표' />
                            :
                            <Image source={require('../images/faqArrDown.png')} alt='화살표' />
                         }  
                       
                    </HStack>
                </TouchableOpacity>
                {
                    index === faqSelectNumber &&
                    <Box p={5} bg='#F2F2F2'>
                        {/* <HTML 
                            source={{html:item.wr_content}} 
                            tagsStyles={StyleHtml} 
                            contentWidth={Dimensions.get('window').width-40}
                        /> */}
                        <HTML 
                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'textDecorationColor']}
                            ignoredTags={['head', 'script', 'src']}
                            imagesMaxWidth={Dimensions.get('window').width - 40}
                            source={{html:item.wr_content}} 
                            tagsStyles={StyleHtml} 
                            containerStyle={{ flex: 1, }}
                            contentWidth={Dimensions.get('window').width}  
                        />
                    </Box>
                }
               
            </Box>
        )
    })

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='FAQ (자주 묻는 질문)' />
            <VStack>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={faqRefresh} onRefresh={faqRefreshOn} />
                    }
                >
                    {
                        faqLoading ?
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <ActivityIndicator size={'large'} color="#333" />
                        </Box>
                        :
                        faqDataReal ?
                        faqDatas
                            :
                            <Box>
                                <DefText text="등록된 질문 목록이 없습니다." />
                            </Box>
                    }
                </ScrollView>
            </VStack>
        </Box>
    );
};

const styles = StyleSheet.create({
    faqButtons : {
        paddingHorizontal:20,
        paddingVertical:15,
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2'
    },
    faqButtonTitle : {
        fontSize:15,
        color:'#666'
    }
})

export default Faq;