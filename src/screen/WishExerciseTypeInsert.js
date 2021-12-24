import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import {wishExerciseTypeData} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';

import Api from '../Api';

const WishExerciseTypeInsert = (props) => {

    const {navigation, route} = props;

    const {params} = route;
    //console.log('1231',params);
    //console.log(props);

 
    const [wishExerciseTypeList, setWishExerciseTypeList] = useState([]);

    useEffect(()=>{
        if(params.wishExerType){
            setWishExerciseTypeList([...wishExerciseTypeList, params.wishExerType]);
        }
        
    },[])

    console.log('wishExerciseTypeList',wishExerciseTypeList)

    const exerciseWishCheck = (a) => {

        console.log('aaa',a);
        let exerciseTypes = a;

        if(!wishExerciseTypeList.includes(exerciseTypes)){

            if(wishExerciseTypeList.length == 3){
                ToastMessage('3개까지 선택가능합니다.');
                return false;
            }

            setWishExerciseTypeList([...wishExerciseTypeList, exerciseTypes]);

        }else{
            const exerciseWishConfirm = wishExerciseTypeList.filter(exerciseTypes=>a!==exerciseTypes);
            setWishExerciseTypeList(exerciseWishConfirm);
        }
    }

    //console.log(wishExerciseTypeList);
    const [wisthExerDatas, setWishExerDatas] = useState([]);

    const WishExerRealData = async () => {
        Api.send('contents_registerWishExer', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                console.log('회원가입 출력..',arrItems);
                setWishExerDatas(arrItems);
                //navigation.navigate('RegisterMyInfo', {'id':idText, 'password':passwordText,'phoneNumber':phoneNumber});

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })
    }

    useEffect(()=>{
        WishExerRealData();
    },[])


    const [wishExerciseData, setWishExerciseData] = useState('');
    useEffect(()=>{
        if(params.wishExerType){
            setWishExerciseData(params.wishExerType);
        }
    },[])


    let wishExercise;
    useEffect(()=>{
        if(wishExerciseData){
            wishExercise = wishExerciseData.split(',');
            setWishExerciseTypeList(wishExercise);
        }
    },[wishExerciseData]);


    //console.log('123',wishExerciseTypeList);
    //console.log(wisthExerDatas);

    const exertypeData = wisthExerDatas.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={index} 
                style={[
                    styles.areaButtons,
                    wishExerciseTypeList.includes(item.wr_subject) &&
                    {backgroundColor:'#CA0D3C'}
                ]}
                onPress={()=>{exerciseWishCheck(item.wr_subject)}}
            >
                <DefText
                     text={item.wr_subject}
                     style={[
                        wishExerciseTypeList.includes(item.wr_subject) &&
                        {color:'#fff'}
                     ]}
                 />
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='관심종목 등록하기' />
            <ScrollView>
                <Box py={5} px={5}>
                    
                    <VStack>
                       
                        <Box>
                            <DefText text='관심종목 (최대 3개까지 선택가능)' style={[{marginTop:15, fontSize:16, fontFamily:Font.RobotoBold}]} />
                            <HStack  flexWrap='wrap' justifyContent='space-between'>
                                {exertypeData}
                            </HStack>
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
                onPress={()=>{navigation.navigate('MypageInfo', {wishExerciseTypeList})}}
            >
                <DefText text='등록완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
            </TouchableOpacity>
        
        </Box>
    );
};

const styles = StyleSheet.create({
    areaButtons : {
        width:'23%',
        height:62,
        borderRadius:3,
        borderWidth:1,
        borderColor:'#F2F2F2',
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    }
})

export default WishExerciseTypeInsert;