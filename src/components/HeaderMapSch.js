import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, Image, Input } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';

const HeaderMapSch = (props) => {

    const {navigation, route, inputValue, onChangeMapText, mapOnpree, onSubmitEditing} = props;

    const [mapSchV, setmapSchV] = useState(props.mapSch);

    return (
        <Box backgroundColor='#fff' px={5} height='60px' justifyContent='center' borderBottomWidth={1} borderBottomColor='#F2F2F2' >
            <HStack alignItems='center' justifyContent='space-between'>
                
                <TouchableOpacity onPress={()=>{navigation.goBack()}} >
                    <Image source={require('../images/backButton.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <Box width='90%'>
                    <Input
                        _focus='transparent'
                        
                        height={41}
                        backgroundColor='#F2F2F2'
                        placeholder='지역을 입력하세요'
                        value={inputValue}
                        onChangeText={onChangeMapText}
                        onSubmitEditing={onSubmitEditing}
                    />
                    <TouchableOpacity onPress={mapOnpree} style={styles.schButton}>
                        <Image source={require('../images/searchIconNew12.png')} alt='검색하기'  />
                    </TouchableOpacity>
                </Box>
         
                {/* <TouchableOpacity onPress={()=>{navigation.navigate('Map','경기도 부천시 도당동')}}>
                    <Image source={require('../images/mapChange.png')} alt='지도보기' />
                </TouchableOpacity> */}
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

export default HeaderMapSch;