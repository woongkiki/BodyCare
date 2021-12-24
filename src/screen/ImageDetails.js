import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Modal, Image } from 'native-base';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';

const ImageDetails = (props) => {


    const {navigation, route} = props;

    console.log(route.params);

    const [loading, setLoading] = useState(true);
    const [gallerys, setGallerys] = useState([]);

    useEffect(()=>{
        const _setGalleryList = async () => {
            try {
                let newArray = [];
                let imageData = {};
                route.params.map((a)=>{
                    imageData = { 'url' : a.imageUrl }
                    newArray.push(imageData);
                })
                await setLoading(false)
                await setGallerys(newArray)
                await setLoading(true)
            }catch(e){
                console.log(e);
            }
        }
        _setGalleryList();
    },[])

    const images = [{
        // Simplest usage.
        url: 'https://enbsport.com/images/partnerViewBanner.png',
     
        // width: number
        // height: number
        // Optional, if you know the image size, you can set the optimization performance
     
        // You can pass props to <Image />.
        props: {
            // headers: ...
        }
    }, {
        url: 'https://enbsport.com/images/bannerSample.png',
        

    }]


    return (
        <Box flex={1}>
            <TouchableOpacity onPress={ ()=>{navigation.goBack()} } style={[{position:'absolute', top:35, left:20, zIndex:99}]}>
                <Image source={require('../images/backButtonWhite.png')} alt='뒤로가기' />
            </TouchableOpacity>
           {
               loading ? 
               <ImageViewer 
                    imageUrls={gallerys}
                    loadingRender={()=><ActivityIndicator size={'large'} color="#333" />}
                />
               :
               <ActivityIndicator size={'large'} color="#333" />
           }
        </Box>
    );
};

export default ImageDetails;