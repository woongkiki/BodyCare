import React from 'react';
import { Box, VStack, Image } from 'native-base';
import { ActivityIndicator, Dimensions } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const {width, height} = Dimensions.get('window');

const Intro = (props) => {

    const {navigation} = props;

    console.log(navigation);

     setTimeout(() => {

         navigation.replace('Tab_Navigation');
    
     }, 2500);

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent='center' alignItems='center'>
            {/* <VStack  alignItems='center'>
                <Image
                    source={require('../images/introLogoNew12.png')}
                    alt='바디케어'
                    style={{ marginBottom:50}}
                />
                <ActivityIndicator size={'large'} color="#333" />
                <DefText text='회원 정보를 확인 중입니다...' style={{fontSize:15, color:'#111', marginTop:50}} />
            </VStack> */}
            <Image
                source={require('../images/intro_12.png')}
                style={{
                    
                    width: width,
                    height: height,
                    resizeMode: 'cover'
                }}
                alt='스플래시 이미지...'
            />
        </Box>
    );
};

export default Intro;