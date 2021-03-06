import React, {useEffect, useState} from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { StackActions } from '@react-navigation/native';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import messaging from '@react-native-firebase/messaging';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const RegisterMyInfo = (props) => {

    const {navigation, route} = props;

    //console.log(route.params);


    let params;
    let areaName1;
    let areaName2;
    let areaName3;
    let purposeExersize;
    let wishexercize;
   
    const [nameInput, setNameInput] = useState('');
    const nameInputChange = text => {
        setNameInput(text);
    }

    const [nickNameInput, setNickNameInput] = useState('');
    const nickNameInputChange = text => {
        setNickNameInput(text);
    }

    const [ageInput, setAgeNameInput] = useState('');
    const ageInputChange = text => {
        setAgeNameInput(text);
    }

    const [genderState, setGenderState] = useState('');

    const [areaInput1, setAreaInput1] = useState('');
    const [areaInput2, setAreaInput2] = useState('');
    const [areaInput3, setAreaInput3] = useState('');

    if(route.params){
        params = route.params;
        areaName1 = params.areas;
        areaName2 = params.areas2;
        areaName3 = params.areas3;
        purposeExersize = params.purposeCheckData;
        wishexercize = params.wishExerciseTypeList;
    }else{
        params = '';
        areaName1 = '';
        areaName2 = '';
        areaName3 = '';
        purposeExersize = '';
        wishexercize = '';
    }

    const aa = areaName1;
    const aa2 = areaName2;
    const aa3 = areaName3;

    useEffect(()=>{
        setAreaInput1(areaName1)
    },[aa]);

    useEffect(()=>{
        setAreaInput2(areaName2)
    },[aa2]);

    useEffect(()=>{
        setAreaInput3(areaName3)
    },[aa3]);

    //console.log(params);
    //???????????? ????????????
    const [exercisePurpose, setExercisePurpose] = useState('');
    const exercisePurposR = purposeExersize;

    let exerP2;
    
    useEffect(()=>{
       
        if(exercisePurposR){
             exerP2 = exercisePurposR[0];

            if(exercisePurposR.length==2){
                exerP2 = exerP2 + ', ' + exercisePurposR[1];
            }else if(exercisePurposR.length==3){
                exerP2 = exerP2 + ', ' + exercisePurposR[1] + ', ' + exercisePurposR[2];
            }
        }

        setExercisePurpose(exerP2);
    },[exercisePurposR]);


    //????????????
    const [wishExerType, setWishExerType] = useState('');
    const wishexercizeVal = wishexercize;

    let wishexers;
    
    useEffect(()=>{
       
        if(wishexercizeVal){
            wishexers = wishexercizeVal[0];

            if(wishexercizeVal.length==2){
                wishexers = wishexers + ', ' + wishexercizeVal[1];
            }else if(wishexercizeVal.length==3){
                wishexers = wishexers + ', ' + wishexercizeVal[1] + ', ' + wishexercizeVal[2];
            }
        }

        setWishExerType(wishexers);
    },[wishexercizeVal]);

   


    const _registerSubmit = async () => {
        if(!nameInput){
            ToastMessage('????????? ??????????????????.');
            return false;
        }
        if(!nickNameInput){
            ToastMessage('???????????? ??????????????????.');
            return false;
        }
        if(!ageInput){
            ToastMessage('????????? ??????????????????.(??? ??????)')
            return false;
        }
        if(!genderState){
            ToastMessage('????????? ??????????????????.');
            return false;
        }
        if(!areaInput1){
            ToastMessage('??????????????? ?????? ?????? ??????????????????.');
            return false;
        }
        if(!exercisePurpose){
            ToastMessage('??????????????? ??????????????????.');
            return false;
        }
        if(!wishExerType){
            ToastMessage('??????????????? ??????????????????.');
            return false;
        }

        const token = await messaging().getToken();

        Api.send('member_registerR', {'id':route.params.id, 'password':route.params.password, 'phonNumber':route.params.phoneNumber, 'names':nameInput,'nickName':nickNameInput,'age':ageInput,'gender':genderState, 'wisharea1':areaInput1, 'wisharea2':areaInput2, 'wisharea3':areaInput3, 'purposeCheck':exercisePurpose,'wishExer':wishExerType, 'appToken':token}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                //console.log('???????????? ??????..',resultItem);
                //navigation.navigate('Home');
                ToastMessage(resultItem.message);
                 navigation.dispatch(
                     StackActions.replace('Tab_Navigation')
                 );
                //navigation.reset('Home');

            }else{
                console.log('?????? ?????? ??????!', resultItem);
                ToastMessage(resultItem.message);
            }
        })

       // Alert.alert('???????????? ??????!!')
    }



    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={ Platform.OS==='ios' ? 'padding' : ''}>
            <Box bg='#fff' flex={1}>
                <HeaderDef navigation={navigation} headertitle='??? ?????? ??????' />
                <ScrollView>
                    <Box px={5} pb={10}>
                    
                        <VStack mt={5} >
                            <HStack alignItems='flex-end' mb={4}>
                                <DefText text='?????????' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <DefText text='(??????)' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                            </HStack>
                            <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    text={nameInput}
                                    onChangeText={nameInputChange}
                                    placeholder='??????(??????)'
                            />
                            <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    text={nickNameInput}
                                    onChangeText={nickNameInputChange}
                                    placeholder='?????????'
                                    mt={2.5}
                            />
                            <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    text={ageInput}
                                    onChangeText={ageInputChange}
                                    keyboardType='phone-pad'
                                    placeholder='?????? (??? 24???)'
                                    mt={2.5}
                            />
                        </VStack>
                        <VStack mt={10}>
                            <HStack alignItems='flex-end' mb={4}>
                                <DefText text='??????' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <DefText text='(??????)' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                            </HStack>
                            <HStack justifyContent='space-between'>
                                <TouchableOpacity style={[styles.genderSelectButton, genderState === '???' ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#F2F2F2'}]} onPress={()=>{setGenderState('???')}}>
                                    <DefText 
                                        text='???'
                                        style={[styles.genderSelectButtonText, genderState === '???' ? {color:'#fff'} : {color:'#999'}]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.genderSelectButton, genderState === '???' ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#F2F2F2'}]} onPress={()=>{setGenderState('???')}}>
                                    <DefText
                                        text='???'
                                        style={[styles.genderSelectButtonText, genderState === '???' ? {color:'#fff'} : {color:'#999'}]}
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                        <VStack mt={10}>
                            <HStack alignItems='flex-end' >
                                <DefText text='???????????? 1' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <DefText text='(??????)' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                            </HStack>
                                {/* <TouchableOpacity style={styles.selectAreaButton}>
                                    <DefText text='??????????????? ???????????????.' style={{fontSize:16, color:'#999'}} />
                                </TouchableOpacity> */}
                        
                            <Input 
                                _focus='tranparent'
                                height={46}
                                bg='#F2F2F2'
                                value={areaInput1}
                                //onChangeText={areaInputChange}
                                placeholder='??????????????? ???????????????.'
                                mt={2.5}
                                onPressOut={()=>{navigation.navigate('WishArea')}}
                            />
                            <Box mt={5}>
                                <DefText text='???????????? 2' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    value={areaInput2}
                                    //onChangeText={areaInputChange}
                                    placeholder='??????????????? ???????????????.'
                                    mt={2.5}
                                    onPressOut={()=>{navigation.navigate('WishArea2')}}
                                />
                            </Box>
                            <Box mt={5}>
                                <DefText text='???????????? 3' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    value={areaInput3}
                                    //onChangeText={areaInputChange}
                                    placeholder='??????????????? ???????????????.'
                                    mt={2.5}
                                    onPressOut={()=>{navigation.navigate('WishArea3')}}
                                />
                            </Box>
                            <Box mt={5}>
                                <HStack alignItems='flex-end' >
                                    <DefText text='????????????' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                    <DefText text='(??????)' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                                </HStack>
                                <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    value={exercisePurpose}
                                    //onChangeText={areaInputChange}
                                    placeholder='????????????'
                                    mt={2.5}
                                    onPressOut={()=>{navigation.navigate('ExercisePurpose')}}
                                />
                            </Box>

                            <Box mt={5}>
                                <HStack alignItems='flex-end' >
                                    <DefText text='????????????' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                                    <DefText text='(??????)' style={[{color:'#CA0D3C', fontFamily:Font.RobotoBold}]} />
                                </HStack>
                                <Input 
                                    _focus='tranparent'
                                    height={46}
                                    bg='#F2F2F2'
                                    value={wishExerType}
                                    //onChangeText={areaInputChange}
                                    placeholder='????????????'
                                    mt={2.5}
                                    onPressOut={()=>{navigation.navigate('WishExerciseType')}}
                                />
                                
                            </Box>
                                
                        </VStack>
                    </Box>
                </ScrollView>
                <TouchableOpacity 
                    style={{
                        height:46,
                        backgroundColor:'#CA0D3C',
                        justifyContent:'center',
                        alignItems:'center',
                        
                    }}
                    onPress={()=>{_registerSubmit()}}
                >
                    <DefText text='???????????? ??????' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
                </TouchableOpacity>
            </Box>
       </KeyboardAvoidingView>
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
        borderColor:'#EBEBEB',
        borderRadius:5,
        marginTop:10,
        justifyContent:'center',
        paddingLeft:20
    }
})

export default RegisterMyInfo;