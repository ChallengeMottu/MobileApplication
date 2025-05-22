import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TelaCadastroM() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroChassi, setNumeroChassi] = useState('');
  const [codigoBeacon, setCodigoBeacon] = useState('');
  const [condicaoMecanica, setCondicaoMecanica] = useState('');
  const [status, setStatus] = useState('');
  const [anoFabricacao, setAnoFabricacao] = useState('');


  useEffect(() => {
    carregarDados();
  }, []);

  const salvarDados = async () => {
    try {
      const dados = {
        placa,
        modelo,
        numeroChassi,
        codigoBeacon,
        condicaoMecanica,
        status,
        anoFabricacao,
      };
      await AsyncStorage.setItem('dadosMoto', JSON.stringify(dados));
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  };

  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        setPlaca(dados.placa || '');
        setModelo(dados.modelo || '');
        setNumeroChassi(dados.numeroChassi || '');
        setCodigoBeacon(dados.codigoBeacon || '');
        setCondicaoMecanica(dados.condicaoMecanica || '');
        setStatus(dados.status || '');
        setAnoFabricacao(dados.anoFabricacao || '');
      }
    } catch (error) {
      console.log('Erro ao carregar dados: ', error);
    }
  };



  const handleCadastro = async () => {
    if (!placa || !modelo || !numeroChassi || !condicaoMecanica || !status || !anoFabricacao) {
      Alert.alert('Campos obrigatórios', 'Por favor preencha todos os campos antes de cadastrar.');
      return;
    }

    await salvarDados();


    setPlaca('');
    setModelo('');
    setNumeroChassi('');
    setCodigoBeacon('');
    setCondicaoMecanica('');
    setStatus('');
    setAnoFabricacao('');

    Alert.alert(
      'Cadastro realizado',
      'Moto cadastrada com sucesso!',
      [
        {
          text: 'OK!',
          onPress: () => navigation.navigate('TelaDadosM'),
        },
      ]
    );
  };


  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Cadastro de nova moto</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Placa</Text>
          <TextInput style={styles.input} value={placa} onChangeText={setPlaca} placeholder="Placa da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput style={styles.input} value={modelo} onChangeText={setModelo} placeholder="Modelo da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ano de Fabricação</Text>
          <TextInput style={styles.input} value={anoFabricacao} onChangeText={setAnoFabricacao} placeholder="Ano de Fabriecação da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Chassi</Text>
          <TextInput style={styles.input} value={numeroChassi} onChangeText={setNumeroChassi} placeholder="Número de Chassi da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Código Beacon</Text>
          <TextInput style={styles.input} value={codigoBeacon} onChangeText={setCodigoBeacon} placeholder="Código Beacon da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.secaoContainer}>
          <Text style={styles.subtituloSecao}>Condições Físicas</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelPergunta}>Qual é a condição mecânica atual da moto?</Text>
          <TextInput style={styles.input} value={condicaoMecanica} onChangeText={setCondicaoMecanica} placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelPergunta}>Está com falta de algum aparato físico?</Text>
          <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholderTextColor="#aaa" />
        </View>


        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.textoBotao}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
    marginBottom: 50

  },
  scrollContent: {
    padding: 20,
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#332f2f',
    width: '85%',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#11881D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#11881D',
    marginBottom: 6,
  },
  labelPergunta: {
    fontSize: 12,
    fontFamily: 'DarkerGrotesque_700Medium',
    color: '#ffff',
    marginBottom: 6,
    textAlign: 'center'
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
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
  },
  subtituloSecao: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 20,
    color: '#11881D'
  },
  secaoContainer: {
    marginBottom: 20,
    marginTop: 10,
    flex: 1,
    alignItems: 'center'
  }
})