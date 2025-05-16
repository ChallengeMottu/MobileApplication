import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useFonts, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold } from '@expo-google-fonts/darker-grotesque';

export default function TelaLogin({ navigation }) {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = () => {
    if (!usuario || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o usuário e a senha.');
      return;
    }


    Alert.alert('Login realizado', 'Você entrou no sistema com sucesso!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.contentWrapper}>
          <Text style={styles.subtitulo}>Preencha os dados para entrar no sistema</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="#888"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.textoBotao}>LOGAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('TelaCadastroF')}
          >
            <Text style={styles.linkTexto}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#332f2f',
    width: '85%',
    height: 470,
    padding: 25,
    borderRadius: 12,
    shadowColor: '#11881D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
  contentWrapper: {
    marginTop: 30,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#11881D',
    marginBottom: 11,
  },
  input: {
    backgroundColor: '#433e3e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
  },
  botao: {
    backgroundColor: '#11881D',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkTexto: {
    color: '#11881D',
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_700Bold',
    textDecorationLine: 'underline',
  },
});
