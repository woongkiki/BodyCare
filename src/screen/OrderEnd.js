import React, {useEffect, useState} from 'react';
import { Box, Text, Image, VStack, HStack, Modal, CheckIcon, Input} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Alert, SafeAreaView } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderShopEnd from '../components/HeaderShopEnd';
import Font from '../common/Font';
import { shopitemdatas } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut  } from '../common/dataFunction';
import Api from '../Api';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const OrderEnd = (props) => {

    const {navigation, route} = props;

    const {params} = route;
    
    console.log('params::', params);

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderShopEnd navigation={navigation} headertitle='주문완료' />
            <ScrollView>
                <Box p={5}>
                    <DefText text='주문하신 상품 구매가 완료되었습니다.' style={{textAlign:'center'}} />
                    <DefText text='배송이 시작되면 알림을 보내드립니다.' style={{textAlign:'center'}} />
                    {
                        params != undefined &&
                        <VStack mt={5} p={2.5} py={5} borderWidth={1} borderColor={'#ccc'}>
                            {
                                params.itemList.map((item, index)=> {
                                    return(
                                        <HStack key={index} justifyContent={'space-between'} alignItems={'center'}>
                                            <DefText text={item.it_name} />
                                            <HStack>
                                                <DefText text={numberFormat(item.it_price) + '원'} />
                                                <DefText text={' (' + item.count + '개)'} />
                                            </HStack>
                                        </HStack>
                                    )
                                })
                            }
                        </VStack>
                    }
                    {
                        params != undefined &&
                        <Box p={2.5} borderWidth={1} borderColor={'#ccc'} mt={2.5}>
                            <HStack justifyContent={'space-between'}>
                                <DefText text='총 주문 금액 합계' />

                                <HStack>
                                    <DefText text={numberFormat(params.sumPrice) + '원'} style={{color:'#CA0D3C', fontFamily:Font.RobotoBold}} />
                                </HStack>
                            </HStack>
                        </Box>
                    }
                </Box>
            </ScrollView>
            <Box p={5}>
                <TouchableOpacity style={styles.paySubmitButton} onPress={()=>navigation.navigate('Tab_Navigation')}>
                    <DefText text='메인으로' style={styles.paySubmitText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    paySubmitButton : {
        height:40,
        backgroundColor:'#CA0D3C',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    paySubmitText: {
        fontSize:14,
        color:'#fff'
    }
})

export default OrderEnd;