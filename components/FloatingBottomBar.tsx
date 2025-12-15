import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, TouchableOpacity, View } from 'react-native-ui-lib';

export const FloatingBottomBar = () => {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/note/${Date.now().toString()}`);
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <View style={styles.pill} row spread centerV>
                <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
                    <Ionicons name="mic" size={24} color={Colors.white} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.mainBtn} onPress={handleCreate}>
                    <Ionicons name="add" size={32} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
                    <Ionicons name="sparkles" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pill: {
        backgroundColor: '#1A1A1A', // Dark pill background
        borderRadius: 40,
        paddingHorizontal: 8,
        paddingVertical: 8,
        width: 200,
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    mainBtn: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#5CE1E6', // Cyan accent
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4, // Slight visual lift
    },
    iconBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
