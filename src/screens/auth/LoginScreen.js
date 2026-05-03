import colors from "../../constants/colors";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseService";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

        // Verificar que auth está definido
    console.log('Auth en Login:', auth);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setError('');
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            Alert.alert('Éxito', 'Inicio de sesión exitoso', [
                { text: 'OK', onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                }) }
            ]);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }
            
            setError(errorMessage);
        }
    };

    return (
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={30} color={colors.negro} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico" 
                        placeholderTextColor={colors.negro}
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={30} color={colors.negro} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Contraseña" 
                        placeholderTextColor={colors.negro}
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry 
                        autoCapitalize="none" 
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: 'rgba(5, 137, 5, 0.7)',
        borderRadius: 40,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.Oscuro,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 140, 9, 0.58)',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        color: colors.iluminado,
        fontSize: 20,
    },
    loginButton: {
        backgroundColor: colors.variante5,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 35,
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.iluminado,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: colors.iluminado,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: colors.alerta,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default LoginScreen;