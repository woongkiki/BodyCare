import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, VStack, HStack, Image, Input  } from 'native-base';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import { phoneFormat } from '../common/dataFunction';
import Font from '../common/Font';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';

const IdLost = (props) => {

    const {navigation} = props;

    const [phoneNumber, setPhoneNumber] = useState('');

    const changePhoneNumber = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    const [schButtonStatus, setSchButtonStatus] = useState(true);

    const [message, setMessage] = useState('');

    useEffect(()=>{
        if(phoneNumber.length>0){
            setSchButtonStatus(false);
        }else{
            setSchButtonStatus(true);
        }
    },[phoneNumber])


    const idLostHandle = () => {
        Api.send('member_idLost', {'phoneNumbers':phoneNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 출력', resultItem.message);
               // refreshInq(resultItem.message);
               setMessage(resultItem.message)
                
            }else{
                console.log('결과 출력 실패');
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : ''}>
                <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss}>
                    <Box>
                        <HeaderDef headertitle='아이디 찾기' navigation={navigation} />
                        <Box p={5}>
                            <Box mb={5}>
                                <DefText text='회원가입시 등록한 휴대폰 번호를 입력하세요.' />
                                
                            </Box>
                            <DefText text='휴대폰 번호' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                         
                            <Input 
                                _focus='transparent'
                                value={phoneNumber}
                                onChangeText={changePhoneNumber}
                                placeholder='휴대폰 번호를 입력하세요.(-는 빼고 입력)'
                                mt={2.5}
                                height={46}
                                keyboardType={'phone-pad'}
                                maxLength={13}
                            />

                            <Box mt={10} alignItems='center'>
                                <TouchableOpacity
                                    style={[styles.schButton, !schButtonStatus ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#666'}]}
                                    onPress={idLostHandle}
                                    disabled={schButtonStatus}
                                >
                                    <DefText text='찾기' style={[{color:'#fff', fontFamily:Font.RobotoBold}]}/>
                                </TouchableOpacity>
                            </Box>
                            <Box alignItems='center' py={12}>
                                <DefText text={message} />
                            </Box>
                        </Box>
                    </Box>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Box>
    );
};

const styles = StyleSheet.create({
    schButton:{
        height: 40,
        width:100,
        backgroundColor:'#CA0D3C',
        borderRadius:40,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default IdLost;