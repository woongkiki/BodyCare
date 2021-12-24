import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Input, Image, Modal } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const Content = (props) => {

    const {navigation, userInfo, member_out} = props;

    //console.log(userInfo);


    //회원탈퇴 팝업
    const [memberleave, setMemberLeave] = useState(false);
  

    const _memberLeave = async () => {
        try{

            //console.log('호호')

            const formData = new FormData();
            formData.append('method', 'member_leave');
            formData.append('mb_id', userInfo.mb_id);
            //formData.append('pwds', idPassword);
            formData.append('method', 'member_leave');
    
            await member_out(formData);

            setMemberLeave(false);
            ToastMessage(userInfo.mb_id+'님께서는 회원에서 탈퇴 하셨습니다.');
            navigation.dispatch(
                StackActions.replace('Tab_Navigation')
            );
            

            
        }catch(e){
            console.log(e);
        }
    }

    return (
        <>
        <Box flex={1} bg='#fff'>
             <HeaderDef navigation={navigation} headertitle='이용약관 및 정책' />
             <VStack>
                 <TouchableOpacity 
                    onPress={()=>{navigation.navigate('PrivacyPolicy')}}
                    style={{paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}
                >
                     <HStack alignItems='center' justifyContent='space-between'>
                        <DefText text='개인정보처리방침' style={{fontSize:15, color:'#666', fontFamily:Font.RobotoMedium}} />
                         <Image
                            source={require('../images/buttonArrRightG.png')}
                            alt='화살표'
                        />
                     </HStack>
                 </TouchableOpacity>
                 <TouchableOpacity
                    onPress={()=>{navigation.navigate('TermsContent')}}
                     style={{paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}
                >
                     <HStack alignItems='center' justifyContent='space-between'>
                        <DefText text='이용약관' style={{fontSize:15, color:'#666', fontFamily:Font.RobotoMedium}} />
                         <Image
                            source={require('../images/buttonArrRightG.png')}
                            alt='화살표'
                        />
                     </HStack>
                 </TouchableOpacity>
                 {
                     userInfo && 
                     <TouchableOpacity 
                        onPress={()=>{setMemberLeave(!memberleave)}}
                        style={{paddingVertical:15, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='회원탈퇴' style={{fontSize:15, color:'#666', fontFamily:Font.RobotoMedium}} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                 }
                 
             </VStack>
        </Box>
        <Modal isOpen={memberleave} onClose={() => setMemberLeave(false)}>
            
            <Modal.Content >
                <Modal.Body>   
                    <VStack>
                        <DefText text='회원탈퇴' style={{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold}} />
                        <DefText text='정말 바디케어 회원을 탈퇴하시겠습니까?' style={{marginTop:10, fontSize:15, color:'#666'}}/>
                    </VStack>
                    <HStack justifyContent='space-between' mt={10}>
                        <TouchableOpacity style={[styles.memberleaveButton, {backgroundColor:'#EBEBEB'}]} onPress={()=>{setMemberLeave(false)}}>
                            <DefText text='취소' style={[styles.memberleaveText]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.memberleaveButton, {backgroundColor:'#CA0241'}]} onPress={()=>{_memberLeave()}}>
                            <DefText text='확인' style={[styles.memberleaveText, {color:'#fff'}]}   />
                        </TouchableOpacity>
                    </HStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    memberleaveButton : {
        width:'48%',
        height:41,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },
    memberleaveText: {
        fontSize:15,
        fontFamily:Font.RobotoMedium,
        color:'#666'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_out: (user) => dispatch(UserAction.member_out(user)),
    })
  )(Content);