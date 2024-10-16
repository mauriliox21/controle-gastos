import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { Filter } from '@react-native-firebase/firestore';
import Header from "@/components/Header";
import { colors } from "@/theme/colors";
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerAppParamList } from '@/routes/app.routes';
import InputDate from '@/components/InputDate';
import Select from '@/components/Select';
import { Category, Debt } from '@/@types';
import CardReport from '@/components/CardReport';

type Props = DrawerScreenProps<RootDrawerAppParamList, "Report", "AppNavigation">;
export default function Report({navigation, route}: Props) {

    const [user, setUser] = useState<FirebaseAuthTypes.User|null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelected, setCategorySelected] = useState('');
    const [value, setValue] = useState('');
    const [debts, setDebts] = useState<Debt[]>([]);
    const [totalDebts, setTotalDebts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initDate, setInitDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    const [refreshing, setRefreshing] = useState(false);

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

    const getAuthenticatedUser = () => {
        auth().onAuthStateChanged((user) => {
            setUser(user);
        });
    }

    const getDebits = () => {
        if(categories.length > 0){
            setDebts([]);
            setLoading(true);

            const filters = [firestore.Filter('date', '>=', initDate), firestore.Filter('date', '<=', endDate)];
            if(!!categorySelected)
                filters.push(firestore.Filter('category', '==', categorySelected))

            firestore()
                .collection('userCategory')
                .doc(user?.uid)
                .collection('debts')
                .where(firestore.Filter.and(...filters))
                .orderBy('date', 'desc')
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
                    };

                    if(!!categorySelected){
                        list.push(debt);
                    } else {
                        const findedIndex = list.findIndex(d => d.category === debt.category);
                        if(findedIndex !== -1){
                            list[findedIndex].value += debt.value;
                        }
                        else{
                            list.push(debt);
                        }
                    }
                    total += debt.value;
                });
                setDebts(list);
                setTotalDebts(total);
            }).catch((error) => {
                console.log(error);
            }).finally(() => setLoading(false));
        }
    }

    const openBar = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        getDebits();
    }, [categorySelected, initDate, endDate, categories]);
    
    useEffect(() => {
        getCategories();
    }, [user]);

    navigation.addListener('focus', () => {
        if(user === null)
            getAuthenticatedUser();
        else
            getCategories();
    });

    return (
        <View style={styles.container}>
            <Header firstLetter={user?.email ? user.email[0] : ''} barsFunction={openBar}/>
            <View style={styles.filters}>
                <View style={styles.dateFilters}>
                    <InputDate 
                        value={initDate}
                        onChangeDate={(value) => setInitDate(value)}
                    />
                    <Text style={styles.period}>a</Text>
                    <InputDate
                        value={endDate}
                        onChangeDate={(value) => setEndDate(value)}
                    />
                </View>
                <Select 
                    data={categories} 
                    keyOfName="name" 
                    keyOfValue="id" 
                    value={value}
                    onChange={(value) => setCategorySelected(value)}
                    addEmptyValue
                    labelEmptyValue={'Todas'}
                />
            </View>
            <View style={styles.body}>
                <FlatList 
                    data={debts} 
                    renderItem={({item}) => <CardReport debt={item}/>}
                    contentContainerStyle={{paddingBottom: 10}}
                    keyExtractor={(debt) => debt.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getCategories} />
                    }
                />
                {loading && 
                    (<View style={styles.loadingArea}>
                        <ActivityIndicator size={40} />
                    </View>)
                }
            </View>
            <View>
                <Text style={styles.txtTotal}>Total: {totalDebts.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.black[400],
        padding: 5,
    },
    filters: {
        paddingHorizontal: 10
    },
    dateFilters:{
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    period: {
        fontSize: 26,
        color: colors.white[700],
        alignSelf: 'center'
    },
    body: {
        flex: 1,
        paddingHorizontal: 10
    },
    loadingArea: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%'
    },
    txtTotal: {
        color: colors.white[700],
        fontSize: 20,
        fontWeight: 'bold',
        height: 40,
        backgroundColor: colors.black[400],
        padding: 8,
        margin: 0
    }
});