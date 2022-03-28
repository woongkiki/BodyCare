import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Input } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';

import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {phoneFormat, randomNumber, validateDate} from '../common/dataFunction';
import {areaDatas, areaDatasGu} from '../Utils/DummyData';

import Api from '../Api';

const WishArea3 = (props) => {

    const {navigation} = props;

    const [areaSelect, setAreaSelect] = useState('서울특별시');
    const [areaGuSelect, setAreaGuSelect] = useState('');
    const [areaDongSelect, setAreaDongSelect]= useState('');

    const _areaSelect = (area) => {
        setAreaSelect(area);
    }

    const _areaSelectGu = (area2) => {
        setAreaGuSelect(area2);
    }

    const _areaSelectDong = (area3) => {
        setAreaDongSelect(area3);
    }

    const [dongAddress, setDongAddress] = useState('');
    const _dongChanges = (addr) => {
        setDongAddress(addr);
    }

    const areas3 = areaSelect + ' ' + areaGuSelect + ' ' + areaDongSelect;

    console.log('선택지역', areas3);

    const [addr1, setAddr1] = useState([]);
    const Areas = async () => {
        Api.send('contents_addrs', {'area1':areaSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                //console.log('지역 첫번째...',arrItems);
                setAddr1(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    const [selectAddr, setSelectAddr] = useState([]);
    const SelectAreas = async () => {
        Api.send('contents_addrSelect', {'area1':areaSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                //console.log('지역...',resultItem);
                setSelectAddr(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })
    }

    const [selectAddrDong, setSelectAddrDong] = useState([]);
    const SelectAreaDong = async () => {
        await Api.send('contents_addrSelectDong', {'area1':areaSelect, 'area2':areaGuSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
            if(resultItem.result === 'Y' && arrItems) {

                console.log('동...',arrItems);
                setSelectAddrDong(arrItems);
                //setSelectAddr(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        Areas();
    },[])

    //console.log(selectAddr);

    useEffect(()=> {    
        SelectAreas();
    },[areaSelect])

    useEffect(()=>{
        SelectAreaDong();
    },[areaGuSelect])

    const AreaDatas = addr1.map((item, index)=> {

        let addrName1;
        if(item.wr_1=='세종특별자치시'){
            addrName1 = '세종';
        }else if(item.wr_1 == '제주특별자치도'){
            addrName1 = '제주도';
        }else{
            addrName1 = item.wr_1;
        }

        return(
            <TouchableOpacity 
                key={index}
                onPress={()=>{_areaSelect(item.wr_1)}}
                style={[
                    styles.areaButtons, 
                    areaSelect === item.wr_1 &&
                    {backgroundColor:'#CA0D3C'},
                    (index + 1) % 3 === 0 && {marginRight:0}
                ]}
            >
                <DefText 
                    text={addrName1}  
                    style={[
                        areaSelect === item.wr_1 && {color:'#fff'}
                    ]}
                />
            </TouchableOpacity>
        )
    });

    const AreaDatasGu = selectAddr.map((item, index)=> {
        return(
            <TouchableOpacity 
                key={index}
                onPress={()=>{_areaSelectGu(item.wr_2)}}
                style={[
                    styles.areaButtons,
                    areaGuSelect === item.wr_2 &&
                    {backgroundColor:'#CA0D3C'},
                    (index + 1) % 3 === 0 && {marginRight:0}
                ]}
            >
                <DefText 
                    text={item.wr_2} 
                    style={[
                        areaGuSelect === item.wr_2 && {color:'#fff'}
                    ]}
                />
            </TouchableOpacity>
        )
    })

    const AreaDataDong = selectAddrDong.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={index}
                onPress={()=>{_areaSelectDong(item.wr_4)}}
                style={[
                    styles.areaButtons,
                    areaDongSelect === item.wr_4 &&
                    {backgroundColor:'#CA0D3C'},
                    (index + 1) % 3 === 0 && {marginRight:0}
                ]}
            >
                <DefText 
                    text={item.wr_4} 
                    style={[
                        areaDongSelect === item.wr_4 && {color:'#fff'}
                    ]}
                />
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='관심지역 등록하기' />
            <ScrollView>
                <Box py={5} px={5}>
                    
                    <VStack>
                        <DefText text='관심지역 선택' style={[{fontSize:18, color:'#191919', fontFamily:Font.RobotoBold, marginRight:5}]} />
                        <Box>
                            <DefText text='선택하세요' style={[{marginTop:15, fontSize:16, fontFamily:Font.RobotoBold}]} />
                            <HStack  flexWrap='wrap' >
                                {AreaDatas}
                            </HStack>
                        </Box>
                        <Box mt={7}>
                            <DefText text='선택하세요' style={[{marginTop:15, fontSize:16, fontFamily:Font.RobotoBold}]} />
                            <HStack  flexWrap='wrap' >
                                {AreaDatasGu}
                            </HStack>
                        </Box>
                        <Box mt={7}>
                            <DefText text='입력하세요' style={[{marginTop:15, fontSize:16, fontFamily:Font.RobotoBold}]} />
                            <HStack flexWrap='wrap'>
                                {AreaDataDong}
                            </HStack>
                            {/* <Input 
                                _focus='transparent'
                                height={46}
                                bg='#F2F2F2'
                                placeholder='동/읍/면/리 단위로 입력하세요.'
                                value={dongAddress}
                                onChangeText={_dongChanges}
                                mt={2.5}
                            /> */}
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
                onPress={()=>{navigation.navigate('RegisterMyInfo', {areas3})}}
            >
                <DefText text='등록완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
            </TouchableOpacity>
        </Box>
    );
};

const styles = StyleSheet.create({
    areaButtons : {
        width:'32%',
        marginRight:'2%',
        height:31,
        borderRadius:3,
        borderWidth:1,
        borderColor:'#F2F2F2',
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    }
})

export default WishArea3;