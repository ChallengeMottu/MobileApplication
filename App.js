import { DarkerGrotesque_500Medium, DarkerGrotesque_800ExtraBold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert } from 'react-native';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaCadastroF from './src/Screens/TelaCadastroF';
import TelaEntradaMotoPatio from './src/Screens/TelaEntradaMotoPatio';
import TelaEquipe from './src/Screens/TelaEquipe';
import TelaFuncionario from './src/Screens/TelaFuncionario';
import TelaInicial from './src/Screens/TelaInicial';
import TelaLogin from './src/Screens/TelaLogin';
import TelaScanner from './src/Screens/TelaScanner';
import TelaNovaSenha from './src/Screens/TelaNovaSenha';
import TelaInfos from './src/Screens/TelaInfos';
import Tela from './src/Screens/Tela';
import TelaCadastroM from './src/Screens/TelaCadastroM';
import { ThemeProvider, useTheme } from './src/context/ContextTheme';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colors, theme } = useTheme();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };

    checkLoginStatus();
  }, [navigation, props.state]);

  const handleNavigation = (routeName) => {
    if (routeName === 'TelaFuncionarios' && !isLoggedIn) {
      Alert.alert('Acesso negado', 'Você precisa fazer login primeiro');
      return;
    }
    navigation.navigate(routeName);
  };

  // Estilos dinâmicos baseados no tema
  const dynamicStyles = StyleSheet.create({
    drawerContainer: {
      backgroundColor: colors.background,
    },
    drawerHeader: {
      ...styles.drawerHeader,
      borderBottomColor: colors.primary,
    },
    userIconContainer: {
      ...styles.userIconContainer,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    drawerTitle: {
      ...styles.drawerTitle,
      color: colors.text,
    },
    drawerLabel: {
      ...styles.drawerLabel,
      color: colors.text,
    },
  });

  return (
    <DrawerContentScrollView {...props} style={dynamicStyles.drawerContainer}>
      <View style={dynamicStyles.drawerHeader}>
        <View style={dynamicStyles.userIconContainer}>
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text style={dynamicStyles.drawerTitle}>
          {isLoggedIn ? 'Funcionário' : 'Visitante'}
        </Text>
      </View>

      <DrawerItem
        label="Início"
        icon={() => (
          <Ionicons name="home" size={24} color={colors.primary} style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaInicial')}
        labelStyle={dynamicStyles.drawerLabel}
        style={styles.drawerItem}
      />

      <DrawerItem
        label="Nossa Equipe"
        icon={() => (
          <Ionicons name="people" size={24} color={colors.primary} style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaEquipe')}
        labelStyle={dynamicStyles.drawerLabel}
        style={styles.drawerItem}
      />

      {isLoggedIn ? (
        <>
          <DrawerItem
            label="Funcionalidades"
            icon={() => (
              <Ionicons name="apps" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaFuncionario')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Cadastro Moto"
            icon={() => (
              <Ionicons name="add-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaCadastroM')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Rastrear Moto"
            icon={() => (
              <Ionicons name="locate" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('Tela')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Minhas Informações"
            icon={() => (
              <Ionicons name="person-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaInfos')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Entrada Moto Pátio"
            icon={() => (
              <Ionicons name="enter" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaEntradaMotoPatio')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Saída da Moto"
            icon={() => (
              <Ionicons name="exit" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaCadastroM')}
            labelStyle={dynamicStyles.drawerLabel}
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
            labelStyle={[dynamicStyles.drawerLabel, { color: '#ff4444' }]}
            style={styles.drawerItem}
          />
        </>
      ) : (
        <DrawerItem
          label="Login"
          icon={() => (
            <Ionicons name="log-in" size={24} color={colors.primary} style={{ marginRight: 10 }} />
          )}
          onPress={() => navigation.navigate('TelaLogin')}
          labelStyle={dynamicStyles.drawerLabel}
          style={styles.drawerItem}
        />
      )}
    </DrawerContentScrollView>
  );
}

function MainNavigator() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colors } = useTheme();

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
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
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
        name="TelaFuncionario"
        component={TelaFuncionario}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaScanner"
        component={TelaScanner}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaEntradaMotoPatio"
        component={TelaEntradaMotoPatio}
        options={{ title: 'Entrada da Moto' }}
      />
      <Drawer.Screen
        name="TelaNovaSenha"
        component={TelaNovaSenha}
        options={{ title: 'Nova Senha' }}
      />
      <Drawer.Screen
        name="TelaInfos"
        component={TelaInfos}
        options={{ title: 'Minhas Informações' }}
      />
      <Drawer.Screen
        name="Tela"
        component={Tela}
        options={{ title: 'Tela' }}
      />
      <Drawer.Screen
        name="TelaCadastroM"
        component={TelaCadastroM}
        options={{ title: 'Cadastro Moto' }}
      />
    </Drawer.Navigator>
  );
}

function AppContent() {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_500Medium
  });

  const { colors } = useTheme();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  drawerLabel: {
    fontSize: 19,
    fontFamily: 'DarkerGrotesque_500Medium',
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