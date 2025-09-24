import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaFuncionario')}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.titulo}>Cadastro de nova Moto</Text>

        <View style={styles.separador} />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Placa</Text>
          <TextInput style={styles.input} value={placa} onChangeText={setPlaca} placeholder="Placa da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Modelo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={modelo}
              onValueChange={(itemValue) => setModelo(itemValue)}
              style={styles.picker}
              dropdownIconColor='#fff'
            >
              <Picker.Item style={styles.pickerItem} label='Modelo' value='' />
              <Picker.Item style={styles.pickerItem} label='Sport 110i' value='Sport 110i' />
              <Picker.Item style={styles.pickerItem} label='Mottu E' value='Mottu E' />
              <Picker.Item style={styles.pickerItem} label='Mottu Pop 110i' value='Mottu Pop 110i' />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Chassi</Text>
          <TextInput style={styles.input} value={numeroChassi} onChangeText={setNumeroChassi} placeholder="Número de Chassi da Moto" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status da Moto</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor='#fff'
            >
              <Picker.Item style={styles.pickerItem} label='Selecione' value='' />
              <Picker.Item style={styles.pickerItem} label='Sem Placa' value='Moto sem placa' />
              <Picker.Item style={styles.pickerItem} label='Com Placa' value='Moto normal com placa' />
              <Picker.Item style={styles.pickerItem} label='Situação de Furto' value='Moto parada por situação de furto' />
              <Picker.Item style={styles.pickerItem} label='Situação de Acidente' value='Moto parada por situação de acidente' />
            </Picker>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.secaoContainer}>
          <Text style={styles.subtituloSecao}>Condições Físicas</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelPergunta}>Qual é a condição mecânica atual da moto?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={condicaoMecanica}
              onValueChange={(itemValue) => setCondicaoMecanica(itemValue)}
              style={styles.picker}
              dropdownIconColor='#fff'
            >
              <Picker.Item style={styles.pickerItem} label='Selecione' value='' />
              <Picker.Item style={styles.pickerItem} label='Bom Estado Mecânico' value='Moto em bom estado mecânico' />
              <Picker.Item style={styles.pickerItem} label='Gravemente Danificada' value='Moto com graves danificações' />
              <Picker.Item style={styles.pickerItem} label='Inoperante' value='Moto sem utilidade' />
              <Picker.Item style={styles.pickerItem} label='Necessita de Revisão' value='Moto precisa ser diagnosticada' />
              <Picker.Item style={styles.pickerItem} label='Pequenos Reparos' value='Moto com pequenos reparos de funcionamento' />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelPergunta}>Está com falta de algum aparato físico?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={condicaoMecanica}
              onValueChange={(itemValue) => setCondicaoMecanica(itemValue)}
              style={styles.picker}
              dropdownIconColor='#fff'
            >
              <Picker.Item style={styles.pickerItem} label='Selecione' value='' />
              <Picker.Item style={styles.pickerItem} label='Completa' value='Completa' />
              <Picker.Item style={styles.pickerItem} label='Falta retrovisor' value='Falta retrovisor' />
              <Picker.Item style={styles.pickerItem} label='Falta banco' value='Falta banco' />
              <Picker.Item style={styles.pickerItem} label='Falta farol' value='Falta farol' />
            </Picker>
          </View>
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
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  goBack: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#000',
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  separador: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 15,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    color: '#01743A',
    marginBottom: 8,
    textAlign: 'left',
  },
  labelPergunta: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#212121',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    borderWidth: 1,
    borderColor: '#555',
  },
  pickerContainer: {
    backgroundColor: '#212121',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#555',
    height: 50,
  },
  picker: {
    color: '#fff',
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 16,
    height: 50,
  },
  pickerItem: {
    fontSize: 14,
    color: '#000',
  },
  secaoContainer: {
    marginBottom: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  subtituloSecao: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#01743A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
});