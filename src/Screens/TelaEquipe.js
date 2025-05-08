import { View, Text, Image, Linking, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';

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
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  if (!fontsLoaded) {
    return null; // Ou um loading indicator
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nossa Equipe</Text>

      {equipe.map((pessoa, index) => (
        <View key={index} style={styles.card}>
          <Image
            source={pessoa.imagem}
            style={[styles.imagem, { marginRight: 15 }]}
          />

          <View style={styles.info}>
            <Text style={styles.nome}>{pessoa.nome}</Text>
            <Text style={styles.rm}>{pessoa.rm}</Text>

            <View style={styles.icones}>
              <TouchableOpacity onPress={() => Linking.openURL(pessoa.github)}>
                <Image
                  source={require('../../assets/githubb.png')}
                  style={styles.icone}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(pessoa.linkedin)}>
                <Image
                  source={require('../../assets/linkedinn.png')}
                  style={styles.icone}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#4C4646',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#11881D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imagem: {
    width: 100,
    height: 160,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#11881D',
  },
  info: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  nome: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    marginBottom: 5,
  },
  rm: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: '#fff',
    marginBottom: 15,
    opacity: 0.9,
  },
  icones: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
  icone: {
    width: 28,
    height: 28,
    tintColor: '#11881D',
  },
});