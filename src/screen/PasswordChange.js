import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, VStack, HStack, Image, Input  } from 'native-base';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import Font from '../common/Font';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';

const PasswordChange = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    const { id, phoneNumber } = params;

    //console.log(params);


    const [newPassword, setNewPassword] = useState('');
    const _newsPasswords = (text) =>{
        setNewPassword(text);
    }

    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const _newsPasswordConfirms = (text) =>{
        setNewPasswordConfirm(text);
    }

    const passwordChanges = () => {

        if(!newPassword){
            ToastMessage('비밀번호를 입력하세요.')
            return false;
        }

        if(!newPasswordConfirm){
            ToastMessage('비밀번호를 다시 한번 입력하세요.')
            return false;
        }

        Api.send('member_passwordCh', {'id':id,'phoneNumber':phoneNumber, 'password':newPassword}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

              // console.log('출력확인..',resultItem.message);
              // setRansoo(resultItem.message);
              ToastMessage(resultItem.message);
              navigation.navigate('Tab_Navigation');

            }else{
                console.log('결과 출력 실패!', resultItem.message);
                ToastMessage(resultItem.message);
            }
        })
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headertitle='비밀번호 변경' navigation={navigation} />
            <Box p={5}>
                <Box>
                    <DefText text='비밀번호 변경' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}]} />
                    <Input 
                        _focus='transparent'
                        mt={2.5}
                        height={46}
                        placeholder='변경하실 비밀번호를 입력하세요.'
                        value={newPassword}
                        onChangeText={_newsPasswords}
                        secureTextEntry={true}
                    />
                    <Input 
                        _focus='transparent'
                        mt={2.5}
                        height={46}
                        placeholder='변경하실 비밀번호를 한번 더 입력하세요.'
                        value={newPasswordConfirm}
                        onChangeText={_newsPasswordConfirms}
                        secureTextEntry={true}
                        
                    />
                    <TouchableOpacity 
                        style={[{
                            height:46,
                            justifyContent:'center',
                            alignItems:'center',
                            backgroundColor:'#CA0D3C',
                            marginTop:10
                        } ]}
                        onPress={passwordChanges}
                       
                    >
                        <DefText text='변경하기' style={[{fontSize:15, fontFamily:Font.RobotoBold}, {color:'#fff'}]} />
                    </TouchableOpacity>
                </Box>
                
            </Box>
        </Box>
    );
};

export default PasswordChange;