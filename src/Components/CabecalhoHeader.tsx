import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CabecalhoHeader({ navigation }) {
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu-outline" style={styles.menuIcon} size={27} />
      </TouchableOpacity>

     
      <View style={styles.logoContainer}>
        <Image 
          style={styles.logo} 
          source={require('../../assets/Pulse.png')} 
          resizeMode="contain"
        />
      </View>

      <View style={styles.menuButton}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 27, 
  },
  menuIcon: {
    color: 'white',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 26, 
    width: 120, 
  },
});