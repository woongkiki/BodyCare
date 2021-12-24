import React, {useEffect, useState} from 'react';
import { Image, Text, Box, VStack, HStack, Modal, View } from 'native-base';
import { TouchableOpacity, Dimensions, FlatList, Linking, Alert, Share, StyleSheet, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { PartnerReviewData, ImageBanners } from '../Utils/DummyData';
import Font from '../common/Font';

import TrainerMain from '../components/TrainerMain';
import HeaderView from '../components/HeaderView';
import { WebView } from 'react-native-webview';
import Swiper from 'react-native-swiper';

import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import { textLengthOverCut } from '../common/dataFunction';

const {width, height} = Dimensions.get('window');

const widtho = (width-40)*0.319;

const widths = (width-40)*0.02;
const contImgWidth = (width - 40) * 0.4;
//console.log(width-40, widtho, widths);

const PartnersView = (props) => {

    const {navigation, route, userInfo} = props;

    const params = route.params;
    //console.log('회원정보', userInfo);
    //console.log(props);

    

    const [loading, setLoading] = useState(true);
    const [partnersViewData, setPartnersViewData] = useState([]);


    const [addrs, setAddrs] = useState('');

    //Api 가져오기..
    const PartnersViewDataReceive = async () => {
        Api.send('contents_partnersView', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                setLoading(false);
                setPartnersViewData(arrItems);
                
                let wr_6s = arrItems.wr_6;
                wr_6s = wr_6s.split('|');
                setAddrs(wr_6s);
                //console.log('123',wr_6s);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
    }


    const [partnersReview, setPartnersReview] = useState([]);
    const [reviewpage, setReviewPage] = useState(4)
    const PartnersViewReviewData = async () => {
        Api.send('contents_partnersReview', {'wr_ids':params.wr_id, 'pages':reviewpage}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               
               // console.log('리뷰데이터 출력', resultItem);
                setPartnersReview(arrItems);
                
            }else{
                console.log('리뷰 결과 출력 실패!');
            }
        });
    }

    const _ReviewReloads = async () => {
        await setReviewPage(partnersReview.length);
        await PartnersViewReviewData();
        //console.log('reviewpage:::',reviewpage);
    }

    const [partnersImages, setPartnersImage] = useState([]);
    const PartnersImageData = async () => {
        Api.send('contents_partnersImage', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               
               // console.log('이미지 출력', resultItem);
                setPartnersImage(arrItems)
                //setPartnersReview(arrItems);
            }else{
                console.log('이미지 결과 출력 실패!');
            }
        });
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
    if(dateMonth<10){
        dateMonth = '0' + dateMonth;
    }else{
        dateMonth = dateMonth;
    }
    let dateDays = date.getDate();
    if(dateDays<10){
        dateDays = '0' + dateDays;
    }

    let fullData = dateYear+'-'+dateMonth+'-'+dateDays;

   // console.log(dateYear+'-'+dateMonth+'-'+dateDays); // 2019 - 연도 반환

    const PartnersMemberLog = async () => {
        Api.send('contents_partnersLog', {'wr_ids':params.wr_id, 'memberId':loginStatus, 'dates':fullData}, (args)=>{
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

    const PartnersCallLog = () => {
        Api.send('contents_partnersCallLog', {'wr_ids':params.wr_id, 'memberId':loginStatus, 'dates':fullData}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems){
                console.log('결과 출력', resultItem);

                

            }else{
                console.log('결과 출력 실패', resultItem);
            }

            Linking.openURL(`tel:` + partnersViewData.wr_3);

        })
    }

    const PartnersKakaoLog = () => {

        if(partnersViewData.wr_4==''){
            ToastMessage('등록된 카카오 채널이 없습니다.');
        }else{
            Linking.openURL(partnersViewData.wr_4);
            Api.send('contents_partnersKakaoLog', {'wr_ids':params.wr_id, 'memberId':loginStatus, 'dates':fullData}, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
    
                if(resultItem.result === 'Y' && arrItems){
                    console.log('결과 출력', resultItem);
                   
    
                }else{
                    console.log('결과 출력 실패', resultItem);
                }
    
                
    
            })
        }

        
    }

    const [trainersLoading, setTrainersLoading] = useState(true);
    const [trainerDataMainList, setTrainerDataMainList] = useState([]); 


    useEffect( async ()=>{
        await setTrainersLoading(true)
        if(partnersViewData){
            await setTrainerDataMainList(partnersViewData.trainer_list);
        }
        await setTrainersLoading(false)
    },[partnersViewData])


   //console.log(trainerDataMainList)

    const _renderItemTrainers = ({item, index}) => {

        //console.log('트레이너:::::',item);
  
        const wr_6s = item.wr_6.split('|');
  
        return (
            <TouchableOpacity style={[styles.trainerListBtn, index===0 ? {marginLeft:0} : {marginLeft:15}]} onPress={()=>{navigation.navigate('TrainersView', item)}}>
                <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:contImgWidth, height: 178}}  />
                <View style={[styles.blackBox]}>
                    {
                        item.wr_subject ? 
                        <DefText text={textLengthOverCut(item.wr_subject + ' 선생님', 10)} style={[{color:'#fff',fontSize:16}]} />
                        :
                        <DefText text='' />
                    }
                   
                    {
                        item.wr_6b_r ? 
                        <DefText text={textLengthOverCut(item.wr_6b_r, 10)} style={[styles.blackBoxInnerTextContent, {color:'#CA0D3C'}]} />
                        :
                        <DefText text='' />
                    }
                    
                  
                    <DefText text={textLengthOverCut(partnersViewData.wr_subject, 10)} style={[styles.blackBoxInnerTextContent ]} />
            
                    
                    <DefText text={textLengthOverCut(wr_6s[1], 10)} style={[styles.blackBoxInnerTextContent]} />
                    {
                      item.partners_category ?
                      <DefText text={textLengthOverCut(item.partners_category, 15)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                      :
                      <Text></Text>
                  }
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(()=>{
        if(loginStatus){
            PartnersMemberLog();
        }
    },[loginStatus])

    useEffect(()=>{
        PartnersViewDataReceive();
        PartnersViewReviewData();
        PartnersImageData();
    },[]);

    //console.log(partnersViewData.score_avg);

    const partnersImageList = partnersImages.map((item, index)=>{
        return(
            <TouchableOpacity onPress={()=>{navigation.navigate('ImageDetails', partnersImages)}} key={index} style={ index > 2 && {marginTop:10}}>
                <Image 
                    source={{uri:item.imageUrl}}
                    alt={item.bf_source}
                    style={[{width:widtho, height:widtho, marginRight:widths }, (index+1) % 3 == 0 && {marginRight:0}]}
                    resizeMode = 'cover'
                />
                
            </TouchableOpacity>
        )
    })

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

    const mainBannerSlides = partnersImages.map((item, index)=>{

        return(
      
            <TouchableOpacity
               activeOpacity={0.8}
               key={index}
               onPress={()=>{navigation.navigate('ImageDetails', partnersImages)}}
            >
                
                    <Image
                    source={{uri:item.imageUrl}}
                    width={width}
                    height={300}
                    alt={item.bf_source}
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
                >
                    
                </Box>
            </TouchableOpacity>

        )
    })

    //공유
    const onShare = async () => {
        try{
            const result = await Share.share({
                message:
                Platform.OS==='android' ?
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

    //즉시상담 팝업
    const [callPopVisible, setCallPopVisible] = useState(false);

    const [mapPopVisible, setMapPopVisible] = useState(false);


    let scoreAvg = Math.round(partnersViewData.score_avg);

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
    }

    
    const _renderItem = ({item, index}) => {

        let scoreImg;
        if(item.wr_9 == 1){
            scoreImg = <Image source={require("../images/s_star1.png")} width={60}
            height={11} alt={item.name} mb={2} />;
        }else if(item.wr_9 == 2){
            scoreImg = <Image source={require("../images/s_star2.png")} width={60}
            height={11} alt={item.name} mb={2} />;
        }else if(item.wr_9 == 3){
            scoreImg = <Image source={require("../images/s_star3.png")} width={60}
            height={11} alt={item.name} mb={2} />;
        }else if(item.wr_9 == 4){
            scoreImg = <Image source={require("../images/s_star4.png")} width={60}
            height={11} alt={item.name} mb={2} />;
        }else if(item.wr_9 == 5){
            scoreImg = <Image source={require("../images/s_star5.png")} width={60}
            height={11} alt={item.name} mb={2} />;
        }

        return(
            <Box px={5} style={[index === 0 ? {marginTop:0}:{marginTop:20}]}>
                <HStack>
                    <Image 
                        source={require('../images/reviewThumb.png')} 
                        alt={item.wr_name}
                        borderRadius={40}
                        overflow='hidden'
                        mr={3}
                     />
                     <VStack>
                         {scoreImg}
                        <HStack alignItems='center'>
                            <Image 
                                source={require('../images/checkedIcons.png')}
                                alt='체크여부'
                                mr={1}
                            />
                            <DefText text={item.wr_name} style={{color:'#666'}} />
                            <Box width='1px' height={15} backgroundColor='#aaa' mx={2}></Box>
                            <DefText text={item.datetime2} style={{color:'#999'}} />
                         </HStack>
                         <DefText text={item.wr_content} style={{color:'#666', marginTop:8}}/>

                     </VStack>
                </HStack>
            </Box>
        )
    }

    return (
        <>
        <Box flex={1} backgroundColor='#fff'>
            <HeaderView navigation={navigation} headPosition={positionY} />
            {
                loading ?
                
                <Box justifyContent='center' alignItems='center' flex={1}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                
                :
                <FlatList
                 onScroll={handleScroll}
                 ListHeaderComponent={
                     <>
                         <VStack>
                            <Box>
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
                                        {
                                            partnersImages.length > 0 ?
                                            mainBannerSlides
                                            :
                                            <Box height={300} alignItems='center' justifyContent='center' backgroundColor='rgba(0,0,0,0.4)'>
                                                <DefText text='No Image' style={{fontSize:30}} />
                                            </Box>
                                        }
                                    </Swiper>
                       
                                </Box>
                                <Box position='absolute' width='100%' bottom={5} left={0} px={5} pt={10}>
                                    <DefText text={partnersViewData.wr_subject} style={{color:'#fff', fontSize:16, fontFamily:Font.RobotoBold}} />
                                    {
                                        addrs != '' &&
                                        <HStack flexWrap={'wrap'} mt={2.5}>
                                            <DefText text={ addrs[1]} style={{color:'#fff'}}  />
                                            {/* <DefText text={' ' + addrs[2]} style={{color:'#fff'}}  /> */}
                                        </HStack>
                                    }
                                   
                                    {
                                        scoreAvg ==! 0 &&
                                        <HStack alignItems='center' mt={2}>
                                            {avgscoreImg}
                                            <DefText text={scoreAvg} style={{color:'#fff', marginLeft:10}} />
                                        </HStack>
                                    }
                                </Box>
                            </Box>
                            <Box px={5}>
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
                                <Box pb={5} pt={'50px'} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                    <DefText 
                                        text='업체소개' 
                                        style={{
                                            fontSize:18, 
                                            color:'#000',
                                            fontFamily:Font.RobotoBold,
                                            marginBottom:20
                                        }} 
                                    />
                             
                                    {/* <HTML 
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                        ignoredTags={['head', 'script', 'src']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                        source={{html: partnersViewData && partnersViewData.wr_content}} 
                                        tagsStyles={StyleHtml} 
                                        containerStyle={{ flex: 1, }}
                                        contentWidth={Dimensions.get('window').width}  
                                    /> */}
                                    <RenderHtml 
                                        
                                        source={{html:partnersViewData && partnersViewData.wr_content }} 
                                        tagsStyles={StyleHtml} 
                                        contentWidth={width-40}
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                        ignoredTags={['head', 'script', 'src', 'label']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                    /> 
                                </Box>
                            </Box>
                            {
                                partnersViewData.wr_7 ? 
                                <Box px={5} pt={5} pb={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                    <DefText 
                                        text='운영시간' 
                                        style={{
                                            fontSize:18, 
                                            color:'#000',
                                            fontFamily:Font.RobotoBold,
                                            marginBottom:20
                                        }} 
                                    />
        
                                    {/* <HTML 
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                        ignoredTags={['head', 'script', 'src']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                        source={{html: partnersViewData && partnersViewData.wr_7}} 
                                        tagsStyles={StyleHtml} 
                                        containerStyle={{ flex: 1, }}
                                        contentWidth={Dimensions.get('window').width}  
                                    /> */}
                                    <RenderHtml 
                                        
                                        source={{html:partnersViewData && partnersViewData.wr_7 }} 
                                        tagsStyles={StyleHtml} 
                                        contentWidth={width-40}
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                        ignoredTags={['head', 'script', 'src', 'label', 'ul']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                    /> 
                                </Box>
                                :
                                <Box></Box>
                            }
                            
                            <Box px={5} py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                <DefText 
                                    text='직원 트레이너 소개' 
                                    style={{
                                        fontSize:18, 
                                        color:'#000',
                                        fontFamily:Font.RobotoBold,
                                        marginBottom:20
                                    }} 
                                />
                                {/* <TrainerMain navigation={navigation} /> */}
                                <Box>
                                {
                                    trainersLoading ?
                                    <Box justifyContent='center' alignItems='center' flex={1}>
                                        <ActivityIndicator size={'large'} color="#333" />
                                    </Box>
                                    :
                                    <FlatList
                                        data={trainerDataMainList}
                                        horizontal={true}
                                        renderItem={_renderItemTrainers}
                                        keyExtractor={(item, index)=>index.toString()}
                                        showsHorizontalScrollIndicator={false}
                                        ListEmptyComponent={
                                            <Box py={10} alignItems='center' justifyContent='center' width={width - 40} height={180}>
                                                <DefText text='주변에 등록된 트레이너가 없습니다.' style={{color:'#666'}} />
                                            </Box>                
                                        }
                                    />
                                }
                                </Box>
                            </Box>
                            <Box px={5} pt={5} pb={2.5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                <DefText 
                                    text='가격표' 
                                    style={{
                                        fontSize:18, 
                                        color:'#000',
                                        fontFamily:Font.RobotoBold,
                                        marginBottom:20
                                    }} 
                                />
                                {/* <HTML 
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize']}
                                    ignoredTags={['head', 'script', 'src']}
                                    imagesMaxWidth={Dimensions.get('window').width - 40}
                                    source={{html: partnersViewData && partnersViewData.wr_6a}} 
                                    tagsStyles={StyleHtml} 
                                    containerStyle={{ flex: 1, }}
                                    contentWidth={Dimensions.get('window').width}  
                                /> */}
                                <RenderHtml 
                                        
                                    source={{html:partnersViewData && partnersViewData.wr_6a }} 
                                    tagsStyles={StyleHtml} 
                                    contentWidth={width-40}
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'listStyle']}
                                    ignoredTags={['head', 'script', 'src', 'label', 'ul']}
                                    imagesMaxWidth={Dimensions.get('window').width - 40}
                                /> 
                            </Box>
                            <Box px={5} py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
                                <DefText 
                                    text='운동 프로그램' 
                                    style={{
                                        fontSize:18, 
                                        color:'#000',
                                        fontFamily:Font.RobotoBold,
                                        marginBottom:20
                                    }} 
                                />
                                {/* <HTML 
                                    source={{html: partnersViewData && partnersViewData.wr_1}} 
                                    tagsStyles={StyleHtml} 
                                    contentWidth={Dimensions.get('window').width}  
                                /> */}
                                <DefText text={partnersViewData.exercizeCont} />
                            </Box>
                       
                            <Box px={5} py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                <DefText 
                                    text='편의시설' 
                                    style={{
                                        fontSize:18, 
                                        color:'#000',
                                        fontFamily:Font.RobotoBold,
                                        marginBottom:20
                                    }} 
                                />
                                <HStack>
                                    {
                                        partnersViewData.fac_names0 &&
                                        <Box alignItems='center' mr={3}>
                                            <Image 
                                                source={{uri:partnersViewData.fac_thumb0}} 
                                                alt={partnersViewData.fac_names0}
                                                style={{width:36, height:32}}
                                                resizeMode='contain'
                                            />
                                            <DefText text={partnersViewData.fac_names0}
                                                style={{marginTop:10, fontFamily:Font.RobotoMedium, color:'#666'}} 
                                            />
                                        </Box>
                                    }
                                    {
                                        partnersViewData.fac_names1 &&
                                        <Box alignItems='center' mr={3}>
                                            <Image 
                                                source={{uri:partnersViewData.fac_thumb1}} 
                                                alt={partnersViewData.fac_names1}
                                                style={{width:32, height:32}}
                                                resizeMode='contain'
                                            />
                                            <DefText text={partnersViewData.fac_names1}
                                                style={{marginTop:10, fontFamily:Font.RobotoMedium, color:'#666'}} 
                                            />
                                        </Box>
                                    }
                                    {
                                        partnersViewData.fac_names2 &&
                                        <Box alignItems='center' mr={3}>
                                            <Image 
                                                source={{uri:partnersViewData.fac_thumb2}} 
                                                alt={partnersViewData.fac_names2}
                                                style={{width:35, height:32}}
                                                resizeMode='contain'
                                            />
                                            <DefText text={partnersViewData.fac_names2}
                                                style={{marginTop:10, fontFamily:Font.RobotoMedium, color:'#666'}} 
                                            />
                                        </Box>
                                    }
                                    {
                                        partnersViewData.fac_names3 &&
                                        <Box alignItems='center' mr={3}>
                                            <Image 
                                                source={{uri:partnersViewData.fac_thumb3}} 
                                                alt={partnersViewData.fac_names3}
                                                style={{width:40, height:32}}
                                                resizeMode='contain'
                                            />
                                            <DefText text={partnersViewData.fac_names3}
                                                style={{marginTop:10, fontFamily:Font.RobotoMedium, color:'#666'}} 
                                            />
                                        </Box>
                                    }
                                </HStack>
                            </Box>
                            {
                                partnersImages.length > 0 && 
                                <Box px={5} py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                    <DefText 
                                        text='사진' 
                                        style={{
                                            fontSize:18, 
                                            color:'#000',
                                            fontFamily:Font.RobotoBold,
                                            marginBottom:20
                                        }} 
                                    />
                                    <HStack flexWrap='wrap'>
                                        {partnersImageList}
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
                                        onPress={()=>{navigation.navigate('ImageDetails', partnersImages)}}
                                    >
                                        <DefText
                                            text='사진 더보기'
                                            style={{color:'#fff', fontFamily:Font.RobotoMedium}}
                                        />
                                    </TouchableOpacity>
                                </Box>
                            }
                            
                            {
                                 partnersViewData.wr_link0 == '' && partnersViewData.wr_link1 == '' && partnersViewData.wr_link2 == '' && partnersViewData.wr_link3 == '' ?
                                <></>
                                :
                                <Box px={5} py={5} borderBottomWidth={1} borderBottomColor='#F2F2F2'>
                                    <DefText 
                                        text='홈페이지 바로가기'
                                        style={{
                                            fontSize:18, 
                                            color:'#000',
                                            fontFamily:Font.RobotoBold,
                                            marginBottom:20
                                        }} 
                                    />
                                    <HStack  flexWrap='wrap' flexGrow={1}>
                                        {
                                            partnersViewData.wr_link0 ?
                                            <TouchableOpacity 
                                                style={{width:'16.6%',alignItems:'center'}}
                                                onPress={()=>Linking.openURL(partnersViewData.wr_link0)}
                                            >
                                                <Image 
                                                    source={require('../images/internet.png')}
                                                    alt='블로그 바로가기'
                                                />
                                                <DefText
                                                    text='홈페이지'
                                                    style={{marginTop:10, color:'#666'}}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <></>
                                        }
                                            
                                        
                                        {
                                            partnersViewData.wr_link1 ?
                                            <TouchableOpacity 
                                                style={{width:'16.6%',alignItems:'center'}}
                                                onPress={()=>Linking.openURL(partnersViewData.wr_link1)}
                                            >
                                                <Image 
                                                    source={require('../images/blogIcons.png')}
                                                    alt='블로그 바로가기'
                                                />
                                                <DefText
                                                    text='블로그'
                                                    style={{marginTop:10, color:'#666'}}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <></>
                                        }
                                        {
                                            partnersViewData.wr_link2 ?
                                            <TouchableOpacity 
                                                style={{width:'16.6%',alignItems:'center'}}
                                                onPress={()=>Linking.openURL(partnersViewData.wr_link2)}
                                            >
                                                <Image 
                                                    source={require('../images/instaIcon.png')}
                                                    alt='인스타 바로가기'
                                                />
                                                <DefText
                                                    text='인스타'
                                                    style={{marginTop:10, color:'#666'}}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <></>
                                        }
                                        {
                                            partnersViewData.wr_link3 ?
                                            <TouchableOpacity 
                                                style={{width:'16.6%',alignItems:'center'}}
                                                onPress={()=>Linking.openURL(partnersViewData.wr_link3)}
                                            >
                                                <Image 
                                                    source={require('../images/facebookIcon.png')}
                                                    alt='페이스북 바로가기'
                                                />
                                                <DefText
                                                    text='페이스북'
                                                    style={{marginTop:10, color:'#666'}}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <></>
                                        }
                                        
                        
                                    </HStack>
                                </Box>
                            }
                            
                            <Box px={5} pt={5}>
                                <HStack mb={5} alignItems='center' justifyContent='space-between'>
                                    <DefText 
                                        text='이용후기' 
                                        style={{
                                            fontSize:18, 
                                            color:'#000',
                                            fontFamily:Font.RobotoBold,
                                        
                                        }} 
                                    />
                                    {
                                        userInfo &&
                                        <TouchableOpacity 
                                            onPress={()=>{navigation.navigate('PartnersReviewUpdate', partnersViewData)}}
                                        > 
                                            <DefText
                                                text='후기작성하기'
                                                style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}}
                                            />
                                        </TouchableOpacity>

                                    }
                                    
                                </HStack>
                            </Box>
                        </VStack>
                     </>
                 }
                 data={partnersReview}
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
                                    marginTop:20
                                }}
                                onPress={_ReviewReloads}
                            >
                                <DefText
                                    text='후기 더보기'
                                    style={{color:'#fff', fontFamily:Font.RobotoMedium}}
                                />
                            </TouchableOpacity>
                        </Box>
                        <Box p={5}>
                            <DefText 
                                text='위치' 
                                style={{
                                    fontSize:18, 
                                    color:'#000',
                                    fontFamily:Font.RobotoBold,
                                    marginBottom:20
                                }} 
                            />
                            <Box height={230}>
                                <WebView
                                    source={{
                                        uri:'https://enbsport.com/map.php?addr='+addrs[1]+"&cmpName="+partnersViewData.wr_subject
                                    }}
                                />

                                <TouchableOpacity activeOpacity={1} style={{position:'absolute',width:width-40, height:230, backgroundColor:'transparent'}} onPress={()=>{setMapPopVisible(true)}}>

                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </>
                }

            />
            }
            
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
                            <TouchableOpacity style={{alignItems:'center', marginRight:40}} onPress={ PartnersCallLog }>
                                <Image 
                                    source={require('../images/phoneIcons.png')}
                                    alt='전화걸기'
                                />
                                <DefText text='전화걸기' style={{marginTop:10, color:'#191919', fontFamily:Font.RobotoMedium}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems:'center'}} onPress={PartnersKakaoLog}>
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

            <Modal isOpen={mapPopVisible} style={{flex:1, backgroundColor:'#fff'}} onClose={() => setMapPopVisible(false)}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box >
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setMapPopVisible(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                        <DefText text={partnersViewData.wr_subject} style={{fontSize:15}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>
                    <Box height={height-50}>
                        <WebView
                            source={{
                                uri:'https://enbsport.com/map.php?addr='+addrs[1]+"&cmpName="+partnersViewData.wr_subject
                            }}
                        />
                    </Box>
                </Box>
                </SafeAreaView>
            </Modal>
        </Box>
        </>
    );
};

const styles = StyleSheet.create({
    blackBox: {
        position: 'absolute',
        top:0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'rgba(0,0,0,0.6)',
        paddingLeft:10,
        paddingVertical:20,
        justifyContent:'space-between'
    },
    trainerListBtn : {
        borderRadius:5,
        overflow: 'hidden'
    },
    blackBoxInnerTextContent:{
        fontSize:14,
        color:'#fff',
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
  )(PartnersView);