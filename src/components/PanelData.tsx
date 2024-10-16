import React, { useRef, useState } from "react";
import { MotiTransitionProp, MotiView, StyleValueWithReplacedTransforms, useAnimationState } from "moti";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import firestore from '@react-native-firebase/firestore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Category } from "@/@types";
import { colors } from "@/theme/colors";
import Select from "@/components/Select";
import Input from "./Input";
import InputDate from "./InputDate";
import Button from "./Button";

enum DataForm {
    'DEBT',
    'CATEGORY'
}

type IPainelDataProps = {
    onCreate: () => void,
    userUid: string
}

export default function PanelData({onCreate, userUid}: IPainelDataProps){
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelected, setCategorySelected] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [categoryName, setCategoryName] = useState('');
    const [formActive, setFormActive] = useState<DataForm>(DataForm.DEBT)
    const scrollViewtRef = useRef<ScrollView>(null);

    const getCategories = () => {
        setCategories([]);
        firestore()
            .collection('userCategory')
            .doc(userUid)
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

    const animationState = useAnimationState({
        from: {
            height: '0%'
        },
        to: {
            height: '0%'
        },
        expanded:{
            height: '100%'
        }
    })
      
    const toggleAnimationState = () => {
        if (animationState.current === 'expanded') {
            animationState.transitionTo('from');
        }
        else{
            animationState.transitionTo('expanded');
            getCategories();
            
        }
    }

    const handleBtnTab = (newForm: DataForm) => {
        setFormActive(newForm);
        if(newForm === DataForm.CATEGORY){
            scrollViewtRef.current?.scrollToEnd({ animated: true});
        }
        else{
            scrollViewtRef.current?.scrollTo({ animated: true, x: 0});
        }
    }

    const handleSaveDebt = () => {
        const debt = {
            category: categorySelected,
            value: parseFloat(value.replace('.', '').replace(',', '.')),
            description,
            date
        }
        firestore().collection('userCategory').doc(userUid).collection('debts').add(debt);
        onCreate();
        closePainel();
    }

    const handleSaveCategory = () => {
        const newCategory = {
            name: categoryName
        }
        firestore().collection('userCategory').doc(userUid).collection('categories').add(newCategory);
        onCreate();
        closePainel();
    }

    const maskValue = (value: string) => {
        value = value.replace(/\D/g, ""); // Remove todos os não dígitos
        value = value.replace(/(\d+)(\d{2})$/, "$1,$2"); // Adiciona a parte de centavos
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona pontos a cada três dígitos
        return value;
    }

    const closePainel = () => {
        setCategorySelected('');
        setDescription('');
        setValue('');
        setDate(new Date());
        setCategoryName('');
        toggleAnimationState();
    }

    return (
        <>
            <MotiView
                state={animationState}
                style={styles.container}
                transition={{type: 'timing', duration: 500} as MotiTransitionProp<StyleValueWithReplacedTransforms<ViewStyle>>}
            >
                <Pressable style={styles.areaExit} onPress={toggleAnimationState}></Pressable>
                <View style={styles.panel}>
                    <View style={styles.headerPanel}>
                        <TouchableOpacity style={styles.buttonClose} onPress={closePainel}>
                            <FontAwesome6 style={styles.iconClose} name="x" size={22} color={colors.white[700]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyPanel}>
                        <View style={styles.headerTabs}>
                            <TouchableOpacity 
                                style={[styles.btnTab, (formActive === DataForm.DEBT && styles.btnTabActive)]}
                                onPress={() => handleBtnTab(DataForm.DEBT)}
                            >
                                <Text style={[styles.txtBtnTab, (formActive === DataForm.DEBT && styles.txtBtnTabActive)]}>Gasto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.btnTab, (formActive === DataForm.CATEGORY && styles.btnTabActive)]}
                                onPress={() => handleBtnTab(DataForm.CATEGORY)}
                            >
                                <Text style={[styles.txtBtnTab, (formActive === DataForm.CATEGORY && styles.txtBtnTabActive)]}>Categoria de Gasto</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView 
                            style={styles.horizontalScroller} 
                            horizontal
                            ref={scrollViewtRef}
                            scrollEnabled={false}
                        >
                            
                            <ScrollView>
                                <View style={styles.formView}>
                                    <Select 
                                        data={categories} 
                                        keyOfName="name" 
                                        keyOfValue="id" 
                                        value={value}
                                        onChange={(value) => setCategorySelected(value)}
                                    />

                                    <Input 
                                        keyboardType="decimal-pad" 
                                        label="Valor" 
                                        value={value}
                                        onChangeText={(value) => setValue(maskValue(value))}
                                    />

                                    <Input 
                                        label="Descrição" 
                                        value={description}
                                        onChangeText={(value) => setDescription(value)}
                                    />

                                    <InputDate 
                                        label="Data" 
                                        value={date}
                                        onChangeDate={(value) => setDate(value)}
                                    />

                                    <Button 
                                        style={styles.btnSave} 
                                        description="Salvar" 
                                        onPress={() => handleSaveDebt()}
                                    />
                                </View>
                            </ScrollView>
                            
                            <View style={styles.formView}>
                                <Input 
                                    label="Categoria" 
                                    value={categoryName}
                                    onChangeText={(value) => setCategoryName(value)}
                                />

                                <Button 
                                    style={styles.btnSave} 
                                    description="Salvar" 
                                    onPress={() => handleSaveCategory()}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </MotiView>
            <TouchableOpacity style={styles.buttonAdd} onPress={toggleAnimationState}>
                {/* <Text style={styles.textButtonAdd}>+</Text> */}
                <FontAwesome6 style={styles.textButtonAdd} name="add" size={24} color={colors.white[700]} />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 10
    },
    areaExit: {
        flex: 3,
    },
    panel: {
        flex: 7,
        backgroundColor: colors.black[300],
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    headerPanel: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    }, 
    buttonClose: {
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconClose: {
        fontSize: 22,
        color: colors.white[700]
    },
    bodyPanel: {
        flex: 8,
    },
    headerTabs: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10
    },
    btnTab:{
        flex: 1,
        backgroundColor: colors.white[800],
        padding: 5,
        borderRadius: 10,
    }, 
    txtBtnTab: {
        color: colors.black[300],
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btnTabActive:{
        backgroundColor: colors.purple[500]
    }, 
    txtBtnTabActive: {
        color: colors.white[900]
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
    textButtonAdd: {
        color: colors.white[700],
        fontSize: 30
    },
    horizontalScroller: {
        flex: 1
    },
    formView: {
        width: Dimensions.get('window').width,
        flex: 1,
        paddingHorizontal: 10
    },
    headerForm: {
        color: colors.white[700],
        fontSize: 22
    },
    btnSave: {
        marginTop: 25
    }
});