import React, {useEffect, useState} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { Platform, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text  } from 'react-native';
import HeaderDef from '../components/HeaderDef';
import { onlinePtCategory } from '../Utils/DummyData';
import { DefText } from '../common/BOOTSTRAP';
import Api from '../Api';
const {width} = Dimensions.get('window');

let widthbutton = width*0.48;

const OnlinePtCategory = (props) => {

    const { navigation, route } = props;

    const { params } = route;

    //console.log(params);

    const [onlineCategory, setOnlineCategory] = useState([]);
    const OnlinePtCategoryList = async () => {
        Api.send('contents_onlineCategory', {'wr_ids':params.wr_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                
                setOnlineCategory(arrItems);

            }else{
                console.log('결과 출력 실패!');
            }
        })
    }

    useEffect(()=>{
        OnlinePtCategoryList();
    },[])

    const [selectCategory, setSelectCategory] = useState(params.categoryName);

    const onlinePtCategoryLists = onlineCategory.map((item, index)=>{

        return(
            <Box style={[{width:width*0.5-20, marginBottom:10},index%2==!0 && { alignItems:'flex-end'}]}>
                <TouchableOpacity 
                    key={index}
                    style={[styles.categoryButton, selectCategory == item && {backgroundColor:'#CA0D3C'}]}
                    onPress={()=>{setSelectCategory(item)}}
                >
                    <DefText 
                        text={item}
                        style={[
                            selectCategory == item && {color:'#fff'}
                        ]}
                    />
                </TouchableOpacity>
            </Box>
        )
    })

    return (
        <Box flex={1} bg='#fff' flexWrap='wrap'>
            <HeaderDef navigation={navigation} headertitle='카테고리 선택' onPress={()=>{navigation.navigate('OnlinePt', {selectCategory})}} />
            <ScrollView>
                <Box p={5} >
                    <HStack  width={width-40} flexWrap={'wrap'} justifyContent='space-between'>
                        {onlinePtCategoryLists}
                    </HStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    categoryButton: {
        width:(width-20)*0.45,
        height:46,
        borderRadius:5,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center'
    }
})

export default OnlinePtCategory;