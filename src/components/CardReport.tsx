import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Debt } from "@/@types";
import { colors } from "@/theme/colors";

type CardReportProps = {
    debt: Debt
}

export default function CardReport({ debt }: CardReportProps) {
    const dateAsString = (date: Date) :string =>  {
        return date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();
    }

    return (
        <View style={styles.card}>
            {/* <Text style={styles.category}>{debt.category?.name}</Text> */}
            <Text style={styles.description}>{debt.category?.name}</Text>
            <Text style={styles.value}>{debt.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</Text>
            <Text style={styles.date}>{dateAsString(debt.date)}</Text>
        </View>
    );
}

const styles =  StyleSheet.create({
    card: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: colors.gray[500],
        flexDirection: 'row',
        marginTop: 15,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    description: {
        color: colors.white[700],
        fontSize: 18,
        maxWidth: '80%'
    },
    value: {
        textAlign: 'right',
        fontSize: 18,
        color: colors.white[700]
    },
    category: {
        backgroundColor: colors.purple[800],
        position: 'absolute',
        top: -7,
        left: 5,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 5,
        color: colors.white[700]
    },
    date: {
        backgroundColor: colors.white[700],
        position: 'absolute',
        bottom: -10,
        right: 5,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 5,
        color: colors.purple[500]
    }
});