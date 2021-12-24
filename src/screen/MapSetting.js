import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import Api from '../Api';

const { width } = Dimensions.get('window');
const buttonWidth = (width-40)*0.23;
const buttonWidthPadding = (width-40)*0.06;
const buttonWidthPaddings = buttonWidthPadding / 3;

const MapSetting = (props) => {

    const {navigation, route} = props;
    


    //console.log(purposeDatas2);
    //console.log(navigation);

    const [partners, setPartners] = useState(0);
    const [purpose, setPurpose] = useState(0);

  
    const [wishExerData, setWishExerData] = useState([]);
    const wishExerDatas = async () => {
        Api.send('contents_wishExer', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

          
                //console.log('결과 출력..',arrItems);
                setWishExerData(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        })
    }

    const [purposeDats, setPurposeDatas] = useState([]);
    const puposeData = async () => {
        Api.send('contents_purpose', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

          
                console.log('결과 출력..',arrItems);
                setPurposeDatas(arrItems);
               // setWishExerData(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        })
    }

    useEffect(()=>{
        wishExerDatas();
        puposeData();
    },[])

    const partnersDatas = wishExerData.map((item, index)=>{
        return(
            <TouchableOpacity
                onPress={()=>{setPartners(item.wr_id)}}
                key={index} 
                style={[
                    styles.settingButton,
                    {marginTop:10, marginRight:buttonWidthPaddings},
                    item.wr_id === partners ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#fff'}
                ]}
            >
                <DefText 
                    text={item.wr_subject} 
                    style={[
                        styles.settingButtonText,
                        item.wr_id === partners ? {color:'#fff'} : {color:'#333'}
                    ]} 
                />
            </TouchableOpacity>
        )
    });


    const typeDatas = purposeDats.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={index} 
                style={[
                    styles.settingButton, 
                    {marginTop:10}, item.idx % 4 === 0 ? {marginRight:0} : {marginRight:buttonWidthPaddings},
                    item.wr_id === purpose ? {backgroundColor:'#CA0D3C'} : {backgroundColor:'#fff'}
                ]}
                onPress={()=>setPurpose(item.wr_id)}
            >
                <DefText 
                    text={item.wr_subject}
                    style={[
                        styles.settingButtonText,
                        item.wr_id === purpose ? {color:'#fff'} : {color:'#333'}
                    ]} 
                />
            </TouchableOpacity>
        )
    });


    //검색목록 지우기
    const [removeSchResult, setRemoveSchResult] = useState(false);


    useEffect(()=>{
        console.log(purpose)
    },[purpose])
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headertitle='상세설정' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <DefText text='업체' style={{fontFamily:Font.RobotoBold}} />
                    <HStack flexWrap='wrap'>
                       {partnersDatas}
                    </HStack>
                </Box>
                <Box p={5}>
                    <DefText text='목적' style={{fontFamily:Font.RobotoBold}} />
                    <HStack flexWrap='wrap'>
                       {typeDatas}
                    </HStack>
                </Box>
                
            </ScrollView>
            <Box>
                <TouchableOpacity 
                    onPress={()=>{ navigation.navigate('Maps', {'purposeDatas':purpose})}} 
                    style={{
                        justifyContent:'center',
                        alignItems:'center',
                        height:46,
                        backgroundColor:'#CA0D3C'
                    }}
                >
                    <DefText text='완료' style={{color:'#fff', fontFamily:Font.RobotoBold}} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    settingButton:{
        width:buttonWidth,
        height:31,
        borderWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    settingButtonText: {
        fontFamily:Font.RobotoMedium
    }
})

export default MapSetting;