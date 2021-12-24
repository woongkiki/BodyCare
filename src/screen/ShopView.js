import React, {useEffect, useState} from 'react';
import { Box, Text, Image, VStack, HStack, Modal} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Platform, Share, ActivityIndicator } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { shopitemdatas } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut  } from '../common/dataFunction';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const ScreenWidthsHalf = Dimensions.get('window').width * 0.5;
const ScreenWidths = Dimensions.get('window').width;

const ShopView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log(userInfo);

    const [tabOn, setTabOn] = useState(0);

    const [sellModal, setSellModal] = useState(false);

    //상품좋아요
    const [itemHeart, setItemHeart] = useState(false);

    //공유
    const onShare = async () => {
        try{
            const result = await Share.share({
                message:Platform.OS==='android' ?
                'https://play.google.com/store/apps/details?id=com.bodycareapp' :
                'https://apps.apple.com/us/app/%EB%B0%94%EB%94%94%EC%BC%80%EC%96%B4/id1584773259',
            })
            if(result.action === Share.sharedAction) {
                if(result.activityType){

                }else{

                }
            }else if(result.action === Share.dismissedAction){

            }
        }catch(error){
            ToastMessage(error.message);
        }
    }

    //카운트
    const [count, setCount] = useState(1);
    //가격
    //let priceFix = parseInt(params.it_price);
    //수량에 따른 가격변화

    const [orPrice, setOrPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');

    const _sellCountMinus = () => {
        if(count===1){
            ToastMessage('최소주문수량은 1개 입니다.');
            return false;
        }
        setCount(count-1);
        setSellPrice(sellPrice - orPrice);
    }

    const _sellCountPlus = () => {
        setCount(count+1);
        setSellPrice(sellPrice + orPrice);
    }
    

    const [shopItemDetail, setShopItemDetail] = useState('');

    const shopItemView = () => {
        Api.send('shop_shopView', {'itid':params.it_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                console.log('상품 결과 뷰 : ', arrItems.it_explan);
                //setShopItemDataReal(arrItems);
                setShopItemDetail(arrItems);
                setOrPrice( parseInt(arrItems.it_price_or) );
                setSellPrice( parseInt(arrItems.it_price) );
                shopItemReview();

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    useEffect(()=>{
        shopItemView();
    },[])


    const [shopReviewAvg, setShopReviewAvg] = useState('');
    const [shopReviewAvgNumber, setShopReviewAvgNumber] = useState('');
    const [shopReviewList, setShopReviewList] = useState('');

    const shopItemReview = () => {
        Api.send('shop_review', {'itid':params.it_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                //console.log('상품 리뷰 : ', arrItems);
                

                let reviewAvg;
                if(arrItems.avg == '5'){
                    reviewAvg =  <Image source={require("../images/s_star5.png")} width={60} height={11} alt='평점' />;
                }else if(arrItems.avg == '4'){
                    reviewAvg =  <Image source={require("../images/s_star4.png")} width={60} height={11} alt='평점' />;
                }else if(arrItems.avg == '3'){
                    reviewAvg =  <Image source={require("../images/s_star3.png")} width={60} height={11} alt='평점' />;
                }else if(arrItems.avg == '2'){
                    reviewAvg =  <Image source={require("../images/s_star2.png")} width={60} height={11} alt='평점' />;
                }else if(arrItems.avg == '1'){
                    reviewAvg =  <Image source={require("../images/s_star1.png")} width={60} height={11} alt='평점' />;
                }

                setShopReviewAvg(reviewAvg);
                setShopReviewAvgNumber(arrItems.avg)
                setShopReviewList(arrItems.review);
                //setShopItemDataReal(arrItems);
                //setShopItemDetail(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    const renderersProps = {
        img: {
          enableExperimentalPercentWidth: true
        }
      };
      

    const cartHandelr = () => {
        Api.send('shop_cart', {'it_id':shopItemDetail.it_id, 'it_name':shopItemDetail.it_name, 'mb_id':userInfo.mb_id, 'sellprice':sellPrice,'ct_cnt':count}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('결과는 ? ', resultItem);
                setSellModal(false);
                ToastMessage(resultItem.message);

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }


    const sellButton = (item) => {

        if(userInfo){
            navigation.navigate('OrderForm', {'itemList':[{'it_id':item.it_id, 'it_name':item.it_name, 'it_price':item.it_price, 'count':count}], 'sumPrice': item.it_price * count});
        }else{
            setSellModal(false);
            ToastMessage('로그인 후 이용가능합니다.');
        }
    }

    const _cartButton = () => {
        //console.log('장바구니 담기..');

        Api.send('contents_cartAction', {'it_id':params.it_id,'mb_id':userInfo.mb_id,'ct_cnt':count}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('결과는 ? ', resultItem);
               setSellModal(false);
                ToastMessage(resultItem.message);

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle={shopItemDetail.it_name} />
            {
                shopItemDetail != '' ? 
                <ScrollView>
                    <VStack>
                        <Box>
                            <Image source={{uri:shopItemDetail.imageUrl}} alt={shopItemDetail.it_name} width={ScreenWidths} height={260} resizeMode='contain' />
                        </Box>
                        <Box p={5} pb={0}>
                            <DefText text={shopItemDetail.it_name} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                            {/* <DefText
                                text={'배송비 : '+numberFormat(route.params.sendCost)+'원 (50,000원 이상시 무료배송)'}
                                style={{marginTop:15, fontSize:14, color:'#666'}}
                            /> */}
                            <Box mt={9}>
                                <HStack justifyContent='space-between' alignItems='flex-end'>
                                    <HStack>
                                        <TouchableOpacity onPress={()=>{setItemHeart(!itemHeart)}}>
                                            {
                                                itemHeart ? 
                                                <Image 
                                                    source={require('../images/viewpageHeartOn.png')} 
                                                    alt='좋아요'
                                                    mr={2}
                                                />
                                                :
                                                <Image 
                                                    source={require('../images/viewpageHeart.png')} 
                                                    alt='좋아요'
                                                    mr={2}
                                                />
                                            }
                                            
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{onShare()}}>
                                            <Image 
                                                source={require('../images/viewpageShare.png')} 
                                                alt='공유하기'
                                            />
                                        </TouchableOpacity> 
                                    </HStack>
                                    <HStack alignItems='flex-end'>
                                        <Box mr={2.5}>
                                            <Box width='100%' height='1px' backgroundColor='#999' position='absolute' top="8px" />
                                            {/* <DefText 
                                                text={numberFormat(params.it_price) + '원'} 
                                                style={{color:'#999', fontSize:12}}
                                            /> */}
                                        </Box>
                                        <DefText
                                        text={ '가격 : ' + numberFormat(shopItemDetail.it_price) + '원'}
                                        style={{fontFamily:Font.RobotoMedium}}
                                        />
                                    </HStack>
                                </HStack>
                            </Box>
                        </Box>
                        <Box mt={8}>
                            <HStack>
                                <TouchableOpacity
                                    style={[styles.shopTabButtons, tabOn === 0 && { borderBottomColor:'#191919'} ]}
                                    onPress={()=>{setTabOn(0)}}
                                >
                                    <DefText text='상품정보' style={[ tabOn === 0 && { fontFamily:Font.RobotoBold} ]} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.shopTabButtons, tabOn === 1 && { borderBottomColor:'#191919'}]}
                                    onPress={()=>{setTabOn(1)}}
                                >
                                    <DefText text='구매후기' style={[ tabOn === 1 && { fontFamily:Font.RobotoBold} ]} />
                                </TouchableOpacity>
                            </HStack>
                            {
                                tabOn === 0 ?
                                <Box p={5}>
                                    {/* <HTML 
                                        source={{html: params.it_explan}} 
                                        tagsStyles={StyleHtml} 
                                        contentWidth={Dimensions.get('window').width}  
                                    /> */}
                                    {/* <DefText text={shopItemDetail.it_explan} /> */}
                                    {
                                        shopItemDetail.it_mobile_explan != '' ?
                                        <HTML 
                                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'textDecorationColor']}
                                            ignoredTags={['head', 'script', 'src']}
                                            source={{html: shopItemDetail.it_mobile_explan}} 
                                            tagsStyles={StyleHtml} 
                                            containerStyle={{ flex: 1, }}
                                            contentWidth={Dimensions.get('window').width - 40 }  
                                            
                                        />
                                        :
                                        shopItemDetail.it_explan != '' ?
                                        <HTML 
                                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'textDecorationColor']}
                                            ignoredTags={['head', 'script', 'src']}
                                        
                                            source={{html: shopItemDetail.it_explan}} 
                                            tagsStyles={StyleHtml} 
                                            containerStyle={{ flex: 1, }}
                                            contentWidth={Dimensions.get('window').width - 40 }  
                                            
                                        />
                                        :
                                        <Box alignItems={'center'} justifyContent={'center'} py={5}>
                                            <DefText text='등록된 상품정보가 없습니다.' />
                                        </Box>
                                    }
                                    
                                    
                                </Box> 
                                :
                                <Box>
                                    <HStack alignItems='center' justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#f2f2f2' p={5}>
                                        <HStack alignItems='center'>
                                            <DefText text='평점' style={{marginRight:15}} />
                                            {
                                                shopReviewAvgNumber != '' &&
                                                shopReviewAvg
                                            }
                                        </HStack>
                                        <TouchableOpacity 
                                            style={{paddingHorizontal:15, height:25, backgroundColor:'#F2F2F2', justifyContent:'center', borderRadius:5}}
                                            onPress={()=>{navigation.navigate('ItmeUseForm', shopItemDetail)}}
                                        >
                                            <DefText text='후기작성' style={{fontSize:13, color:'#191919'}} />
                                        </TouchableOpacity>
                                    </HStack>
                                    {
                                        shopReviewList != '' ?
                                        <Box p={5}>
                                            {
                                                shopReviewList.map((item, index)=> {

                                                    let scores;
                                                    if(item.is_score == '5'){
                                                        scores = <Image source={require("../images/s_star5.png")} width={60} height={11} alt='5점' my={2.5} />;
                                                    }else if(item.is_score == '4'){
                                                        scores = <Image source={require("../images/s_star4.png")} width={60} height={11} alt='4점' my={2.5} />;
                                                    }else if(item.is_score == '3'){
                                                        scores = <Image source={require("../images/s_star3.png")} width={60} height={11} alt='3점' my={2.5} />;
                                                    }else if(item.is_score == '2'){
                                                        scores = <Image source={require("../images/s_star2.png")} width={60} height={11} alt='2점' my={2.5} />;
                                                    }else if(item.is_score == '1'){
                                                        scores = <Image source={require("../images/s_star1.png")} width={60} height={11} alt='1점' my={2.5} />;
                                                    }

                                                    return (
                                                        <VStack key={index}>
                                                            <Box>
                                                                <HStack alignItems='center'>
                                                                    <DefText text={item.is_name} style={{color:'#666', fontFamily:Font.RobotoMedium}} />
                                                                    <Box width='1px' height='15px' backgroundColor='#aaa' mx={2.5} />
                                                                    <DefText text={item.is_time} style={{color:'#aaa', fontFamily:Font.RobotoMedium}} />
                                                                </HStack>
                                                                {
                                                                    item.is_score != '' && 
                                                                    scores
                                                                }  
                                                                <HTML 
                                                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'textDecorationColor']}
                                                                    ignoredTags={['head', 'script', 'src']}
                                                                    imagesMaxWidth={Dimensions.get('window').width - 40}
                                                                    source={{html: item.is_content}} 
                                                                    tagsStyles={StyleHtml} 
                                                                    containerStyle={{ flex: 1, }}
                                                                    contentWidth={Dimensions.get('window').width}  
                                                                />
                                                            </Box>
                                                        </VStack>
                                                    )
                                                })
                                            }
                                        </Box>
                                        :
                                        <Box p={5} alignItems={'center'} justifyContent={'center'}>
                                            <DefText text='등록된 후기가 없습니다.' style={{color:'#666'}} />
                                        </Box>
                                    }
                                   
                                </Box>
                            }   
                        </Box>
                        
                    </VStack>
                </ScrollView>
                :
                <Box flex={1} alignItems={'center'} justifyContent={'center'} backgroundColor='#fff'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
            <TouchableOpacity 
                style={{
                    height:46,
                    backgroundColor:'#CA0D3C',
                    justifyContent:'center',
                    alignItems:'center',
                    
                }}
                onPress={()=>{setSellModal(!sellModal)}}
            >
                <DefText text='구매하기' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
            </TouchableOpacity>
            {
                shopItemDetail != '' &&
                <Modal isOpen={sellModal} onClose={() => setSellModal(false)}>
                    <Modal.Content position='absolute' bottom={0} width={ScreenWidths} borderRadius={0} borderTopRadius={10}>
                        <Modal.Body>
                            <DefText text={textLengthOverCut(shopItemDetail.it_name, 25)} style={{fontSize:17, color:'#191919', fontFamily:Font.RobotoBold}} />
                            <HStack mt={5}>
                                <Image source={{uri:shopItemDetail.imageUrl}} alt='이미지 썸네일' width='60px' height='60px' mr={5} />
                                <VStack justifyContent='space-around'  width={ScreenWidths-130}>
                                    <DefText text={shopItemDetail.it_name} />
                                    <HStack justifyContent='space-between' alignItems='center' >
                                        <DefText text={numberFormat(shopItemDetail.it_price) + '원'} style={{fontFamily:Font.RobotoBold}} />

                                        <HStack>
                                            <TouchableOpacity style={styles.countsButton} onPress={()=>{_sellCountMinus()}}>
                                                <DefText text='-' />
                                            </TouchableOpacity>
                                            <Box style={styles.countsButton}>
                                                <DefText text={count} style={{fontSize:11}} />
                                            </Box>
                                            <TouchableOpacity style={styles.countsButton} onPress={()=>{_sellCountPlus()}}>
                                                <DefText text='+' />
                                            </TouchableOpacity>
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </HStack>
                            <Box p={2.5} mt={5} bg='#f2f2f2'>
                                <HStack justifyContent='space-between' alignItems='center'>
                                    <DefText text={'총 수량 ' + count + '개'} />
                                    <HStack alignItems='center'>
                                        <DefText text={'총 금액'} style={{marginRight:10}} />
                                        <DefText text={numberFormat(sellPrice) + '원'} style={{fontSize:16, fontFamily:Font.RobotoBold, color:'#CA0D3C'}} />
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box mt={5}>
                                <HStack justifyContent='space-between'>
                                    {
                                        userInfo && 
                                        <TouchableOpacity style={[styles.sellButton]} onPress={cartHandelr}>
                                            <DefText text='장바구니 담기' style={{fontFamily:Font.RobotoMedium}} />
                                        </TouchableOpacity>
                                    }
                                    
                                    <TouchableOpacity onPress={()=>sellButton(shopItemDetail)} style={[styles.sellButton, {borderWidth:0, backgroundColor:'#CA0D3C'}, !userInfo && {width:'100%'}]}>
                                        <DefText text='바로 구매하기' style={{color:'#fff', fontFamily:Font.RobotoMedium}} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    shopTabButtons :{
        width:ScreenWidthsHalf,
        height:45,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center'
    },

    countsButton: {
        width:30,
        height:30,
        borderWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center'
    },

    sellButton: {
        width:ScreenWidths*0.43,
        height:41,
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
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
)(ShopView);