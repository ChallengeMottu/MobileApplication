import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { useFonts, DarkerGrotesque_700Bold, DarkerGrotesque_500Medium } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';

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

          <View style={{ marginBottom: 30, alignItems: 'center', marginRight: 'auto', marginTop: -30 }}>
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
            <Text style={styles.imageCaption}>Gestão Eficiente</Text>
          </View>
        </View>

        <View style={styles.imageTextWrapper}>
          <Image
            source={require('../../assets/com.png')}
            style={styles.smallImage2}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>Comunicação</Text>
        </View>
      </View>

      <View style={styles.Patios}>
        <Text style={{ color: '#fff', marginBottom: 20, fontFamily: 'DarkerGrotesque_700Bold', fontSize: 20, marginLeft: 10 }}>Mapeamento e Gestão dos Pátios</Text>
        <Text style={{ color: '#fff', fontFamily: 'DarkerGrotesque_500Medium', fontSize: 18, marginLeft: 10 }}>Entenda como o Pulse garante um</Text>
        <Text style={{ color: '#fff', fontFamily: 'DarkerGrotesque_500Medium', fontSize: 18, marginTop: 2, marginLeft: 10 }}>gerenciamento preciso</Text>
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

      <View style={styles.identificacaoSection}>
        <Text style={styles.identificacaoTitulo}>Tecnologia de identificação</Text>
        <Text style={styles.identificacaoSubtitulo}>
          Conheça a tecnologia usada que permite a{'\n'}identificação das motos
        </Text>

        <View style={styles.identificacaoConteudo}>
          <View style={styles.imageStack}>
            <Image
              source={require('../../assets/Bluetoo.png')}
              style={styles.identificacaoImagem}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/NrF.png')}
              style={styles.identificacaoImagem}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.identificacaoTexto}>
            O Bluetooth Low Energy (BLE), modelo Nrf52810, é uma tecnologia de
            comunicação sem fio de baixo consumo. Com o uso do mesmo, o sistema
            capacita as motos e facilita o processo de identificação de cada moto
            pertencente ao pátio.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 100, marginLeft: 50, marginBottom: 17 }}>
        <Text style={{ fontFamily: 'DarkerGrotesque_700Bold', color: '#fff', fontSize: 20 }}>Parceiros que impulsionam{'\n'} a inovação</Text>
      </View>
      <View style={styles.rowImages2}>
        <View style={styles.imageTextWrapper}>
          <Image
            source={require('../../assets/mottu.png')}
            style={styles.partnershipImage}
            resizeMode="contain"
          />
        </View>

        <View style={{ height: 92, width: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../assets/fiap.png')}
            style={styles.partnershipImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.greenSectionFooter}>
        <View style={styles.footerContent}>
          <View style={{marginBottom:20}}>
            <Image
              source={require('../../assets/Pulse.png')}
              style={styles.footerLogoImage}
              resizeMode="contain"
            />

            <Text style={styles.footerSlogan}>Onde a Eficiência Encontra a Velocidade</Text>
          </View>

          <Text style={styles.footerContactTitle}>Não hesite em nos contactar</Text>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.contactText}>pulsehelp@hotmail.com</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.contactText}>0800-448-222</Text>
          </View>
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
    fontSize: 26,
    color: '#fff',
    marginBottom: 5,
  },
  statText: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -130, // Sobreposição com a view verde
    marginBottom: 10,
    zIndex: 1, // Faz com que a imagem fiqui em cima da view
  },
  image: {
    width: 300, // Largura fixa
    height: 300,
  },
  image2: {
    alignItems: 'center'
  },
  rowImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  rowImages2: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginVertical: 10,
    marginBottom: 40

  },
  smallImage: {
    width: width * 0.4,
    height: 100,
  },
  smallImage2: {
    width: width * 0.4,
    height: 100,
    marginTop: 15,
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
    fontSize: 17,
    fontFamily: 'DarkerGrotesque_500Medium',
    flex: 1,
  },
  identificacaoSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  identificacaoTitulo: {
    color: '#fff',
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'right'
  },
  identificacaoSubtitulo: {
    color: '#fff',
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'right',
  },
  identificacaoConteudo: {
    gap: 16,
    marginLeft: 80
  },
  identificacaoImagem: {
    width: 70,
    height: 70,
  },
  identificacaoTexto: {
    color: '#fff',
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  identificacaoConteudo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },

  imageStack: {
    flexDirection: 'column',
    gap: 10,
    marginTop: -75,
  },
  partnershipImage: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  greenSectionFooter: {
    backgroundColor: '#11881D',
    width: '100%',
    height: 190,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  footerContent: {
    justifyContent: 'center',
    marginBottom:20
  },

  footerLogoImage: {
    width: 80,
    height: 30,
  },

  footerSlogan: {
    fontFamily: 'DarkerGrotesque_500Medium',
    color: '#fff',
    fontSize: 16,
    marginBottom: 14,
  },

  footerContactTitle: {
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 15
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  icon: {
    marginRight: 8,
  },

  contactText: {
    color: '#fff',
    fontSize: 13,

  },
});