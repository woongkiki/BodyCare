import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Text, Input, Image } from 'native-base';
import {  Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Api from '../Api';

const TermsContent = (props) => {

    const {navigation} = props;


    const [termsRefresh, setTermsRefresh] = useState(false);

    const [loading, setLoading] = useState(true);
    const [termContent, setTermContent] = useState([]);
    const TermData = async () => {
        try{
            Api.send('config_term', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setLoading(false);
                    setTermContent(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
            });
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        TermData();
    },[]);

    const TermsRefreshOn = () => {
        setLoading(true)
        TermData();
    }

    return (
        <Box flex={1} bg='#fff'>
            

            <HeaderDef navigation={navigation} headertitle='이용약관' />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={termsRefresh} onRefresh={TermsRefreshOn} />
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
                        source={{html: termContent && termContent.co_content}} 
                        tagsStyles={StyleHtml} 
                        contentWidth={Dimensions.get('window').width}  
                    /> */}
                    <HTML 
                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'textDecorationColor']}
                        ignoredTags={['head', 'script', 'src']}
                        imagesMaxWidth={Dimensions.get('window').width - 40}
                        source={{html: termContent && termContent.co_content}} 
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

export default TermsContent;