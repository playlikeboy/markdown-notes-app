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
            <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.folderRow}>
                        <View style={styles.folderInfo}>
                            <Ionicons name="folder" size={24} color="#007AFF" />
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
                <Ionicons name="add" size={32} color="white" />
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
    },
    listContent: {
        padding: 16,
    },
    folderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    folderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    folderName: {
        fontSize: 16,
        color: '#000',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'flex-end',
    },
    button: {
        borderRadius: 8,
        padding: 10,
        paddingHorizontal: 16,
        elevation: 2,
    },
    buttonCancel: {
        backgroundColor: '#f0f0f0',
    },
    buttonSave: {
        backgroundColor: '#007AFF',
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
