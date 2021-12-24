import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Input, Image, Modal } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, RefreshControl, Dimensions, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Api from '../Api';
const {width} = Dimensions.get('window');

const Menual = (props) => {

    const {navigation} = props;

    const menualContent = `
        <p>
            바디캐어 설명서가 출력됩니다.
        </p>
    `;

    const [menualRefresh, setMenualRefesh] = useState(false);

   

    const [menual, setMenual] = useState([]);
    const MenualData = async () => {
        try{
            Api.send('config_manual', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setMenual(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        MenualData();
    },[]);


    const menualRefreshOn = () =>{
        MenualData();
    }

    //console.log('앱설명서',menual.co_content);

    return (

        <Box flex={1} bg='#fff'>
             <HeaderDef navigation={navigation} headertitle='바디케어 설명서' />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={menualRefresh} onRefresh={menualRefreshOn} />
                }
            >
                <Box p={5}>
                    {/* <HTML 
                        source={{ html: menual['co_content'] && menual['co_content']}} 
                        tagsStyles={StyleHtml} 
                        contentWidth={Dimensions.get('window').width}  
                    /> */}

                    <HTML 
                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                        ignoredTags={['head', 'script', 'src']}
                        imagesMaxWidth={Dimensions.get('window').width - 40}
                        source={{ html: menual['co_content'] && menual['co_content']}} 
                        tagsStyles={StyleHtml} 
                        containerStyle={{ flex: 1, }}
                        contentWidth={Dimensions.get('window').width}  
                    />
                </Box>
            </ScrollView>
        </Box>


    );
};


export default Menual;