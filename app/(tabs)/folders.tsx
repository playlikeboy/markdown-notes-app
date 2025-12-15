import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { Button, Card, Colors, Text, TextField, TouchableOpacity, View } from 'react-native-ui-lib';
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
        <View flex bg-background>
            <View paddingT-60 paddingH-20 paddingB-20>
                <Text h1 color={Colors.primary}>Folders</Text>
            </View>

            <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card row spread centerV padding-16 marginH-20 marginB-12 style={{ borderRadius: 16 }} backgroundColor={Colors.secondaryBackground} enableShadow={false}>
                        <View row centerV>
                            <Ionicons name="folder" size={24} color={Colors.primary} />
                            <Text text70 color={Colors.primary} marginL-12>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteFolder(item.id)}>
                            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                        </TouchableOpacity>
                    </Card>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View flex center padding-40>
                        <Text text70 color={Colors.secondary}>No folders yet.</Text>
                    </View>
                }
            />

            <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={32} color={Colors.white} />
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text text60 center marginB-20 color={Colors.primary}>New Folder</Text>
                        <TextField
                            placeholder="Folder Name"
                            value={newFolderName}
                            onChangeText={setNewFolderName}
                            placeholderTextColor={Colors.secondary}
                            style={styles.input}
                            containerStyle={styles.inputContainer}
                        />
                        <Button
                            label="Create Folder"
                            backgroundColor={Colors.primary}
                            color={Colors.white}
                            onPress={handleCreateFolder}
                            style={{ marginTop: 16 }}
                        />
                        <Button
                            label="Cancel"
                            link
                            color={Colors.secondary}
                            marginT-16
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary, // Black
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    input: {
        fontSize: 18,
        color: Colors.primary,
        paddingVertical: 12,
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: 20,
    }
});
