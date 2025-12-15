import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { MarkdownPreview } from '../../components/MarkdownPreview';
import { deleteNote, Folder, getFolders, getNoteById, saveNote } from '../../services/db';

export default function NoteEditorScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [folderId, setFolderId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Folder selection
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderModalVisible, setFolderModalVisible] = useState(false);
    const [currentFolderName, setCurrentFolderName] = useState('No Folder');

    // Debounce ref
    const saveTimeoutRef = useRef<any>(null); // Use any to avoid NodeJS/Browser timeout mismatch

    useEffect(() => {
        loadNote();
        loadFolders();
    }, [id]);

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
                setContent(note.content);
                setFolderId(note.folderId);

                // Resolve folder name
                if (note.folderId) {
                    const allFolders = await getFolders(); // re-fetch to be sure
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

    const handeSave = useCallback(async (newTitle: string, newContent: string, newFolderId: string | null) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await saveNote(id, newTitle, newContent, newFolderId, []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    }, [id]);

    const onChangeTitle = (text: string) => {
        setTitle(text);
        debouncedSave(text, content, folderId);
    };

    const onChangeContent = (text: string) => {
        setContent(text);
        debouncedSave(title, text, folderId);
    };

    const onSelectFolder = (newFolderId: string | null, name: string) => {
        setFolderId(newFolderId);
        setCurrentFolderName(name);
        setFolderModalVisible(false);
        handeSave(title, content, newFolderId);
    }

    const debouncedSave = (t: string, c: string, fId: string | null) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            handeSave(t, c, fId);
        }, 1000); // Auto-save after 1s
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (id) await deleteNote(id);
                        router.back();
                    }
                }
            ]
        );
    };

    const toggleMode = () => {
        setMode(prev => prev === 'edit' ? 'preview' : 'edit');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerTransparent: true, // Make header transparent
                    headerTintColor: '#FEA00A', // Back button color
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <Text style={styles.saveStatus}>{isSaving ? 'Saving...' : ''}</Text>
                            <Pressable onPress={toggleMode} style={styles.iconButton}>
                                {/* Circle icon background for visibility */}
                                <View style={styles.circleButton}>
                                    <Ionicons name={mode === 'edit' ? "checkmark" : "create"} size={20} color="#FEA00A" />
                                </View>
                            </Pressable>

                            <Pressable onPress={handleDelete} style={styles.iconButton}>
                                <View style={styles.circleButton}>
                                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                </View>
                            </Pressable>
                        </View>
                    ),
                    headerBackground: () => <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', flex: 1 }} /> // Semi transparent background
                }}
            />

            <View style={styles.editorContainer}>
                {mode === 'edit' ? (
                    <>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Title"
                            value={title}
                            onChangeText={onChangeTitle}
                            maxLength={100}
                            placeholderTextColor="#999"
                        />
                        <View style={styles.metaRow}>
                            <TouchableOpacity onPress={() => setFolderModalVisible(true)} style={styles.folderChip}>
                                <Text style={styles.folderText}>{currentFolderName}</Text>
                                <Ionicons name="chevron-down" size={14} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <MarkdownEditor
                            value={content}
                            onChangeText={onChangeContent}
                            style={styles.editorInput}
                        />
                    </>
                ) : (
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewTitle}>{title}</Text>
                        <MarkdownPreview content={content} />
                    </View>
                )}
            </View>

            {/*... modals keep same ...*/}
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
        backgroundColor: '#fff',
    },
    editorContainer: {
        flex: 1,
        paddingTop: 100, // Space for transparent header
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 0,
    },
    circleButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f2f2f7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveStatus: {
        fontSize: 12,
        color: '#ccc',
        marginRight: 8,
    },
    metaRow: {
        marginBottom: 16,
    },
    folderChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    folderText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    titleInput: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    editorInput: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
    },
    previewContainer: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
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
