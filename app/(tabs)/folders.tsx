import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createFolder, deleteFolder, Folder, getFolders } from '../../services/db';

import { theme } from '../../constants/theme';

export default function FoldersScreen() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const loadFolders = useCallback(async () => {
        const data = await getFolders();
        setFolders(data as Folder[]);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFolders();
        }, [loadFolders])
    );

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            await createFolder(Date.now().toString(), newFolderName.trim());
            setNewFolderName('');
            setModalVisible(false);
            loadFolders();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to create folder");
        }
    };

    const handleDeleteFolder = (id: string) => {
        Alert.alert(
            "Delete Folder",
            "Are you sure? Notes inside will lose their folder association.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteFolder(id);
                        loadFolders();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Folders</Text>
            </View>

            <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.folderRow}>
                        <View style={styles.folderInfo}>
                            <Ionicons name="folder" size={24} color={theme.colors.primary} />
                            <Text style={styles.folderName}>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteFolder(item.id)}>
                            <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No folders yet.</Text>
                    </View>
                }
            />

            <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={32} color={theme.colors.white} />
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>New Folder</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Folder Name"
                            value={newFolderName}
                            onChangeText={setNewFolderName}
                            autoFocus
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                        <View style={styles.modalButtons}>
                            <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.buttonSave]} onPress={handleCreateFolder}>
                                <Text style={[styles.textStyle, { color: 'white' }]}>Create</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        ...theme.typography.header,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    folderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    folderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    folderName: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 0, // Square FAB
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '85%',
        backgroundColor: theme.colors.background,
        borderRadius: 0, // Square modal
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    modalTitle: {
        ...theme.typography.subHeader,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: theme.colors.secondaryBackground,
        borderRadius: 0,
        padding: 16,
        marginBottom: 24,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        borderRadius: 0,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    buttonCancel: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.primary, // Distinct cancel
    },
    buttonSave: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    textStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
    },
});
