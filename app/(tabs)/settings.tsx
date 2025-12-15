import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Switch, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

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
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Settings</Text>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id + index}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({ item, index, section }) => {
                    const isLast = index === section.data.length - 1;

                    return (
                        <View style={[
                            styles.row,
                            !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
                        ]}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconContainer, item.destructive && styles.iconDestructive]}>
                                    <Ionicons name={item.icon as any} size={20} color={item.destructive ? theme.colors.white : theme.colors.primary} />
                                </View>
                                <Text style={[styles.rowTitle, item.destructive && styles.textDestructive]}>{item.title}</Text>
                            </View>

                            {item.type === 'switch' && (
                                <Switch value={!!item.value} onValueChange={item.onValueChange} trackColor={{ false: '#ccc', true: theme.colors.primary }} />
                            )}

                            {item.type === 'info' && (
                                <Text style={styles.infoText}>{item.value}</Text>
                            )}

                            {item.type === 'button' && (
                                <Pressable onPress={item.onPress}>
                                    <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
                                </Pressable>
                            )}
                        </View>
                    )
                }}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        ...theme.typography.header,
    },
    listContent: {
        paddingHorizontal: 0, // Edge-to-edge for Uber style
        paddingBottom: 40,
    },
    sectionHeader: {
        ...theme.typography.label,
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    row: {
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 0, // Square icons
        backgroundColor: theme.colors.secondaryBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconDestructive: {
        backgroundColor: theme.colors.danger,
        borderColor: theme.colors.danger,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    textDestructive: {
        color: theme.colors.danger,
    },
    infoText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});
