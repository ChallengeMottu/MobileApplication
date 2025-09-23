import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View, ImageBackground } from "react-native";

export default function TelaInicial() {
  return (
    <ScrollView style={styles.container}>
      {/* SEÇÃO VERDE - Apresentação */}
      <ImageBackground 
        source={require('../../assets/fundo.png')} 
        style={styles.sectionGreen}
        resizeMode="cover"
      >
        <View style={styles.sectionContent}>
          <View style={styles.textBox}>
            <Text style={styles.title}>
              Gerenciador da Maior Frota de Motos da América Latina
            </Text>
            <Text style={styles.highlight}>+100K</Text>
            <Text style={styles.subtitle}>
              motos com alocação inteligente
            </Text>
          </View>
          <Image
            source={require('../../assets/moto.png')}
            style={styles.imageMoto}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* SEÇÃO BRANCA - Gestão, Tecnologia, Comprometimento */}
      <View style={styles.sectionWhite}>
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Ionicons name="settings" size={40} color="#01743A" />
            <Text style={styles.featureText}>Gestão</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="hardware-chip" size={40} color="#01743A" />
            <Text style={styles.featureText}>Tecnologia</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={40} color="#01743A" />
            <Text style={styles.featureText}>Comprometimento</Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO PRETA - Mapeamento */}
      <View style={styles.sectionBlack}>
        <View style={styles.sectionContentColumn}>
          <Text style={styles.sectionTitle}>
            Mapeamento e Gestão da Frota
          </Text>
          <Text style={styles.listItem}>✅ Localização em tempo real</Text>
          <Text style={styles.listItem}>✅ Otimização de pátio</Text>
          <Text style={styles.listItem}>✅ Redução de custos operacionais</Text>
        </View>
      </View>

      {/* SEÇÃO BRANCA - Tecnologia de Identificação */}
      <View style={styles.sectionWhite}>
        <View style={styles.sectionContent}>
          <Image
            source={require("../../assets/Bluetoo.png")}
            style={styles.imageBeacon}
            resizeMode="contain"
          />
          <View style={styles.textBoxRight}>
            <Text style={styles.sectionTitleDark}>
              Tecnologia de Identificação
            </Text>
            <Text style={styles.paragraph}>
              Uso de beacons para identificar e associar motos em pátios,
              trazendo mais segurança e eficiência no gerenciamento da frota.
            </Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO PRETA - Parceiros */}
      <View style={styles.sectionBlack}>
        <Text style={styles.sectionTitle}>Nossos Parceiros</Text>
        <View style={styles.partnersRow}>
          <Image
            source={require("../../assets/mottu.png")}
            style={styles.partnerLogo}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/fiap.png")}
            style={styles.partnerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* RODAPÉ VERDE */}
      <View style={styles.footer}>
        <Image
          source={require("../../assets/Pulse.png")}
          style={styles.footerLogo}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          Pulse - Tecnologia para gestão inteligente de frotas
        </Text>
        <Text style={styles.footerTextSmall}>Contato: contato@pulse.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // -------- SEÇÃO VERDE --------
  sectionGreen: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    height: 400,
    alignItems: "center",
  },
  sectionContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  highlight: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  imageMoto: {
    width: 220,
    height: 220,
    marginLeft: 10,
  },

  // -------- SEÇÃO BRANCA --------
  sectionWhite: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#01743A",
  },

  // -------- SEÇÃO PRETA --------
  sectionBlack: {
    backgroundColor: "#000",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionContentColumn: {
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#01743A",
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },

  // -------- SEÇÃO BRANCA COM BEACON --------
  textBoxRight: {
    flex: 1,
    marginLeft: 20,
  },
  sectionTitleDark: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#01743A",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  imageBeacon: {
    width: 120,
    height: 120,
  },

  // -------- PARCEIROS --------
  partnersRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  partnerLogo: {
    width: 120,
    height: 80,
  },

  // -------- RODAPÉ --------
  footer: {
    backgroundColor: "#01743A",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  footerTextSmall: {
    fontSize: 14,
    color: "#fff",
  },
});
