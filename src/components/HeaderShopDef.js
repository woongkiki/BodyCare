import React from 'react';
import { Box, HStack, Text, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from './ToastMessage';

const HeaderShopDef = (props) => {

    const {navigation, headertitle, onPress, userInfo} = props;


    const shopHeadLink = (a) => {
        //console.log(a);
        if(a != null){
            navigation.navigate('Cart');
        }else{
            ToastMessage('로그인 후 이용가능합니다.')
        }
    }

    return (
        <Box backgroundColor='#fff' px={5} py={4} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
            <HStack alignItems='center' justifyContent='space-between' >
                <HStack alignItems='center'>
                    {/* <TouchableOpacity onPress={ onPress ? onPress : ()=>{navigation.goBack()} } style={[{marginRight:25}]}>
                        <Image source={require('../images/backButton.png')} alt='뒤로가기' />
                    </TouchableOpacity> */}
                    <DefText text={headertitle} style={{fontSize:18, fontFamily:Font.RobotoBold, color:'#000' }} />
                </HStack>
               <HStack alignItems={'center'}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('ShopSearch')}}>
                        <Image source={require('../images/searchIconNew12.png')} alt='검색' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPress} style={{marginLeft:20}}>
                        <Image source={require('../images/shop_menu_button.png')} alt='메뉴열기' style={{width:19, height:15, resizeMode:'contain'}}/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{marginLeft:20}}  onPress={()=>shopHeadLink(userInfo)}>
                        <Image source={require('../images/cartNewIcons.png')} alt='쇼핑몰' style={{width:19,height:19, resizeMode:'contain'}}  />
                    </TouchableOpacity>
               
                    
                    
               </HStack>
            </HStack>
        </Box>
    );
};



export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(HeaderShopDef);