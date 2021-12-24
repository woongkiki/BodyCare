import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import {exercisePurposeData} from '../Utils/DummyData';

import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const ExercisePurposeInsert = (props) => {

    const {navigation, route} = props;


    const {params} = route;

    console.log(params);


    const [purposeCheckData, setPurposeCheckDate] = useState([]);

    const [purposeRealData, setPurposeRealData] = useState([]);
    const purposeData = async () => {
        Api.send('contents_registerPurpose', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                console.log('회원가입 출력..',resultItem);
                setPurposeRealData(arrItems);
                //navigation.navigate('RegisterMyInfo', {'id':idText, 'password':passwordText,'phoneNumber':phoneNumber});

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })
    }

    useEffect(()=>{
        purposeData();
    },[]);

    //console.log('운동목적..', purposeRealData);


    const exercisePurposeCheck = (a) => {
        let purposeName = a;

        if(!purposeCheckData.includes(purposeName)){

            if(purposeCheckData.length == 3){
                ToastMessage('3개까지 선택가능합니다.');
                return false;
            }

            setPurposeCheckDate([...purposeCheckData, purposeName]);

        }else{
            const purposeYes = purposeCheckData.filter(purposeName=>a!==purposeName);
            setPurposeCheckDate(purposeYes);
        }
    }

    const [exerPurposeData, setExerPurposeData] = useState('');
    useEffect(()=>{
        if(params.exercisePurpose){
            setExerPurposeData(params.exercisePurpose);
        }
    },[])


    let exerPurposes;
    useEffect(()=>{
        if(exerPurposeData){
            exerPurposes = exerPurposeData.split(',');
            setPurposeCheckDate(exerPurposes);
        }
    },[exerPurposeData]);


    console.log(purposeCheckData)

    //console.log('dd',exerPurposes);
    //console.log(purposeCheckData);

    const exercisePurposD = purposeRealData.map((item, index)=> {
        return(
            <TouchableOpacity 
                key={index} 
                style={[
                    styles.areaButtons,
                    purposeCheckData.includes(item.wr_subject) &&
                    {backgroundColor:'#CA0D3C'}
                ]}
                onPress={()=>{exercisePurposeCheck(item.wr_subject)}}
            >
                <DefText
                     text={item.wr_subject}
                     style={[
                        purposeCheckData.includes(item.wr_subject) &&
                        {color:'#fff'}
                     ]}
                 />
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='운동목적 등록하기' />
            <ScrollView>
                <Box py={5} px={5}>
                    
                    <VStack>
                       
                        <Box>
                            <DefText text='운동목적 (최대 3개까지 선택가능)' style={[{marginTop:15, fontSize:16, fontFamily:Font.RobotoBold}]} />
                            <HStack  flexWrap='wrap' justifyContent='space-between'>
                                {exercisePurposD}
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
                onPress={()=>{navigation.navigate('MypageInfo', {purposeCheckData})}}
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

export default ExercisePurposeInsert;