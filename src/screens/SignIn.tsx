import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { RootDrawerAuthParamList } from "@/routes/auth.routes";
import { DrawerScreenProps } from "@react-navigation/drawer";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { colors } from "@/theme/colors";
import ButtonLink from "@/components/ButtonLink";
import ModalAlert , {hadleMensage} from "@/components/ModalAlert";

type Props = DrawerScreenProps<RootDrawerAuthParamList, "SignIn", "AuthNavigation">;
export default function SignIn({route ,navigation}: Props){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = () => {
        auth().signInWithEmailAndPassword(email, password)
        .then((credentials) => {
            console.log('Autenticado com sucesso');
            console.log(credentials);
        })
        .catch((err) => {
            hadleMensage('E-mail ou senha inválidos', setErrorMessage, 6000);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerIcon}>
                <Image style={styles.icon} source={require("@/assets/logo.png")}/>
            </View>
            <View style={styles.containerForm}>
                <Text style={styles.headerText}>Acesse sua conta:</Text>
                <Input label="E-mail:" value={email} onChangeText={(value) => setEmail(value)}/>
                <Input label="Senha:" value={password} onChangeText={(value) => setPassword(value)} secureTextEntry/>

                <Button style={{marginTop: 30}} description="Acessar" onPress={handleSignIn}/>
                <ButtonLink description="Não tenho uma conta" onPress={() => navigation.navigate("SignUp")}/>
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