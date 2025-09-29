import { View, Text, Image, Linking, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ContextTheme';

const equipe = [
  {
    nome: 'Gabriela De Sousa Reis',
    rm: 'RM558830',
    imagem: require('../../assets/gabriela.png'),
    github: 'https://github.com/Gabriela-Reiss',
    linkedin: 'https://www.linkedin.com/in/dev-gabrielareis/',
  },
  {
    nome: 'Laura Amadeu Soares',
    rm: 'RM566690',
    imagem: require('../../assets/laura.png'),
    github: 'https://github.com/lauraamadeu5',
    linkedin: 'https://www.linkedin.com/in/laura-amadeu-0995a22b6/',
  },
  {
    nome: 'Raphael Lamaison Kim',
    rm: 'RM557914',
    imagem: require('../../assets/raphael.png'),
    github: 'https://github.com/RaphaelKim21',
    linkedin: 'https://www.linkedin.com/in/raphael-kim-48b26630b/',
  },
];

export default function TelaEquipe() {
  const { colors } = useTheme();
  
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.titulo, { color: colors.text }]}>Nossa Equipe</Text>
        <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
          Conheça os desenvolvedores por trás do Pulse
        </Text>
      </View>

      {/* Team Cards */}
      <View style={styles.cardsContainer}>
        {equipe.map((pessoa, index) => (
          <View 
            key={index} 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.cardBackground,
                shadowColor: colors.primary
              }
            ]}
          >
            <Image
              source={pessoa.imagem}
              style={styles.imagem}
            />

            <View style={styles.cardInfo}>
              <View style={styles.textContainer}>
                <Text style={[styles.nome, { color: colors.text }]}>
                  {pessoa.nome}
                </Text>
                
                <View style={styles.rmContainer}>
                  <Ionicons name="school-outline" size={14} color={colors.primary} />
                  <Text style={[styles.rm, { color: colors.textSecondary }]}>
                    {pessoa.rm}
                  </Text>
                </View>
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: colors.primary }]}
                  onPress={() => Linking.openURL(pessoa.github)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../assets/githubb.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: colors.primary }]}
                  onPress={() => Linking.openURL(pessoa.linkedin)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../assets/linkedinn.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer Info */}
      <View style={[styles.footer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="people-outline" size={24} color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.text }]}>
          Equipe FIAP - Challenge Sprint 3
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontFamily: 'DarkerGrotesque_700Bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    textAlign: 'center',
    opacity: 0.8,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  imagem: {
    width: 100,
    height: 160,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#01743A',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginBottom: 15,
  },
  nome: {
    fontSize: 20,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginBottom: 6,
    lineHeight: 24,
  },
  rmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rm: {
    fontSize: 15,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
  },
});