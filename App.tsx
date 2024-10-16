import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import AuthNavigation from '@/routes/auth.routes';
import AppNavigation from '@/routes/app.routes';


export default function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      setUser(user)
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
      <StatusBar barStyle='light-content'/>
      <NavigationContainer>
        {!!user ? 
          <AppNavigation/> 
          :  
          <AuthNavigation/>
        }
      </NavigationContainer>
     
    </SafeAreaView>
  );
}

