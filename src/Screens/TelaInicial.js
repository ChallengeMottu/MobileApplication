import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFonts, DarkerGrotesque_700Bold, DarkerGrotesque_500Medium } from '@expo-google-fonts/darker-grotesque';

const { height } = Dimensions.get('window');

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
      {/* View verde ocupando metade da tela */}
      <View style={styles.greenSection}>
        <Text style={styles.tituloPrincipal}>
          O <Text style={styles.textoBranco}>Gerenciador</Text> da Maior Frota de
        </Text>
        
        <Text style={styles.tituloDestaque}>
          Motos da <Text style={styles.textoBranco}>América Latina</Text>
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com desespero inteligente</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com colocado inteligente</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>+100K</Text>
            <Text style={styles.statText}>motos com desespero inteligente</Text>
          </View>
        </View>
      </View>

      {/* Footer abaixo da seção verde */}
      <Text style={styles.footerText}>
        Organização que acelera sua moto
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  greenSection: {
    backgroundColor: '#11881D',
    height: 400, // Ocupa exatamente metade da tela
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tituloPrincipal: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tituloPrincipal: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 24,
    color: '#11881D', // Verde para o texto geral
    textAlign: 'center',
    marginBottom: 10,
  },
  tituloDestaque: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 28,
    color: '#11881D', // Verde para o texto geral
    textAlign: 'center',
    marginBottom: 30,
  },
  textoBranco: {
    color: '#fff', // Branco para palavras específicas
  },
  tituloDestaque: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    marginTop: 20,
  },
  statItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 36,
    color: '#fff',
    marginBottom: 5,
  },
  statText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});