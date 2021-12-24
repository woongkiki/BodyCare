import React, { useState } from 'react';
import { Box, VStack, HStack, Image, Input, ScrollView, Select, CheckIcon } from 'native-base';
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';

import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { phoneFormat } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

import Api from '../Api';

const Inquiry = (props) => {

    const {navigation, route, userInfo} = props;

  

    let inqTypeProp;
    if(route.params){
        inqTypeProp = route.params.inqType;
    }else{
        inqTypeProp = '';
    }

    const [inqType, setInqType] = useState(inqTypeProp);


    //연락처값
    let phonenumberch;
    const [phoneNumbers, setPhoneNumbers] = useState('');
    const _phoneNumberChange = (number) => {
        phonenumberch = phoneFormat(number);
        setPhoneNumbers(phonenumberch);
    }

    //문의 내용입력
    const [inqContent, setInqContent] = useState('');
    const _inqContentChange = (text) => {
        setInqContent(text);
    }

    //개인정보 수집동의
    const [inqAgreeValue, setInqAgreeValue] = useState(false);
    const [isMember, setIsMember] = useState('비회원');

    const refreshInq = (m) => {
        
        ToastMessage(m);
        navigation.replace('Inquiry');
    }

    const _inqSubmitConfirm = async () => {
        try{

            if(!inqType){
                ToastMessage('문의유형을 선택하세요.');
                return false;
            }
            if(!phoneNumbers){
                ToastMessage('연락처를 입력해주세요.');
                return false;
            }
            if(!inqContent){
                ToastMessage('문의내용을 입력해주세요.');
                return false;
            }
            if(!inqAgreeValue){
                ToastMessage('개인정보 수집에 동의해주세요.');
                return false;
            }
            if(userInfo){
                setIsMember(userInfo['mb_id']);
            }

            //console.log(isMember);

            Api.send('contents_inquiry', {'category':inqType, 'phoneNumber':phoneNumbers, 'content':inqContent, 'mb_id':isMember}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;

                if(resultItem.result === 'Y' && arrItems) {
                    console.log('결과 출력', resultItem.message);
                    refreshInq(resultItem.message);
                    
                }else{
                    console.log('결과 출력 실패');
                }
            });

        }catch(e){
            console.log(e);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS==='ios'? 'padding' : ''} flex={1} bg='#fff'>
            <Box bg='#fff' flex={1} >
                <HeaderDef navigation={navigation} headertitle='문의하기' />
                <ScrollView>
                    <VStack py={5} px={5}>
                        <HStack  mb={4}>
                            <DefText text='문의유형' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                            <DefText text='*' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                        </HStack>
                        <Select
                            selectedValue={inqType} 
                            height={46}
                            backgroundColor='#fff'
                            placeholder='문의유형을 선택하세요.'
                            onValueChange={(itemValue) => setInqType(itemValue)}
                        >
                            <Select.Item label="일반문의" value='일반문의' />
                            <Select.Item label="1회 체험문의" value='1회 체험문의' />
                            <Select.Item label="파트너사 센터 가입문의" value='파트너사 센터 가입문의' />
                            <Select.Item label="트레이너 가입문의" value='트레이너 가입문의' />
                            <Select.Item label="신고하기" value='신고하기' />
                            <Select.Item label="기타" value='기타' />
                        </Select>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='연락처' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <DefText text='*' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                            </HStack>
                            <Input
                                _focus='transparent'
                                height={46}
                                backgroundColor='#fff'
                                placeholder='연락처를 입력해주세요.(-는 뺴고입력)'
                                mt={3}
                                keyboardType='phone-pad'
                                value={phoneNumbers}
                                onChangeText={_phoneNumberChange}
                                maxLength={13}
                            />
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='내용' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <DefText text='*' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                            </HStack>
                            <Input
                                _focus='transparent'
                                height={240}
                                backgroundColor='#fff'
                                placeholder='센터명, 주소, 담당자 성함, 내용 등 입력해주세요.'
                                mt={3}
                                multiline={true}
                               value={inqContent}
                               onChangeText={_inqContentChange}
                               textAlignVertical='top'
                            />
                        </Box>
                        <Box mt={5}>
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>{setInqAgreeValue(!inqAgreeValue)}}>
                                    <Box mr={2} width='19px' height='19px' borderRadius='5px' backgroundColor='#fff' borderWidth={1} borderColor='#999' justifyContent='center' alignItems='center'>
                                        {
                                            inqAgreeValue && <CheckIcon width='13px' height='13px' color='#CA0D3C'  />
                                        }
                                        
                                    </Box>
                                </TouchableOpacity>
                                <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:'#666'}}>
                                    <DefText text='개인정보 수집 및 이용약관에 대하여 동의합니다.' style={{fontSize:15, color:'#666'}} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        
                    </VStack>
                </ScrollView>
                <TouchableOpacity 
                    style={{
                        height:46,
                        backgroundColor:'#CA0D3C',
                        justifyContent:'center',
                        alignItems:'center',
                        
                    }}
                    onPress={()=>{_inqSubmitConfirm()}}
                >
                    <DefText text='작성완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
                </TouchableOpacity>
            </Box>
        </KeyboardAvoidingView>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(Inquiry);