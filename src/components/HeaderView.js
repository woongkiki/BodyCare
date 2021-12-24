import React from 'react';
import { Box, Image, Text, HStack, VStack } from 'native-base';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const HeaderView = (props) => {

    const {navigation, headPosition} = props;

    //console.log(headPosition);

    let headPositionNum = headPosition/100;
    if(headPositionNum>1){
        headPositionNum = 1;
    }

   let headBg = 'rgba(255,255,255,'+headPositionNum+')';
    
    return (
        <Box 
            position='absolute' 
            top={0} 
            left={0} 
            width={width} 
            zIndex={999}
            backgroundColor={headBg}
            p={5}
            shadow={
                headPosition > 50 && 8
            }
        >
            <HStack  justifyContent='space-between'>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    {
                        headPosition > 10 ?
                        <Image
                            source={require('../images/backButtonBlack.png')}
                            alt='뒤로가기'
                        />
                        :
                        <Image
                            source={require('../images/backButtonWhite.png')}
                            alt='뒤로가기'
                        />
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.push('Shop')}}>
                    {
                        headPosition > 10 ?
                        <Image
                            source={require('../images/cartIconBlack.png')}
                            alt='뒤로가기'
                        />
                        :
                        <Image
                            source={require('../images/cartIconWhite.png')}
                            alt='뒤로가기'
                        />
                    }
                    
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default HeaderView;