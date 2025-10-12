import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  FlatList, 
  Animated,
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
    const [lastLogin, setLastLogin] = useState<string | null>(null);
    const [loginHistory, setLoginHistory] = useState<string[]>([]);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        const fetchLoginData = async () => {
            const storedLogin = await AsyncStorage.getItem('lastLogin');
            const storedHistory = await AsyncStorage.getItem('loginHistory');

            if (storedLogin) {
                setLastLogin(storedLogin);
            } else {
                setLastLogin("C'est votre première connexion !");
            }

            if (storedHistory) {
                setLoginHistory(JSON.parse(storedHistory));
            }

            // Animation d'entrée
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();
        };

        fetchLoginData();
    }, []);

    const handleLogin = async () => {
        const now = new Date();
        const formattedDate = now.toLocaleString('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        await AsyncStorage.setItem('lastLogin', formattedDate);
        setLastLogin(formattedDate);

        const updatedHistory = [...loginHistory, formattedDate];
        setLoginHistory(updatedHistory);
        await AsyncStorage.setItem('loginHistory', JSON.stringify(updatedHistory));
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('lastLogin');
        setLastLogin("Vous êtes déconnecté. C'est votre première connexion !");
    };

    const HistoryItem = ({ item, index }: { item: string; index: number }) => {
        const [itemFadeAnim] = useState(new Animated.Value(0));
        const [itemScaleAnim] = useState(new Animated.Value(0.9));

        useEffect(() => {
            Animated.parallel([
                Animated.timing(itemFadeAnim, {
                    toValue: 1,
                    duration: 500,
                    delay: index * 100,
                    useNativeDriver: true,
                }),
                Animated.spring(itemScaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    delay: index * 100,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);

        return (
            <Animated.View
                style={[
                    styles.historyItem,
                    {
                        opacity: itemFadeAnim,
                        transform: [{ scale: itemScaleAnim }]
                    }
                ]}
            >
                <Text style={styles.historyItemText}>{item}</Text>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>Bienvenue</Text>
                
                <View style={styles.lastLoginCard}>
                    <Text style={styles.lastLoginLabel}>Dernière connexion</Text>
                    <Text style={styles.lastLogin}>{lastLogin}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.logoutButton]}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>Historique des connexions</Text>
                    <FlatList
                        data={loginHistory}
                        renderItem={({ item, index }) => (
                            <HistoryItem item={item} index={index} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.historyList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 32,
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    lastLoginCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        marginBottom: 32,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    lastLoginLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    lastLogin: {
        fontSize: 18,
        color: '#1e293b',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 400,
        marginBottom: 40,
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        transitionDelay: 'all 0.2s ease-in-out',
    },
    loginButton: {
        backgroundColor: '#10b981',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.25,
    },
    historySection: {
        width: '100%',
        maxWidth: 400,
        flex: 1,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#1e293b',
        textAlign: 'center',
    },
    historyList: {
        width: '100%',
        borderRadius: 12,
    },
    historyItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    historyItemText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
});

export default Index;