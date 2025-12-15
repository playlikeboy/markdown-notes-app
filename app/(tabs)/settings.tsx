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
                renderItem={({ item, index, section }) => {
                    const isFirst = index === 0;
                    const isLast = index === section.data.length - 1;

                    return (
                        <View style={[
                            styles.row,
                            isFirst && { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
                            isLast && { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
                            !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#c7c7cc', marginLeft: 16 } // Separator inset
                        ]}>
                            <View style={[styles.rowLeft, !isLast && { marginLeft: -16, paddingLeft: 16 }]}>
                                {/* Hack to fix alignment with inset separator */}
                                <View style={[styles.iconContainer, item.destructive && styles.iconDestructive]}>
                                    <Ionicons name={item.icon as any} size={20} color={item.destructive ? '#FF3B30' : '#007AFF'} />
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
                                    <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
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
        backgroundColor: '#f2f2f7', // iOS grouped table background
        paddingTop: 60,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 20,
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8e8e93',
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 4, // Align with cell content better
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    // Rounded corners logic handled potentially in renderItem or simpler: just use full blocks for now like iOS often does
    // But for a true group look we want top/bottom radius. Let's try a simpler approach where we just give them all radius if they are standalone, or...
    // simpler: Let's make the list item visually clean.
    rowWrapper: {
        overflow: 'hidden',
        // We will apply borderRadius to the first and last items in renderItem logic ideally
        // For now let's just use a block style that looks "Modern Group" (inset)
        borderRadius: 10,
        marginBottom: 0,
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
        backgroundColor: '#FFE5E5', // Lighter red bg
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
        color: '#8e8e93',
    },
});
