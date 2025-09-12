import { DarkerGrotesque_500Medium, DarkerGrotesque_800ExtraBold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaCadastroF from './src/Screens/TelaCadastroF';
import TelaCadastroM from './src/Screens/TelaCadastroM';
import TelaDadosM from './src/Screens/TelaDadosM';
import TelaEquipe from './src/Screens/TelaEquipe';
import TelaInfos from './src/Screens/TelaInfos';
import TelaInicial from './src/Screens/TelaInicial';
import TelaLogin from './src/Screens/TelaLogin';
import TelaScanner from './src/Screens/TelaScanner';
import TelaAssociacao from './src/Screens/TelaAssociacao';
import TelaDesassociacao from './src/Screens/TelaDesassociacao';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };

    checkLoginStatus();
  }, [navigation, props.state]);

  const handleNavigation = (routeName) => {
    if (routeName === 'TelaInfos' && !isLoggedIn) {
      Alert.alert('Acesso negado', 'Você precisa fazer login primeiro');
      return;
    }
    navigation.navigate(routeName);
  };


  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text style={styles.drawerTitle}>
          {isLoggedIn ? 'Funcionário' : 'Visitante'}
        </Text>
      </View>

      <DrawerItem
        label="Início"
        icon={() => (
          <Ionicons name="home" size={24} color="#11881D" style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaInicial')}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />

      <DrawerItem
        label="Nossa Equipe"
        icon={() => (
          <Ionicons name="people" size={24} color="#11881D" style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaEquipe')}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />



      {isLoggedIn ? (
        <>
          <DrawerItem
            label="Minhas Informações"
            icon={() => (
              <Ionicons name="information-circle" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaInfos')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Cadastro Moto"
            icon={() => (
              <Ionicons name="bicycle" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaCadastroM')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Rastrear Moto"
            icon={() => (
              <Ionicons name="bluetooth" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaScanner')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Dados da Moto"
            icon={() => (
              <Ionicons name="information-circle-outline" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaDadosM')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Associar Beacon"
            icon={() => (
              <Ionicons name="information-circle-outline" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaAssociacao')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Desassociar Beacon"
            icon={() => (
              <Ionicons name="information-circle-outline" size={24} color="#11881D" style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaDesassociacao')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />




          <DrawerItem
            label="Sair"
            icon={() => (
              <Ionicons name="log-out" size={24} color="#ff4444" style={{ marginRight: 10 }} />
            )}
            onPress={async () => {
              await AsyncStorage.removeItem('usuarioLogado');
              navigation.navigate('TelaInicial');
            }}
            labelStyle={[styles.drawerLabel, { color: '#ff4444' }]}
            style={styles.drawerItem}
          />
        </>
      ) : (
        <DrawerItem
          label="Login"
          icon={() => (
            <Ionicons name="log-in" size={24} color="#11881D" style={{ marginRight: 10 }} />
          )}
          onPress={() => navigation.navigate('TelaLogin')}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
      )}
    </DrawerContentScrollView>
  );
}

function MainNavigator() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };

    checkLoginStatus();

    const unsubscribe = navigation.addListener('state', checkLoginStatus);

    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#333',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: '#ccc',
        drawerStyle: {
          backgroundColor: '#000',
          width: 280,
        },
        header: (props) => <CabecalhoHeader {...props} />,
      }}
    >
      <Drawer.Screen
        name="TelaInicial"
        component={TelaInicial}
        options={{
          title: 'Início',
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          )
        }}
      />
      <Drawer.Screen
        name="TelaEquipe"
        component={TelaEquipe}
        options={{ title: 'Equipe' }}
      />
      <Drawer.Screen
        name="TelaLogin"
        component={TelaLogin}
        options={{ title: 'Login' }}
      />
      <Drawer.Screen
        name="TelaCadastroF"
        component={TelaCadastroF}
        options={{ title: 'Cadastro' }}
      />
      <Drawer.Screen
        name="TelaInfos"
        component={TelaInfos}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaScanner"
        component={TelaScanner}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaCadastroM"
        component={TelaCadastroM}
        options={{ title: 'CadastroMoto' }}
      />
      <Drawer.Screen
        name="TelaDadosM"
        component={TelaDadosM}
        options={{ title: 'Equipe' }}
      />
      <Drawer.Screen
        name="TelaAssociacao"
        component={TelaAssociacao}
        options={{ title: 'Equipe' }}
      />

      <Drawer.Screen
        name="TelaDesassociacao"
        component={TelaDesassociacao}
        options={{ title: 'Equipe' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_500Medium
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="#11881D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#000',
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#11881D',
  },
  userIconContainer: {
    backgroundColor: '#11881D',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#11881D',
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    color: 'white',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  drawerLabel: {
    fontSize: 19,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: 'white',
    marginLeft: -16,
    letterSpacing: 0.3,
  },
  drawerItem: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
    marginHorizontal: 15,
  },
});