import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import auth from '@react-native-firebase/auth';
import { colors } from "@/theme/colors";

type HeaderProps = {
    firstLetter: string
    barsFunction?: () => void
}

export default function Header({firstLetter, barsFunction}: HeaderProps){

    const logout = () => {
        auth().signOut();
    }

    const handleBars = () => {
        if(barsFunction !== undefined)
            barsFunction();
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.avatar} onPress={handleBars}>
                <FontAwesome6 style={styles.avatarText} name="bars" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={logout}>
                <Text style={styles.avatarText}>{firstLetter.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.black[300],
        borderRadius: 5,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatar: {
        width: 50,
        aspectRatio: 1/1,
        borderRadius: 50,
        backgroundColor: colors.purple[500],
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        fontSize: 22,
        color: colors.white[900],
        fontWeight: 'bold'
    }
});