import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import auth from '@react-native-firebase/auth';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RootDrawerAuthParamList } from "@/routes/auth.routes";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { colors } from "@/theme/colors";
import ButtonLink from "@/components/ButtonLink";
import ModalAlert, { hadleMensage } from "@/components/ModalAlert";

type Props = DrawerScreenProps<RootDrawerAuthParamList, "SignUp", "AuthNavigation">;
export default function SignUp({route ,navigation}: Props){
    const [email, setEmail] =  useState('');
    const [password, setPassword] =  useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleSignUp = () => {
        auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Cadastrado com sucesso");
            console.log(userCredential.user.uid);
        })
        .catch((err) => {
            const errString = err.toString();
            let message = '';
            console.log(err)

            if(errString.indexOf('email-already-in-use') !== -1){
                message = 'E-mail já cadastrado'
            } else if(errString.indexOf('email-already-in-use') !== -1){
                message = 'E-mail invalido'
            } else if(errString.indexOf('weak-password') !== -1){
                message = 'A senha precisa ter pelo menos 6 caracteres'
            }
            hadleMensage(message, setErrorMessage, 6000);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerIcon}>
                <Image style={styles.icon} source={require("@/assets/logo.png")}/>
            </View>
            <View style={styles.containerForm}>
                <Text style={styles.headerText}>Crie uma conta:</Text>
                <Input 
                    label="E-mail:" 
                    value={email} 
                    onChangeText={(value) => setEmail(value)}
                />

                <Input 
                    label="Senha:" 
                    value={password} 
                    onChangeText={(value) => setPassword(value)} 
                    secureTextEntry
                />

                <Button style={{marginTop: 30}} description="Criar" onPress={handleSignUp}/>
                <ButtonLink description="Já tenho uma conta" onPress={() => navigation.navigate("SignIn")}/>
            </View>
            <ModalAlert message={errorMessage}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: colors.black[400]
    },
    containerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        height: 150,
        aspectRatio: 1/1
    }, 
    containerForm: {
        flex: 2,
        padding: 5
    },
    headerText: {
        color: colors.white[700],
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});