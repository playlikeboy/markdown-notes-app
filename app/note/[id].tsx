import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib'; // UI Lib
import { RichEditor } from '../../components/RichEditor';
import { deleteNote, getFolders, getNoteById, updateNote } from '../../services/db';

export default function NoteEditorScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [folders, setFolders] = useState<any[]>([]);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [folderModalVisible, setFolderModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadNote();
        loadFolders();
    }, [id]);

    const loadNote = async () => {
        if (!id) return;
        const note = await getNoteById(id);
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setFolderId(note.folderId);
        }
    };

    const loadFolders = async () => {
        const data = await getFolders();
        setFolders(data);
    };

    const handleSave = async (newContent?: string) => {
        try {
            setIsSaving(true);
            // Use passed content or current state
            const html = newContent !== undefined ? newContent : content;
            await updateNote(id as string, title, html, folderId, []);
            setIsSaving(false);
        } catch (e) {
            console.error(e);
        }
    };

    // Auto-save when leaving or debounced could go here
    // For now we pass handleSave to the editor onChange if needed, or just setContent
    const onChangeContent = (html: string) => {
        setContent(html);
        // Optional: Debounce save here
    };

    const handleDelete = async () => {
        await deleteNote(id as string);
        router.back();
    };

    const currentFolderName = folders.find(f => f.id === folderId)?.name || 'No Folder';

    return (
        <View flex bg-background>
            {/* Header */}
            <View row spread centerV paddingH-20 paddingT-60 paddingB-20 style={styles.header}>
                <View row centerV>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setFolderModalVisible(true)} style={styles.folderPill}>
                        <Ionicons name="folder-outline" size={18} color={Colors.primary} />
                        <Text text80 marginH-8>{currentFolderName}</Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <View row centerV gap-16>
                    <Text text90 color={Colors.secondary}>{isSaving ? 'Saving...' : 'Saved'}</Text>
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color={Colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View flex paddingH-24>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={(t) => { setTitle(t); handleSave(); }} // Auto save title
                    placeholderTextColor={Colors.secondary}
                    multiline
                />

                <RichEditor
                    initialContent={content}
                    onChange={onChangeContent}
                />
            </View>

            {/* Folder Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={folderModalVisible}
                onRequestClose={() => setFolderModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text text70 marginB-20 center>Move to Folder</Text>
                        {[{ id: 'root', name: 'No Folder' }, ...folders].map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.folderItem}
                                onPress={() => { setFolderId(item.id === 'root' ? null : item.id); setFolderModalVisible(false); handleSave(); }}
                            >
                                <Ionicons name={item.id === 'root' ? "document-text-outline" : "folder-outline"} size={22} color={Colors.primary} />
                                <Text text70 marginL-12 flex>{item.name}</Text>
                                {folderId === (item.id === 'root' ? null : item.id) && <Ionicons name="checkmark" size={20} color={Colors.cardBlue} />}
                            </TouchableOpacity>
                        ))}
                        <Button
                            label="Cancel"
                            link
                            color={Colors.primary}
                            marginT-20
                            onPress={() => setFolderModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.headerBlue,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    folderPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 12,
    },
    titleInput: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 16,
        marginTop: 24,
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
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    }
});
