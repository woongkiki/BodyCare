import React, {useState, useEffect} from 'react';
import { Image, Text, Box, VStack, HStack, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, FlatList, Share, Linking, Alert, ActivityIndicator, Platform } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { TrainerReviewData, ImageBanners } from '../Utils/DummyData';
import Font from '../common/Font';

import TrainerMain from '../components/TrainerMain';
import HeaderView from '../components/HeaderView';
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Swiper from 'react-native-swiper';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const { width } = Dimensions.get('window');

const widtho = (width-40)*0.319;

const widths = (width-40)*0.02;

const TrainersView = (props) => {

    const {navigation, route, userInfo} = props;

    const params = route.params;

    //console.log(params);

    const [loading, setLoading] = useState(true);
    const [trainerDatas, setTrainerDatas] = useState([]);
    const TrainersViewDataReceive = async () => {
        Api.send('contents_trainersView', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                setLoading(false);
                //setPartnersViewData(arrItems);
                setTrainerDatas(arrItems)
                //console.log(resultItem);
            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    const [trainerReviewDatas, setTrainerReviewDatas] = useState([]);
    const TrainersReviewData = async () => {
        Api.send('contents_trainerReview', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               // console.log('트레이너 후기 출력..', arrItems);
                setTrainerReviewDatas(arrItems);
                //setTrainerImageDatas(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
    }

    const [trainerImgsRoading, setTrainerImgsRoading] = useState(false);
    const [trainerImageDatas, setTrainerImageDatas] = useState([]);
    const TrainersImageData = async () => {
        await Api.send('contents_trainerImage', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

                console.log('트레이너 이미지 출력..',arrItems);
                setTrainerImageDatas(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
        await setTrainerImgsRoading(true);
    }

    let partnersAddr = '';

    if(trainerDatas.wr_6){
        partnersAddr = trainerDatas.wr_6.split('|');
    }else{
        partnersAddr = '주소정보없음';
    }


    const [loginStatus, setLoginStatus] = useState('');

    useEffect(()=>{
        if(userInfo){
            setLoginStatus(userInfo.mb_id);
        }else{
            setLoginStatus('');
        }
    },[userInfo]);


    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth() + 1;
    if(date.getMonth()<10){
        dateMonth = '0' + dateMonth;
    }
    let dateDays = date.getDate();
    if(dateDays<10){
        dateDays = '0' + dateDays;
    }

    let fullData = dateYear+'-'+dateMonth+'-'+dateDays;

    //console.log(dateYear+'-'+dateMonth+'-'+dateDays); // 2019 - 연도 반환

    const PartnersMemberLog = async () => {
        Api.send('contents_trainersLog', {'wr_ids':params.wr_id, 'memberId':loginStatus, 'dates':fullData}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               
                console.log('로그 출력', resultItem);
                
                //setPartnersReview(arrItems);
            }else{
                console.log('이미지 결과 출력 실패!', resultItem);
            }
        });
    }

    useEffect(()=>{
        if(loginStatus){
            PartnersMemberLog();
        }
    },[loginStatus])




    useEffect(()=>{
        TrainersViewDataReceive();
        TrainersReviewData();
        TrainersImageData();
    },[])

    //console.log('결과 : ', trainerDatas);
    const trainerBanner = trainerImageDatas.map((item, index)=>{
        return(
            <TouchableOpacity
               key={index}
               onPress={()=>{navigation.navigate('ImageDetails', trainerImageDatas)}}
            >
                <Image
                   source={{uri:item.imageUrl}}
                   width={width}
                   height={300}
                   alt='이미지'
                   resizeMode='stretch'
                />
                <Box 
                    style={
                        {
                            position: 'absolute',
                            top:0,
                            left:0,
                            width:'100%',
                            height:'100%',
                            backgroundColor:'rgba(0,0,0,0.2)'
                        }
                    }
                ></Box>
            </TouchableOpacity>
        )
    });

    const trainerImageCnt = trainerImageDatas.length;

    //console.log('갯수',trainerImageCnt);

    const trainerImages = trainerImageDatas.map((item, index)=>{
        return(
            
            <TouchableOpacity onPress={()=>{navigation.navigate('ImageDetails', trainerImageDatas)}} key={index} style={ index > 2 && {marginTop:10}}>
                <Image 
                    source={{uri:item.imageUrl}}
                    alt={item.bf_source}
                    style={[{width:widtho, height:widtho, marginRight:widths }, (index+1) % 3 == 0 && {marginRight:0}]}
                    resizeMode = 'cover'
                />
                
            </TouchableOpacity>
        )
    })
    
    //console.log('이미지...', );


    const [positionY, setPositionY] = useState(0);
    const handleScroll = (event) => {
 
        setPositionY(event.nativeEvent.contentOffset.y)
    };

    const renderPagination = (index, total, context) => {
        return (
          <Box
            position='absolute'
            bottom='-12px'
            right={5}
            style={{
                width:90,
                height: 24,
                backgroundColor:'#fff',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:24
            }}
            shadow={8}
          >
              <HStack>
                  <DefText text={index + 1} />
                  <DefText text={' / ' + total} />
              </HStack>

          </Box>
        )
    }


    //좋아요
    const [trainersHeart, setTrainersHeart] = useState(false);

    //즉시상담 팝업
    const [callPopVisible, setCallPopVisible] = useState(false);

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
    

    //console.log('종ㅂㅇ험ㄴ암',trainerDatas.score_avg);

    let scoreAvg = Math.round(trainerDatas.score_avg);

    let avgscoreImg;
    if(scoreAvg === 1){
        avgscoreImg = <Image source={require("../images/s_star1.png")} width={60}
        height={11} alt='1점' />;
    }else if(scoreAvg === 2){
        avgscoreImg = <Image source={require("../images/s_star2.png")} width={60}
        height={11} alt='2점' />;
    }else if(scoreAvg === 3){
        avgscoreImg = <Image source={require("../images/s_star3.png")} width={60}
        height={11} alt='3점' />;
    }else if(scoreAvg === 4){
        avgscoreImg = <Image source={require("../images/s_star4.png")} width={60}
        height={11} alt='4점' />;
    }else if(scoreAvg === 5){
        avgscoreImg = <Image source={require("../images/s_star5.png")} width={60}
        height={11} alt='5점' />;
    }else{

        scoreAvg = '후기 없음'
    }
    
    //console.log(trainerDatas.wr_4);
    const partnersKakao = () => {
        if(trainerDatas.wr_4==''){
            ToastMessage('등록된 카카오 채널이 없습니다.');
        }else{
            Linking.openURL(trainerDatas.wr_4);
        }
    }



    const _renderItem = ({item, index}) => {

        let scoreImg;
        if(item.wr_9 == 1){
            scoreImg = <Image source={require("../images/s_star1.png")} width={60} height={11} alt={item.name} mb={2}  />;
        }else if(item.wr_9 == 2){
            scoreImg = <Image source={require("../images/s_star2.png")} width={60} height={11} alt={item.name} mb={2}  />;
        }else if(item.wr_9 == 3){
            scoreImg = <Image source={require("../images/s_star3.png")} width={60} height={11} alt={item.name} mb={2}  />;
        }else if(item.wr_9 == 4){
            scoreImg = <Image source={require("../images/s_star4.png")} width={60} height={11} alt={item.name} mb={2}  />;
        }else if(item.wr_9 == 5){
            scoreImg = <Image source={require("../images/s_star5.png")} width={60} height={11} alt={item.name} mb={2}  />;
        }

        return(
            <Box px={5} style={[item.idx === 1 ? {marginTop:0}:{marginTop:20}]}>
                <HStack>
                    <Image 
                        source={require('../images/reviewThumb.png')} 
                        alt={item.wr_content}
                        borderRadius={40}
                        overflow='hidden'
                        mr={3}
                     />
                     <VStack>
                        {scoreImg}
                         <HStack alignItems='center' mb={2.5}>
                            <Image 
                                source={require('../images/checkedIcons.png')}
                                alt='체크여부'
                                mr={1}
                            />
                            <DefText text={item.wr_name} style={{color:'#666'}} />
                            <Box width='1px' height={15} backgroundColor='#aaa' mx={2}></Box>
                            <DefText text={item.datetime2} style={{color:'#999'}} />
                         </HStack>
                         
                        
                     </VStack>
                </HStack>
            </Box>
        )
    }



    //

    return (
        <>
            {
                loading ? 
                <Box justifyContent='center' alignItems='center' flex={1}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                :
                
                <Box flex={1} backgroundColor='#fff'>
                    <HeaderView navigation={navigation} headPosition={positionY} />
                    <FlatList 
                        onScroll={handleScroll}
                        ListHeaderComponent={
                            <>
                                <VStack>
                                    <Box>
                                        <Swiper 
                                            loop={true} 
                                            height={300}
                                            showsButtons={false}
                                            dot={
                                                <Box
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    width: 5,
                                                    height: 5,
                                                    borderRadius: 5,
                                                    marginLeft: 10,
                                                }}
                                                />
                                            }
                                            activeDot={
                                            <Box
                                                style={{
                                                backgroundColor: 'transparent',
                                                width: 5,
                                                height: 5,
                                                borderRadius: 5,
                                                marginLeft: 10,
                                                }}
                                            />
                                            }
                                            renderPagination={renderPagination}
                                        >
                                            {trainerBanner}
                                        </Swiper>
                                        <Box position='absolute' width='100%' bottom={5} left={0} px={5}>
                                            <DefText text={trainerDatas.wr_subject + ' 트레이너'} style={{color:'#fff', fontSize:16, fontFamily:Font.RobotoBold}} />
                                            <HStack alignItems='center' mt={2}>
                                                {avgscoreImg}
                                                <DefText text={scoreAvg} style={{color:'#fff', marginLeft:10}} />
                                            </HStack>
                                        </Box>
                                    </Box>
                                    <Box px={5}  borderBottomColor='#F2F2F2'>
                                        <Box position='absolute' top={10} right={5} zIndex={100}>
                                            <HStack>
                                                <TouchableOpacity onPress={()=>{setTrainersHeart(!trainersHeart)}}>
                                                    {
                                                        trainersHeart ?
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
                                        </Box>
                                        <Box pb={4} pt={10} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                            <DefText 
                                                text='트레이너 소개' 
                                                style={{
                                                    fontSize:18, 
                                                    color:'#000',
                                                    fontFamily:Font.RobotoBold,
                                                    marginBottom:20
                                                }} 
                                            />
                                            <HStack>
                                                <TouchableOpacity onPress={()=>{navigation.navigate('ImageDetails', trainerImageDatas)}}>
                                                {
                                                    trainerImgsRoading &&
                                                    trainerImageDatas[0]['imageUrl'] != '' ?
                                                    <Image
                                                        source={{uri:trainerImageDatas[0]['imageUrl']}}
                                                        alt={trainerImageDatas[0]['bf_source']}
                                                        width={100}
                                                        height={100}
                                                        mr={3}
                                                        resizeMode='cover'
                                                        style={{borderRadius:100}}
                                                    />
                                                    :
                                                    <Image 
                                                        source={require('../images/trainerSampleT.png')}
                                                        alt='샘플이미지'
                                                        width={100}
                                                        height={100}
                                                        mr={3}
                                                    />
                                                }
                                                </TouchableOpacity>
                                                <VStack justifyContent='space-around' py={2}>
                                                    <DefText 
                                                        text={trainerDatas.wr_subject + ' 선생님'}
                                                        style={{fontSize:16, fontFamily:Font.RobotoBold}}
                                                    />
                                                    <Box>
                                                        <DefText text='전문분야' style={{color:'#666'}} />
                                                        <DefText text={trainerDatas.exer_list} style={{color:'#191919', fontFamily:Font.RobotoMedium, marginTop:7}} />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                            <DefText 
                                                text='경력사항' 
                                                style={{
                                                    fontSize:18, 
                                                    color:'#000',
                                                    fontFamily:Font.RobotoBold,
                                                    marginBottom:15
                                                }} 
                                            />
                                            
                                           <RenderHtml 
                                                
                                                source={{html:trainerDatas.wr_content && trainerDatas.wr_content}} 
                                                tagsStyles={StyleHtml} 
                                                contentWidth={width-40}
                                                ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                                ignoredTags={['head', 'script', 'src', 'label']}
                                            /> 
                                        </Box>
                                        {
                                            trainerDatas.wr_1 ? 
                                            <Box  py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                                <DefText 
                                                    text='자격정보' 
                                                    style={{
                                                        fontSize:18, 
                                                        color:'#000',
                                                        fontFamily:Font.RobotoBold,
                                                        marginBottom:15
                                                    }} 
                                                />
                     
                                                <RenderHtml 
                                                
                                                    source={{html:trainerDatas.wr_1 && trainerDatas.wr_1 }} 
                                                    tagsStyles={StyleHtml} 
                                                    contentWidth={width-40}
                                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                                    ignoredTags={['head', 'script', 'src', 'label']}
                                                /> 
                                            </Box>
                                            :
                                            <></>
                                        }
                                        {
                                            trainerDatas.wr_2 && 
                                            <Box py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                                <DefText 
                                                    text='상담가능시간' 
                                                    style={{
                                                        fontSize:18, 
                                                        color:'#000',
                                                        fontFamily:Font.RobotoBold,
                                                        marginBottom:15
                                                    }} 
                                                />
                                                <DefText text={trainerDatas.wr_2} style={{color:'#666'}} />
                                            </Box>
                                        }
                                       
                                        <Box py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                            <DefText 
                                                text='운동가능장소' 
                                                style={{
                                                    fontSize:18, 
                                                    color:'#000',
                                                    fontFamily:Font.RobotoBold,
                                                    marginBottom:15
                                                }} 
                                            />
                                            {
                                                trainerDatas.partners_name && 
                                                <DefText
                                                    text={trainerDatas.partners_name}
                                                    style={{ fontSize:15, marginBottom:10}}
                                                />
                                            }
                                            
                                            <DefText
                                                text={partnersAddr[1]}
                                                style={{marginBottom:10,color:'#666'}}
                                            />
                                           
                                            
                                        </Box>
                                        <Box py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                            <DefText 
                                                text='가격표' 
                                                style={{
                                                    fontSize:18, 
                                                    color:'#000',
                                                    fontFamily:Font.RobotoBold,
                                                    marginBottom:15
                                                }} 
                                            />
                                    
                                           
                                            <RenderHtml 
                                                
                                                source={{html: trainerDatas && trainerDatas.wr_price}} 
                                                tagsStyles={StyleHtml} 
                                                contentWidth={width-40}
                                                ignoredStyles={[ 'width', 'height','margin', 'padding', 'fontFamily',  'fontSize']}
                                            /> 
                                        </Box>
                                        {
                                            trainerImageDatas.length > 0 &&
                                            <Box  py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                                <DefText
                                                    text='사진' 
                                                    style={{
                                                        fontSize:18, 
                                                        color:'#000',
                                                        fontFamily:Font.RobotoBold,
                                                        marginBottom:15
                                                    }} 
                                                />
                                                <HStack flexWrap='wrap'>
                                                    {trainerImages}
                                                </HStack>
                                                <TouchableOpacity 
                                                    style={{
                                                        height:35,
                                                        backgroundColor:'#CA0D3C',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        borderBottomLeftRadius:10,
                                                        borderBottomRightRadius:10,
                                                        marginTop:10
                                                    }}
                                                    onPress={()=>{navigation.navigate('ImageDetails', trainerImageDatas)}}
                                                >
                                                    <DefText
                                                        text='사진 더보기'
                                                        style={{color:'#fff', fontFamily:Font.RobotoMedium}}
                                                    />
                                                </TouchableOpacity>
                                            </Box>

                                        }
                                        
                                        <Box pt={5}>
                                            <HStack mb={5} alignItems='center' justifyContent='space-between'>
                                                <DefText 
                                                    text='트레이닝 후기' 
                                                    style={{
                                                        fontSize:18, 
                                                        color:'#000',
                                                        fontFamily:Font.RobotoBold,
                                                    
                                                    }} 
                                                />
                                                {
                                                    userInfo &&
                                                    <TouchableOpacity 
                                                        onPress={()=>{navigation.navigate('TrainersReviewUpdate', trainerDatas)}}
                                                    > 
                                                        <DefText
                                                            text='후기작성하기'
                                                            style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}}
                                                        />
                                                    </TouchableOpacity>

                                                }
                                            </HStack>
                                        </Box>
                                    </Box>
                                </VStack>
                            </>
                        }
                        data={trainerReviewDatas}
                        renderItem={_renderItem}
                        keyExtractor={(item, index)=>index.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Box py={10} alignItems='center'>
                                <DefText text='등록된 후기가 없습니다.' style={{color:'#666'}} />
                            </Box>                
                        }
                        ListFooterComponent={
                            <>
                                <Box px={5} pb={5} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                    <TouchableOpacity 
                                        style={{
                                            height:35,
                                            backgroundColor:'#CA0D3C',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            borderBottomLeftRadius:10,
                                            borderBottomRightRadius:10,
                                            marginTop:10
                                        }}
                                    >
                                        <DefText
                                            text='후기 더보기'
                                            style={{color:'#fff', fontFamily:Font.RobotoMedium}}
                                        />
                                    </TouchableOpacity>
                                </Box>
                            </>
                        }
                    />
                    <Box p={5} borderTopWidth={1} borderTopColor='#F2F2F2'>
                        <TouchableOpacity 
                            style={{
                                height:46,
                                backgroundColor:'#CA0D3C',
                                justifyContent:'center',
                                alignItems:'center',
                                borderRadius:5,
                            }}
                            onPress={()=>{setCallPopVisible(true)}}
                        >
                            <DefText text='즉시상담' style={{color:'#fff', fontSize:15, fontFamily:Font.RobotoBold}} />
                        </TouchableOpacity>
                    </Box>
                </Box>
                
            }
            <Modal isOpen={callPopVisible} onClose={() => setCallPopVisible(false)}>
            
                <Modal.Content maxWidth={width-110}>
                
                    <TouchableOpacity
                        style={{
                            position:'absolute',
                            top:-50,
                            right:0,
                            zIndex:100
                        }}
                        onPress={()=>{setCallPopVisible(false)}}
                    >
                        <Image
                            source={require('../images/popCloseBtn.png')} 
                            alt='즉시상담 팝업 닫기'
                        />
                    </TouchableOpacity>
                    <Modal.Body>
                        
                        <HStack justifyContent='center'>
                            <TouchableOpacity style={{alignItems:'center', marginRight:40}} onPress={()=>{Linking.openURL(`tel:` + trainerDatas.wr_3)}}>
                                <Image 
                                    source={require('../images/phoneIcons.png')}
                                    alt='전화걸기'
                                />
                                <DefText text='전화걸기' style={{marginTop:10, color:'#191919', fontFamily:Font.RobotoMedium}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems:'center'}} onPress={partnersKakao}>
                                <Image 
                                    source={require('../images/kakaoIcon.png')}
                                    alt='카카오톡 채널'
                                />
                                <DefText text='카카오톡 채널' style={{marginTop:10, color:'#191919', fontFamily:Font.RobotoMedium}} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
        
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
  )(TrainersView);
