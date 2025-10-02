import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ContextTheme";

export default function TelaCadastroM() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold
  });

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroChassi, setNumeroChassi] = useState('');
  const [codigoBeacon, setCodigoBeacon] = useState('');
  const [condicaoMecanica, setCondicaoMecanica] = useState('');
  const [aparatoFisico, setAparatoFisico] = useState(''); // Novo estado adicionado
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
        aparatoFisico, // Adicionado
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
        setAparatoFisico(dados.aparatoFisico || ''); // Adicionado
        setStatus(dados.status || '');
        setAnoFabricacao(dados.anoFabricacao || '');
      }
    } catch (error) {
      console.log('Erro ao carregar dados: ', error);
    }
  };

  const handleCadastro = async () => {
    if (!placa || !modelo || !numeroChassi || !condicaoMecanica || !aparatoFisico || !status || !anoFabricacao) {
      Alert.alert('Campos obrigatórios', 'Por favor preencha todos os campos antes de cadastrar.');
      return;
    }

    await salvarDados();

    setPlaca('');
    setModelo('');
    setNumeroChassi('');
    setCodigoBeacon('');
    setCondicaoMecanica('');
    setAparatoFisico(''); // Adicionado
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
    <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('TelaFuncionario')}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.titulo, { color: colors.text }]}>Cadastro de nova Moto</Text>

        <View style={[styles.separador, { backgroundColor: colors.border }]} />

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Placa</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={placa}
            onChangeText={setPlaca}
            placeholder="Placa da Moto"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Modelo</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={modelo}
              onValueChange={(itemValue) => setModelo(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label='Modelo' value='' />
              <Picker.Item label='Sport 110i' value='Sport 110i' />
              <Picker.Item label='Mottu E' value='Mottu E' />
              <Picker.Item label='Mottu Pop 110i' value='Mottu Pop 110i' />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Número de Chassi</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={numeroChassi}
            onChangeText={setNumeroChassi}
            placeholder="Número de Chassi da Moto"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Ano de Fabricação</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            value={anoFabricacao}
            onChangeText={setAnoFabricacao}
            placeholder="Ano de Fabricação"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Status da Moto</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label='Selecione' value='' />
              <Picker.Item label='Sem Placa' value='Moto sem placa' />
              <Picker.Item label='Com Placa' value='Moto normal com placa' />
              <Picker.Item label='Situação de Furto' value='Moto parada por situação de furto' />
              <Picker.Item label='Situação de Acidente' value='Moto parada por situação de acidente' />
            </Picker>
          </View>
        </View>

        <View style={[styles.separador, { backgroundColor: colors.border }]} />

        <View style={styles.secaoContainer}>
          <Text style={[styles.subtituloSecao, { color: colors.text }]}>Condições Físicas</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.labelPergunta, { color: colors.textSecondary }]}>Qual é a condição mecânica atual da moto?</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={condicaoMecanica}
              onValueChange={(itemValue) => setCondicaoMecanica(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label='Selecione' value='' />
              <Picker.Item label='Bom Estado Mecânico' value='Moto em bom estado mecânico' />
              <Picker.Item label='Gravemente Danificada' value='Moto com graves danificações' />
              <Picker.Item label='Inoperante' value='Moto sem utilidade' />
              <Picker.Item label='Necessita de Revisão' value='Moto precisa ser diagnosticada' />
              <Picker.Item label='Pequenos Reparos' value='Moto com pequenos reparos de funcionamento' />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.labelPergunta, { color: colors.textSecondary }]}>Está com falta de algum aparato físico?</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Picker
              selectedValue={aparatoFisico}
              onValueChange={(itemValue) => setAparatoFisico(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label='Selecione' value='' />
              <Picker.Item label='Completa' value='Completa' />
              <Picker.Item label='Falta retrovisor' value='Falta retrovisor' />
              <Picker.Item label='Falta banco' value='Falta banco' />
              <Picker.Item label='Falta farol' value='Falta farol' />
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={[styles.botao, { backgroundColor: colors.primary }]} onPress={handleCadastro}>
          <Text style={[styles.textoBotao, { color: colors.primaryText }]}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  separador: {
    height: 1,
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
    marginBottom: 8,
    textAlign: 'left',
  },
  labelPergunta: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    borderWidth: 1,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    height: 50,
  },
  picker: {
    fontFamily: 'DarkerGrotesque_500Medium',
    fontSize: 16,
    height: 50,
  },
  secaoContainer: {
    marginBottom: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  subtituloSecao: {
    fontFamily: 'DarkerGrotesque_700Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  botao: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textoBotao: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
});