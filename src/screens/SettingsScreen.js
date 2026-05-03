import colors from "../constants/colors";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseService";
import { useAuth } from "../../navigation/AppNavigator";

const SettingsScreen = () => {
    const { setUser } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null); // Opcional, ya que onAuthStateChanged lo hará
            Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente.");
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la sesión.");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajustes</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.principal,
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
};

export default SettingsScreen;
