import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, View, ActivityIndicator } from 'react-native';
import { Box, Image, Text } from 'native-base'
import Swiper from 'react-native-swiper';
import Api from '../Api';
import { DefText } from '../common/BOOTSTRAP';

const { width } = Dimensions.get('window');

const MainSlide = (props) => {

    const {navigation} = props;

    const [loading, setLoading] = useState(true);
    const [mainBannerDataList, setMainBannerDataList] = useState([]);
    const MainBannerData = async () => {
        Api.send('contents_mainBanner', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                setLoading(false);
                //console.log('결과 출력 : ', arrItems);
                setMainBannerDataList(arrItems);
                //setTrainerDataMainList(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    useEffect(()=>{
        MainBannerData();
    },[])

    //console.log('메인배너',mainBannerDataList);


    const mainBanners = mainBannerDataList.map((item, index)=>{
        return(
            <TouchableOpacity activeOpacity={1} key={index}>
                <Image source={{uri:item.thumb}} style={{width:width, height:260}} alt={item.wr_subject} />
            </TouchableOpacity>
        )
    })

    return (
        <Box height='260px' paddingY='20px' bg='#fff'>
            {
                loading ? 
                <Box justifyContent='center' alignItems='center' height={240}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                :
                <Swiper loop={true}
                    dot={
                        <View
                        style={{
                            backgroundColor: '#C1C1C1',
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
                        backgroundColor: '#fff',
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        marginLeft: 10,
                        }}
                    />
                    }
                    paginationStyle={{
                        bottom: 15,
                        
                    }}
                >
                    {mainBanners}
                </Swiper>
            }
           
        </Box>
    );
};



export default MainSlide;