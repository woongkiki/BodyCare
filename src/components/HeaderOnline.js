import React, {useState} from 'react';
import { Box, VStack, HStack, Input, Image } from 'native-base';
import { TouchableOpacity, Dimensions } from 'react-native';



const HeaderOnline = ( props ) => {

    const {navigation, inputValue, inputChnage, onPress} = props;
    const { width } = Dimensions.get('window');

    return (
        <Box>
            <HStack py={2.5} px={5} borderBottomWidth={1} borderBottomColor='#f2f2f2' alignItems='center'>
                <TouchableOpacity onPress={ ()=>{navigation.goBack()} } style={[{marginRight:25}]}>
                    <Image source={require('../images/backButton.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <Input 
                    _focus='transparent'
                    height={41}
                    backgroundColor='#fff'
                    value={inputValue}
                    onChangeText={inputChnage}
                    onSubmitEditing={onPress}
                    borderRadius={0}
                    width={width*0.7}
                    placeholder='검색어를 입력하세요.'
                />
                <TouchableOpacity
                    style={{
                        width:41,
                        height:41,
                        justifyContent:'center',
                        alignItems:'center',
                        position: 'absolute',
                        top:10,
                        right:10,

                    }}
                    onPress={onPress}
                >
                    <Image source={require('../images/searchIconNew12.png')} alt='검색' />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default HeaderOnline;