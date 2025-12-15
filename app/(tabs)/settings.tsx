import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(false);

    const handleDeleteAllData = () => {
        Alert.alert(
            "Reset App",
            "This will delete ALL notes and folders permanently. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete Everything",
                    style: "destructive",
                    onPress: async () => {
                        const db = await SQLite.openDatabaseAsync('notes.db');
                        await db.execAsync('DELETE FROM notes; DELETE FROM folders;');
                        Alert.alert("Reset Complete", "All data has been cleared.");
                    }
                }
            ]
        )
    };

    interface SectionItem {
        id: string;
        title: string;
        type: 'switch' | 'button' | 'info';
        value?: boolean | string;
        onValueChange?: (val: boolean) => void;
        onPress?: () => void;
        icon: string;
        destructive?: boolean;
    }

    interface Section {
        title: string;
        data: SectionItem[];
    }

    const sections: Section[] = [
        {
            title: 'Preferences',
            data: [
                {
                    id: 'theme',
                    title: 'Dark Mode',
                    type: 'switch',
                    value: darkMode,
                    onValueChange: setDarkMode,
                    icon: 'moon'
                }
            ]
        },
        {
            title: 'Data',
            data: [
                {
                    id: 'reset',
                    title: 'Delete All Notes',
                    type: 'button',
                    onPress: handleDeleteAllData,
                    icon: 'trash',
                    destructive: true
                }
            ]
        },
        {
            title: 'About',
            data: [
                {
                    id: 'version',
                    title: 'Version',
                    value: '1.0.0',
                    type: 'info',
                    icon: 'information-circle'
                }
            ]
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id + index}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, item.destructive && styles.iconDestructive]}>
                                <Ionicons name={item.icon as any} size={20} color={item.destructive ? '#fff' : '#007AFF'} />
                            </View>
                            <Text style={[styles.rowTitle, item.destructive && styles.textDestructive]}>{item.title}</Text>
                        </View>

                        {item.type === 'switch' && (
                            <Switch value={!!item.value} onValueChange={item.onValueChange} />
                        )}

                        {item.type === 'info' && (
                            <Text style={styles.infoText}>{item.value}</Text>
                        )}

                        {item.type === 'button' && (
                            <Pressable onPress={item.onPress}>
                                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                            </Pressable>
                        )}
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7', // iOS grouped table background
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 0,
        marginTop: 40,
    },
    listContent: {
        padding: 16,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 16,
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 0, // In a real list, only last item needs radius
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: '#E6F4FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconDestructive: {
        backgroundColor: '#FF3B30',
    },
    rowTitle: {
        fontSize: 17,
        color: '#000',
    },
    textDestructive: {
        color: '#FF3B30',
    },
    infoText: {
        fontSize: 17,
        color: '#888',
    },
});
