import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
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
        Organização que <Text style={{ color: '#11881d' }}>acelera</Text> sua moto
      </Text>

      <View style={styles.image2}>
        <View style={styles.rowImages}>
          <View style={styles.imageTextWrapper}>
            <Image
              source={require('../../assets/tec.png')}
              style={styles.smallImage}
              resizeMode="contain"
            />
            <Text style={styles.imageCaption}>Tecnologia</Text>
          </View>

          <View style={styles.imageTextWrapper}>
            <Image
              source={require('../../assets/ges.png')}
              style={styles.smallImage}
              resizeMode="contain"
            />
            <Text style={styles.imageCaption}>Gestão</Text>
          </View>
        </View>

        <View style={styles.imageTextWrapper}>
          <Image
            source={require('../../assets/com.png')}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>Comunicação</Text>
        </View>
      </View>

      <View style={styles.Patios}>
        <Text style={{ color: '#fff', marginBottom: 20, fontFamily: 'DarkerGrotesque_700Bold', fontSize: 20 }}>Mapeamento e Gestão dos Pátios</Text>
        <Text style={{ color: '#fff', fontFamily: 'DarkerGrotesque_500Medium', fontSize:17}}>Entenda como o Pulse garante um</Text>
        <Text style={{ color: '#fff', fontFamily: 'DarkerGrotesque_500Medium', fontSize:17, marginTop:2}}>gerenciamento preciso</Text>
      </View>
       <View style={styles.listaContainer}>
          <View style={styles.listaItem}>
            <Image
              source={require('../../assets/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.listaTexto}>
              Identificação Inteligente das Motos com Uso de Tecnologias IoT
            </Text>
          </View>

          <View style={styles.listaItem}>
            <Image
              source={require('../../assets/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.listaTexto}>
              Alocação Automatizada das Motos com base em especificações
            </Text>
          </View>

          <View style={styles.listaItem}>
            <Image
              source={require('../../assets/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.listaTexto}>
              Visualização dinâmica em tempo real das divisões do pátio
            </Text>
          </View>

          <View style={styles.listaItem}>
            <Image
              source={require('../../assets/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.listaTexto}>
              Integração com Câmeras de Segurança
            </Text>
          </View>

          <View style={styles.listaItem}>
            <Image
              source={require('../../assets/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.listaTexto}>
              Análise de dados para melhoria contínua
            </Text>
          </View>
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  greenSection: {
    backgroundColor: '#11881D',
    width: '100%',
    height: 350,
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
  image2: {
    alignItems: 'center'
  },
  rowImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  smallImage: {
    width: width * 0.4,
    height: 100,
  },
  fullImage: {
    width: width * 0.85,
    height: 120,
    marginTop: 10,
  },
  imageTextWrapper: {
    alignItems: 'center',
  },
  imageCaption: {
    color: '#fff',
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  outText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 32
  },
  Patios: {
    marginTop: 94,
    marginLeft: 13
  },
  listaContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    marginTop: 2,
  },
  listaTexto: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    flex: 1,
  }


});