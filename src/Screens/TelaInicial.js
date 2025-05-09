import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useFonts, DarkerGrotesque_700Bold, DarkerGrotesque_500Medium } from '@expo-google-fonts/darker-grotesque';

const { width } = Dimensions.get('window');

export default function TelaInicial() {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_700Bold,
    DarkerGrotesque_500Medium
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* View verde */}
      <View style={styles.greenSection}>
        <Text style={styles.tituloPrincipal}>
          O <Text style={styles.textoBranco}>Gerenciador</Text> da Maior Frota de
        </Text>
        
        <Text style={styles.tituloDestaque}>
          Motos da <Text style={styles.textoBranco}>América Latina</Text> 
        </Text>

        <View style={styles.statsContainer}>
          <View style={{ marginTop: 10, marginBottom: 20, alignItems: 'center' }}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com alocação inteligente</Text>
          </View>

          <View style={{ marginBottom: 3, alignItems: 'center', marginLeft: 'auto' }}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com alocação inteligente</Text>
          </View>

          <View style={{ marginBottom: 30, alignItems: 'center', marginRight: 'auto' }}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com alocação inteligente</Text>
          </View>
        </View>
      </View>

 
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/moto.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>


      <Text style={styles.outText}>
        Organização que <Text style={{color:'#11881d'}}>acelera</Text> sua moto
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  greenSection: {
    backgroundColor: '#11881D',
    width: '100%',
    height:350,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  tituloPrincipal: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  tituloDestaque: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  textoBranco: {
    color: '#fff',
  },
  statsContainer: {
    marginTop: 20,
  },
  statNumber: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 23,
    color: '#fff',
    marginBottom: 5,
  },
  statText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -175, // Sobreposição com a view verde
    marginBottom: 10,
    zIndex: 1, // Faz com que a imagem fiqui em cima da view
  },
  image: {
    width: 400, // Largura fixa
    height: 400,
  },
  outText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});