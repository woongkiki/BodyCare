import React, {useState, useEffect} from 'react';
import { TouchableOpacity, View, Text, ScrollView, Alert } from 'react-native';
import { Box, Input, VStack, HStack, Select, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Font from '../common/Font';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const PartnersReviewUpdate = (props) => {

    const {navigation, userInfo, route} = props;

    const { params } = route;

    //console.log(userInfo);

    const [scoreStar, setScoreStar] = useState('5');

    let scoreImg = '';
    if(scoreStar === '1'){
        scoreImg = <Image source={require("../images/s_star1.png")} width={60}
        height={11} alt='5점' />;
    }else if(scoreStar === '2'){
        scoreImg = <Image source={require("../images/s_star2.png")} width={60}
        height={11} alt='4점' />;
    }else if(scoreStar === '3'){
        scoreImg = <Image source={require("../images/s_star3.png")} width={60}
        height={11} alt='3점' />;
    }else if(scoreStar === '4'){
        scoreImg = <Image source={require("../images/s_star4.png")} width={60}
        height={11} alt='2점' />;
    }else if(scoreStar === '5'){
        scoreImg = <Image source={require("../images/s_star5.png")} width={60}
        height={11} alt='1점' />;
    }else{
        scoreImg = <Image source={require("../images/s_star5.png")} width={60}
        height={11} alt='1점' />;
    }


    const [partnersContent, setPartnersContent] = useState('');
    const partnersFormChange = (text) => {
        setPartnersContent(text);
    }

    //console.log(partnersContent);

    const ReviewUpdate = async () => {

        if(!scoreStar){
            ToastMessage('평점을 선택하세요.');
            return false;
        }

        if(!partnersContent){
            ToastMessage('후기 내용을 입력하세요.');
            return false;
        }


        //console.log('클릭클릭');
        Api.send('contents_partnersReviewUpdate', {'mb_id':userInfo.mb_id, 'wr_id':params.wr_id, 'wr_name':userInfo.mb_name, 'wr_content':partnersContent, 'score':scoreStar}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 출력', resultItem);
                ToastMessage(resultItem.message);
                setPartnersContent('');
                navigation.replace('PartnersReviewUpdate', params);
            }else{
                console.log('결과 출력 실패');
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef navigation={navigation} headertitle='시설후기 작성' />
            <ScrollView>
                <VStack px={5} py={5}>
                     <Box>
                        <HStack alignItems='center' mb={2.5}>
                            <DefText text='시설명' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                            <DefText text={params.wr_subject} />
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <HStack alignItems='center' mb={2.5}>
                            <DefText text='평점' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                            {
                                scoreImg
                            }
                        </HStack>
                        <Box alignItems='flex-end'>
                            <Select
                                selectedValue={scoreStar} 
                                height={46}
                                width='80%'
                                backgroundColor='#fff'
                                placeholder='평점을 선택하세요.'
                                onValueChange={(itemValue) => setScoreStar(itemValue)}
                            >
                                <Select.Item 
                                    label={ 
                                        <>
                                        <HStack alignItems='center'>
                                            <Image source={require("../images/s_star5.png")} style={{width:80, height:15}} alt='평점' />
                                            <DefText text='5점' style={{fontSize:15, marginLeft:10}} />
                                        </HStack>
                                        </>
                                    } 
                                    value='5' 
                                />
                                <Select.Item 
                                    label={ 
                                        <>
                                        <HStack alignItems='center'>
                                            <Image source={require("../images/s_star4.png")} style={{width:80, height:15}} alt='평점' />
                                            <DefText text='4점' style={{fontSize:15, marginLeft:10}} />
                                        </HStack>
                                        </>
                                    } 
                                    value='4' 
                                />
                                <Select.Item 
                                    label={ 
                                        <>
                                        <HStack alignItems='center'>
                                            <Image source={require("../images/s_star3.png")} style={{width:80, height:15}} alt='평점' />
                                            <DefText text='3점' style={{fontSize:15, marginLeft:10}} />
                                        </HStack>
                                        </>
                                    } 
                                    value='3' 
                                />
                                <Select.Item 
                                    label={ 
                                        <>
                                        <HStack alignItems='center'>
                                            <Image source={require("../images/s_star2.png")} style={{width:80, height:15}} alt='평점' />
                                            <DefText text='2점' style={{fontSize:15, marginLeft:10}} />
                                        </HStack>
                                        </>
                                    } 
                                    value='2' 
                                />
                                <Select.Item 
                                    label={ 
                                        <>
                                        <HStack alignItems='center'>
                                            <Image source={require("../images/s_star1.png")} style={{width:80, height:15}} alt='평점' />
                                            <DefText text='1점' style={{fontSize:15, marginLeft:10}} />
                                        </HStack>
                                        </>
                                    } 
                                    value='1' 
                                />
            
                            </Select>
                        </Box>
                        <Box mt={5}>
                            <HStack  mb={2.5}>
                                <DefText text='내용' style={{fontSize:16, color:'#000', fontFamily:Font.RobotoBold, width:'20%'}} />
                                <Input 
                                    _focus='transparent'
                                    value={partnersContent}
                                    height={150}
                                    width='80%'
                                    onChangeText={partnersFormChange}
                                    textAlignVertical='top'
                                    placeholder='후기 내용을 입력하세요.'
                                />
                            </HStack>
                        </Box>
                    </Box>
                </VStack>
            </ScrollView>
            <TouchableOpacity 
                style={{
                    height:46,
                    backgroundColor:'#CA0D3C',
                    justifyContent:'center',
                    alignItems:'center',
                    
                }}
                onPress={()=>{ReviewUpdate()}}
            >
                <DefText text='작성완료' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
            </TouchableOpacity>
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
)(PartnersReviewUpdate);