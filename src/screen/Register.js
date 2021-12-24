import React, {useEffect, useState} from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';

let t1;
let tcounter;
let temp;

const Register = (props) => {

    const {navigation} = props;

    const [idText, setIdText] = useState('');
    const _idChangeText = text => {
        setIdText(text);
    }

    const [passwordText, setPasswordText] = useState('');
    const _passwordChangeText = text => {
        setPasswordText(text);
    }

    const [passwordTextConfirm, setPasswordTextConfirm] = useState('');
    const _passwordChangeTextConfirm = text => {
        setPasswordTextConfirm(text);
    }

    const [phoneNumber, setPhoneNumber] = useState('');
    const [changePhone, setChangePhone] = useState('');
    const _phoneNumberChange = (phone) => {
        setPhoneNumber(phone);
        let changePhone = phoneFormat(phone);
        setChangePhone(changePhone);
    }

    const [smsRandNumber, setSmsRandNumber] = useState();
    const _smsSendNumberChage = text => {
        setSmsRandNumber(text);
    }

    const [timeStamp, setTimeStamp] = useState('');
    const [phoneIntervel, setPhoneInterval] = useState(false);
    const [intervals, setIntervals] = useState(false);
    const [authTile, setAuthTitle] = useState('인증완료');
    const [authButtonState, setAuthButtonState] = useState(true);
    const [nextButtonState, setNextButtonState] = useState(true)

    
    const timer_start = () => {
        tcounter = 30;
        t1 = setInterval(Timer, 1000);
        //console.log(t1);
    };

    const Timer = () => {
        //setPhoneInterval(false);
        tcounter = tcounter - 1;
        // temp = Math.floor(tcounter / 60);
        // temp = temp + (tcounter % 60);

        temp = Math.floor(tcounter/60);
        if(Math.floor(tcounter/60) < 10)  temp = '0'+temp;								
        temp = temp + ":";   								
        if((tcounter % 60) < 10)temp = temp + '0';
        temp = temp + (tcounter % 60);

        //console.log(temp);
        setTimeStamp(temp);
        //setIntervals(true); //실행중

        
        if (tcounter <= 0) {
            //timer_stop();
            setPhoneInterval(false);
        }
    };


    const [ransoo, setRansoo] = useState('');
    const _sendSmsButton = () => {
        if(phoneNumber.length==0){
            ToastMessage('휴대폰번호를 입력하세요..');
            return false;
        }
        if(!validateDate(changePhone)){
            ToastMessage('올바른 휴대폰번호 형식을 입력하세요..');
            return false;
        }

        // timer_start();
        if(phoneIntervel){
            ToastMessage(tcounter + '초 후에 재발송할 수 있습니다.')
        }

        
        Api.send('member_registerSms', {'phoneNumber':changePhone}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               //console.log('출력확인..',resultItem.message);
               setRansoo(resultItem.message);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        })

       

        setPhoneInterval(true);
        setAuthButtonState(false);//인증버튼 활성화
        //setSmsRandNumber(randomNumber(6));
    }

    //console.log('랜덤숫자',ransoo);


    const _authComplete = () => {
      
       if(tcounter <= 0){
        ToastMessage('인증시간이 만료되었습니다.\n인증번호를 재발송 받아주세요.');
           return false;
       }
       if(smsRandNumber == ransoo){
            setAuthTitle('인증확인');
            setPhoneInterval(false);
            setAuthButtonState(true);//인증버튼 비활성화
            ToastMessage('본인인증이 완료되었습니다.\n다음단계로 이동하세요.');
            setNextButtonState(false);
            return true;
       }
       
        // timer_stop();

    }



    const timer_stop = () => {
        // setPhoneInterval(true);
        //console.log(phoneIntervel);
        //console.log(t1);
        clearInterval(t1);
        setTimeStamp('');
       
    };

    useEffect(()=>{
        if(!phoneIntervel) {timer_stop()}
        else                {timer_start()}
    },[phoneIntervel])


    const _nextRegister = () => {

        if(!idText){
            ToastMessage('아이디를 입력하세요.')
            return false;
        }

        if(!passwordText){
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        if(passwordText ==! passwordTextConfirm){
            ToastMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }

        if(authTile == '인증완료' && !authButtonState){
            ToastMessage('휴대폰 인증을 완료해주세요.');
            return false;
        }

        Api.send('member_registerIdChk', {'id':idText, 'password':passwordText, 'phoneNumber':changePhone}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                console.log('회원가입 출력..',resultItem);
                navigation.navigate('RegisterMyInfo', {'id':idText, 'password':passwordText,'phoneNumber':changePhone});

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })

       // console.log('완료..');
        //navigation.navigate('RegisterMyInfo');
    }    


    return (
        
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='회원가입' />
            <ScrollView>
                <Box px={5} height='100%'>
                   
                    <VStack mt={5}>
                        <DefText text='회원 정보 입력' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                        <Input
                            _focus='transparent'
                            height={46}
                            bg='#F2F2F2'
                            placeholder='아이디'
                            mt={3}
                            value={idText}
                            onChangeText={_idChangeText}
                        />
                        <Input
                            _focus='transparent'
                            height={46}
                            bg='#F2F2F2'
                            placeholder='비밀번호'
                            mt={3}
                            secureTextEntry={true}
                            value={passwordText}
                            onChangeText={_passwordChangeText}
                        />
                        <Input
                            _focus='transparent'
                            height={46}
                            bg='#F2F2F2'
                            placeholder='비밀번호 확인'
                            mt={3}
                            secureTextEntry={true}
                            value={passwordTextConfirm}
                            onChangeText={_passwordChangeTextConfirm}
                        />
                    </VStack>
                    <VStack py={5}>
                        <DefText text='휴대폰 본인인증' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                        <HStack alignItems='center' mt={3} justifyContent='space-between'>
                            <Input
                                _focus='transparent'
                                height={46}
                                bg='#F2F2F2'
                                placeholder='휴대폰 번호 입력 (-은 빼고 입력)'
                                value={changePhone}
                                onChangeText={_phoneNumberChange}
                                returnKeyType="next"
                                keyboardType="phone-pad"
                                maxLength={13}
                                width='70%'
                            />
                            <TouchableOpacity style={[styles.smsCertiButton]} onPress={()=>{_sendSmsButton()}}>
                                <DefText text='인증번호 발송' style={[{fontSize:15, color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                        <VStack mt={3}>
                            <Input
                                _focus='transparent'
                                height={46}
                                bg='#F2F2F2'
                                placeholder='인증번호'
                                value={smsRandNumber}
                                onChangeText={_smsSendNumberChage}
                                maxLength={6}
                                keyboardType="phone-pad"
                            />
                            <Box position='absolute' top={0} right={5} height={46} justifyContent='center'>
                                <DefText text={timeStamp} style={{color:'#999'}} />
                            </Box>
                            <TouchableOpacity style={[styles.certiNumberAuth, authButtonState===true && {backgroundColor:'#f1f1f1'}]} onPress={()=>{_authComplete()}} disabled={authButtonState}>
                                <DefText text={authTile} style={[{fontSize:15,fontFamily:Font.RobotoBold}, authButtonState===true ? {color:'#666'} : {color:'#fff'}]}   />
                            </TouchableOpacity>
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>
            <Box  >
                <TouchableOpacity 
                    style={[{
                        height:46,
                        justifyContent:'center',
                        alignItems:'center',
                        
                    }, nextButtonState === true ? {backgroundColor:'#f1f1f1'} : {backgroundColor:'#CA0D3C'} ]}
                    disabled={nextButtonState}
                    onPress={()=>{ _nextRegister() }}
                >
                    <DefText text='다음' style={[{fontSize:15, fontFamily:Font.RobotoBold}, nextButtonState === true ? {color:'#191919'} : {color:'#fff'}]} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    smsCertiButton:{
        height:46,
        backgroundColor:'#CA0D3C',
        justifyContent:'center',
        alignItems:'center',
        width:'28%',
        borderRadius:5
    },

    certiNumberAuth : {
        height:46,
        backgroundColor:'#CA0241',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:20
    }
})

export default Register;