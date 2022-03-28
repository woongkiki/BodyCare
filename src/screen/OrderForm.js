import React, {useEffect, useState} from 'react';
import { Box, Text, Image, VStack, HStack, Modal, CheckIcon, Input} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Alert, SafeAreaView } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { shopitemdatas } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut  } from '../common/dataFunction';
import Api from '../Api';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Postcode from '@actbase/react-daum-postcode';

const {width} = Dimensions.get('window');

const OrderForm = (props) => {

    const {navigation, userInfo, route, member_info} = props;

    const {params} = route;


   console.log('21312321',params);

    const [itemInfo, setItemInfo] = useState('');
    const [itemSumPrice, setItemSumPrice] = useState('');

    useEffect(()=>{
        if(userInfo != null){
            setOrderName(userInfo.mb_name);
            setOrderPhoneNumber(userInfo.mb_hp);
        }

        if(params != undefined){
            setItemInfo(params.itemList);
            setItemSumPrice(params.sumPrice)
        }
    },[userInfo, params])


    useEffect(()=>{
        console.log('ㅁㄴㅇㅁㄴㅇ', itemInfo);
    }, [itemInfo])

//    console.log('주문폼::', userInfo);

    const [orderName, setOrderName] = useState('');
    const orderNameChange = (text) => {
        setOrderName(text);
    }

    const [orderPhoneNumber, setOrderPhoneNumber] = useState('');
    const phoneNumberChange = (phone) => {
        setOrderPhoneNumber(phone);
    }

    //배송지정보
    const [baesongInfo, setBaesongInfo] = useState('');
    const baesongChange = (baesong) => {
        setBaesongInfo(baesong);
    }

    //주소정보
    const [addrText, setAddrText] = useState('');
    const addrChange = (addr) => {
        setAddrText(addr);
    }

    //추가주소정보
    const [addrText2, setAddrText2] = useState('');
    const addrTextChange2 = (addr2) => {
        setAddrText2(addr2);
    }

    const [addrModal, setAddrModal] = useState(false);

    const addrSumits = (addrZip, addr1) => {
        setBaesongInfo(addrZip);
        setAddrText(addr1);
        //setAddrText2(addr2);
    }

    const paySubmit = () => {

        if(!orderName) {
            ToastMessage('주문자명을 입력하세요.');
            return false;
        }

        if(!orderPhoneNumber){
            ToastMessage('주문자 연락처를 입력하세요.');
            return false;
        }

        if(!addrText){
            ToastMessage('배송지 정보를 입력하세요.');
            return false;
        }

        console.log('상품구매완료..');

        navigation.replace('OrderEnd', params);
    }


    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderDef navigation={navigation} headertitle='주문하기' />
            <ScrollView>
                <Box p={5}>
                    <DefText text='주문자 정보' style={[styles.labelText]} />
                    <Box mt={2.5}>
                        <DefText text='주문자명' style={{color:'#666'}} />   
                        <Input
                            placeholder='주문자명'
                            height='45px'
                            value={orderName}
                            onChangeText={orderNameChange}
                            _focus='transparent'
                            style={{marginTop:10, fontSize:14}}
                        />
                    </Box>
                    <Box mt={5}>
                        <DefText text='주문자 연락처' style={styles.orderInfoSubTitle} />
                        <Input
                            placeholder='주문자 연락처'
                            height='45px'
                            value={orderPhoneNumber}
                            onChangeText={phoneNumberChange}
                            _focus='transparent'
                            style={{marginTop:10, fontSize:14}}
                        />
                    </Box>
                    <Box mt={5}>
                        <DefText text='배송지정보' style={styles.orderInfoSubTitle} />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <Input
                                placeholder='지번'
                                width={(width-40)*0.6}
                                height='45px'
                                value={baesongInfo}
                                onChangeText={baesongChange}
                                _focus='transparent'
                                style={{fontSize:14}}
                            />
                            <TouchableOpacity onPress={() => setAddrModal(true)} style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:5, borderWidth:1,borderColor:'#999'}}>
                                <DefText text='주소찾기' style={{fontSize:14}} />
                            </TouchableOpacity>
                        </HStack>
                        <Box mt={2.5}>
                            <Input 
                                placeholder='상세주소를 입력하세요.'
                                height='45px'
                                value={addrText}
                                onChangeText={addrChange}
                                _focus='transparent'
                                style={{fontSize:14}}
                            />
                        </Box>
                        <Box mt={2.5}>
                            <Input 
                                placeholder='추가주소를 입력하세요.'
                                height='45px'
                                value={addrText2}
                                onChangeText={addrTextChange2}
                                _focus='transparent'
                                style={{fontSize:14}}
                            />
                        </Box>

                        <Box mt={5}>
                            <DefText text='주문상품' style={styles.labelText}  />
                            {
                                itemInfo != '' && 
                                <>
                                {
                                    itemInfo.map((item, index)=> {
                                        return (
                                            <HStack key={index} alignItems='center' justifyContent={'space-between'} style={{marginTop:10}}>
                                                <Box>
                                                    <DefText text={item.it_name}/>
                                                </Box>
                                                <HStack>
                                                    <DefText text={numberFormat(item.it_price) + '원'} style={{marginRight:10}}/>
                                                    <DefText text={' ('+item.count+'개)'} />
                                                </HStack>
                                            </HStack>
                                        )
                                    })
                                }
                               
                                </>
                            }
                            
                            <Box mt={5}>
                                <HStack justifyContent='space-between'>
                                    <DefText text='최종결제금액' style={styles.totalPrice} />
                                    {
                                        itemSumPrice != '' &&
                                        itemSumPrice == '0' ?
                                        <DefText text={ itemSumPrice + "원"} style={styles.totalPrice} />
                                        :
                                        <DefText text={ numberFormat(itemSumPrice) + "원"} style={styles.totalPrice} />
                                    }
                                    
                                </HStack>
                            </Box>
                        </Box>

                        <Box mt={5}>
                            <TouchableOpacity style={styles.paySubmitButton} onPress={()=>paySubmit()}>
                                <DefText text='결제하기' style={styles.paySubmitText} />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} flex={1}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setAddrModal(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                        <DefText text='다음주소찾기' style={{fontSize:20, lineHeight:23}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>

                    <Postcode
                    style={{ width: width, height: 320, flex:1 }}
                    jsOptions={{ animation: true, hideMapBtn: true }}
                    onSelected={data => {
                        console.log(data);
                        addrSumits(data.zonecode, data.address)
                        setAddrModal(false);
                    }}
                    onError={e=>console.log(e)}
                    />

                </SafeAreaView>

            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    labelText : {
        fontSize:16,
        color:'#333',
        fontFamily:Font.RobotoBold
    },
    priceText: {
        fontSize:13,
        color:'#333'
    },
    totalPrice : {
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(OrderForm);