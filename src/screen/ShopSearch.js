import React, { useState } from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard, StyleSheet, Alert, FlatList } from 'react-native'
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';
import Font from '../common/Font'

import Api from '../Api';

const ShopSearch = (props) => {

    let ScreenWidths = Dimensions.get('window').width;
    let ScreenWidthsHalf = ScreenWidths * 0.45;
    let ImageWidths = ScreenWidths * 0.43;
    let ScreenPaddings = ScreenWidths * 0.05;

    const {navigation} = props;

    const [loading, setLoading] = useState(false);
    const [allSchText, setAllSchText] = useState('');

    const _SchValueChange = (text) => {
        setAllSchText(text);
    }

    const [shopSchData, setShopSchData] = useState([]);
    const _shopSchButton = () => {
        if(allSchText.length==0){
            ToastMessage('검색어를 1글자 이상 입력하세요.');
            return false;
        }
        //샐러드
        setLoading(true);

        Api.send('contents_shopSearch', {'schText':allSchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                setLoading(false);
                //console.log(resultItem);
                setShopSchData(arrItems);


            }else{
                console.log('결과 출력 실패!');
            }
        });
    }


    const _renderShopResult = ({item, index})=>{
        return(
          
            <TouchableOpacity 
                
                style={[{ width:ScreenWidthsHalf} , index % 2 === 0 ? { marginLeft:ScreenPaddings} : {alignItems:'flex-end'}]}
                onPress={()=>{navigation.navigate('ShopView', item)}}
            >
                <Box mt={5} style={[ index % 2 ==! 0 && {alignItems:'flex-end'} ]}>
                    <Image
                        source={{uri:item.imageUrl}}
                        alt={item.it_name}
                        style={{width:ImageWidths, height:115, borderRadius:5}}
                    />
                </Box>
                <Box alignItems='flex-start' width={ImageWidths} mt={2.5} >
                    <DefText text={item.it_name} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                </Box>
                <Box alignItems='flex-end'   width={ImageWidths} mt={2.5} >
                    <DefText
                        text={numberFormat(item.it_price) + '원'}
                        style={{color:'#666', fontFamily:Font.RobotoMedium}}
                    />
                </Box>
            </TouchableOpacity>
         
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <Box flex={1} >
                    <HeaderDef navigation={navigation} headertitle='어떤 상품을 찾으시나요?' />
                    <Box py={5}>
                        <Box px={5}>
                            <Input
                                _focus='transparent'
                                height={46}
                                width='100%'
                                value={allSchText}
                                onChangeText={_SchValueChange}
                                
                                placeholder='상품명을 입력하세요'
                            />
                            <TouchableOpacity 
                                style={{height:46, width:46, justifyContent:'center', alignItems:'center', position:'absolute', right:20, top:0}}
                                onPress={_shopSchButton}
                            >
                                <Image source={require('../images/searchIcon.png')} alt='검색하기' />
                            </TouchableOpacity>
                        </Box>
                        <Box mt={5}>
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
                                        <DefText text='등록된 상품이 없습니다.' style={{color:'#666'}} />
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

export default ShopSearch;