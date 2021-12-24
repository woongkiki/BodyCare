import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const DefaultLogin = (props) => {

    const {navigation, member_login} = props;

    const [idText, setIdText] = useState('');
    const _idChangeText = text => {
        setIdText(text);
    }

    const [idPassword, setIdPassword] = useState('');
    const _PasswordChangeText = text => {
        setIdPassword(text);
    }


    const handleLoginBtn = async () => {

        try{
            if(!idText){
                ToastMessage('아이디를 입력하세요.');
                return false;
            }
    
            if(!idPassword){
                ToastMessage('비밀번호를 입력하세요.');
            }
    
            const formData = new FormData();
            formData.append('ids', idText);
            formData.append('pwds', idPassword);
            formData.append('method', 'member_login');
    
            const login = await member_login(formData);
    
            if(login.state){
                navigation.dispatch(
                    StackActions.replace('Tab_Navigation', {msg:'안녕하세요..'})
                );
                //console.log(login.result.mb_id);
            }else{
                //console.log(login);
                ToastMessage(login.msg);
            }
        }catch(e){
            console.log('실패');
        }
        
    }


    return (
        <Box flex={1} bg='#fff'>
            <KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <>
                        <HeaderDef navigation={navigation} headertitle='바디케어 일반회원 로그인' />
                        <Box bg='#fff' height='100%'>
                            <VStack px={5}>
                                <Input
                                    _focus='transparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    placeholder='아이디'
                                    mt={5}
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
                                    value={idPassword}
                                    onChangeText={_PasswordChangeText}
                                />
                                <Box alignItems='flex-end' mt={5}>
                                    <HStack alignItems='center'>
                                        <TouchableOpacity onPress={()=>{navigation.navigate('IdLost')}}>
                                            <DefText text='아이디 찾기' style={[styles.loginButtonTexts]}/>
                                        </TouchableOpacity>
                                        <Box width='1px' height={15} backgroundColor='#999' mx={3}></Box>
                                        <TouchableOpacity onPress={()=>{navigation.navigate('PasswordLost')}}>
                                            <DefText text='비밀번호 찾기' style={[styles.loginButtonTexts]} />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                                <TouchableOpacity onPress={handleLoginBtn} style={styles.loginButton}>
                                    <DefText text='로그인' style={{fontSize:15, color:'#fff', fontFamily:Font.RobotoBold}} />
                                </TouchableOpacity>
                                <Box alignItems='flex-end'>
                                    <TouchableOpacity style={[{marginTop:20}]} onPress={()=>{navigation.navigate('Register')}}>
                                        <DefText text='일반회원 회원가입' style={[styles.loginButtonTexts]}  />
                                    </TouchableOpacity>
                                </Box>
                            </VStack>
                        </Box>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Box>
    );
};

const styles = StyleSheet.create({
    loginButtonTexts: {
        fontSize:15,
        color:'#999'
    },
    loginButton: {
        height:46,
        backgroundColor:'#CA0D3C',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:20
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
)(DefaultLogin);