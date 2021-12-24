import React from 'react';
import { Box, HStack, Text, Image, Input } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';

const HeaderSearch = (props) => {

    const {navigation, inputValue, inputChnage, onPress, onSubmitEditing, latitudeInfo, longitudeInfo} = props;


    //console.log('헤더:::', props);


    return (
        <Box backgroundColor='#fff' px={5} py={4} borderBottomWidth={1} borderBottomColor='#F2F2F2' >
            <HStack alignItems='center' justifyContent='space-between'>
                
                {/* <TouchableOpacity onPress={()=>{navigation.goBack()}} >
                    <Image source={require('../images/backButton.png')} alt='뒤로가기' />
                </TouchableOpacity> */}
                <Box width='90%'>
                    <Input
                        _focus='transparent'
                        value={inputValue}
                        onChangeText={inputChnage}
                        height={41}
                        backgroundColor='#F2F2F2'
                        onSubmitEditing={onPress}
                    />
                    <TouchableOpacity style={styles.schButton} onPress={onPress}>
                        <Image source={require('../images/searchIconNew12.png')} alt='검색하기' />
                    </TouchableOpacity>
                </Box>
         
                <TouchableOpacity onPress={()=>{navigation.navigate('Maps')}}>
                    <Image source={require('../images/mapChange.png')} alt='지도보기' />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

const styles = StyleSheet.create({
    schButton : {
        position: 'absolute',
        right:0,
        height:41,
        width:41,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default HeaderSearch;