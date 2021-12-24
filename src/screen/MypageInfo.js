import React, { useEffect, useState } from 'react';
import { Box, Text, Image, VStack, HStack, Input} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert, Platform, Keyboard } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import ImagePicker from 'react-native-image-crop-picker';
import { phoneFormat } from '../common/dataFunction';
import AsyncStorage from '@react-native-community/async-storage';

const MypageInfo = (props) => {

    const {navigation, userInfo, member_update, member_info, route} = props;

    const {params} = route;

    //console.log(params);

    const [name, setNameInput] = useState('');
    const _nameInputChange = text => {
        setNameInput(text);
    }

    const [nickName, setNickName] = useState('');
    const _nickNameInputChange = text => {
        setNickName(text)
    }

    
    const [age, setAge] = useState('');
    const _ageInputChange = text => {
        setAge(text);
    }

    const [phoneNumber, setPhoneNumber] = useState('');
    const _phoneNumberInputChange = text => {
        setPhoneNumber(phoneFormat(text));
    }

    const [genderState, setGenderState] = useState('');

    const [areaInput1, setAreaInput1] = useState('');
    const [areaInput2, setAreaInput2] = useState('');
    const [areaInput3, setAreaInput3] = useState('');

    const [exercisePurpose, setExercisePurpose] = useState(''); // 운동목적

    const [wishExerType, setWishExerType] = useState(''); // 관심종목

    const [profileImgs, setProfileImgs] = useState('');
    const _changeProfileImg = () =>{
        //console.log('이미지 변경');
        ImagePicker.openPicker({
            width: 110,
            height: 100,
            cropping: true,
            cropperCircleOverlay: true
          }).then(image => {
            //console.log(image);

            const my_photo = {
                idx : 1,
                uri : image.path,
                type : image.mime,
                data : image.data,
                name : 'profile_img.jpg'
            }

            setProfileImgs(my_photo);
          });
    }

    //console.log('호호: ',profileImgs);

    useEffect(()=>{
        setNameInput(userInfo.mb_name);
        setNickName(userInfo.mb_nick);
        setAge(userInfo.mb_7);
        setPhoneNumber(userInfo.mb_hp);
        setGenderState(userInfo.mb_1);
        setAreaInput1(userInfo.mb_2);
        setAreaInput2(userInfo.mb_3);
        setAreaInput3(userInfo.mb_4);
        setExercisePurpose(userInfo.mb_5.replace(/ /gi, ""));
        setWishExerType(userInfo.mb_6.replace(/ /gi, ""));
    },[userInfo]);//회원정보에서 가져오기

    //console.log(wishExerType);

    //값 전달 받기
    const [areas, setAreas] = useState('');
    const [areas2, setAreas2] = useState('');
    const [areas3, setAreas3] = useState('');

    let purposedata;
    let purPoseDataReal;

    let wishExerciseData;
    let wishExerciseDataReal;
    useEffect(()=>{
        if(params){
            if(params.areas){
                setAreas(params.areas);
            }
            if(params.areas2){
                setAreas2(params.areas2);
            }
            if(params.areas3){
                setAreas3(params.areas3);
            }
            if(params.purposeCheckData){
                purposedata = params.purposeCheckData;
                purPoseDataReal = purposedata[0];

                if(purposedata.length==2){
                    purPoseDataReal = purPoseDataReal + ',' + purposedata[1];
                }else if(purposedata.length==3){
                    purPoseDataReal = purPoseDataReal + ',' + purposedata[1] + ',' + purposedata[2];
                }

                setExercisePurpose(purPoseDataReal);
                //console.log('하하',purPoseDataReal);
            }
            if(params.wishExerciseTypeList){
                
                wishExerciseData = params.wishExerciseTypeList;
                wishExerciseDataReal = wishExerciseData[0];

                console.log('개수 : ',wishExerciseData.length );

                if(wishExerciseData.length==2){
                    wishExerciseDataReal = wishExerciseDataReal + ',' + wishExerciseData[1];
                }else if(wishExerciseData.length==3){
                    wishExerciseDataReal = wishExerciseDataReal + ',' + wishExerciseData[1] + ',' + wishExerciseData[2];
                }

                setWishExerType(wishExerciseDataReal);
            
            }
        }
        //setAreas(areas);
    },[params]);

    
    
    useEffect(()=>{
        if(areas){
            setAreaInput1(areas);
        }
        if(areas2){
            setAreaInput2(areas2);
        }
        if(areas3){
            setAreaInput3(areas3);
        }
    },[areas, areas2, areas3])

    //console.log(areas3);


    const _registerInsertSubmit = async () => {
        if(!name){
            ToastMessage('이름을 입력해주세요.');
            return false;
        }
        if(!nickName){
            ToastMessage('닉네임을 입력해주세요.');
            return false;
        }
        if(!age){
            ToastMessage('연령을 입력해주세요.(만 나이)')
            return false;
        }
        if(!genderState){
            ToastMessage('성별을 선택해주세요.');
            return false;
        }
        if(!areaInput1){
            ToastMessage('관심지역은 하나 이상 입력해주세요.');
            return false;
        }
        if(!exercisePurpose){
            ToastMessage('운동목적을 선택해주세요.');
            return false;
        }
        if(!wishExerType){
            ToastMessage('관심종목을 선택해주세요.');
            return false;
        }


        Keyboard.dismiss();

        const formData = new FormData();
        formData.append('method', 'member_update');
        formData.append('id', userInfo.mb_id);
        formData.append('names', name);
        formData.append('nickName', nickName);
        formData.append('age', age);
        formData.append('phoneNumber', phoneNumber);
        formData.append('gender', genderState);
        formData.append('wisharea1', areaInput1);
        formData.append('wisharea2', areaInput2);
        formData.append('wisharea3', areaInput3);
        formData.append('purposeCheck', exercisePurpose);
        formData.append('wishExer', wishExerType);
        if(profileImgs.uri != undefined) {
        formData.append('photo', {
            uri: profileImgs.uri,
            type: 'image/jpeg',
            name: 'photo.jpeg',
          });
        }

          console.log("::form::",formData);

        const update = await member_update(formData);
        if (update.result) {
           // ToastMessage(update.msg);
           member_info_handle();
           navigation.dispatch(
                StackActions.replace('Tab_Navigation', {msg:'회원정보가 수정되었습니다.'})
            );
            //console.log(update)
        } else {
            console.log(update)
        }
        
    }

     //회원정보 조회

     //회원정보 조회
    const member_info_handle = () => {
        AsyncStorage.getItem('mb_id').then(async (response) => {

        const formData = new FormData();
        formData.append('method', 'member_info');
        formData.append('id', response);
        await member_info(formData);
        });
    };

    console.log(profileImgs)

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef navigation={navigation} headertitle='내 정보 수정'  />
            <ScrollView>
                <VStack>
                    <Box py={4} style={{ justifyContent:'center', alignItems:'center'}}>
                        <Box>
                            {
                                profileImgs ?
                                <Image source={{uri:profileImgs.uri} }
                                    alt='프로필 이미지'
                                    style={{width:110, height:110, borderRadius:107}}
                                    resizeMode='contain'
                                />
                                :
                                <Image source={{uri:userInfo.mb_profile_img+"?cache="+Math.random()} }
                                    alt='프로필 이미지'
                                    style={{width:110, height:110, borderRadius:107}}
                                    resizeMode='contain'
                                />
                            }
                            

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    bottom:0,
                                    right: 0
                                }}
                                activeOpacity={0.9}
                                onPress={_changeProfileImg}
                            >
                                <Image source={require('../images/cameraOn.png')} alt='사진선택' />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box px={5}>
                        <DefText text='내정보' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={name}
                            onChangeText={_nameInputChange}
                            mt={2.5}
                            placeholder='이름'
                        />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={nickName}
                            onChangeText={_nickNameInputChange}
                            mt={2.5}
                            placeholder='닉네임'
                        />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={age}
                            onChangeText={_ageInputChange}
                            mt={2.5}
                            placeholder='나이(만)'
                            keyboardType='phone-pad'
                        />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={phoneNumber}
                            onChangeText={_phoneNumberInputChange}
                            mt={2.5}
                            placeholder='연락처'
                            keyboardType='phone-pad'
                            maxLength={13}
                        />
                    </Box>
                    <Box px={5} mt={10}>
                        <DefText text='성별' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={[styles.genderSelectButton, genderState === '남' ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#F2F2F2'}]} onPress={()=>{setGenderState('남')}}>
                                <DefText 
                                    text='남'
                                    style={[styles.genderSelectButtonText, genderState === '남' ? {color:'#fff'} : {color:'#999'}]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.genderSelectButton, genderState === '여' ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#F2F2F2'}]} onPress={()=>{setGenderState('여')}}>
                                <DefText
                                    text='여'
                                    style={[styles.genderSelectButtonText, genderState === '여' ? {color:'#fff'} : {color:'#999'}]}
                                />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box px={5} mt={10} >
                        <DefText text='관심지역1' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={areaInput1}
                            //onChangeText={areaInputChange}
                            placeholder='관심지역을 선택하세요.'
                            mt={2.5}
                            onPressOut={()=>{navigation.navigate('WishAreaInsert1', {areaInput1})}}
                        />
                    </Box>
                    <Box px={5} mt={5}>
                        <DefText text='관심지역2' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={areaInput2}
                            //onChangeText={areaInputChange}
                            placeholder='관심지역을 선택하세요.'
                            mt={2.5}
                            onPressOut={()=>{navigation.navigate('WishAreaInsert2', {areaInput2})}}
                        />
                    </Box>
                    <Box px={5} mt={5}>
                        <DefText text='관심지역3' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={areaInput3}
                            //onChangeText={areaInputChange}
                            placeholder='관심지역을 선택하세요.'
                            mt={2.5}
                            onPressOut={()=>{navigation.navigate('WishAreaInsert3', {areaInput3})}}
                        />
                    </Box>
                    <Box px={5} mt={5}>
                        <DefText text='운동목적' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={exercisePurpose}
                            //onChangeText={areaInputChange}
                            placeholder='등록하기'
                            mt={2.5}
                            onPressOut={()=>{navigation.navigate('ExercisePurposeInsert', {exercisePurpose})}}
                        />
                    </Box>
                    <Box px={5} mt={5} pb={5}>
                        <DefText text='관심종목' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Input 
                            _focus='tranparent'
                            height={46}
                            bg='#F2F2F2'
                            value={wishExerType}
                            //onChangeText={areaInputChange}
                            placeholder='등록하기'
                            mt={2.5}
                            onPressOut={()=>{navigation.navigate('WishExerciseTypeInsert', {wishExerType})}}
                        />
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
                onPress={_registerInsertSubmit}
            >
                <DefText text='내정보 수정 완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
            </TouchableOpacity>
        </Box>
    );
};


const styles = StyleSheet.create({
    genderSelectButton: {
        width:'48%',
        height: 46,
        borderWidth:1,
        borderColor:'#F2F2F2',
        justifyContent:'center',
        alignItems:'center'
    },
    genderSelectButtonText: {
        color:'#999',
        fontSize:15
    },
    selectAreaButton:{
        height: 46,
        backgroundColor:'#F2F2F2',
        borderWidth:1,
        borderColor:'#CA0D3C',
        borderRadius:5,
        marginTop:10,
        justifyContent:'center',
        paddingLeft:20
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
    })
)(MypageInfo);