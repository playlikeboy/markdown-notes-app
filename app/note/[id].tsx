import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { deleteNote, Folder, getFolders, getNoteById, updateNote } from '../../services/db';

export default function NoteEditorScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Editor bridge
    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: '',
    });

    const [title, setTitle] = useState('');
    // We don't need 'content' state for editor, we use editor.getHTML()
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Folder logic
    const [folderId, setFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderModalVisible, setFolderModalVisible] = useState(false);
    const [currentFolderName, setCurrentFolderName] = useState('No Folder');

    const saveTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (editor) {
            // Load initial content when editor is ready
            loadNote();
            loadFolders();
        }
    }, [id, editor]); // Wait for editor

    const loadFolders = async () => {
        const data = await getFolders();
        setFolders(data as Folder[]);
    };

    const loadNote = async () => {
        if (!id) return;
        try {
            const note = await getNoteById(id);
            if (note) {
                setTitle(note.title);
                setFolderId(note.folderId);

                // Set editor content
                if (editor) {
                    editor.setContent(note.content || '');
                }

                if (note.folderId) {
                    const allFolders = await getFolders();
                    const f = (allFolders as Folder[]).find((f: Folder) => f.id === note.folderId);
                    if (f) setCurrentFolderName(f.name);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!id || !editor) return;
        setIsSaving(true);
        try {
            const htmlContent = await editor.getHTML();
            await updateNote(id, title, htmlContent, folderId);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save debouncer
    const triggerAutoSave = () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            handleSave();
        }, 1000);
    };

    // Trigger save on title change
    const onChangeTitle = (text: string) => {
        setTitle(text);
        triggerAutoSave();
    };

    // Trigger save on editor content change usually requires a listener or hook
    // simpler approach: save on back or periodically, or use manual save for now to ensure stability
    // TenTap doesn't have a direct 'onChange' prop on RichText component easily accessible for rapid updates without bridge listeners.
    // We will save on component unmount and periodically.

    // Adding interval saver for safety
    useEffect(() => {
        const interval = setInterval(() => {
            handleSave();
        }, 3000);
        return () => clearInterval(interval);
    }, [title, folderId, editor]);


    const onSelectFolder = (newFolderId: string | null, name: string) => {
        setFolderId(newFolderId);
        setCurrentFolderName(name);
        setFolderModalVisible(false);
        handleSave(); // Save immediately after folder change
    }

    const handleDelete = () => {
        Alert.alert("Delete Note", "Irreversible action.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    if (id) await deleteNote(id);
                    router.back();
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerTintColor: theme.colors.primary,
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <Text style={styles.saveStatus}>{isSaving ? 'Saving...' : 'Saved'}</Text>
                            <TouchableOpacity onPress={handleDelete}>
                                <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerBackground: () => <View style={{ backgroundColor: theme.colors.background, opacity: 0.95, flex: 1 }} />
                }}
            />

            <View style={styles.metaContainer}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={onChangeTitle}
                    placeholderTextColor={theme.colors.textSecondary}
                />
                {/* Folder Selector */}
                <TouchableOpacity onPress={() => setFolderModalVisible(true)} style={styles.folderRow}>
                    <Text style={styles.folderLabel}>Folder:</Text>
                    <Text style={styles.folderValue}>{currentFolderName}</Text>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <RichText editor={editor} style={styles.richText} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <Toolbar editor={editor} />
            </KeyboardAvoidingView>

            {/* Modal Logic (Simplified for brevity, kept existing simplified) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={folderModalVisible}
                onRequestClose={() => setFolderModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Move to Folder</Text>
                        <FlatList
                            data={[{ id: 'root', name: 'No Folder' }, ...folders]}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.folderItem}
                                    onPress={() => onSelectFolder(item.id === 'root' ? null : item.id, item.name)}
                                >
                                    <Ionicons name={item.id === 'root' ? "document-text-outline" : "folder-outline"} size={22} color="#333" />
                                    <Text style={styles.folderItemText}>{item.name}</Text>
                                    {folderId === (item.id === 'root' ? null : item.id) && <Ionicons name="checkmark" size={20} color="#FEA00A" />}
                                </TouchableOpacity>
                            )}
                        />
                        <Pressable style={styles.closeButton} onPress={() => setFolderModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </Pressable>
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    saveStatus: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    metaContainer: {
        marginTop: 100, // Header clearance
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: 10,
    },
    titleInput: {
        ...theme.typography.header,
        marginBottom: 8,
    },
    folderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    folderLabel: {
        ...theme.typography.label,
    },
    folderValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    richText: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
        gap: 12,
    },
    folderItemText: {
        fontSize: 17,
        flex: 1,
        color: '#000',
    },
    closeButton: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f2f2f7',
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    }
});
