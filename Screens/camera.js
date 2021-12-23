import * as React from 'react';
import {Button, View, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class Pick_Image extends React.Component{
    state = {image: null}
    
    get_permmision = async() =>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry We Need Camera Permission To Proceed Further.")
            }
        }
    }

    _pickimage = async() =>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            });
            if(! result.cancelled){
                this.setState({image: result.data})
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }catch(error){
            console.log(error)
        }
    }

    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const filetoupload = {uri: uri, name: filename, type: type}
        data.append("digit", filetoupload)
        fetch("https://f292a3137990.ngrok.io/Predict-Digit", {method: "POST", body:data, headers: {"content-type": "multipart/form-data",},}).then((
            response
        )=>response.json()).then(
            (result)=>{
                console.log("success", result);
            }).catch((e)=>{
                console.error(e);
            });
        }

    componentDidMount(){
        this.get_permmision()
    }

    render(){
        let {img} = this.state
        return(
            <View style = {{flex: 1, alignItems:"center", justifyContent:'center'}}>
                <Button title='Pick Image From Gallery'  onPress={this._pickimage} />
            </View>
        );
    }
}