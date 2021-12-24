import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import Api from '../Api';
import Font from '../common/Font';
import { textLengthOverCut } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const {width} = Dimensions.get('window');
const imgSize = width * 0.4;

const datepickerSize = width * 0.42;

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

const UserStatus = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    const [ statusLoading, setStatusLoading ] = useState(true);

    const [ partnersStatus, setPartnersStatus ] = useState([]);

    const partnersStatusRR = async () => {
        
        await Api.send('status_partners', {'mb_id':params.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //console.log('통계 메시지 출력:::::', arrItems);
                
                setPartnersStatus(arrItems);
                //setPartnersRealData(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

    }

    const [ statusArray, setStatusArray ] = useState([]);
    const statusRR = async () => {
        
        await Api.send('status_list', {'startDate':dateTimeText, 'endDate':endDateTimeText, 'wr_id':partnersStatus[0].wr_id, 'visitCate':visitCategory}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('통계 메시지 출력:::::', resultItem);
                setStatusArray(arrItems);
                //setPartnersStatus(arrItems);
                //setPartnersRealData(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

    }
    

    const statusData = statusArray.map((item, index)=>{

  
        return(
            <Box key={index}>
                <HStack borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                    <Box height='35px' justifyContent='center' alignItems='center' width='50%' borderRightWidth={1} borderRightColor='#dfdfdf'>
                        <DefText text={item.mb_id}  />
                    </Box>
                    <Box height='35px' justifyContent='center' alignItems='center' width='50%' borderRightWidth={1} borderRightColor='#dfdfdf'>
                        <DefText text={item.wr_3}  />
                    </Box>
                </HStack>
            </Box>
        )
  
    })


    //연령별 접속자
    const [ageVisitStatus, setAgeVisitStatus] = useState([]);

    const ageStatus = async () => {
        await Api.send('status_age', {'startDate':dateTimeText, 'endDate':endDateTimeText, 'wr_id':partnersStatus[0].wr_id, 'visitCate':visitCategory}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('연령별 메시지 출력:::::', resultItem);
                
                //setPartnersStatus(arrItems);
                //setPartnersRealData(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
    }



    useEffect(()=>{
        partnersStatusRR();
    },[])

    useEffect(async()=>{

        await setStatusLoading(false);
        await statusRR();

        //console.log('파트너::', partnersStatus)
    }, [partnersStatus]);


        
  



    const myPartnersCont = partnersStatus.map((item, index)=> {

        const wr_6s = item.wr_6.split('|');

        return(
            <TouchableOpacity
                key={index}
                style={{ marginBottom:20}}
                onPress={()=>{navigation.navigate('PartnersView', item)}}
            >
                <HStack justifyContent='space-between'>
                {
                        item.thumb ?
                        <Image
                            source={{uri:item.thumb}}
                            alt={item.wr_subject}
                            width={imgSize}
                            height={imgSize}
                            borderRadius={10}
                            overflow='hidden'
                            
                        />
                        :
                        <Image
                            source={require('../images/noImage.png')}
                            alt={item.wr_subject}
                            width={imgSize}
                            height={imgSize}
                            borderRadius={10}
                            overflow='hidden'
                            
                        />
                    }
                    <VStack justifyContent='space-around'  width='52%'>
                        <Box>
                            {
                                item.wr_subject ? 
                                <DefText text={textLengthOverCut(item.wr_subject, 10)} style={{marginBottom:10, fontSize:16, fontFamily:Font.RobotoBold}} />
                                :
                                <DefText text='' />
                            }
                            {
                                wr_6s[1] ? 
                            
                                <DefText text={textLengthOverCut(wr_6s[1], 15)} style={{color:'#666'}} />
                                
                                :
                                <DefText text=''  />
                            }
                        </Box>
                        {
                            item.wr_6b_r ? 
                            <DefText text={textLengthOverCut(item.wr_6b_r,16)} style={{color:'#CA0D3C', fontFamily:Font.RobotoMedium}} />
                            :
                            <DefText text='' />
                        }
                        
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    });


    //console.log('params::::', params);
    const categorys = [
        {
            categoryName: '접속자',
        },
        {
            categoryName: '연령',
        },
        {
            categoryName: '성별',
        },
        {
            categoryName: '관심지역',
        },
        {
            categoryName: '운동목적',
        },
        {
            categoryName: '관심종목',
        },
    ]

    const [visitCategory, setVisitCategory] = useState('접속자');

    const _visitChange = (cate) => {
        setVisitCategory(cate);
    }

    useEffect(()=>{
        if(visitCategory=='접속자'){
            statusRR();
        }
        if(visitCategory=='연령'){
            ageStatus();
        }
    },[visitCategory])

    const categoryList = categorys.map((item, index)=> {
        return(
            <TouchableOpacity key={index} onPress={()=>_visitChange(item.categoryName)}>
                <DefText text={item.categoryName} style={[{fontSize:13}, item.categoryName === visitCategory && {color:'#CA0D3C'}]} />
            </TouchableOpacity>
        )
    })
    

    //날짜 선택..
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
      year: today.getFullYear(),  //현재 년도
      month: today.getMonth() + 1, // 현재 월
      date: today.getDate(), // 현제 날짜
      hours: today.getHours(), //현재 시간
      minutes: today.getMinutes(), //현재 분
    };

    let todayText = time.year + '-' + time.month + '-' + time.date;

    const [dateTimeText, setDateTimeText] = useState(todayText);
    const dateTimeChange = (text) => {
        setDateTimeText(text);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker();
        setDateTimeText(date.format("yyyy-MM-dd"))
    };

    const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [endDateTimeText, setEndDateTimeText] = useState(todayText);

    const showEndDatePicker = () => {
        setEndDatePickerVisible(true);
    }

    const hideEndDatePicker = () => {
        setEndDatePickerVisible(false);
    }

    const handleDatePicker = (dates) => {
        hideEndDatePicker();
        setEndDateTimeText(dates.format("yyyy-MM-dd"));
    }



    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef navigation={navigation} headertitle='내 업체 통계'  />
            {
                partnersStatus.length === 0 ? 
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <DefText text='내 업체로 등록된 파트너사가 없습니다.' />
                </Box>
                :
                <>
                <ScrollView>
                    <Box p={5}>
                        {
                            statusLoading ?
                            <Box justifyContent='center' alignItems='center' flex={1}>
                                <ActivityIndicator size={'large'} color="#333" />
                            </Box>
                            :
                            myPartnersCont
                        }
                       
                        <Box>
                            <HStack justifyContent='space-between' alignItems='center'>
                                <TouchableOpacity onPress={showDatePicker} >
                                    <HStack style={{width:datepickerSize, height:40, borderWidth:1, borderColor:'#dfdfdf', alignItems:'center', justifyContent:'space-between', borderRadius:5, paddingHorizontal:10}}>
                                        <DefText text={dateTimeText} style={{fontSize:13, color:'#333'}} />
                                        <Image source={require('../images/dateIcons.png')} alt='날짜' />
                                    </HStack>
                                </TouchableOpacity>
                                <DefText text="~" />
                                <TouchableOpacity onPress={showEndDatePicker} >
                                    <HStack style={{width:datepickerSize, height:40, borderWidth:1, borderColor:'#dfdfdf', alignItems:'center', justifyContent:'space-between', borderRadius:5, paddingHorizontal:10}}>
                                        <DefText text={endDateTimeText} style={{fontSize:13, color:'#333'}} />
                                        <Image source={require('../images/dateIcons.png')} alt='날짜' />
                                    </HStack>
                                </TouchableOpacity>
                            </HStack>
                            <TouchableOpacity style={styles.timeSelectButton}>
                                <DefText text='검색' style={styles.timeSelectText} />
                            </TouchableOpacity>
                        </Box>
                        <Box mt={5}>
                            <HStack justifyContent='space-between'>
                                {categoryList}
                            </HStack>
                        </Box>
                        <Box mt={5}>
                            {
                                visitCategory === '접속자' &&
                                <Box>
                                    <HStack backgroundColor='#6f809a'>
                                        <Box height='35px' justifyContent='center' alignItems='center' width='50%' borderRightWidth={1} borderRightColor='#dfdfdf'>
                                            <DefText text='접속 아이디' style={{color:'#fff'}} />
                                        </Box>
                                        <Box height='35px' justifyContent='center' alignItems='center' width='50%'>
                                            <DefText text='접속 날짜' style={{color:'#fff'}} />
                                        </Box>
                                    </HStack>
                                    {statusData}
                                </Box>
                            }
                            {
                                visitCategory === '연령' &&
                                <Box>
                                    <HStack backgroundColor='#6f809a'>
                                        <Box height='35px' justifyContent='center' alignItems='center' width='50%' borderRightWidth={1} borderRightColor='#dfdfdf'>
                                            <DefText text='연령대' style={{color:'#fff'}} />
                                        </Box>
                                        <Box height='35px' justifyContent='center' alignItems='center' width='50%'>
                                            <DefText text='그래프(비율 %)' style={{color:'#fff'}} />
                                        </Box>
                                    </HStack>
                                    <Box>
                                        <HStack>
                                            <VStack width='50%'>
                                                <Box height='35px' justifyContent='center' alignItems='center' borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                                    <DefText text='10대' />
                                                </Box>
                                                <Box height='35px' justifyContent='center' alignItems='center' borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                                    <DefText text='20대' />
                                                </Box>
                                                <Box height='35px' justifyContent='center' alignItems='center' borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                                    <DefText text='30대' />
                                                </Box>
                                                <Box height='35px' justifyContent='center' alignItems='center' borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                                    <DefText text='40대' />
                                                </Box>
                                                <Box height='35px' justifyContent='center' alignItems='center' borderLeftWidth={1} borderLeftColor='#dfdfdf' borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                                    <DefText text='50대 이상' />
                                                </Box>
                                            </VStack>
                                            <VStack width='50%'>

                                            </VStack>
                                        </HStack>
                                    </Box>

                                </Box>
                            }
                        </Box>
                        
                    </Box>
                </ScrollView>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <DateTimePickerModal
                    isVisible={endDatePickerVisible}
                    mode="date"
                    onConfirm={handleDatePicker}
                    onCancel={hideEndDatePicker}
                />  
                </>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    timeSelectButton: {
        width:width-40,
        height:30,
        backgroundColor:'#999',
        marginTop:10,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    timeSelectText: {
        fontSize:14,
        color:'#fff'
    }
})

export default UserStatus;