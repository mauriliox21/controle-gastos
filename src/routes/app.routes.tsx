import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AntDesign from '@expo/vector-icons/AntDesign';
import Home from '@/screens/Home';
import Report from '@/screens/Report';
import { colors } from '@/theme/colors';

export type RootDrawerAppParamList = {
  Home: undefined;
  Report: undefined;
};
const Drawer = createDrawerNavigator<RootDrawerAppParamList>();

export default function AppNavigation() {
  return (
    <Drawer.Navigator 
      initialRouteName='Report' 
      id='AppNavigation' 
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.purple[500],
        drawerActiveTintColor: colors.white[700],
        drawerInactiveBackgroundColor: colors.white[900],
        drawerInactiveTintColor: colors.purple[500],
      }}
    >
      <Drawer.Screen 
        options={{
          title: 'Início',
          drawerIcon: ({focused}) => (<AntDesign name="home" size={24} color={focused ? colors.white[700] : colors.purple[500]} />),
        }} 
        name="Home" 
        component={Home} 
      />
      <Drawer.Screen
        options={{
          title: 'Relatório',
          drawerIcon: ({focused}) => (<AntDesign name="barschart" size={24} color={focused ? colors.white[700] : colors.purple[500]} />),
        }} 
        name="Report" component={Report} />
    </Drawer.Navigator>
  );
}