import React, {useState} from 'react';
import { Box, Text, Image, VStack, HStack, Input, Select} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const ItmeUseForm = (props) => {

    const {navigation, route} = props;

    //console.log(route.params);

    const [scoreStar, setScoreStar] = useState('5');

    let scoreImg = '';
    if(scoreStar === '1'){
        scoreImg = <Image source={require("../images/s_star1.png")} width={60}
        height={11} alt='5점' />;
    }else if(scoreStar === '2'){
        scoreImg = <Image source={require("../images/s_star2.png")} width={60}
        height={11} alt='4점' />;
    }else if(scoreStar === '3'){
        scoreImg = <Image source={require("../images/s_star3.png")} width={60}
        height={11} alt='3점' />;
    }else if(scoreStar === '4'){
        scoreImg = <Image source={require("../images/s_star4.png")} width={60}
        height={11} alt='2점' />;
    }else if(scoreStar === '5'){
        scoreImg = <Image source={require("../images/s_star5.png")} width={60}
        height={11} alt='1점' />;
    }


    const [itemformContent, setItemFormContent] = useState('');
    const ItemUseChange = (text) => {
        setItemFormContent(text);
    }

    return (
        <>
        <Box flex={1} bg='#fff'>
            <KeyboardAvoidingView behavior={ Platform === 'ios' ? 'padding' : '' }>
                <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <Box>
                    <HeaderDef navigation={navigation} headertitle='구매후기 작성' />
                    <Box p={5} bg='#fff'>
                        <VStack>
                            <Box>
                                <HStack alignItems='center' mb={2.5}>
                                    <DefText text='제품명' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                                    <DefText text={route.params.title} />
                                </HStack>
                            </Box>
                            <Box mt={5}>
                                <HStack alignItems='center' mb={2.5}>
                                    <DefText text='평점' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                                    {
                                        scoreImg
                                    }
                                </HStack>
                                <Box alignItems='flex-end'>
                                    <Select
                                        selectedValue={scoreStar} 
                                        height={46}
                                        width='80%'
                                        backgroundColor='#fff'
                                        placeholder='평점을 선택하세요.'
                                        onValueChange={(itemValue) => setScoreStar(itemValue)}
                                    >
                                        <Select.Item 
                                            label={ 
                                                <>
                                                <HStack alignItems='center'>
                                                    <Image source={require("../images/s_star5.png")} style={{width:80, height:15}} alt='평점' />
                                                    <DefText text='5점' style={{fontSize:15, marginLeft:10}} />
                                                </HStack>
                                                </>
                                            } 
                                            value='5' 
                                        />
                                        <Select.Item 
                                            label={ 
                                                <>
                                                <HStack alignItems='center'>
                                                    <Image source={require("../images/s_star4.png")} style={{width:80, height:15}} alt='평점' />
                                                    <DefText text='4점' style={{fontSize:15, marginLeft:10}} />
                                                </HStack>
                                                </>
                                            } 
                                            value='4' 
                                        />
                                        <Select.Item 
                                            label={ 
                                                <>
                                                <HStack alignItems='center'>
                                                    <Image source={require("../images/s_star3.png")} style={{width:80, height:15}} alt='평점' />
                                                    <DefText text='3점' style={{fontSize:15, marginLeft:10}} />
                                                </HStack>
                                                </>
                                            } 
                                            value='3' 
                                        />
                                        <Select.Item 
                                            label={ 
                                                <>
                                                <HStack alignItems='center'>
                                                    <Image source={require("../images/s_star2.png")} style={{width:80, height:15}} alt='평점' />
                                                    <DefText text='2점' style={{fontSize:15, marginLeft:10}} />
                                                </HStack>
                                                </>
                                            } 
                                            value='2' 
                                        />
                                        <Select.Item 
                                            label={ 
                                                <>
                                                <HStack alignItems='center'>
                                                    <Image source={require("../images/s_star1.png")} style={{width:80, height:15}} alt='평점' />
                                                    <DefText text='1점' style={{fontSize:15, marginLeft:10}} />
                                                </HStack>
                                                </>
                                            } 
                                            value='1' 
                                        />
                    
                                    </Select>
                                </Box>
                            </Box>
                            <Box mt={5}>
                                <HStack  mb={2.5}>
                                    <DefText text='내용' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                                    <Input 
                                        _focus='transparent'
                                        value={itemformContent}
                                        height={150}
                                        width='80%'
                                        onChangeText={() => {ItemUseChange()}}
                                        textAlignVertical='top'
                                    />
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>

                </Box>
                </TouchableWithoutFeedback>
                
            </KeyboardAvoidingView>
        </Box>
            <TouchableOpacity 
            style={{
                height:46,
                backgroundColor:'#CA0D3C',
                justifyContent:'center',
                alignItems:'center',
                
            }}
        >
            <DefText text='작성완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
        </TouchableOpacity>
        </>
    );
};

export default ItmeUseForm;