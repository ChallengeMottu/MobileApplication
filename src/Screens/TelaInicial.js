import { Image, ScrollView, StyleSheet, Text, View, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function TelaInicial() {
  const { t } = useTranslation();

  // Array dos itens da lista de mapeamento
  const mappingItems = [
    'identificacao_inteligente',
    'alocacao_automatizada', 
    'visualizacao_tempo_real',
    'integracao_camera',
    'analise_dados'
  ];

  return (
    <ScrollView style={styles.container}>
      {/* SEÇÃO 1 - Hero com fundo */}
      <ImageBackground 
        source={require('../../assets/fundo.png')} 
        style={styles.heroSection}
        resizeMode="cover"
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            {t('gerenciador_maior_frota')}
          </Text>
          <Text style={styles.heroNumber}>{t('mais_100k')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('motos_alocacao_inteligente')}
          </Text>
        </View>
        <View style={styles.heroMotoContainer}>
          <Image
            source={require('../../assets/moto.png')}
            style={styles.heroMoto}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* SEÇÃO 2 - Organização que acelera */}
      <View style={styles.sectionWhite}>
        <Text style={styles.sectionTitle}>
          {t('organizacao_acelera')}
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Ionicons 
              name="stats-chart" 
              size={50} 
              color="#01743A" 
            />
            <Text style={styles.featureText}>
              {t('gestao_eficiente')}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons 
              name="settings" 
              size={50} 
              color="#01743A" 
            />
            <Text style={styles.featureText}>
              {t('tecnologia')}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons 
              name="people" 
              size={50} 
              color="#01743A" 
            />
            <Text style={styles.featureText}>
              {t('comprometimento')}
            </Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO 3 - Mapeamento e Gestão */}
      <View style={styles.sectionDark}>
        <Text style={styles.darkSectionTitle}>
          {t('mapeamento_gestao_frota')}
        </Text>
        <Text style={styles.darkSectionSubtitle}>
          {t('entenda_pulse')}
        </Text>

        <View style={styles.checkList}>
          {mappingItems.map((itemKey, index) => (
            <View key={index} style={styles.checkItem}>
              <Image
                source={require('../../assets/check.png')}
                style={styles.checkIcon}
                resizeMode="contain"
              />
              <Text style={styles.checkText}>
                {t(itemKey)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* SEÇÃO 4 - Tecnologia de Identificação */}
      <View style={styles.sectionWhite}>
        <View style={styles.beaconContent}>
          <View style={styles.beaconImages}>
            <Image
              source={require('../../assets/Bluetoo.png')}
              style={styles.beaconMainImage}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/NrF.png')}
              style={styles.beaconSmallImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.beaconTextBox}>
            <Text style={styles.beaconTitle}>
              {t('tecnologia_identificacao')}
            </Text>
            <Text style={styles.beaconDescription}>
              {t('descricao_bluetooth')}
            </Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO 5 - Parceiros */}
      <View style={styles.sectionDark}>
        <Text style={styles.darkSectionTitle}>
          {t('parceiros_impulsionam')}
        </Text>
        <Text style={styles.darkSectionTitle}>
          {t('inovacao')}
        </Text>

        <View style={styles.partnersRow}>
          <Image
            source={require('../../assets/mottu.png')}
            style={styles.partnerLogo}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/fiap.png')}
            style={styles.partnerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* RODAPÉ VERDE */}
      <View style={styles.footer}>
        <Image
          source={require('../../assets/Pulse.png')}
          style={styles.footerLogoImage}
          resizeMode="contain"
        />
        <Text style={styles.footerTagline}>
          {t('eficiencia_velocidade')}
        </Text>

        <View style={styles.footerDivider} />

        <Text style={styles.footerContactTitle}>
          {t('nao_hesite_contactar')}
        </Text>
        <Text style={styles.footerEmail}>
          {t('email_contato')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // SEÇÃO HERO
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    minHeight: 420,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  heroContent: {
    maxWidth: '55%',
    paddingTop: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    lineHeight: 34,
  },
  heroNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.95,
    lineHeight: 20,
  },
  heroMotoContainer: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    width: 240,
    height: 240,
  },
  heroMoto: {
    width: '100%',
    height: '100%',
  },

  // SEÇÃO BRANCA
  sectionWhite: {
    backgroundColor: '#fff',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  greenText: {
    color: '#01743A',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  featureIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginTop: 15,
  },

  // SEÇÃO ESCURA
  sectionDark: {
    backgroundColor: '#000',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  darkSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  darkSectionSubtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: '#ccc',
  },

  // CHECKLIST
  checkList: {
    gap: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#fff',
  },

  // SEÇÃO BEACON
  beaconContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  beaconImages: {
    position: 'relative',
    width: 120,
    height: 150,
  },
  beaconMainImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  beaconSmallImage: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  beaconTextBox: {
    flex: 1,
  },
  beaconTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  beaconDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },

  // PARCEIROS
  partnersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 40,
    gap: 30,
  },
  partnerLogo: {
    width: 140,
    height: 60,
  },

  // RODAPÉ
  footer: {
    backgroundColor: '#01743A',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  footerLogoImage: {
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  footerTagline: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 30,
  },
  footerContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  footerEmail: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
});