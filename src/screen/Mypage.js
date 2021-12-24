import React, { useEffect, useState } from 'react';
import { Box, Text, Image, VStack, HStack} from 'native-base'
import { TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import { StackActions } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';

const Mypage = (props) => {


    const { navigation, userInfo, member_logout } = props;
    //console.log('로그인정보',userInfo);
    console.log(userInfo);


    const [companyData, setCompanyData] = useState([{'de_admin_company_tel':123}]); //마이페이지 하단 정보 받아서 저장
    const companyInfoData = async () => {
        try{
            Api.send('company_info', {}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
                
                if(resultItem.result === 'Y' && arrItems) {
                    //console.log('결과 출력', arrItems);
                    setCompanyData(arrItems);
                }else{
                    console.log('결과 출력 실패');
                }
                

            })
        }catch(e){
            console.log(e)
        }
    }

    const handleLogOutBtn = async () => {
        try{

            //console.log('호호')

            const formData = new FormData();
            formData.append('method', 'member_logout');

            await member_logout(formData);
            //console.log(formData);
            //console.log(logOut);
            // navigation.dispatch(
            //     StackActions.replace('Home')
            // );
            
             ToastMessage('로그아웃 합니다.');
             navigation.dispatch(
                 StackActions.replace('Tab_Navigation')
             );

            // Alert.alert('tq?')
        }catch(e){
            console.log(e);
        }
        
    }



    useEffect(()=>{
        companyInfoData();
    },[])

    //console.log(companyData[0]['de_admin_company_owner']);
    

    return (
        <Box flex={1} bg='#fff'>
            <HeaderDef navigation={navigation} headertitle='마이 바디케어'  />
            <ScrollView>
                {
                    userInfo ?
                    <VStack py={4} px={4} style={{backgroundColor:'#fff'}}>
                        <HStack>
                            <Box style={{backgroundColor:'#fff', borderRadius:50, overflow:'hidden'}}>
                                {
                                    userInfo.mb_profile_img === '' ?
                                    <Box>
                                    </Box>
                                    :
                                    <Image source={{uri:userInfo.mb_profile_img+"?cache="+Math.random()}}
                                        alt='프로필'
                                        style={{width:100, height:100}}
                                    />
                                }
                                
                                {/* <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        bottom:0,
                                        right: 0
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <Image source={require('../images/cameraOn.png')} alt='사진선택' />
                                </TouchableOpacity> */}
                            </Box>
                            <HStack alignItems='center' justifyContent='space-between' width='70%'>
                                <VStack justifyContent='center' ml={5}>
                                    <Box>
                                        <DefText text={userInfo.mb_nick} style={{fontSize:17, fontFamily:Font.RobotoMedium}} />
                                        <DefText text={userInfo.mb_id} style={{fontSize:15, color:'#666666',marginTop:7}} />
                                    </Box>
                                </VStack>
                                <VStack>
                                    <TouchableOpacity style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:'#f1f1f1', borderRadius:5, marginBottom:10}}
                                        onPress={()=>{navigation.navigate('MypageInfo')}}
                                    >
                                        <DefText text='정보수정' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:'#f1f1f1', borderRadius:5}} onPress={ handleLogOutBtn }>
                                        <DefText text='로그아웃' />
                                    </TouchableOpacity>
                                    
                                </VStack>
                            </HStack>
                        </HStack>
                    </VStack>
                    :
                    <VStack>
                        <TouchableOpacity style={[styles.myPageButton]} onPress={()=>{navigation.navigate('DefaultLogin')}}>
                            <HStack alignItems='center' justifyContent='space-between'>
                                <DefText text='일반회원 가입 및 로그인' style={[styles.loginButtonText]} />
                                <Image
                                    source={require('../images/buttonArrRight.png')}
                                    alt='화살표'
                                />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.myPageButton]}
                            onPress={()=>{navigation.navigate('PartnersLogin')}}
                        >
                            <HStack alignItems='center' justifyContent='space-between'>
                                <DefText text='파트너사 가입 및 로그인' style={[styles.loginButtonText]} />
                                <Image
                                    source={require('../images/buttonArrRight.png')}
                                    alt='화살표'
                                />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.myPageButton]}
                            onPress={()=>{navigation.navigate('TrainersLogin')}}
                        >
                            <HStack alignItems='center' justifyContent='space-between'>
                                <DefText text='트레이너회원 가입 및 로그인' style={[styles.loginButtonText]} />
                                <Image
                                    source={require('../images/buttonArrRight.png')}
                                    alt='화살표'
                                />
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                }
                
                <VStack mt={2}>
                    {/* {
                         userInfo &&
                         userInfo.mb_level > 8 &&
                         <TouchableOpacity 
                            style={[styles.myPageButton, {borderTopWidth:1, borderTopColor:'#F2F2F2'}]}
                            onPress={()=>{navigation.navigate('UserStatus', userInfo)}}
                        >
                            <HStack alignItems='center' justifyContent='space-between'>
                                {
                                    userInfo.mb_level == 8 &&
                                    <DefText text='트레이너 통계' style={[styles.mypageButtonText]} />
                                }
                                {
                                    userInfo.mb_level == 9 &&
                                    <DefText text='내 업체 통계' style={[styles.mypageButtonText]} />
                                }
                               
                                <Image
                                    source={require('../images/buttonArrRightG.png')}
                                    alt='화살표'
                                />
                            </HStack>
                        </TouchableOpacity>
                    } */}
                     


                    <TouchableOpacity 
                        style={[styles.myPageButton, {borderTopWidth:1, borderTopColor:'#F2F2F2'}]}
                        onPress={()=>{navigation.navigate('NoticeEvent')}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='공지사항 &amp; 이벤트' style={[styles.mypageButtonText]} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.myPageButton]}
                        onPress={()=>{navigation.navigate('Menual')}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='바디케어 설명서' style={[styles.mypageButtonText]} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.myPageButton]}
                        onPress={()=>{navigation.navigate('Content')}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='이용약관 및 정책' style={[styles.mypageButtonText]} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.myPageButton]}
                        onPress={()=>{navigation.navigate('Faq')}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='바디케어 FAQ' style={[styles.mypageButtonText]} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.myPageButton]}
                        onPress={()=>{navigation.navigate('Inquiry')}}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='문의하기' style={[styles.mypageButtonText]} />
                            <Image
                                source={require('../images/buttonArrRightG.png')}
                                alt='화살표'
                            />
                        </HStack>
                    </TouchableOpacity>
                </VStack>
                <Box py={6} bg='#fff' alignItems='center'>
                    <VStack alignItems='center'>
                        <DefText text={'고객센터 ' + companyData[0]['de_admin_company_tel']} style={[styles.myPageDefText]} />
                        <DefText text={companyData[0]['de_admin_company_fax']} style={[styles.myPageDefText]} />
                        <DefText text={companyData[0]['de_admin_lunch_time']} style={[styles.myPageDefText]} />
                    </VStack>
                    <VStack alignItems='center' mt={5}>
                        <DefText text={companyData[0]['de_admin_company_name']} style={[styles.myPageDefText]} />
                        <HStack alignItems='center' marginTop='5px'>
                            <DefText text={'사업자 등록번호 ' + companyData[0]['de_admin_company_saupja_no']} style={[styles.myPageDefText, {marginTop:0}]} />
                            <Box width='1px' height={15} backgroundColor='#666' mx={2}></Box>
                            <DefText text={'대표 : ' + companyData[0]['de_admin_company_owner']} style={[styles.myPageDefText, {marginTop:0}]} />
                        </HStack>
                        <DefText text={'통신판매업 신고 : ' + companyData[0]['de_admin_tongsin_no']} style={[styles.myPageDefText]} />
                        <DefText text={'주소 : ' + companyData[0]['de_admin_company_addr']} style={[styles.myPageDefText]} />
                        <DefText text={'이메일 : ' + companyData[0]['de_admin_info_email']} style={[styles.myPageDefText]} />
                        <DefText text='홈페이지 : https://enbsport.com' style={[styles.myPageDefText]}  />
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles= StyleSheet.create({
    myPageButton: {
        padding:20,
        borderBottomWidth:1,
        borderBottomColor:'#F2F2F2',
        backgroundColor:'#fff',
        
    },
    loginButtonText: {
        fontSize:17,
        color:'#111111',
        fontFamily:Font.RobotoBold
    },
    mypageButtonText: {
        fontSize:16,
        color:'#666666',
        fontFamily:Font.RobotoBold
    },
    myPageDefText : {
        fontSize: 15,
        color:'#666666',
        marginTop:5
    }

})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
        
    })
)(Mypage);