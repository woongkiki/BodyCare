import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, VStack, HStack, Image, Input  } from 'native-base';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import Font from '../common/Font';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
let t1;
let tcounter;
let temp;


const PasswordLost = (props) => {
    

    const {navigation} = props;

   
    const [myId, setMyid] = useState('');

    const myIdChange = (text) => {
        setMyid(text);
    }

    const [phoneNumber, setPhoneNumber] = useState('');
    const [changePhone, setChangePhone] = useState('');
    const changePhoneNumber = (phone) => {


        setPhoneNumber(phoneFormat(phone));
    }


    const [smsRandNumber, setSmsRandNumber] = useState();
    const _smsSendNumberChage = text => {
        setSmsRandNumber(text);
    }

    const [timeStamp, setTimeStamp] = useState('');
    const [phoneIntervel, setPhoneInterval] = useState(false);
    const [authButtonState, setAuthButtonState] = useState(true);
    const [authTile, setAuthTitle] = useState('인증완료');

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
        if(!myId){
            ToastMessage('아이디를 입력하세요.');
            return false;
        }

        if(phoneNumber.length==0){
            ToastMessage('휴대폰번호를 입력하세요..');
            return false;
        }
        if(!validateDate(phoneNumber)){
            ToastMessage('올바른 휴대폰번호 형식을 입력하세요..');
            return false;
        }

        // timer_start();
        if(phoneIntervel){
            ToastMessage(tcounter + '초 후에 재발송할 수 있습니다.')
        }

        setPhoneInterval(true);
        setAuthButtonState(false); //인증버튼 활성화

        Api.send('member_passwordChange', {'id':myId,'phoneNumber':phoneNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               console.log('출력확인..',resultItem.message);
               setRansoo(resultItem.message);

            }else{
                console.log('결과 출력 실패!', resultItem.message);
                ToastMessage(resultItem.message);
            }
        })

       
        //setSmsRandNumber(randomNumber(6));
    }


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

    const _passwordChanges = () =>{
        navigation.navigate('PasswordChange', {id:myId, phoneNumber:phoneNumber})
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

    return (
        <>
         <Box flex={1} backgroundColor='#fff'>
            <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : ''}>
                <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss}>
                    <Box>
                        <HeaderDef headertitle='비밀번호 찾기' navigation={navigation} />
                        <Box p={5}>
                            <Box>
                                <DefText text='아이디' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                                <Input 
                                    _focus='transparent'
                                    mt={2.5}
                                    height={46}
                                    placeholder='아이디를 입력하세요.'
                                    value={myId}
                                    onChangeText={setMyid}
                                />
                            </Box>
                            <Box mt={5}>
                                <DefText text='휴대폰 본인인증' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                                <HStack alignItems='center' mt={2.5} justifyContent='space-between'>
                                    <Input 
                                        _focus='transparent'
                                        value={phoneNumber}
                                        onChangeText={changePhoneNumber}
                                        placeholder='휴대폰 번호를 입력하세요.'
                                        
                                        height={46}
                                        keyboardType={'phone-pad'}
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
                                    <TouchableOpacity style={[styles.certiNumberAuth, authButtonState==true && {backgroundColor:'#f1f1f1'}]} onPress={_authComplete} disabled={authButtonState}>
                                        <DefText text={authTile} style={[{fontSize:15,fontFamily:Font.RobotoBold}, authButtonState==true ? {color:'#666'} : {color:'#fff'}]}   />
                                    </TouchableOpacity>
                                </VStack>
                            </Box>
                        </Box>
                    </Box>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            
        </Box>
        <Box  >
            <TouchableOpacity 
                style={[{
                    height:46,
                    justifyContent:'center',
                    alignItems:'center',
                    
                }, nextButtonState === true ? {backgroundColor:'#f1f1f1'} : {backgroundColor:'#CA0D3C'} ]}
                disabled={nextButtonState}
                onPress={ _passwordChanges }
            >
                <DefText text='다음' style={[{fontSize:15, fontFamily:Font.RobotoBold}, nextButtonState === true ? {color:'#191919'} : {color:'#fff'}]} />
            </TouchableOpacity>
        </Box>
        </>
    );
};

const styles = StyleSheet.create({
    smsCertiButton:{
        height:46,
        backgroundColor:'#CA0241',
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

export default PasswordLost;