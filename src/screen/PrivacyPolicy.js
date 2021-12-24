import React,{useState, useEffect} from 'react';
import { Box, VStack, HStack, Text, Input, Image } from 'native-base';
import {  Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Api from '../Api';

const PrivacyPolicy = (props) => {

    const {navigation} = props;


    const privacyContent = `
        <p>
            관리자에서 입력한 개인정보처리방침이 출력됩니다.
        </p>
    `;

    const [privacyRefresh, setPrivacyRefresh] = useState(false);

    const [loading, setLoading] = useState(true);
    const [privacy, setPrivacy] = useState([]);
    const PrivacyData = async () => {
        try{
            Api.send('config_privacy', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setLoading(false);
                    setPrivacy(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        PrivacyData();
    },[]);

    const privacyRefreshOn = () => {
        setLoading(true);
        PrivacyData();
    }

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='개인정보처리방침' />
            <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={privacyRefresh} onRefresh={privacyRefreshOn} />
                }
            >
                {
                    loading ?
                    <Box justifyContent='center' alignItems='center' height={200}>
                        <ActivityIndicator size={'large'} color="#333" />
                    </Box>
                    :
                    <Box p={5}>
                        {/* <HTML 
                            source={{html: privacy && privacy.co_content}} 
                            tagsStyles={StyleHtml} 
                            contentWidth={Dimensions.get('window').width}  
                        /> */}
                        <HTML 
                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'textDecorationColor']}
                            ignoredTags={['head', 'script', 'src']}
                            imagesMaxWidth={Dimensions.get('window').width - 40}
                            source={{html: privacy && privacy.co_content}} 
                            tagsStyles={StyleHtml} 
                            containerStyle={{ flex: 1, }}
                            contentWidth={Dimensions.get('window').width}  
                        />
                </Box>
                }
            </ScrollView>
        </Box>
    );
};

export default PrivacyPolicy;