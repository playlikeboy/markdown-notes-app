import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createFolder, deleteFolder, Folder, getFolders } from '../../services/db';

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
                            <Ionicons name="folder-outline" size={24} color="#FEA00A" />
                            <Text style={styles.folderName}>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteFolder(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
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
                <Ionicons name="add" size={32} color="#FEA00A" />
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
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    folderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12, // More breathable
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#c7c7cc',
    },
    folderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    folderName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#000',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
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
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 14, // iOS style
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 16,
        color: '#000',
    },
    input: {
        width: '100%',
        backgroundColor: '#f2f2f7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 17,
        color: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'space-between', // Spread buttons
    },
    button: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#fff',
    },
    buttonSave: {
        backgroundColor: '#000',
    },
    textStyle: {
        fontSize: 17,
        fontWeight: '600',
    },
});
