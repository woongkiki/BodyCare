import React, {useEffect, useState} from 'react';
import { Box, Text, Image, VStack, HStack, Modal, CheckIcon} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { shopitemdatas } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut  } from '../common/dataFunction';
import Api from '../Api';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const ScreenWidths = Dimensions.get('window').width;

const Cart = ( props ) => {

    const {navigation, userInfo} = props;

    //전체선택
    const [allChecks, setAllChecks] = useState(true);
    const [itemChecks, setItemChecks] = useState(true);

    const [count, setCount] = useState(1);
    //가격
    let priceFix = 26000;
    //수량에 따른 가격변화
    const [sellPrice, setSellPrice] = useState(26000);

     //총 결제 금액
     const [sumPrice, setSumPrice] = useState(sellPrice + 3000);

    const _sellCountMinus = () => {
        if(count===1){
            ToastMessage('최소주문수량은 1개 입니다.');
            return false;
        }
        setCount(count-1);
        setSellPrice(sellPrice - priceFix);
        setSumPrice(sumPrice - priceFix)
    }

    const _sellCountPlus = () => {
        setCount(count+1);
        setSellPrice(sellPrice + priceFix);
        setSumPrice(sumPrice + priceFix)
    }

    useEffect(()=>{

        if(!allChecks){
            setItemChecks(false);
        }else{
            setItemChecks(true);
        }

        if(!itemChecks && !allChecks ){
            setSellPrice(0)
            setSumPrice(0 + 3000)
        }else{
            setSellPrice(26000)
            setSumPrice(sellPrice + 3000)
        }

    },[allChecks, itemChecks])

   //장바구니 목록 삭제
    const [cartListModal, setCartListModal] = useState(false);
    const _cartListDelete = () => {
        if(!allChecks){
            ToastMessage('상품을 1개이상 선택하세요!');
            return false;
        }

        setCartListModal(!cartListModal);
    }

    const [cartListDelete, setCartListDelete] = useState(false);


    const [cartItemData, setCartItemData] = useState([]);
    const CartData = async () => {
        Api.send('contents_cartList', {'mb_id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('장바구니 목록쓰',arrItems);
               setCartItemData(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }


    const [cartItemLists, setCartItemLists] = useState('');
    const [cartSumPrice, setCartSumPrice] = useState('');

    const CartItemDataReceive = () => {
        Api.send('shop_cartlist', {'mb_id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('장바구니 목록쓰',arrItems);
               console.log('장바구니 목록::::',arrItems);
               //console.log('장바구니 목록123::::',resultItem);
               setCartItemLists(arrItems.cartList);
               setCartSumPrice(arrItems.sumPrice);
               setCheckId(arrItems.selectIdx);
               

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    useEffect(()=>{
        CartItemDataReceive();
    }, [])

    const [checkId, setCheckId] = useState([]);

    const cartChecks = (idx) => {
        //console.log(idx);

        if(checkId.includes(idx)){

           
          //  console.log('없음', checkId);

            const findIdx = checkId.find((e) => e === idx); // 배열에 같은값이 있으면 출력
            const idxs = checkId.indexOf(findIdx);

            checkId.splice(idxs, 1)

            setCheckId([...checkId]);

        }else{

           // console.log('있음', checkId);

            setCheckId([...checkId, idx]);
        }

        let checkIdSelect = checkId.join('|');

        //console.log('checkIdSelect',checkId);

        
    }


    const [cartItemTotalPrice, setCartItemTotalPrice] = useState('');

    useEffect(()=>{
       

        let checkIdSelect = checkId.join('|');
        console.log('checkId',checkIdSelect);

        Api.send('shop_cartSum', {'mb_id':userInfo.mb_id, 'checkId':checkIdSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('장바구니 목록쓰',arrItems);
               console.log('장바구니 상품 값 합계::::',arrItems);
               setCartItemTotalPrice(arrItems);
              // ToastMessage(resultItem.message);
              // CartItemDataReceive();

            }else{
                console.log(resultItem);
                setCartItemTotalPrice('0');
            }
        });

    }, [checkId])


    const cartRemove = () => {
        
        if(checkId == ''){
            ToastMessage('삭제하실 상품을 하나이상 체크하세요.');
            return false;
        }

        let checkIdSelect = checkId.join('|');

        Api.send('shop_cartDelete', {'mb_id':userInfo.mb_id, 'checkId':checkIdSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('장바구니 목록쓰',arrItems);
               console.log('장바구니 삭제::::',resultItem);
               ToastMessage(resultItem.message);
               CartItemDataReceive();

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    const cartAllRemove = () => {
        
        Api.send('shop_cartAllDelete', {'mb_id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               //console.log('장바구니 목록쓰',arrItems);
               //console.log('장바구니 삭제::::',resultItem);
               ToastMessage(resultItem.message);
               CartItemDataReceive();

            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    // useEffect(()=>{
    //     console.log('선택한 체크박스:::', checkId)
    // },[checkId])


   
    const sellButton = () => {

        console.log(checkId);

        let checkIdSelect = checkId.join('|');

        Api.send('shop_cartSell', {'mb_id':userInfo.mb_id, 'checkId':checkIdSelect}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
               console.log('장바구니 구매:::',arrItems);
               navigation.navigate('OrderForm', {'itemList':arrItems, 'sumPrice': cartItemTotalPrice});
               //console.log('장바구니 삭제::::',resultItem);
              // ToastMessage(resultItem.message);
              // CartItemDataReceive();

            }else{
                console.log('결과 출력 실패!');
            }
        });
        //navigation.navigate('OrderForm', {'itemList':[{'it_id':item.it_id, 'it_name':item.it_name, 'it_price':item.it_price, 'count':count}], 'sumPrice': item.it_price * count});
    }


    return (
        <>
            <Box flex={1} bg='#fff'>
                <HeaderDef navigation={navigation} headertitle='장바구니' />
                <ScrollView>
                    <VStack p={5}>
                        {
                            !cartListDelete ? 
                            <Box>
                                <HStack alignItems='center' justifyContent='flex-end'>
                                    {/* <HStack alignItems='center'>
                                        <TouchableOpacity onPress={()=>{setAllChecks(!allChecks)}}>
                                            <Box mr={2} width='19px' height='19px' borderRadius='5px' backgroundColor='#fff' borderWidth={1} borderColor='#999' justifyContent='center' alignItems='center'>
                                                {
                                                    allChecks && <CheckIcon width='13px' height='13px' color='#CA0D3C'  />
                                                }
                                                
                                            </Box>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{setAllChecks(!allChecks)}}>
                                            <DefText text='전체선택' style={{fontSize:15, color:'#666'}} />
                                        </TouchableOpacity>
                                    </HStack> */}
                                    <TouchableOpacity 
                                    
                                        style={{height:25, paddingHorizontal:10, borderWidth:1, borderColor:'#ddd', borderRadius:5,justifyContent:'center'}}
                                        onPress={()=>{
                                            cartRemove()
                                        }}
                                    >
                                        <DefText text='선택삭제' style={{fontSize:13, color:'#666'}} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    
                                        style={{height:25, paddingHorizontal:10, borderWidth:1, borderColor:'#CA0D3C', borderRadius:5,justifyContent:'center', marginLeft:10}}
                                        onPress={()=>{
                                            cartAllRemove()
                                        }}
                                    >
                                        <DefText text='비우기' style={{fontSize:13, color:'#CA0D3C'}} />
                                    </TouchableOpacity>
                                </HStack>
                                <VStack>
                                {
                                    cartItemLists != '' ?
                                    <Box>
                                        {
                                            cartItemLists.map((item, index)=> {
                                                return(
                                                    <TouchableOpacity onPress={()=>{cartChecks(item.od_id)}}
                                                        activeOpacity={0.9}
                                                        key={index}
                                                    >
                                                        <HStack mt={5} pt={5} borderTopWidth={1} borderColor='#f2f2f2'>
                                                            
                                                            <Box mr={2} width='15px' height='15px' borderRadius='2px' backgroundColor='#fff' borderWidth={1} borderColor='#999' justifyContent='center' alignItems='center' position='absolute' top={5} left={0} zIndex={99}>
                                                                {
                                                                    checkId.includes(item.od_id) && <CheckIcon width='10px' height='10px' color='#CA0D3C'  />
                                                                }
                                                                
                                                            </Box>
                                                        
                                                            <Image source={{uri:item.imageUrl}} alt='이미지 썸네일' width='60px' height='60px' mr={5} />
                                                            <VStack justifyContent='space-around'  width={ScreenWidths-130}>
                                                                <DefText text={item.it_name} />
                                                                <HStack justifyContent='space-between' alignItems='center' mt={2.5} >
                                                                    <DefText text={numberFormat(item.ct_price) + '원'} style={{fontFamily:Font.RobotoBold}} />
                                                                    <Box>
                                                                        <DefText text={item.ct_qty + '개'} style={{fontSize:14}} />
                                                                    </Box>
                                                        
                                                                </HStack>
                                                                <Box alignItems='flex-end'  mt={5}>
                                                                    <DefText text={'합계 ' + numberFormat(item.ct_price * 1) + '원'} />
                                                                </Box>
                                                            </VStack>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </Box>
                                    :
                                    <Box p={5} alignItems={'center'} justifyContent={'center'} mt={5}>
                                        <DefText text='장바구니에 담긴 상품이 없습니다.' />
                                    </Box>
                                }
                                {/* {
                                    cartRender
                                } */}

                                {/* <Box p={2.5} mt={5} bg='#f2f2f2'>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <DefText text={'상품 금액'} />
                                    
        
                                            <DefText text={numberFormat(sellPrice) + '원'} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                                    
                                    </HStack>
                                </Box> */}
                                {/* <Box p={2.5} mt={5} bg='#f2f2f2'>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <DefText text={'배송비'} />
                                        
                                        
                                            <DefText text={numberFormat(3000) + '원'} style={{fontSize:16, fontFamily:Font.RobotoBold}} />
                        
                                    </HStack>
                                </Box> */}

                                <Box p={2.5} mt={5} bg='#f2f2f2'>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <DefText text={'총 결제 금액'} />
                                        
                                        {
                                            cartItemTotalPrice != '' &&
                                            <DefText text={numberFormat(cartItemTotalPrice) + '원'} style={{fontSize:16, fontFamily:Font.RobotoBold,  color:'#CA0D3C'}} />
                                        }
                                           
                        
                                    </HStack>
                                </Box>
                                
                            </VStack>
                            </Box>
                            :
                            <Box justifyContent='center' alignItems='center' height={100}>
                                <DefText text='장바구니가 비었습니다.' />
                            </Box>
                        }
                        {
                            !cartListDelete ? 
                            <Box mt={5}>
                                <HStack justifyContent='space-between'>
                    
                                    <TouchableOpacity onPress={sellButton} style={[styles.sellButton, {borderWidth:0, backgroundColor:'#CA0D3C'}]}>
                                        <DefText text='바로 구매하기' style={{color:'#fff', fontFamily:Font.RobotoMedium}} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            :
                            <Box mt={5}>
                                <HStack justifyContent='space-between'>
                    
                                    <TouchableOpacity 
                                        style={[styles.sellButton, {borderWidth:0, backgroundColor:'#CA0D3C'}]}
                                        onPress={()=>{
                                            navigation.navigate('Shop');
                                        }}
                                    >
                                        <DefText text='바디케어 상품 보러가기' style={{color:'#fff', fontFamily:Font.RobotoMedium}} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        }
                        
                        
                    </VStack>
                </ScrollView>
            </Box>

            <Modal isOpen={cartListModal} onClose={() => setCartListModal(false)}>
                
                <Modal.Content>
                    <Modal.Body>
                        <DefText text='선택된 상품을 삭제하시겠어요?' style={{fontSize:18, fontFamily:Font.RobotoBold}} />
                        <TouchableOpacity
                            style={{
                                height:35,
                                backgroundColor:'#CA0D3C',
                                justifyContent:'center',
                                alignItems:'center',
                                marginTop:20
                            }}
                            onPress={()=>{setCartListDelete(true); setCartListModal(false)}}
                        >
                            <DefText text='삭제하기' style={{color:'#fff'}} />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    countsButton: {
        width:30,
        height:30,
        borderWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center'
    },

    sellButton: {
        width:'100%',
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
)(Cart);