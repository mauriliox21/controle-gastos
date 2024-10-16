import React, { useEffect, useState } from "react";
import {FlatList, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import MonthSelect from "@/components/MonthSelect";
import { Category, Debt } from "@/@types";
import CardDebt from "@/components/CardDebt";
import { colors } from "@/theme/colors";
import PanelData from "@/components/PanelData";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import { RootDrawerAppParamList } from "@/routes/app.routes";
import { DrawerScreenProps } from "@react-navigation/drawer";
import Header from "@/components/Header";

type Props = DrawerScreenProps<RootDrawerAppParamList, "Home", "AppNavigation">;
export default function Home({route, navigation}: Props) {
    const [dateSearch, setDateSearch] = useState(new Date().getMonth() + "_" + new Date().getFullYear());
    const [categories, setCategories] = useState<Category[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [idFromDelete, setIdFromDelete] = useState('');
    const [totalDebts, setTotalDebts] = useState(0);
    const [user, setUser] = useState<FirebaseAuthTypes.User|null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getAuthenticatedUser = () => {
        auth().onAuthStateChanged((user) => {
            setUser(user);
        });
    }

    const getDebits = () => {
        const [start, end] = getDates();

        if(categories.length > 0){
            setLoading(true);
            firestore()
                .collection('userCategory')
                .doc(user?.uid)
                .collection('debts')
                .where('date', '>=', start)
                .where('date', '<=', end)
                .get()
            .then((debtSnapshot) => {
                setDebts([]);
                setTotalDebts(0);
                let total = 0;
                const list: Debt[] = []; 
                debtSnapshot.docs.map(doc => {
                    const debt: Debt = {
                        id: doc.id,
                        description: doc.data().description,
                        value: doc.data().value,
                        date: new Date(doc.data().date.seconds * 1000),
                        category: (categories.find(cat => cat.id === doc.data().category) as Category)
                    }
                    list.push(debt);
                    total += debt.value;
                });
                setDebts(list);
                setTotalDebts(total);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const getCategories = () => {
        setCategories([]);
        firestore()
            .collection('userCategory')
            .doc(user?.uid)
            .collection('categories')
            .orderBy('name', 'asc')
            .get()
        .then((categorySnapshot) => {
            const list: Category[] = [];
            categorySnapshot.docs.map(doc => {
                list.push({id: doc.id, name: doc.data().name});
            });
            setCategories(list);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getDates = (): Date[] => {
        const month = parseInt(dateSearch.split('_')[0]);
        const year = parseInt(dateSearch.split('_')[1]);
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month, 1);
        endDate.setMonth(month + 1);
        endDate.setHours(-1);

        return [startDate, endDate];
    }

    const reload = () => {
        getCategories();
    }

    const handleDelete = (id: string) => {
        setIdFromDelete(id);
        setModalVisible(true);
    }

    const handleConfirmDelete = () => {
        firestore()
            .collection('userCategory')
            .doc(user?.uid)
            .collection('debts')
            .doc(idFromDelete)
            .delete()
        .then(() => {
            setIdFromDelete('');
            setModalVisible(false);
            reload();
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleCancelDelete = () => {
        setIdFromDelete('');
        setModalVisible(false);
    }

    useEffect(() => {
        reload();
    }, [user]);

    useEffect(() => {
        getDebits();
    }, [categories, dateSearch]);

    useEffect(() => {
        if(user === null)
            getAuthenticatedUser();
        else
            reload();
    }, [route]);

    return (
        <>
            <View style={styles.container}>
                <Header firstLetter={user?.email ? user.email[0] : ''} barsFunction={() => navigation.openDrawer()}/>
                <View style={styles.containerGrid}>
                    <MonthSelect onChange={(month_year: string) => setDateSearch(month_year)} />
                    <FlatList 
                        data={debts} 
                        renderItem={({item}) => <CardDebt onLongPress={() => handleDelete(item.id)} debt={item}/>}
                        contentContainerStyle={{paddingBottom: 10}}
                        keyExtractor={(debt) => debt.id}
                        removeClippedSubviews
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={reload} />
                        }
                    />
                    {loading && 
                        (<View style={styles.loadingArea}>
                            <ActivityIndicator size={40} />
                        </View>)
                    }
                </View>
            </View>
            <Text style={styles.txtTotal}>Total: {totalDebts.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</Text>
            
            <PanelData  userUid={user?.uid??''} onCreate={reload}/>
            <ModalConfirmDelete 
                visible={modalVisible} 
                onClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.black[400],
        padding: 5,
    },
    welcomeText: {
        fontSize: 20,
        color: colors.white[700]
    },
    containerGrid: {
        //flex: 1
    },
    buttonAdd: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: colors.purple[500],
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtButtonAdd: {
        color: colors.white[700],
        fontSize: 35
    },
    txtTotal: {
        color: colors.white[700],
        fontSize: 20,
        fontWeight: 'bold',
        height: 40,
        backgroundColor: colors.black[400],
        padding: 8,
        margin: 0
    },
    loadingArea: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%'
    }
});