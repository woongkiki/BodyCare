import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard, StyleSheet, Alert, FlatList } from 'react-native'
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font'
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import DeviceInfo from 'react-native-device-info';


const ScreenWidths = Dimensions.get('window').width;
const ScreenWidthsHalf = (ScreenWidths-20) * 0.5;
const ImageWidths = ScreenWidths * 0.43;
const ScreenPaddings = ScreenWidths * 0.05;


const Search = (props) => {


    const {navigation} = props;

    let isTablet = DeviceInfo.isTablet();


    const [loading, setLoading] = useState(false);
    const [allSchText, setAllSchText] = useState('');

    const _SchValueChange = (text) => {
        setWishExerIdx('');
        setAllSchText(text);
    }

    const [wishExerArr, setWishExerArr] = useState([]);
    const [wishExerIdx, setWishExerIdx] = useState('');
    const [purposeArr, setPurposeArr] = useState([]);
    const [categorys, setCategorys] = useState('');
    //console.log(allSchText);

    const [shopSchData, setShopSchData] = useState([]);

    const wishExerCategorys = () => {
        Api.send('contents_wishExerList', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                
                setWishExerArr(arrItems);


            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    const purposeCategorys = () => {
        Api.send('contents_purposeLists', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                
                setPurposeArr(arrItems);


            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    useEffect(()=>{
        wishExerCategorys();
        purposeCategorys();
    },[])

//시흥
    useEffect(()=>{
        console.log('wishExerIdx:::', wishExerIdx);
    },[wishExerIdx])


    const _shopSchButton = () => {
        if(allSchText.length==0){
            ToastMessage('검색어를 1글자 이상 입력하세요.');
            return false;
        }

        Keyboard.dismiss();
        //샐러드
        setLoading(true);

        Api.send('contents_allSearch', {'schText':allSchText, 'sendIdx':wishExerIdx, 'sendCategory':categorys}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               
                setShopSchData(arrItems);
                console.log('resultItem::::',resultItem);
                //console.log('arrItems::::',arrItems);
                //setShopSchData(arrItems);


            }else{
                console.log('결과 출력 실패!');
            }
        });

        setLoading(false);
    }

    const recommendData = wishExerArr.map((item,index)=> {
        return(
            <TouchableOpacity 
                key={index}
                style={[styles.recommendButton]}
                onPress={()=>{setAllSchText(item.wr_subject); setWishExerIdx(item.wr_id); setCategorys('partners')}}
            >
                <DefText text={item.wr_subject} />
            </TouchableOpacity>
        )
    })

    const recommendData2 = purposeArr.map((item,index)=> {
        return(
            <TouchableOpacity 
                key={index}
                style={[styles.recommendButton]}
                onPress={()=>{setAllSchText(item.wr_subject); setWishExerIdx(item.wr_id); setCategorys('trainers') }}
            >
                <DefText text={item.wr_subject} />
            </TouchableOpacity>
        )
    })


    const navigateGo = (item) => {
        //console.log(item.cate);
        if(item.cate=='partners'){
            navigation.navigate('PartnersView', item)
        }else if(item.cate=='trainers'){
            navigation.navigate('TrainersView', item)
        }
    }


    const _renderShopResult = ({item, index})=>{
        return(
          
            <TouchableOpacity 
                
                style={[{ width:ScreenWidthsHalf}]}
                onPress={()=> {navigateGo(item)} }
            >
                <Box mt={5} style={[ index % 2 ==! 0 && {alignItems:'center'}, {marginLeft:20} ]}>
                {
                    item.imageUrl ?
                    <Image
                        source={{uri:item.imageUrl}}
                        alt={item.wr_subject}
                        style={[{width:ImageWidths, height:115, borderRadius:5}, isTablet && {height:230}]}
                        resizeMode='cover'
                    />
                    :
                    <Image
                        source={require('../images/noImage.png')}
                        alt={item.wr_subject}
                        style={[{width:ImageWidths, height:115, borderRadius:5}, isTablet && {height:230}]}
                        resizeMode='contain'
                    />
                }
                {
                    item.wr_subject ? 
                    <DefText text={textLengthOverCut(item.wr_subject, 8)} style={{textAlign:'center', marginTop:20, fontSize:16}} />
                    :
                    <DefText text='' />
                }
                
                    
                </Box>
            </TouchableOpacity>
         
        )
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <Box flex={1} >
                    <HeaderDef navigation={navigation} headertitle='어떤 운동을 찾으시나요?' />
                    <Box py={5}>
                        <Box px={5}>
                            <Input
                                _focus='transparent'
                                height={46}
                                width='100%'
                                value={allSchText}
                                onChangeText={_SchValueChange}
                                onSubmitEditing={_shopSchButton}
                            />
                            <TouchableOpacity
                                 style={{height:46, width:46, justifyContent:'center', alignItems:'center', position:'absolute', right:20, top:0}}
                                 onPress={_shopSchButton}
                            >
                                <Image source={require('../images/searchIconNew12.png')} alt='검색하기' />
                            </TouchableOpacity>
                        </Box>
                        <Box mt={5}  px={5}>
                            <DefText text='추천 검색 키워드' style={{fontSize:16, fontFamily:Font.RobotoBold, marginBottom:10}} />
                            <HStack flexWrap='wrap' >
                                {recommendData}
                                {recommendData2}
                            </HStack>
                        </Box>
                        <Box mt={5} pb={600}>
                        {
                            loading ?
                            <Box justifyContent='center' alignItems='center' height={260}>
                                <ActivityIndicator size={'large'} color="#333" />
                            </Box>
                            :
                            <FlatList 
                                data={shopSchData}
                                renderItem={_renderShopResult}
                                keyExtractor={(item, index)=>index.toString()}ß
                                numColumns={2}
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={
                                    <Box py={10} alignItems='center'>
                                        <DefText text='검색된 내용이 없습니다.' style={{color:'#666'}} />
                                    </Box>                
                                }
                        />
                                
                        }
                        </Box>    
                    </Box>
                </Box>
            </TouchableWithoutFeedback>
        </Box>
    );
};

const styles = StyleSheet.create({
    recommendButton: {
        paddingHorizontal:10,
        height:30,
        justifyContent:'center',
        backgroundColor:'#e3e3e3',
        borderRadius:30,
        marginRight:10,
        marginTop:5,
        
    }
})

export default Search;