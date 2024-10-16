import React from 'react';
import SignIn from '@/screens/SignIn';
import SignUp from '@/screens/SignUp';
import { createDrawerNavigator } from '@react-navigation/drawer';

export type RootDrawerAuthParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerAuthParamList>();

export default function AuthNavigation() {
  return (
    <Drawer.Navigator initialRouteName="SignIn" id="AuthNavigation" screenOptions={{headerShown: false}}>
      <Drawer.Screen name="SignIn" component={SignIn}/>
      <Drawer.Screen name="SignUp" component={SignUp}/>
    </Drawer.Navigator>
  );
}