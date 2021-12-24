import React, { useEffect, useState } from 'react';
import { Box, Text, Image, VStack, HStack, Modal} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, ActivityIndicator, View, Platform } from 'react-native';
import Swiper from 'react-native-swiper';
import {DefText} from '../common/BOOTSTRAP';
import HeaderShopDef from '../components/HeaderShopDef';
import Font from '../common/Font';
import { shopitemdatas } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut  } from '../common/dataFunction';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import DeviceInfo from 'react-native-device-info';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const Shop = (props) => {

    let ScreenWidths = Dimensions.get('window').width;
    let ScreenWidthsHalf = ScreenWidths * 0.44;
    let ImageWidths = ScreenWidths * 0.43;
    let ScreenPaddings = Platform.OS == 'ios' ? ScreenWidths * 0.02 : ScreenWidths * 0.02;


    let shopBannerHeight = ScreenWidths / 2.3;
    
    //console.log(ScreenPaddings);
    let isTablet = DeviceInfo.isTablet();

    const {navigation, userInfo} = props;

    
    


    const [bannerLoading, setBannerLoading] = useState(true);
    const [shopBannerDatas, setShopBannerDatas] = useState([]);
    const ShopBannerData = async () => {

        
        Api.send('contents_shopMainBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //setLoading(false);
                setBannerLoading(false);
                setShopBannerDatas(arrItems);
                //console.log('배너 결과 출력 : ', arrItems);
               // setMainBannerDataList(arrItems);
                //setTrainerDataMainList(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
        
    }


    useEffect(()=>{
        ShopBannerData();

    },[])


    const [menuModal, setMenuModal] = useState(false); //메뉴 모달 띄우기
    const [shopCaegory, setShopCategory] = useState('');
    const [selectCategoryIdx, setSelectCategoryIdx] = useState('');

    const [shopLoading, setShopLoading] = useState(false);

    const shopMenuCategory = async () => {

        await setShopLoading(true);

        await Api.send('shop_category', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('카테고리 결과 출력123 : ', arrItems);

                setShopCategory(arrItems);
             //   console.log('카테고리:::', arrItems);
                setSelectCategoryIdx(arrItems[0].ca_id);

                if(selectCategoryIdx != ''){
                    Api.send('shop_itemList', {'categoryIdx':selectCategoryIdx}, (args)=>{
                        let resultItem = args.resultItem;
                        let arrItems = args.arrItems;
            
                        if(resultItem.result === 'Y' && arrItems) {
                            //console.log('결과 출력123 : ', arrItems);
            
                           
                            console.log('상품 리스트:::', arrItems);
                            setItemListAll(arrItems);
                            setCategoryName(arrItems.categoryName)
                            setItemList(arrItems.itemList)
                            //setShopItemEventData(arrItems);
                        }else{
                            console.log('상품 출력 실패!');
                        }
                    });
                }
                //setShopItemEventData(arrItems);
            }else{
                console.log('카테고리 출력 실패!');
            }
        });

        await setShopLoading(false);
    }

    const categorySelect = (idx) => {
       // console.log('선택한 카테고리 번호:::', idx);

        setSelectCategoryIdx(idx);
        setMenuModal(false);
    }

    const shopMenuOpen = () => {
        setMenuModal(true);
    }
    

    useEffect(()=>{
        shopMenuCategory();
    }, []);

    const isFocused = useIsFocused();

    useEffect(() => {
      
        if (isFocused){
          //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
          shopMenuCategory()
        } 
          
      }, [isFocused]);
    
    const [itemListAll, setItemListAll] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [itemList, setItemList] = useState('');

    useEffect(()=>{
        console.log('선택된 idx', selectCategoryIdx);

        if(selectCategoryIdx != ''){
            Api.send('shop_itemList', {'categoryIdx':selectCategoryIdx}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
    
                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력123 : ', arrItems);
    
                   
                    console.log('상품 리스트:::', arrItems);
                    setItemListAll(arrItems);
                    setCategoryName(arrItems.categoryName)
                    setItemList(arrItems.itemList)
                    //setShopItemEventData(arrItems);
                }else{
                    console.log('상품 출력 실패!');
                }
            });
        }
    }, [selectCategoryIdx])

    const shopBanner = shopBannerDatas.map((item, index)=>{
        return(
            <TouchableOpacity activeOpacity={1} key={index}>
                {
                    isTablet ? 
                    <Image source={{uri:item.thumb}} style={{width:ScreenWidths, height:shopBannerHeight}} alt={item.wr_id} resizeMode='stretch' />
                    :
                    <Image source={{uri:item.thumb}} style={{width:ScreenWidths, height:shopBannerHeight}} alt={item.wr_id} resizeMode='stretch' />
                }

            </TouchableOpacity>
        )
    })

    const _renderShop = ({item, index})=>{
        return(
          
            <TouchableOpacity onPress={()=>navigation.navigate('ShopView', {'it_id':item.it_id})} key={index} style={[{width:ScreenWidths * 0.5 - 20, marginBottom:20}, (index+1) % 2 == 0 ? {marginLeft:10} : {marginLeft:20} ]}>
                                                   
                <Box>
                    <Image source={{uri:item.imageUrl}} style={{width:ImageWidths, height:ImageWidths, borderRadius:5, resizeMode:'stretch'}} alt={item.it_name} />
                </Box>
            
                
                <Box width={ImageWidths}>
                    <DefText text={ textLengthOverCut(item.it_name, 12)} style={{fontSize:14, color:'#000', marginTop:20}} />
                    <Box alignItems='flex-end' mt={2.5} >
                        <DefText
                            text={numberFormat(item.it_price) + '원'}
                            style={{color:'#666', fontFamily:Font.RobotoMedium}}
                        />
                    </Box>
                </Box>
            </TouchableOpacity>
         
        )
    }

 

    return (
        <Box flex={1} bg='#fff'>
            <HeaderShopDef navigation={navigation} headertitle='바디캐어 쇼핑몰' onPress={shopMenuOpen} />
            {
                !shopLoading ?
              
                <FlatList
                    nestedScrollEnabled
                    ListHeaderComponent={
                        <>
                            {
                                bannerLoading ? 
                                <Box justifyContent='center' alignItems='center' height={260}>
                                    <ActivityIndicator size={'large'} color="#333" />
                                </Box>
                                :
                                <Swiper loop={true} height={isTablet ? shopBannerHeight : shopBannerHeight}
                                    autoplay={true}
                                    autoplayTimeout={3}
                                    dot={
                                        <View
                                        style={{
                                            backgroundColor: '#fff',
                                            width: 5,
                                            height: 5,
                                            borderRadius: 5,
                                            marginLeft: 10,
                                        }}
                                        />
                                    }
                                    activeDot={
                                    <View
                                        style={{
                                        backgroundColor: '#CA0D3C',
                                        width: 5,
                                        height: 5,
                                        borderRadius: 5,
                                        marginLeft: 10,
                                        }}
                                    />
                                    }
                                    paginationStyle={{
                                        bottom: '10%',
                                        
                                    }}
                                >
                                    {shopBanner}
                                </Swiper>
                            }
                            {
                                categoryName != '' &&
                                <Box px={5} mt={5} mb={5}>
                                    <DefText 
                                        text={categoryName} 
                                        style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold}} 

                                    />
                                </Box>
                            }
                        </>
                    }
                    data={itemList}
                   
                    renderItem={_renderShop}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 상품정보가 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                    numColumns={2}
                   
                />
               
                
                :
                <Box flex={1} alignItems={'center'} justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
    
                <Modal isOpen={menuModal} style={{flex:1, backgroundColor:'#fff'}} onClose={() => setMenuModal(false)}>
                    <HStack width={ScreenWidths} height='50px' alignItems='center' justifyContent={'flex-end'} borderBottomWidth={1} borderBottomColor={'#ddd'}>
                        <Box position={'absolute'} height='50px' width={ScreenWidths} top={0} left={0} justifyContent={'center'} alignItems={'center'}>
                            <DefText text='쇼핑 카테고리 선택' style={{fontSize:18, fontFamily:Font.RobotoBold}} />
                        </Box>
                        <TouchableOpacity style={{paddingRight:20}} onPress={()=>{setMenuModal(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <ScrollView>
                        <Box width={ScreenWidths}>
                            {
                                shopCaegory != '' &&
                                shopCaegory.map((item, index)=> {
                                    return(
                                        <TouchableOpacity key={index} onPress={()=>categorySelect(item.ca_id)} style={[styles.categoryButton, selectCategoryIdx == item.ca_id && {backgroundColor:'#CA0D3C'}]}>
                                            <DefText text={item.ca_name} style={[styles.categoryText, selectCategoryIdx == item.ca_id && {color:'#fff'}]} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </Box>
                    </ScrollView>
                </Modal>
            
        </Box>
    );
};

const styles = StyleSheet.create({
   categoryButton: {
       paddingVertical:10,
       paddingHorizontal: 20,
       borderBottomWidth:1,
       borderBottomColor:'#ddd'
   },
   categoryText : {
       fontSize:15,
       color:'#333',
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
  )(Shop);